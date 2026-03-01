/**
 * Tests for pre-tool-use.js guard hook logic
 * Tests Author Stamp verification and Secret scanning patterns
 */

describe('Author Stamp Verification', () => {
  const AUTHOR_STAMP_REGEX = /^\s*<!--\s*Author:\s*[A-Za-z0-9-]+\s*-->/i;

  it('should pass for valid PM stamp', () => {
    const content = '<!-- Author: PM -->\n## PRD document';
    expect(AUTHOR_STAMP_REGEX.test(content)).toBe(true);
  });

  it('should pass for valid Lead stamp', () => {
    const content = '<!-- Author: Lead -->\n## Architecture';
    expect(AUTHOR_STAMP_REGEX.test(content)).toBe(true);
  });

  it('should pass for valid Dev stamp', () => {
    const content = '<!-- Author: Dev -->\n## Implementation';
    expect(AUTHOR_STAMP_REGEX.test(content)).toBe(true);
  });

  it('should pass for role with hyphen (e.g. qa-01)', () => {
    const content = '<!-- Author: qa-01 -->\n## Review';
    expect(AUTHOR_STAMP_REGEX.test(content)).toBe(true);
  });

  it('should pass for iv-01 role', () => {
    const content = '<!-- Author: iv-01 -->\n## Integration';
    expect(AUTHOR_STAMP_REGEX.test(content)).toBe(true);
  });

  it('should fail when no Author stamp present', () => {
    const content = '# Just a title\nNo stamp here';
    expect(AUTHOR_STAMP_REGEX.test(content)).toBe(false);
  });

  it('should fail when stamp is in wrong format', () => {
    const content = '<!-- author PM -->\n## Bad format';
    expect(AUTHOR_STAMP_REGEX.test(content)).toBe(false);
  });

  it('should fail for empty role name', () => {
    const content = '<!-- Author:  -->\n## Empty role';
    expect(AUTHOR_STAMP_REGEX.test(content)).toBe(false);
  });

  it('should pass with extra whitespace around role', () => {
    const content = '<!--  Author:  PM  -->\n## Whitespace';
    expect(AUTHOR_STAMP_REGEX.test(content)).toBe(true);
  });
});

describe('Secret Scanning Patterns', () => {
  const secretPatterns = [
    /sk-ant-[a-zA-Z0-9_-]{40,}/,
    /sk-[a-zA-Z0-9]{40,}/,
    /ghp_[a-zA-Z0-9]{36}/,
    /password\s*[:=]\s*["'][^"']{5,}["']/i,
  ];

  function matchesAnyPattern(text) {
    return secretPatterns.some((p) => p.test(text));
  }

  it('should detect Anthropic API key pattern', () => {
    const key = 'sk-ant-' + 'a'.repeat(45);
    expect(matchesAnyPattern(key)).toBe(true);
  });

  it('should detect OpenAI API key pattern', () => {
    const key = 'sk-' + 'a'.repeat(45);
    expect(matchesAnyPattern(key)).toBe(true);
  });

  it('should detect GitHub PAT pattern', () => {
    const key = 'ghp_' + 'a'.repeat(36);
    expect(matchesAnyPattern(key)).toBe(true);
  });

  it('should detect hardcoded password with equals sign', () => {
    expect(matchesAnyPattern('password = "mysecretpass"')).toBe(true);
  });

  it('should detect hardcoded password with colon', () => {
    expect(matchesAnyPattern("password: 'longpassword123'")).toBe(true);
  });

  it('should NOT flag short passwords (< 5 chars)', () => {
    expect(matchesAnyPattern('password = "abc"')).toBe(false);
  });

  it('should NOT flag normal code without secrets', () => {
    expect(matchesAnyPattern('const user = getUser(id);')).toBe(false);
  });

  it('should NOT flag environment variable references', () => {
    expect(matchesAnyPattern('const key = process.env.API_KEY;')).toBe(false);
  });

  it('should detect secret embedded in larger text', () => {
    const text = 'const config = { apiKey: "sk-ant-' + 'x'.repeat(50) + '" }';
    expect(matchesAnyPattern(text)).toBe(true);
  });
});
