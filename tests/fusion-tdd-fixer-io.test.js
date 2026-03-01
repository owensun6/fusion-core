/**
 * Tests for fusion-tdd-fixer.js I/O functions (with mocked child_process)
 */

jest.mock('child_process', () => ({
  execFileSync: jest.fn(),
}));

const fs = require('fs');
const { execFileSync } = require('child_process');
const { getGitDiff, runTest, main, MAX_RETRIES } = require('../.claude/scripts/fusion-tdd-fixer');

class ExitError extends Error {
  constructor(code) {
    super(`process.exit(${code})`);
    this.exitCode = code;
  }
}

afterEach(() => {
  jest.restoreAllMocks();
  execFileSync.mockReset();
});

describe('getGitDiff (mocked)', () => {
  it('should return trimmed git diff output on success', () => {
    execFileSync.mockReturnValueOnce('  1 file changed\n');

    const diff = getGitDiff();
    expect(diff).toBe('1 file changed');
    expect(execFileSync).toHaveBeenCalledWith(
      'git',
      ['diff', '--stat'],
      expect.objectContaining({ encoding: 'utf-8' }),
    );
  });

  it('should return fallback string when git fails', () => {
    execFileSync.mockImplementationOnce(() => {
      throw new Error('git not found');
    });

    const diff = getGitDiff();
    expect(diff).toBe('[git diff unavailable]');
  });
});

describe('runTest (mocked)', () => {
  it('should return exitCode 0 on test success', () => {
    execFileSync.mockReturnValueOnce('all tests passed');

    const result = runTest();
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('all tests passed');
    expect(result.stderr).toBe('');
  });

  it('should return error info on test failure', () => {
    const err = new Error('test failed');
    err.status = 1;
    err.stdout = 'FAIL tests/x.test.js';
    err.stderr = 'TypeError: boom';
    execFileSync.mockImplementationOnce(() => {
      throw err;
    });

    const result = runTest();
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('FAIL tests/x.test.js');
    expect(result.stderr).toBe('TypeError: boom');
  });

  it('should default exitCode to 1 when error.status is undefined', () => {
    const err = new Error('unknown failure');
    err.stdout = '';
    err.stderr = '';
    execFileSync.mockImplementationOnce(() => {
      throw err;
    });

    const result = runTest();
    expect(result.exitCode).toBe(1);
  });

  it('should fallback to error.message when stderr is empty', () => {
    const err = new Error('process crashed');
    err.status = 2;
    err.stdout = '';
    execFileSync.mockImplementationOnce(() => {
      throw err;
    });

    const result = runTest();
    expect(result.exitCode).toBe(2);
    expect(result.stderr).toBe('process crashed');
  });
});

describe('main (mocked, non-analyze mode)', () => {
  const originalExit = process.exit;
  const originalLog = console.log;
  const originalError = console.error;
  const originalWrite = process.stdout.write;

  beforeEach(() => {
    process.exit = jest.fn((code) => {
      throw new ExitError(code);
    });
    console.log = jest.fn();
    console.error = jest.fn();
    process.stdout.write = jest.fn();
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue('{"session":[],"metadata":{}}');
    jest.spyOn(fs, 'writeFileSync').mockReturnValue(undefined);
    jest.spyOn(fs, 'mkdirSync').mockReturnValue(undefined);
  });

  afterEach(() => {
    process.exit = originalExit;
    console.log = originalLog;
    console.error = originalError;
    process.stdout.write = originalWrite;
    jest.restoreAllMocks();
    execFileSync.mockReset();
  });

  it('should exit 0 when first test run passes', () => {
    execFileSync.mockReturnValueOnce('all green');

    try {
      main();
    } catch (e) {
      expect(e).toBeInstanceOf(ExitError);
      expect(e.exitCode).toBe(0);
    }

    expect(process.exit).toHaveBeenCalledWith(0);
  });

  it('should circuit-break after MAX_RETRIES failures', () => {
    const err = new Error('fail');
    err.status = 1;
    err.stdout = 'FAIL tests/a.test.js\nTests:  1 failed, 0 passed, 1 total';
    err.stderr = 'TypeError: broken';

    // Each iteration: runTest (throws) + getGitDiff inside createErrorSnapshot (throws)
    for (let i = 0; i < MAX_RETRIES; i++) {
      execFileSync.mockImplementationOnce(() => {
        throw err;
      });
      execFileSync.mockReturnValueOnce(''); // getGitDiff
    }

    try {
      main();
    } catch (e) {
      expect(e).toBeInstanceOf(ExitError);
      expect(e.exitCode).toBe(2);
    }

    expect(process.exit).toHaveBeenCalledWith(2);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('should exit 0 if test passes on second attempt', () => {
    const err = new Error('fail');
    err.status = 1;
    err.stdout = 'FAIL tests/a.test.js';
    err.stderr = 'TypeError: oops';

    // First attempt: runTest fails + getGitDiff
    execFileSync.mockImplementationOnce(() => {
      throw err;
    });
    execFileSync.mockReturnValueOnce(''); // getGitDiff for snapshot
    // Second attempt: runTest passes
    execFileSync.mockReturnValueOnce('all green');

    try {
      main();
    } catch (e) {
      expect(e).toBeInstanceOf(ExitError);
      expect(e.exitCode).toBe(0);
    }

    expect(process.exit).toHaveBeenCalledWith(0);
  });
});
