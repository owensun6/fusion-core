/**
 * Tests for vlm-acceptance.js — parseVlmResult, buildReport, threshold logic
 *
 * Note: We test the exported functions by requiring the module.
 * Since vlm-acceptance.js uses `if (require.main === module)` guard for main(),
 * we need to extract the functions. The file currently doesn't export them,
 * so we test by re-implementing the core logic extraction or by loading inline.
 */

// Since vlm-acceptance.js doesn't export functions, we extract and test the logic directly
// by reading the file and eval-ing the pure functions.
const fs = require('fs');
const path = require('path');

// Load the source and extract functions for testing
const sourceCode = fs.readFileSync(
  path.join(__dirname, '../.claude/skills/iv-01/vlm-acceptance.js'),
  'utf-8',
);

// Extract parseVlmResult and buildReport by creating a module-like scope
const testModule = {};
const wrappedCode = sourceCode
  .replace('#!/usr/bin/env node', '')
  .replace(/process\.exit\(\d+\)/g, 'throw new Error("EXIT")')
  .replace(
    /const PROJECT_ROOT[\s\S]*?const MONITOR_PATH[^;]+;/,
    `
    const PROJECT_ROOT = '/tmp/test-vlm';
    const VLM_REPORT_PATH = '/tmp/test-vlm/VLM_Report.md';
    const MONITOR_PATH = '/tmp/test-vlm/monitor.md';
  `,
  )
  .replace(
    /function main\(\)[\s\S]*$/,
    `
    testModule.parseVlmResult = parseVlmResult;
    testModule.buildReport = buildReport;
    testModule.PASS_THRESHOLD = PASS_THRESHOLD;
  `,
  );

// Execute in a controlled scope
const vm = require('vm');
const sandbox = {
  require,
  console: { ...console, error: () => {} }, // suppress error output in tests
  process: {
    ...process,
    exit: () => {
      throw new Error('EXIT');
    },
  },
  module: {},
  testModule,
  Object,
};
vm.createContext(sandbox);
vm.runInContext(wrappedCode, sandbox);

const { parseVlmResult, buildReport, PASS_THRESHOLD } = sandbox.testModule;

describe('parseVlmResult', () => {
  it('should parse valid JSON from a clean string', () => {
    const input = '{"total_score": 95, "breakdown": {}}';
    const result = parseVlmResult(input);
    expect(result.total_score).toBe(95);
  });

  it('should extract JSON embedded in surrounding text', () => {
    const input = 'Here is the result: {"total_score": 88, "summary": "good"} end of output';
    const result = parseVlmResult(input);
    expect(result.total_score).toBe(88);
  });

  it('should throw on input with no JSON', () => {
    expect(() => parseVlmResult('no json here')).toThrow();
  });

  it('should throw on empty string', () => {
    expect(() => parseVlmResult('')).toThrow();
  });

  it('should parse JSON with nested breakdown', () => {
    const input = JSON.stringify({
      total_score: 92,
      breakdown: {
        layout: { score: 95, issues: [] },
        color: { score: 89, issues: ['slightly off'] },
      },
      critical_issues: [],
      summary: 'Overall good',
    });
    const result = parseVlmResult(input);
    expect(result.breakdown.layout.score).toBe(95);
    expect(result.breakdown.color.issues).toHaveLength(1);
  });
});

describe('buildReport', () => {
  it('should generate passing report when score >= 90', () => {
    const vlmResult = {
      total_score: 95,
      breakdown: {
        layout: { score: 96, issues: [] },
      },
      critical_issues: [],
      summary: 'Excellent match',
    };
    const report = buildReport(vlmResult);
    expect(report).toContain('通过截图还原度验收');
    expect(report).toContain('95');
    expect(report).toContain('Excellent match');
  });

  it('should generate failing report when score < 90', () => {
    const vlmResult = {
      total_score: 75,
      breakdown: {},
      critical_issues: ['Major layout shift'],
      summary: 'Needs work',
    };
    const report = buildReport(vlmResult);
    expect(report).toContain('未通过截图还原度验收');
    expect(report).toContain('75');
    expect(report).toContain('Major layout shift');
  });

  it('should handle boundary value of exactly 90 (pass)', () => {
    const vlmResult = {
      total_score: 90,
      breakdown: {},
      critical_issues: [],
      summary: 'Just passing',
    };
    const report = buildReport(vlmResult);
    expect(report).toContain('通过截图还原度验收');
  });

  it('should handle boundary value of 89 (fail)', () => {
    const vlmResult = {
      total_score: 89,
      breakdown: {},
      critical_issues: [],
      summary: 'Just below',
    };
    const report = buildReport(vlmResult);
    expect(report).toContain('未通过截图还原度验收');
  });

  it('should handle boundary value of 91 (pass)', () => {
    const vlmResult = {
      total_score: 91,
      breakdown: {},
      critical_issues: [],
      summary: 'Just above',
    };
    const report = buildReport(vlmResult);
    expect(report).toContain('通过截图还原度验收');
  });

  it('should include Author stamp in header', () => {
    const vlmResult = { total_score: 95, breakdown: {}, critical_issues: [], summary: '' };
    const report = buildReport(vlmResult);
    expect(report).toMatch(/<!--\s*Author:\s*iv-01\s*-->/);
  });

  it('should render breakdown issues correctly', () => {
    const vlmResult = {
      total_score: 80,
      breakdown: {
        typography: { score: 70, issues: ['Font size mismatch', 'Wrong weight'] },
      },
      critical_issues: [],
      summary: '',
    };
    const report = buildReport(vlmResult);
    expect(report).toContain('Font size mismatch');
    expect(report).toContain('Wrong weight');
  });

  it('should show "(无问题)" when breakdown has no issues', () => {
    const vlmResult = {
      total_score: 95,
      breakdown: {
        layout: { score: 98, issues: [] },
      },
      critical_issues: [],
      summary: '',
    };
    const report = buildReport(vlmResult);
    expect(report).toContain('(无问题)');
  });

  it('should show "无严重问题" when no critical issues', () => {
    const vlmResult = {
      total_score: 95,
      breakdown: {},
      critical_issues: [],
      summary: '',
    };
    const report = buildReport(vlmResult);
    expect(report).toContain('无严重问题');
  });
});

describe('Threshold constant', () => {
  it('should be 90', () => {
    expect(PASS_THRESHOLD).toBe(90);
  });
});
