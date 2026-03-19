/**
 * model-routing.js unit tests
 *
 * Coverage targets:
 *   getRoute, isValidRole, getValidRoles, getMatrix
 *   matchByCapabilities, parseFrontmatter, matchRoles, discoverRoles
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  getRoute,
  isValidRole,
  getValidRoles,
  getMatrix,
  matchByCapabilities,
  parseFrontmatter,
  matchRoles,
  discoverRoles,
} = require('../model-routing');

// ─── getRoute ─────────────────────────────────────────────────────────────────

describe('getRoute', () => {
  test('returns route info for a valid role', () => {
    const route = getRoute('pm');
    expect(route).not.toBeNull();
    expect(route.model).toBe('opus');
    expect(route.tier).toBe('heavy');
    expect(Array.isArray(route.capabilities)).toBe(true);
    expect(route.capabilities).toContain('prd');
  });

  test('returns null for an unknown role', () => {
    expect(getRoute('nonexistent')).toBeNull();
  });

  test('returns null for empty string', () => {
    expect(getRoute('')).toBeNull();
  });

  test('route object is frozen', () => {
    const route = getRoute('pm');
    expect(Object.isFrozen(route)).toBe(true);
  });
});

// ─── isValidRole ──────────────────────────────────────────────────────────────

describe('isValidRole', () => {
  test('returns true for every role in the matrix', () => {
    const roles = [
      'pm', 'lead', 'db-schema-designer', 'be-domain-modeler', 'be-ai-integrator',
      'be-api-router', 'qa-01', 'qa-02', 'qa-03', 'iv-01', 'iv-02',
      'fe-ui-builder', 'fe-logic-binder',
    ];
    roles.forEach(role => expect(isValidRole(role)).toBe(true));
  });

  test('returns false for unknown role', () => {
    expect(isValidRole('wizard')).toBe(false);
  });

  test('returns false for empty string', () => {
    expect(isValidRole('')).toBe(false);
  });

  test('is case-sensitive', () => {
    expect(isValidRole('PM')).toBe(false);
    expect(isValidRole('Lead')).toBe(false);
  });
});

// ─── getValidRoles ────────────────────────────────────────────────────────────

describe('getValidRoles', () => {
  test('returns 13 roles', () => {
    expect(getValidRoles().length).toBe(13);
  });

  test('includes expected roles', () => {
    const roles = getValidRoles();
    expect(roles).toContain('pm');
    expect(roles).toContain('lead');
    expect(roles).toContain('fe-ui-builder');
    expect(roles).toContain('qa-03');
  });

  test('result is immutable', () => {
    const roles = getValidRoles();
    expect(() => { roles.push('hacker'); }).toThrow();
  });
});

// ─── getMatrix ────────────────────────────────────────────────────────────────

describe('getMatrix', () => {
  test('heavy-tier roles use opus or sonnet', () => {
    const matrix = getMatrix();
    Object.values(matrix)
      .filter(entry => entry.tier === 'heavy')
      .forEach(entry => {
        expect(['opus', 'sonnet']).toContain(entry.model);
      });
  });

  test('light-tier roles use haiku', () => {
    const matrix = getMatrix();
    Object.values(matrix)
      .filter(entry => entry.tier === 'light')
      .forEach(entry => {
        expect(entry.model).toBe('haiku');
      });
  });

  test('every role has non-empty capabilities', () => {
    const matrix = getMatrix();
    Object.entries(matrix).forEach(([role, entry]) => {
      expect(entry.capabilities.length).toBeGreaterThan(0);
    });
  });

  test('matrix is frozen', () => {
    const matrix = getMatrix();
    expect(Object.isFrozen(matrix)).toBe(true);
  });
});

// ─── matchByCapabilities ──────────────────────────────────────────────────────

describe('matchByCapabilities', () => {
  test('exact match returns correct role', () => {
    const results = matchByCapabilities(['prd']);
    expect(results[0].role).toBe('pm');
    expect(results[0].score).toBe(1);
  });

  test('security-audit matches qa-03', () => {
    const results = matchByCapabilities(['security-audit']);
    expect(results[0].role).toBe('qa-03');
  });

  test('returns results sorted by score descending', () => {
    const results = matchByCapabilities(['database', 'schema', 'migration']);
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
    }
  });

  test('no match returns empty array', () => {
    const results = matchByCapabilities(['nonexistent-capability']);
    expect(results).toHaveLength(0);
  });

  test('empty capabilities returns empty array', () => {
    const results = matchByCapabilities([]);
    expect(results).toHaveLength(0);
  });

  test('partial match returns correct score', () => {
    // db-schema-designer has ['database', 'schema', 'migration', 'orm']
    // querying ['database', 'schema'] → score = 2/2 = 1
    const results = matchByCapabilities(['database', 'schema']);
    const dbRole = results.find(r => r.role === 'db-schema-designer');
    expect(dbRole).toBeDefined();
    expect(dbRole.score).toBe(1);
  });

  test('matched field lists only the matching capabilities', () => {
    const results = matchByCapabilities(['prd', 'nonexistent']);
    const pmResult = results.find(r => r.role === 'pm');
    expect(pmResult).toBeDefined();
    expect(pmResult.matched).toContain('prd');
    expect(pmResult.matched).not.toContain('nonexistent');
  });

  test('result is immutable', () => {
    const results = matchByCapabilities(['prd']);
    expect(() => { results.push({}); }).toThrow();
  });
});

// ─── parseFrontmatter ─────────────────────────────────────────────────────────

describe('parseFrontmatter', () => {
  test('parses simple key-value pairs', () => {
    const content = `---
name: gene-extractor
tier: light
model: haiku
---
body`;
    const fm = parseFrontmatter(content);
    expect(fm.name).toBe('gene-extractor');
    expect(fm.tier).toBe('light');
    expect(fm.model).toBe('haiku');
  });

  test('parses inline array syntax', () => {
    const content = `---
capabilities: ['gene-extraction', 'pattern-recognition']
---`;
    const fm = parseFrontmatter(content);
    expect(Array.isArray(fm.capabilities)).toBe(true);
    expect(fm.capabilities).toContain('gene-extraction');
    expect(fm.capabilities).toContain('pattern-recognition');
  });

  test('returns empty object when no frontmatter', () => {
    const fm = parseFrontmatter('# just a heading\nsome body');
    expect(fm).toEqual({});
  });

  test('returns empty object for empty string', () => {
    expect(parseFrontmatter('')).toEqual({});
  });

  test('strips surrounding quotes from values', () => {
    const content = `---\ndescription: "some description"\n---`;
    const fm = parseFrontmatter(content);
    expect(fm.description).toBe('some description');
  });
});

// ─── matchRoles (without skillsDir) ──────────────────────────────────────────

describe('matchRoles (no skillsDir)', () => {
  test('matches by capabilities descriptor', () => {
    const results = matchRoles({ capabilities: ['prd', 'bdd'] });
    expect(results[0].role).toBe('pm');
  });

  test('keyword "api" maps to rest-api → be-api-router', () => {
    const results = matchRoles({ keywords: ['api'] });
    expect(results.some(r => r.role === 'be-api-router')).toBe(true);
  });

  test('keyword "security" maps to security-audit → qa-03', () => {
    const results = matchRoles({ keywords: ['security'] });
    expect(results[0].role).toBe('qa-03');
  });

  test('keyword "database" maps to database → db-schema-designer', () => {
    const results = matchRoles({ keywords: ['database'] });
    expect(results[0].role).toBe('db-schema-designer');
  });

  test('unknown keyword returns empty array', () => {
    const results = matchRoles({ keywords: ['zzz-unknown'] });
    expect(results).toHaveLength(0);
  });

  test('empty descriptor returns empty array', () => {
    const results = matchRoles({});
    expect(results).toHaveLength(0);
  });

  test('capabilities and keywords are combined (deduped)', () => {
    // both 'security-audit' cap and 'security' keyword map to security-audit
    const results = matchRoles({ capabilities: ['security-audit'], keywords: ['security'] });
    expect(results[0].role).toBe('qa-03');
    expect(results[0].score).toBe(1); // no duplicate inflation
  });

  test('result is immutable', () => {
    const results = matchRoles({ capabilities: ['prd'] });
    expect(() => { results.push({}); }).toThrow();
  });
});

// ─── discoverRoles ────────────────────────────────────────────────────────────

describe('discoverRoles', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fusion-discover-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  // Helper: write a SKILL.md into a named subdirectory
  function makeSkill(roleName, content) {
    const dir = path.join(tmpDir, roleName);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'SKILL.md'), content, 'utf8');
  }

  test('returns empty array when skillsDir does not exist', () => {
    const results = discoverRoles('/nonexistent/path/skills');
    expect(results).toHaveLength(0);
    expect(Object.isFrozen(results)).toBe(true);
  });

  test('skips subdirectory with no SKILL.md', () => {
    fs.mkdirSync(path.join(tmpDir, 'empty-role'));
    const results = discoverRoles(tmpDir);
    expect(results).toHaveLength(0);
  });

  test('SKILL.md with frontmatter capabilities uses skill source', () => {
    makeSkill('custom-agent', `---
name: custom-agent
tier: light
model: haiku
capabilities: ['custom-cap', 'another-cap']
---
# Custom Agent`);
    const results = discoverRoles(tmpDir);
    expect(results).toHaveLength(1);
    expect(results[0].role).toBe('custom-agent');
    expect(results[0].source).toBe('skill');
    expect(results[0].capabilities).toContain('custom-cap');
    expect(results[0].model).toBe('haiku');
    expect(results[0].tier).toBe('light');
  });

  test('SKILL.md with no frontmatter falls back to matrix entry', () => {
    makeSkill('pm', '# PM Skill\nno frontmatter here');
    const results = discoverRoles(tmpDir);
    expect(results).toHaveLength(1);
    expect(results[0].role).toBe('pm');
    expect(results[0].source).toBe('matrix');
    expect(results[0].capabilities).toContain('prd');
    expect(results[0].model).toBe('opus');
  });

  test('SKILL.md with no frontmatter and unknown role gets empty capabilities', () => {
    makeSkill('unknown-role', '# Unknown\nno frontmatter');
    const results = discoverRoles(tmpDir);
    expect(results).toHaveLength(1);
    expect(results[0].role).toBe('unknown-role');
    expect(results[0].source).toBe('matrix');
    expect(results[0].capabilities).toHaveLength(0);
    expect(results[0].model).toBe('sonnet');
  });

  test('discovers multiple skills', () => {
    makeSkill('pm', `---\nname: pm\ncapabilities: ['prd']\n---`);
    makeSkill('lead', `---\nname: lead\ncapabilities: ['architecture']\n---`);
    const results = discoverRoles(tmpDir);
    expect(results).toHaveLength(2);
    const roles = results.map(r => r.role);
    expect(roles).toContain('pm');
    expect(roles).toContain('lead');
  });

  test('result is frozen', () => {
    makeSkill('pm', `---\nname: pm\ncapabilities: ['prd']\n---`);
    const results = discoverRoles(tmpDir);
    expect(Object.isFrozen(results)).toBe(true);
    expect(Object.isFrozen(results[0])).toBe(true);
  });

  test('matchRoles with skillsDir uses discovered roles', () => {
    makeSkill('custom-agent', `---
name: custom-agent
tier: light
model: haiku
capabilities: ['rare-cap']
---`);
    const results = matchRoles({ capabilities: ['rare-cap'], skillsDir: tmpDir });
    expect(results).toHaveLength(1);
    expect(results[0].role).toBe('custom-agent');
    expect(results[0].source).toBe('skill');
  });
});
