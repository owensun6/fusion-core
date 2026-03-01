/**
 * Tests for fusion-tdd-fixer.js analysis engine (pure functions)
 */
const fs = require('fs');
const {
  analyzeTestOutput,
  buildFixGuidance,
  createErrorSnapshot,
  readExistingLog,
  writeHealLog,
  writePanicReport,
  ensureDir,
  MAX_RETRIES,
} = require('../.claude/scripts/fusion-tdd-fixer');

describe('analyzeTestOutput', () => {
  it('should extract failed test files from Jest output', () => {
    const stdout = `
FAIL tests/auth.test.js
FAIL tests/user.test.js
PASS tests/utils.test.js
`;
    const result = analyzeTestOutput(stdout, '');
    expect(result.failedFiles).toEqual(['tests/auth.test.js', 'tests/user.test.js']);
  });

  it('should extract failed test names (bullet format)', () => {
    const stdout = `
  \u25cf Auth > should validate token
  \u25cf User > should create user
`;
    const result = analyzeTestOutput(stdout, '');
    expect(result.failedTestNames).toEqual([
      'Auth > should validate token',
      'User > should create user',
    ]);
  });

  it('should extract Expected/Received pairs', () => {
    const stdout = `
    Expected: "hello"
    Received: "world"
`;
    const result = analyzeTestOutput(stdout, '');
    expect(result.assertions).toEqual([{ expected: '"hello"', received: '"world"' }]);
  });

  it('should extract error types and messages', () => {
    const stderr = "TypeError: Cannot read properties of undefined (reading 'map')";
    const result = analyzeTestOutput('', stderr);
    expect(result.errors).toEqual([
      { type: 'TypeError', message: "Cannot read properties of undefined (reading 'map')" },
    ]);
  });

  it('should extract ReferenceError', () => {
    const stderr = 'ReferenceError: myVar is not defined';
    const result = analyzeTestOutput('', stderr);
    expect(result.errors).toEqual([{ type: 'ReferenceError', message: 'myVar is not defined' }]);
  });

  it('should extract SyntaxError', () => {
    const stderr = 'SyntaxError: Unexpected token }';
    const result = analyzeTestOutput('', stderr);
    expect(result.errors).toEqual([{ type: 'SyntaxError', message: 'Unexpected token }' }]);
  });

  it('should extract file locations from stack traces', () => {
    const stderr = '    at Object.<anonymous> (/src/auth.js:42:10)';
    const result = analyzeTestOutput('', stderr);
    expect(result.locations).toEqual([{ file: '/src/auth.js', line: 42, column: 10 }]);
  });

  it('should extract test summary (failed + passed + total)', () => {
    const stdout = 'Tests:  2 failed, 5 passed, 7 total';
    const result = analyzeTestOutput(stdout, '');
    expect(result.summary).toEqual({ failed: 2, passed: 5, total: 7 });
  });

  it('should handle summary with only passed tests', () => {
    const stdout = 'Tests:  10 passed, 10 total';
    const result = analyzeTestOutput(stdout, '');
    expect(result.summary).toEqual({ failed: 0, passed: 10, total: 10 });
  });

  it('should return empty arrays when no matches found', () => {
    const result = analyzeTestOutput('all good', 'no errors');
    expect(result.failedFiles).toEqual([]);
    expect(result.failedTestNames).toEqual([]);
    expect(result.assertions).toEqual([]);
    expect(result.errors).toEqual([]);
    expect(result.locations).toEqual([]);
    expect(result.summary).toEqual({ failed: 0, passed: 0, total: 0 });
  });

  it('should return a frozen (immutable) object', () => {
    const result = analyzeTestOutput('', '');
    expect(Object.isFrozen(result)).toBe(true);
  });

  it('should handle multiple errors and locations combined', () => {
    const stderr =
      'TypeError: foo is undefined\nReferenceError: bar is not defined\n    at Object.<anonymous> (/a.js:1:2)\n    at Object.<anonymous> (/b.js:3:4)';
    const result = analyzeTestOutput('', stderr);
    expect(result.errors).toHaveLength(2);
    expect(result.locations).toHaveLength(2);
  });

  it('should handle combined stdout and stderr', () => {
    const stdout = 'FAIL tests/combo.test.js\nTests:  1 failed, 2 passed, 3 total';
    const stderr = 'TypeError: combo broke';
    const result = analyzeTestOutput(stdout, stderr);
    expect(result.failedFiles).toEqual(['tests/combo.test.js']);
    expect(result.errors).toHaveLength(1);
    expect(result.summary).toEqual({ failed: 1, passed: 2, total: 3 });
  });
});

