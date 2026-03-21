/**
 * Tests for lib/model-routing.js
 */
const { getRoute, isValidRole, getValidRoles, getMatrix } = require('../lib/model-routing');

describe('Model Routing Matrix', () => {
  describe('getRoute', () => {
    it('should return opus for pm role', () => {
      const route = getRoute('pm');
      expect(route).toEqual({
        model: 'opus',
        tier: 'heavy',
        reason: expect.any(String),
        capabilities: ['requirements', 'prd', 'bdd', 'user-stories'],
      });
    });

    it('should return opus for lead role', () => {
      const route = getRoute('lead');
      expect(route.model).toBe('opus');
      expect(route.tier).toBe('heavy');
    });

    it('should return sonnet for db-schema-designer', () => {
      const route = getRoute('db-schema-designer');
      expect(route.model).toBe('sonnet');
    });

    it('should return sonnet for be-domain-modeler', () => {
      expect(getRoute('be-domain-modeler').model).toBe('sonnet');
    });

    it('should return sonnet for be-ai-integrator', () => {
      expect(getRoute('be-ai-integrator').model).toBe('sonnet');
    });

    it('should return sonnet for be-api-router', () => {
      expect(getRoute('be-api-router').model).toBe('sonnet');
    });

    it('should return sonnet for qa-01', () => {
      expect(getRoute('qa-01').model).toBe('sonnet');
    });

    it('should return sonnet for qa-02', () => {
      expect(getRoute('qa-02').model).toBe('sonnet');
    });

    it('should return sonnet for qa-03', () => {
      expect(getRoute('qa-03').model).toBe('sonnet');
    });

    it('should return sonnet for iv-01', () => {
      expect(getRoute('iv-01').model).toBe('sonnet');
    });

    it('should return sonnet for iv-02', () => {
      expect(getRoute('iv-02').model).toBe('sonnet');
    });

    it('should return haiku for fe-ui-builder', () => {
      const route = getRoute('fe-ui-builder');
      expect(route.model).toBe('haiku');
      expect(route.tier).toBe('light');
    });

    it('should return haiku for fe-logic-binder', () => {
      const route = getRoute('fe-logic-binder');
      expect(route.model).toBe('haiku');
      expect(route.tier).toBe('light');
    });

    it('should return null for unknown role', () => {
      expect(getRoute('unknown-role')).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(getRoute('')).toBeNull();
    });
  });

  describe('isValidRole', () => {
    it('should return true for all 13 valid roles', () => {
      const roles = [
        'pm',
        'lead',
        'db-schema-designer',
        'be-domain-modeler',
        'be-ai-integrator',
        'be-api-router',
        'qa-01',
        'qa-02',
        'qa-03',
        'iv-01',
        'iv-02',
        'fe-ui-builder',
        'fe-logic-binder',
      ];
      for (const role of roles) {
        expect(isValidRole(role)).toBe(true);
      }
    });

    it('should return false for invalid roles', () => {
      expect(isValidRole('hacker')).toBe(false);
      expect(isValidRole('')).toBe(false);
      expect(isValidRole('PM')).toBe(false); // case-sensitive
    });
  });

  describe('getValidRoles', () => {
    it('should return exactly 13 roles', () => {
      expect(getValidRoles()).toHaveLength(13);
    });

    it('should include pm and lead', () => {
      const roles = getValidRoles();
      expect(roles).toContain('pm');
      expect(roles).toContain('lead');
    });
  });

  describe('getMatrix', () => {
    it('should return a frozen object', () => {
      const matrix = getMatrix();
      expect(Object.isFrozen(matrix)).toBe(true);
    });

    it('should have frozen entries', () => {
      const matrix = getMatrix();
      for (const key of Object.keys(matrix)) {
        expect(Object.isFrozen(matrix[key])).toBe(true);
      }
    });

    it('should silently reject mutations (frozen object)', () => {
      const matrix = getMatrix();
      matrix.newRole = { model: 'gpt' };
      expect(matrix.newRole).toBeUndefined();
    });
  });
});

// V4.1 新增功能测试
const {
  matchByCapabilities,
  parseFrontmatter,
  discoverRoles,
  matchRoles,
} = require('../lib/model-routing');
const path = require('path');

describe('V4 matchByCapabilities', () => {
  it('should match be-api-router for rest-api capability', () => {
    const results = matchByCapabilities(['rest-api']);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].role).toBe('be-api-router');
    expect(results[0].score).toBeGreaterThan(0);
  });

  it('should return empty for non-existent capability', () => {
    const results = matchByCapabilities(['quantum-computing']);
    expect(results).toHaveLength(0);
  });

  it('should return frozen results', () => {
    const results = matchByCapabilities(['rest-api']);
    expect(Object.isFrozen(results)).toBe(true);
  });

  it('should score higher for more matching capabilities', () => {
    const results = matchByCapabilities(['rest-api', 'graphql', 'swagger']);
    expect(results[0].role).toBe('be-api-router');
    expect(results[0].score).toBe(1); // 3/3 = 100%
  });
});

describe('V4.1 parseFrontmatter', () => {
  it('should parse simple string values', () => {
    const content = '---\nname: test-role\ndescription: "A test"\n---\n# Body';
    const fm = parseFrontmatter(content);
    expect(fm.name).toBe('test-role');
    expect(fm.description).toBe('A test');
  });

  it('should parse array values', () => {
    const content = '---\ncapabilities: ["a", "b", "c"]\n---\n';
    const fm = parseFrontmatter(content);
    expect(fm.capabilities).toEqual(['a', 'b', 'c']);
  });

  it('should return empty object for no frontmatter', () => {
    expect(parseFrontmatter('# Just a heading')).toEqual({});
  });

  it('should handle mixed quotes', () => {
    const content = "---\nname: 'quoted-name'\n---\n";
    const fm = parseFrontmatter(content);
    expect(fm.name).toBe('quoted-name');
  });
});

