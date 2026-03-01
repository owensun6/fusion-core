/**
 * Fusion-Core: Model Routing Matrix (独立模块)
 *
 * 13 兵种 → 模型映射表，供 router 和 hook 共用。
 * 所有数据不可变 (Object.freeze)。
 *
 * V4 增强: 每个兵种增加 capabilities 字段 + matchByCapabilities() 能力匹配。
 * V4.1 增强: discoverRoles() 动态发现 + matchRoles() 组合匹配。
 */

const MODEL_ROUTING_MATRIX = Object.freeze({
  // 重度兵种 — 需要最强推理能力
  pm: Object.freeze({
    model: 'opus',
    tier: 'heavy',
    reason: '架构级思考需要最强推导能力',
    capabilities: ['requirements', 'prd', 'bdd', 'user-stories'],
  }),
  lead: Object.freeze({
    model: 'opus',
    tier: 'heavy',
    reason: '架构级思考需要最强推导能力',
    capabilities: ['architecture', 'system-design', 'task-planning', 'adr'],
  }),
  // 厚上下文兵种 — 核心结构设计
  'db-schema-designer': Object.freeze({
    model: 'sonnet',
    tier: 'heavy',
    reason: '数据库设计属于不可逆核心结构',
    capabilities: ['database', 'schema', 'migration', 'orm'],
  }),
  'be-domain-modeler': Object.freeze({
    model: 'sonnet',
    tier: 'heavy',
    reason: '领域建模需要深度业务理解',
    capabilities: ['domain-logic', 'business-rules', 'validation'],
  }),
  'be-ai-integrator': Object.freeze({
    model: 'sonnet',
    tier: 'heavy',
    reason: 'AI 集成需要精确推理',
    capabilities: ['ai-integration', 'llm', 'prompt-engineering', 'embedding'],
  }),
  // 中度兵种 — 测试与审查
  'be-api-router': Object.freeze({
    model: 'sonnet',
    tier: 'medium',
    reason: 'API 路由涉及契约完整性',
    capabilities: ['rest-api', 'graphql', 'route-definition', 'swagger'],
  }),
  'qa-01': Object.freeze({
    model: 'sonnet',
    tier: 'medium',
    reason: '语法检查涉及长代码段检索',
    capabilities: ['syntax-check', 'code-style', 'linting'],
  }),
  'qa-02': Object.freeze({
    model: 'sonnet',
    tier: 'medium',
    reason: '规范合规需要上下文理解',
    capabilities: ['spec-compliance', 'contract-validation'],
  }),
  'qa-03': Object.freeze({
    model: 'sonnet',
    tier: 'medium',
    reason: '安全审计不可降级',
    capabilities: ['security-audit', 'owasp', 'vulnerability-scan'],
  }),
  'iv-01': Object.freeze({
    model: 'sonnet',
    tier: 'medium',
    reason: '契约验证需要精确比对',
    capabilities: ['e2e-test', 'connectivity', 'playwright'],
  }),
  'iv-02': Object.freeze({
    model: 'sonnet',
    tier: 'medium',
    reason: '数据流追踪需要上下文',
    capabilities: ['data-flow', 'serialization', 'cache-invalidation'],
  }),
  // 轻量兵种 — 纯体力活
  'fe-ui-builder': Object.freeze({
    model: 'haiku',
    tier: 'light',
    reason: '纯 HTML/CSS 搬运，无需宏观思考',
    capabilities: ['html', 'css', 'react-component', 'ui-layout'],
  }),
  'fe-logic-binder': Object.freeze({
    model: 'haiku',
    tier: 'light',
    reason: '已有 Swagger 契约，只需写 Fetch',
    capabilities: ['api-binding', 'state-management', 'fetch', 'swr'],
  }),
});

const VALID_ROLES = Object.freeze(Object.keys(MODEL_ROUTING_MATRIX));

/**
 * 获取指定角色的路由信息
 * @param {string} role - 兵种角色名
 * @returns {{ model: string, tier: string, reason: string, capabilities: string[] } | null}
 */
function getRoute(role) {
  return MODEL_ROUTING_MATRIX[role] || null;
}

/**
 * 检查角色是否合法
 * @param {string} role
 * @returns {boolean}
 */
function isValidRole(role) {
  return VALID_ROLES.includes(role);
}

/**
 * 获取所有合法角色列表
 * @returns {readonly string[]}
 */
function getValidRoles() {
  return VALID_ROLES;
}

/**
 * 获取完整路由矩阵（只读）
 * @returns {Readonly<Record<string, {model: string, tier: string, reason: string, capabilities: string[]}>>}
 */
function getMatrix() {
  return MODEL_ROUTING_MATRIX;
}

/**
 * V4: 根据能力标签匹配兵种
 * @param {string[]} requiredCapabilities - 所需能力标签列表
 * @returns {{ role: string, score: number, matched: string[], entry: object }[]} 按匹配度降序排列
 */