describe('buildFixGuidance', () => {
  it('should generate type-error guidance for TypeError', () => {
    const analysis = {
      errors: [{ type: 'TypeError', message: 'foo is not a function' }],
      assertions: [],
      failedFiles: [],
      locations: [{ file: '/src/utils.js', line: 10, column: 5 }],
    };
    const guidance = buildFixGuidance(analysis);
    expect(guidance).toHaveLength(1);
    expect(guidance[0].category).toBe('type-error');
    expect(guidance[0].source).toBe('/src/utils.js');
  });

  it('should generate missing-reference guidance for ReferenceError', () => {
    const analysis = {
      errors: [{ type: 'ReferenceError', message: 'x is not defined' }],
      assertions: [],
      failedFiles: [],
      locations: [],
    };
    const guidance = buildFixGuidance(analysis);
    expect(guidance[0].category).toBe('missing-reference');
    expect(guidance[0].source).toBeNull();
  });

  it('should generate syntax-error guidance for SyntaxError', () => {
    const analysis = {
      errors: [{ type: 'SyntaxError', message: 'Unexpected token' }],
      assertions: [],
      failedFiles: [],
      locations: [],
    };
    const guidance = buildFixGuidance(analysis);
    expect(guidance[0].category).toBe('syntax-error');
  });

  it('should generate runtime-error for unknown error types', () => {
    const analysis = {
      errors: [{ type: 'RangeError', message: 'out of range' }],
      assertions: [],
      failedFiles: [],
      locations: [],
    };
    const guidance = buildFixGuidance(analysis);
    expect(guidance[0].category).toBe('runtime-error');
  });

  it('should generate assertion-failure guidance for assertion mismatches', () => {
    const analysis = {
      errors: [],
      assertions: [{ expected: '"hello"', received: '"world"' }],
      failedFiles: ['tests/foo.test.js'],
      locations: [],
    };
    const guidance = buildFixGuidance(analysis);
    expect(guidance[0].category).toBe('assertion-failure');
    expect(guidance[0].source).toBe('tests/foo.test.js');
  });

  it('should generate unknown guidance when files failed but no specific errors', () => {
    const analysis = {
      errors: [],
      assertions: [],
      failedFiles: ['tests/bar.test.js'],
      locations: [],
    };
    const guidance = buildFixGuidance(analysis);
    expect(guidance[0].category).toBe('unknown');
  });

  it('should return empty array when no failures detected', () => {
    const analysis = {
      errors: [],
      assertions: [],
      failedFiles: [],
      locations: [],
    };
    const guidance = buildFixGuidance(analysis);
    expect(guidance).toHaveLength(0);
  });

  it('should return a frozen (immutable) array', () => {
    const analysis = { errors: [], assertions: [], failedFiles: [], locations: [] };
    const guidance = buildFixGuidance(analysis);
    expect(Object.isFrozen(guidance)).toBe(true);
  });

  it('should handle all error types in one analysis', () => {
    const analysis = {
      errors: [
        { type: 'TypeError', message: 'a' },
        { type: 'ReferenceError', message: 'b' },
        { type: 'SyntaxError', message: 'c' },
        { type: 'RangeError', message: 'd' },
      ],
      assertions: [{ expected: '"x"', received: '"y"' }],
      failedFiles: ['test.js'],
      locations: [{ file: '/src/foo.js', line: 1, column: 1 }],
    };
    const guidance = buildFixGuidance(analysis);
    expect(guidance).toHaveLength(5);
    expect(guidance[0].category).toBe('type-error');
    expect(guidance[1].category).toBe('missing-reference');
    expect(guidance[2].category).toBe('syntax-error');
    expect(guidance[3].category).toBe('runtime-error');
    expect(guidance[4].category).toBe('assertion-failure');
  });
});