describe('V4.1 discoverRoles', () => {
  const skillsDir = path.join(__dirname, '..', '.claude', 'skills');

  it('should discover roles from skills directory', () => {
    const roles = discoverRoles(skillsDir);
    expect(roles.length).toBeGreaterThan(0);
  });

  it('should return frozen results', () => {
    const roles = discoverRoles(skillsDir);
    expect(Object.isFrozen(roles)).toBe(true);
  });

  it('should return empty array for non-existent directory', () => {
    const roles = discoverRoles('/nonexistent/path');
    expect(roles).toHaveLength(0);
  });

  it('should find gene-extractor with skill source', () => {
    const roles = discoverRoles(skillsDir);
    const geneExtractor = roles.find((r) => r.role === 'gene-extractor');
    expect(geneExtractor).toBeDefined();
    expect(geneExtractor.source).toBe('skill');
    expect(geneExtractor.capabilities).toContain('gene-extraction');
  });

  it('should fallback to matrix for roles without capabilities in SKILL.md', () => {
    const roles = discoverRoles(skillsDir);
    const apiRouter = roles.find((r) => r.role === 'be-api-router');
    if (apiRouter) {
      expect(apiRouter.source).toBe('matrix');
      expect(apiRouter.capabilities).toContain('rest-api');
    }
  });
});

describe('V4.1 matchRoles', () => {
  const skillsDir = path.join(__dirname, '..', '.claude', 'skills');

  it('should match by capabilities with skillsDir', () => {
    const matches = matchRoles({ capabilities: ['gene-extraction'], skillsDir });
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].role).toBe('gene-extractor');
  });

  it('should match by keywords without skillsDir (fallback to matrix)', () => {
    const matches = matchRoles({ keywords: ['api', 'database'] });
    expect(matches.length).toBeGreaterThan(0);
  });

  it('should return empty for empty input', () => {
    expect(matchRoles({})).toHaveLength(0);
    expect(matchRoles({ capabilities: [] })).toHaveLength(0);
    expect(matchRoles({ keywords: ['nonexistent-keyword'] })).toHaveLength(0);
  });

  it('should return frozen results', () => {
    const matches = matchRoles({ capabilities: ['rest-api'] });
    expect(Object.isFrozen(matches)).toBe(true);
  });
});

describe('V4.1 parseFrontmatter edge cases', () => {
  it('should skip lines without key-value format', () => {
    const content = '---\nname: valid\n# this is a comment\n  indented line\n---\n';
    const fm = parseFrontmatter(content);
    expect(fm.name).toBe('valid');
    expect(Object.keys(fm)).toHaveLength(1);
  });

  it('should handle empty frontmatter block', () => {
    const content = '---\n\n---\n';
    const fm = parseFrontmatter(content);
    expect(fm).toEqual({});
  });

  it('should handle frontmatter with only non-matching lines', () => {
    const content = '---\n# comment only\n   \n---\n';
    const fm = parseFrontmatter(content);
    expect(fm).toEqual({});
  });

  it('should parse hyphenated keys', () => {
    const content = '---\nmy-key: my-value\n---\n';
    const fm = parseFrontmatter(content);
    expect(fm['my-key']).toBe('my-value');
  });

  it('should handle array with single element', () => {
    const content = '---\ncapabilities: ["solo"]\n---\n';
    const fm = parseFrontmatter(content);
    expect(fm.capabilities).toEqual(['solo']);
  });

  it('should handle empty array', () => {
    const content = '---\ncapabilities: []\n---\n';
    const fm = parseFrontmatter(content);
    expect(fm.capabilities).toEqual([]);
  });
});

describe('V4.1 discoverRoles edge cases', () => {
  const fs = require('fs');
  const skillsDir = path.join(__dirname, '..', '.claude', 'skills');

  it('should have frozen entries in discovered roles', () => {
    const roles = discoverRoles(skillsDir);
    for (const role of roles) {
      expect(Object.isFrozen(role)).toBe(true);
    }
  });

  it('should include model and tier for each discovered role', () => {
    const roles = discoverRoles(skillsDir);
    for (const role of roles) {
      expect(role).toHaveProperty('model');
      expect(role).toHaveProperty('tier');
      expect(role).toHaveProperty('capabilities');
      expect(role).toHaveProperty('source');
    }
  });
});

describe('V4.1 matchRoles edge cases', () => {
  const skillsDir = path.join(__dirname, '..', '.claude', 'skills');

  it('should combine capabilities and keywords', () => {
    const matches = matchRoles({ capabilities: ['rest-api'], keywords: ['database'], skillsDir });
    expect(matches.length).toBeGreaterThan(0);
  });

  it('should deduplicate capabilities from keywords', () => {
    const matches = matchRoles({ capabilities: ['rest-api'], keywords: ['api'] });
    expect(matches.length).toBeGreaterThan(0);
  });

  it('should return empty for keywords not in KEYWORD_MAP', () => {
    const matches = matchRoles({ keywords: ['xyznonexistent'] });
    expect(matches).toHaveLength(0);
  });
});

describe('Immutability', () => {
  it('capabilities arrays should be frozen (deep immutability)', () => {
    const pm = getRoute('pm');
    expect(Object.isFrozen(pm.capabilities)).toBe(true);
    expect(() => pm.capabilities.push('hacked')).toThrow();
  });

  it('role entry objects should be frozen', () => {
    const lead = getRoute('lead');
    expect(Object.isFrozen(lead)).toBe(true);
  });
});