function matchByCapabilities(requiredCapabilities) {
  const results = [];

  for (const [role, entry] of Object.entries(MODEL_ROUTING_MATRIX)) {
    const matched = requiredCapabilities.filter((cap) => entry.capabilities.includes(cap));
    if (matched.length > 0) {
      results.push({
        role,
        score: matched.length / requiredCapabilities.length,
        matched,
        entry,
      });
    }
  }

  return Object.freeze(results.sort((a, b) => b.score - a.score));
}

/**
 * V4.1: 从 SKILL.md frontmatter 中解析 YAML 头部（轻量级，无外部依赖）
 * @param {string} content - SKILL.md 文件内容
 * @returns {Record<string, string | string[]>}
 */
function parseFrontmatter(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return {};

  const result = {};
  for (const line of fmMatch[1].split('\n')) {
    const kvMatch = line.match(/^(\w[\w-]*):\s*(.+)$/);
    if (!kvMatch) continue;

    const [, key, rawValue] = kvMatch;
    const value = rawValue.replace(/^["']|["']$/g, '').trim();

    if (value.startsWith('[') && value.endsWith(']')) {
      result[key] = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.replace(/^[\s"']+|[\s"']+$/g, ''))
        .filter(Boolean);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * V4.1: 扫描 skills 目录，从每个 SKILL.md 的 frontmatter 提取能力标签
 * 没有 capabilities 的 SKILL.md 回退到 MODEL_ROUTING_MATRIX
 * @param {string} skillsDir - .claude/skills/ 的绝对路径
 * @returns {readonly { role: string, capabilities: string[], tier: string, model: string, source: 'skill'|'matrix' }[]}
 */
function discoverRoles(skillsDir) {
  const fs = require('fs');
  const path = require('path');

  const discovered = [];
  if (!fs.existsSync(skillsDir)) return Object.freeze(discovered);

  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillPath = path.join(skillsDir, entry.name, 'SKILL.md');
    if (!fs.existsSync(skillPath)) continue;

    try {
      const content = fs.readFileSync(skillPath, 'utf8');
      const fm = parseFrontmatter(content);
      const roleName = fm.name || entry.name;
      const matrixEntry = MODEL_ROUTING_MATRIX[roleName];

      discovered.push(
        Object.freeze({
          role: roleName,
          capabilities: fm.capabilities || (matrixEntry ? matrixEntry.capabilities : []),
          tier: fm.tier || (matrixEntry ? matrixEntry.tier : 'medium'),
          model: fm.model || (matrixEntry ? matrixEntry.model : 'sonnet'),
          source: fm.capabilities ? 'skill' : 'matrix',
        }),
      );
    } catch {
      // 跳过无法读取的文件
    }
  }

  return Object.freeze(discovered);
}

/**
 * V4.1: 根据任务描述符匹配兵种（discoverRoles + matchByCapabilities 的组合）
 * @param {{ capabilities?: string[], keywords?: string[], skillsDir?: string }} descriptor
 * @returns {readonly { role: string, score: number, matched: string[], source: string }[]}
 */
function matchRoles(descriptor) {
  const { capabilities: requiredCaps, keywords, skillsDir } = descriptor;

  const KEYWORD_MAP = {
    api: 'rest-api',
    rest: 'rest-api',
    graphql: 'graphql',
    database: 'database',
    schema: 'schema',
    sql: 'database',
    ui: 'react-component',
    css: 'css',
    html: 'html',
    fetch: 'fetch',
    state: 'state-management',
    domain: 'domain-logic',
    business: 'business-rules',
    security: 'security-audit',
    test: 'e2e-test',
    ai: 'ai-integration',
    llm: 'llm',
    prompt: 'prompt-engineering',
    prd: 'prd',
    requirement: 'requirements',
    bdd: 'bdd',
    architecture: 'architecture',
    design: 'system-design',
    swagger: 'swagger',
    migration: 'migration',
    component: 'react-component',
    layout: 'ui-layout',
    swr: 'swr',
    binding: 'api-binding',
    validation: 'validation',
    owasp: 'owasp',
    audit: 'security-audit',
    playwright: 'playwright',
    e2e: 'e2e-test',
    gene: 'gene-extraction',
    pattern: 'pattern-recognition',
  };

  const capsFromKeywords = (keywords || [])
    .map((kw) => KEYWORD_MAP[kw.toLowerCase()])
    .filter(Boolean);

  const allCaps = [...new Set([...(requiredCaps || []), ...capsFromKeywords])];
  if (allCaps.length === 0) return Object.freeze([]);

  if (skillsDir) {
    const discovered = discoverRoles(skillsDir);
    const results = [];
    for (const role of discovered) {
      const matched = allCaps.filter((cap) => role.capabilities.includes(cap));
      if (matched.length > 0) {
        results.push({
          role: role.role,
          score: matched.length / allCaps.length,
          matched,
          source: role.source,
        });
      }
    }
    return Object.freeze(results.sort((a, b) => b.score - a.score));
  }

  return matchByCapabilities(allCaps);
}

module.exports = {
  getRoute,
  isValidRole,
  getValidRoles,
  getMatrix,
  matchByCapabilities,
  discoverRoles,
  matchRoles,
  parseFrontmatter,
};