describe('createErrorSnapshot', () => {
  it('should create a frozen snapshot with all fields', () => {
    const snapshot = createErrorSnapshot({
      exitCode: 1,
      stderr: 'error output',
      stdout: 'test output',
      attempt: 1,
      analysis: { failedFiles: ['test.js'] },
      fixGuidance: [{ category: 'type-error', guidance: 'fix it', source: null }],
    });

    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(snapshot.attempt).toBe(1);
    expect(snapshot.exitCode).toBe(1);
    expect(snapshot.analysis.failedFiles).toEqual(['test.js']);
    expect(snapshot.fixGuidance).toHaveLength(1);
    expect(snapshot.timestamp).toBeDefined();
  });

  it('should truncate long stderr to 5000 chars', () => {
    const longStderr = 'x'.repeat(10000);
    const snapshot = createErrorSnapshot({
      exitCode: 1,
      stderr: longStderr,
      stdout: '',
      attempt: 1,
    });
    expect(snapshot.errorOutput.length).toBe(5000);
  });

  it('should truncate long stdout to 3000 chars', () => {
    const longStdout = 'y'.repeat(6000);
    const snapshot = createErrorSnapshot({
      exitCode: 1,
      stderr: '',
      stdout: longStdout,
      attempt: 1,
    });
    expect(snapshot.testOutput.length).toBe(3000);
  });

  it('should default analysis to null and fixGuidance to empty array', () => {
    const snapshot = createErrorSnapshot({
      exitCode: 1,
      stderr: '',
      stdout: '',
      attempt: 1,
    });
    expect(snapshot.analysis).toBeNull();
    expect(snapshot.fixGuidance).toEqual([]);
  });

  it('should include gitDiff field', () => {
    const snapshot = createErrorSnapshot({
      exitCode: 1,
      stderr: '',
      stdout: '',
      attempt: 2,
    });
    expect(snapshot.gitDiff).toBeDefined();
    expect(typeof snapshot.gitDiff).toBe('string');
  });

  it('should include ISO timestamp', () => {
    const snapshot = createErrorSnapshot({
      exitCode: 0,
      stderr: '',
      stdout: '',
      attempt: 1,
    });
    expect(snapshot.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

describe('readExistingLog', () => {
  it('should return default log structure when no file exists', () => {
    const log = readExistingLog();
    expect(log).toEqual({ session: [], metadata: {} });
  });

  it('should have session and metadata keys', () => {
    const log = readExistingLog();
    expect(log).toHaveProperty('session');
    expect(log).toHaveProperty('metadata');
    expect(Array.isArray(log.session)).toBe(true);
  });

  it('should read and parse existing JSON log file', () => {
    const mockLog = { session: [{ attempt: 1 }], metadata: { foo: 'bar' } };
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(mockLog));

    const log = readExistingLog();
    expect(log).toEqual(mockLog);

    fs.existsSync.mockRestore();
    fs.readFileSync.mockRestore();
  });

  it('should return default on invalid JSON', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('not-valid-json{{{');

    const log = readExistingLog();
    expect(log).toEqual({ session: [], metadata: {} });

    fs.existsSync.mockRestore();
    fs.readFileSync.mockRestore();
  });
});

describe('ensureDir', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create directory when it does not exist', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);
    const mkdirSpy = jest.spyOn(fs, 'mkdirSync').mockReturnValueOnce(undefined);

    ensureDir('/fake/path/to/file.json');

    expect(mkdirSpy).toHaveBeenCalledWith('/fake/path/to', { recursive: true });
  });

  it('should not create directory when it already exists', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
    const mkdirSpy = jest.spyOn(fs, 'mkdirSync').mockReturnValueOnce(undefined);

    ensureDir('/fake/existing/path/file.json');

    expect(mkdirSpy).not.toHaveBeenCalled();
  });
});

describe('writeHealLog', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should append snapshot to existing log and write file', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const writeSpy = jest.spyOn(fs, 'writeFileSync').mockReturnValue(undefined);

    const existingLog = { session: [{ attempt: 1, exitCode: 1 }], metadata: {} };
    const newSnapshot = { attempt: 2, exitCode: 1, timestamp: '2026-03-01T00:00:00Z' };

    const result = writeHealLog(existingLog, newSnapshot);

    expect(result.session).toHaveLength(2);
    expect(result.session[1]).toEqual(newSnapshot);
    expect(result.metadata.totalAttempts).toBe(2);
    expect(result.metadata.lastUpdated).toBeDefined();
    expect(writeSpy).toHaveBeenCalledTimes(1);
    expect(Object.isFrozen(result)).toBe(true);
  });

  it('should work with empty initial log', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'writeFileSync').mockReturnValue(undefined);

    const existingLog = { session: [], metadata: {} };
    const newSnapshot = { attempt: 1, exitCode: 1 };

    const result = writeHealLog(existingLog, newSnapshot);

    expect(result.session).toHaveLength(1);
    expect(result.metadata.totalAttempts).toBe(1);
  });
});

describe('writePanicReport', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should generate markdown report with session data', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const writeSpy = jest.spyOn(fs, 'writeFileSync').mockReturnValue(undefined);

    const healLog = {
      session: [
        {
          timestamp: '2026-03-01T00:00:00Z',
          exitCode: 1,
          errorOutput: 'some error',
          fixGuidance: [{ category: 'type-error', guidance: 'fix types' }],
          gitDiff: '1 file changed',
        },
        {
          timestamp: '2026-03-01T00:01:00Z',
          exitCode: 1,
          errorOutput: 'same error',
          fixGuidance: [],
          gitDiff: '2 files changed',
        },
      ],
    };

    writePanicReport(healLog);

    expect(writeSpy).toHaveBeenCalledTimes(1);
    const writtenContent = writeSpy.mock.calls[0][1];
    expect(writtenContent).toContain('<!-- Author: Dev -->');
    expect(writtenContent).toContain('Panic Report');
    expect(writtenContent).toContain('type-error');
    expect(writtenContent).toContain('2 files changed');
  });

  it('should handle session with no fixGuidance', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const writeSpy = jest.spyOn(fs, 'writeFileSync').mockReturnValue(undefined);

    const healLog = {
      session: [
        {
          timestamp: '2026-03-01T00:00:00Z',
          exitCode: 1,
          errorOutput: 'error',
          gitDiff: 'diff',
        },
      ],
    };

    writePanicReport(healLog);

    const writtenContent = writeSpy.mock.calls[0][1];
    expect(writtenContent).toContain('(无自动分析结果)');
  });

  it('should handle empty session array', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const writeSpy = jest.spyOn(fs, 'writeFileSync').mockReturnValue(undefined);

    writePanicReport({ session: [] });

    const writtenContent = writeSpy.mock.calls[0][1];
    expect(writtenContent).toContain('N/A');
  });
});

describe('MAX_RETRIES constant', () => {
  it('should be 3', () => {
    expect(MAX_RETRIES).toBe(3);
  });
});
