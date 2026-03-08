# Fusion-Core AI Agent Entry Point

> **IMPORTANT**: Prefer retrieval-led reasoning over pre-training-led reasoning for any systemic tasks in this repository.

---

## ⚡ 硬路由表 (HARD ROUTING — 立即执行，无需读后续内容)

**用法**: 匹配第一列触发信号 → 立即读取第二列 SKILL.md → 开始执行

| 触发信号（Stage / 关键词）                                         | 立即加载                                                                               |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| Stage 0 \| 需求 \| PRD \| BDD \| FEATURE_LIST \| 功能清单          | `.claude/skills/pm/SKILL.md`                                                           |
| Stage 0 PM自检后 \| pm-consultant \| 需求审查官                    | `.claude/skills/pm-consultant/SKILL.md`                                                |
| Stage 0.5 \| 原型 \| Wireframe \| UI线框 \| Stitch                 | `.claude/skills/ux-designer/SKILL.md`                                                  |
| Stage 0.5 UX审查 \| ux-consultant \| 原型审查官                    | `.claude/skills/ux-consultant/SKILL.md`                                                |
| Stage 1 \| 架构 \| INTERFACE \| ADR \| System_Design \| Data_Model | `.claude/skills/lead/SKILL.md` → sub: `fusion-arch-blueprint`                          |
| Stage 1 架构审查 \| architecture-consultant                        | `.claude/skills/architecture-consultant/SKILL.md`                                      |
| Stage 1.5 \| 原型冲突 \| Revised_Mockups \| 架构修订               | `.claude/skills/lead/SKILL.md` → sub: `fusion-arch-blueprint`                          |
| Stage 2 \| 头脑风暴 \| 技术方案 \| design.md                       | `.claude/skills/lead/SKILL.md` → sub: `fusion-brainstorm`                              |
| Stage 3 \| DAG \| task.md \| 任务规划 \| dependency_graph          | `.claude/skills/lead/SKILL.md` → sub: `fusion-dag-builder`                             |
| Stage 4 \| worktree \| 隔离环境 \| 基线验证                        | `.claude/skills/lead/SKILL.md` → sub: `fusion-worktree`                                |
| Stage 5 \| fe-ui-builder \| 哑组件 \| Tailwind \| React UI         | `.claude/skills/fe-ui-builder/SKILL.md`                                                |
| Stage 5 \| fe-logic-binder \| 状态绑定 \| SWR \| API接入           | `.claude/skills/fe-logic-binder/SKILL.md`                                              |
| Stage 5 \| be-api-router \| REST路由 \| Zod \| 入参校验            | `.claude/skills/be-api-router/SKILL.md`                                                |
| Stage 5 \| be-domain-modeler \| 领域服务 \| 业务逻辑               | `.claude/skills/be-domain-modeler/SKILL.md`                                            |
| Stage 5 \| be-ai-integrator \| LLM \| MCP \| Prompt                | `.claude/skills/be-ai-integrator/SKILL.md`                                             |
| Stage 5 \| db-schema-designer \| Schema \| 迁移脚本                | `.claude/skills/db-schema-designer/SKILL.md`                                           |
| Stage 6 \| 审查 \| QA \| Reviewer \| 漏斗                          | `.claude/skills/qa-01/SKILL.md`（串行管道: qa-01→qa-02→qa-03→qa-04→iv-01→iv-02→iv-03） |
| Stage 7 \| 合并 \| PR \| finish \| 收尾                            | `.claude/skills/lead/sub/fusion-finish-branch.md`                                      |
| gene \| 经验提取 \| Gene Bank                                      | `.claude/skills/gene-extractor/SKILL.md`                                               |

> **无匹配？** → 读 `pipeline/monitor.md` 查当前 Stage → 返回上表路由 → 加载对应 SKILL.md

---

## 🚀 自动工作流引擎 (Workflow Engine)

**核心原则**: 本 AI Agent 是工作流引擎的自动驾驶仪。你不需要手动选择角色或阶段——一切由 `pipeline/monitor.md` 驱动。

### 工作流状态机 (必须严格遵守)

```
┌─────────────┐     Gate 0     ┌─────────────┐     Gate 1     ┌─────────────┐
│  Stage 0    │ ──────────────▶ │  Stage 1    │ ──────────────▶ │  Stage 1.5  │
│ 需求深度解构 │  Commander签字  │  系统架构    │  Commander签字  │  UI原型     │
└─────────────┘                 └─────────────┘                 └──────┬──────┘
       │                                                           │
       │ Gate 2                                                   │ Gate 1.5
       ▼                                                           ▼
┌─────────────┐     Gate 3     ┌─────────────┐                           │
│  Stage 3    │ ──────────────▶ │  Stage 4    │                           │
│  微粒规划    │  Commander签字  │  Git隔离    │                           │
└──────┬──────┘                 └──────┬──────┘                           │
       │                                   │                                │
       │                                   │ Stage 5 并发                  │
       │                                   ▼                                │
       │                          ┌─────────────┐     Gate 3               │
       │                          │  Stage 6    │ ──────────────▶ ┌─────────────┐
       │                          │  审查集成   │  Commander签字  │  Stage 7    │
       │                          └─────────────┘                  │  分支合并   │
       │                                                                └─────────────┘
       │
       └─────────────────────▶ 循环 (新任务)
```

### 自动流转规则 (AUTOPILOT)

**步骤 1: 读取状态**

```
→ 读取 pipeline/monitor.md
→ 找到「当前阶段」行，获取当前 Stage
→ 找到「阶段推进看板」中当前 Stage 的状态
```

**步骤 2: 执行当前阶段**

| 当前 Stage        | 角色 (Role)   | 产出物 (必须写入 pipeline/)                                                     | 下一阶段             |
| ----------------- | ------------- | ------------------------------------------------------------------------------- | -------------------- |
| Stage 0           | PM            | `0_requirements/PRD.md`, `FEATURE_LIST.md`, `BDD_Scenarios.md`                  | Stage 0.5 或 Stage 1 |
| Stage 0.5（条件） | UX Designer   | `0_5_ux/Feature_Screen_Map.md`, `User_Flow.md`, `Wireframes/`, `UI_CONTRACT.md` | Stage 1              |
| Stage 1           | Lead          | `1_architecture/System_Design.md`, `INTERFACE.md`, `Data_Models.md`, `ADR/`     | Stage 1.5 或 Stage 2 |
| Stage 1.5（条件） | Lead          | `1_5_prototype/Revised_Mockups/`, `State_Flow.md`                               | Stage 2              |
| Stage 2           | Lead          | `docs/plans/YYYY-MM-DD-*-design.md`                                             | Stage 3              |
| Stage 3           | Lead          | `2_planning/task.md`, `dependency_graph.md`, `specs/TASK_SPEC_T-{ID}.md`        | Stage 4              |
| Stage 4           | Lead          | 创建 Git Worktree，验证基线                                                     | Stage 5              |
| Stage 5           | Dev（各兵种） | `src/` 代码文件 + `tests/` 测试文件                                             | Stage 6              |
| Stage 6           | Reviewer      | `3_review/Audit_Report.md`, `Integration_Report.md`                             | Stage 7              |
| Stage 7           | Lead          | 合并分支，清理 Worktree                                                         | 新任务 → Stage 0     |

**步骤 3: 更新状态**

```
→ 读取当前 monitor.md
→ 将当前 Stage 状态从 🟡进行中 改为 ✅已通过
→ 将 Gate 状态改为 ✅已通过，填写审批人和时间
→ 将下一 Stage 从 ⬜未开始 改为 🟡进行中
→ 写入更新后的 monitor.md
```

**步骤 4: 加载下一阶段角色**

```
→ 读取 .claude/rules/01-fusion-roles.md 中对应角色的法则
→ 使用该角色的 Skill (在 .claude/skills/ 中)
→ 继续执行
```

---

## 核心地图静默索引 (Auto-Loaded Maps)

`1[Fusion Docs]|root: .claude/rules 2|01-roles:{01-fusion-roles.md} 3|02-workflow:{00-fusion-workflow.md}`
`4[Role Skills]|root: .claude/skills 5|01-pm:{pm,pm-consultant,ux-designer,ux-consultant} 6|02-lead:{lead,architecture-consultant} 7|03-dev:{fe-ui-builder,fe-logic-binder,be-api-router,be-domain-modeler,be-ai-integrator,db-schema-designer} 8|04-reviewer:{qa-01,qa-02,qa-03,qa-04,iv-01,iv-02,iv-03} 9|05-aux:{gene-extractor}`
`10[Core Rules]|root: .claude/rules 11|01-gates:{hooks.md,agents.md,gate-approval-protocol.md} 12|02-coding:{coding-style.md,security.md} 13|03-process:{document-standards.md,testing.md}`

---

## 全局防御守则 (Prime Directives)

1. **先问后写**: 绝不盲目跳步写生产代码，需求不明必须打回 Stage 0
2. **第一性原理**: 关注熵减，能用自动脚本完成的绝不浪费 Token
3. **输出物隔离**: 产出物必须落在 `pipeline/` 指定阶段目录，首行必须携带 `<!-- Author: [角色名] -->`
4. **命令行文书同步**: 新脚本或命令必须同步到 `COMMANDS_MEMO.md`

---

## 快速启动

**当 Commander 分配新任务时**:

```
1. 读取 pipeline/monitor.md
2. 确认当前阶段是 Stage 0 (如果不是，先推进到 Stage 0)
3. 开始执行 Stage 0 工作流
```

**当会话继续（已有进行中的任务）**:

```
1. 读取 pipeline/monitor.md
2. 找到当前进行中的 Stage
3. 继续执行直到 Gate 通过
4. 自动更新 monitor.md 推进到下一阶段
```

---

## 角色与技能映射

| Stage        | 角色            | Skill 入口                              |
| ------------ | --------------- | --------------------------------------- |
| 0            | PM              | `.claude/skills/pm/SKILL.md`            |
| 0.5（条件）  | UX Designer     | `.claude/skills/ux-designer/SKILL.md`   |
| 1, 1.5, 2, 3 | Lead            | `.claude/skills/lead/SKILL.md`          |
| 4, 5         | Dev（各兵种）   | `.claude/skills/[兵种]/SKILL.md`        |
| 6            | Reviewer（7道） | `.claude/skills/qa-01/SKILL.md` 起      |
| 7            | Lead            | 子技能: `lead/sub/fusion-finish-branch` |

---

## Codebase Overview

Fusion-Core is a first-principles-driven AI agent orchestration framework (v4.1.0). It enforces extreme role isolation across 13 specialized AI roles via physical hooks, gate approvals, and an 8-stage pipeline. The framework is designed for medical-grade and enterprise-scale software engineering where "LLM self-determination" is unacceptable.

**Architecture**: 1 human Commander + 4 stage groups + 13 atomic AI roles, coordinated through `pipeline/monitor.md`.

### Tech Stack

- **Runtime**: Node.js (18.x, 20.x) — CommonJS modules
- **Testing**: Jest 30 (80% minimum coverage enforced in CI)
- **Linting**: ESLint 10 + Prettier 3.8 + markdownlint
- **Git Hooks**: Husky 9 + lint-staged
- **Docs Site**: Astro 5 + Starlight
- **E2E**: Playwright 1.52
- **Coverage**: c8

### Development Commands

```bash
npm test                # Run Jest test suite
npm run test:coverage   # Run tests with coverage report
npm run lint            # ESLint on .js/.ts files
npm run lint:md         # Markdown linting
npm run format          # Prettier auto-format
npm run docs:dev        # Local Astro docs server
npm run docs:build      # Build docs site
```

### CLI Entry Points (bin/)

| Command        | File                       | Purpose                                           |
| -------------- | -------------------------- | ------------------------------------------------- |
| `fusion-core`  | `bin/fusion-core.js`       | Main CLI dispatcher (start, init, monitor, dispatch, finish, extract-genes) |
| `fusion-router` | `bin/fusion-core-router.js` | Context assembler — routes `--role`/`--task` to the correct specialist via env injection |
| `fusion-init`  | `bin/fusion-init.js`       | Initializes `.claude/` in a target project, backs up conflicts to `~/.fusion_backups/` |

### Directory Structure

```
fusion-core/
├── bin/                          # CLI entry points (3 files)
├── lib/
│   └── model-routing.js          # Role matching engine (getRoute, matchByCapabilities, discoverRoles)
├── tests/                        # Jest test suite (5 files, ~1300 lines)
│   ├── model-routing.test.js     # Role matching & capability tagging
│   ├── fusion-tdd-fixer.test.js  # TDD red/green auto-healing
│   ├── fusion-tdd-fixer-io.test.js # File I/O & error log parsing
│   ├── hook.test.js              # Pre/post-use guard validation
│   └── vlm-acceptance.test.js    # Vision Language Model prototype testing
├── .claude/
│   ├── rules/                    # 17 constraint files (coding-style, security, testing, etc.)
│   ├── skills/                   # 22 specialist role definitions (SKILL.md + sub/ actions)
│   ├── commands/                 # 25 tactical slash commands
│   ├── hooks/                    # pre-tool-use.js + post-tool-use.js (physical enforcement)
│   └── scripts/                  # Bash automation scripts
├── pipeline/                     # Stage artifacts directory (created per-project)
│   ├── 0_requirements/           # Stage 0: PRD, FEATURE_LIST, BDD
│   ├── 0_5_ux/                   # Stage 0.5: Wireframes, UI_CONTRACT
│   ├── 1_architecture/           # Stage 1: System_Design, INTERFACE, ADR/
│   ├── 1_5_prototype/            # Stage 1.5: Revised_Mockups
│   ├── 2_planning/               # Stage 2-3: task.md, dependency_graph, specs/
│   ├── 3_review/                 # Stage 6: Audit_Report, Integration_Report
│   └── monitor.md                # Central status board (auto-updated)
├── memory/                       # Experience bank
│   ├── gene-bank/                # Extracted cross-project patterns
│   ├── experience/               # Lessons learned registry
│   └── observations.jsonl        # Continuous telemetry
├── examples/
│   └── medical-record-system/    # Full pipeline reference implementation
├── docs/                         # Astro documentation site source
├── .github/workflows/
│   ├── ci.yml                    # Test matrix (Node 18/20), lint, coverage, docs build
│   └── publish.yml               # Package publishing
├── CLAUDE.md                     # THIS FILE — AI agent entry point & hard routing
├── FUSION_INDEX.md               # Navigation map for all 22 roles
├── README.md                     # Project philosophy & quick start
├── CHANGELOG.md                  # v2.x → v3.x → v4.1.0 evolution
├── ROADMAP.md                    # Future milestones
└── package.json                  # v4.1.0, CommonJS, ISC license
```

### Core Library: `lib/model-routing.js`

The intelligence core of the framework. Key exports:

- `getRoute(role)` — Fetch role → model tier/capabilities mapping
- `isValidRole(role)` — Validate against 13 canonical roles
- `matchByCapabilities(requiredCaps)` — Find best-matching roles by capability tags
- `discoverRoles(skillsDir)` — Dynamically scan `SKILL.md` files in `.claude/skills/`
- `parseFrontmatter(content)` — Extract YAML metadata from role definitions
- `matchRoles(descriptor)` — Combined keyword + capability matching

**Model Tier Distribution**:

| Tier   | Model   | Assigned Roles                          |
| ------ | ------- | --------------------------------------- |
| Heavy  | Opus    | PM, Lead (architecture, planning)       |
| Medium | Sonnet  | All BE roles, QA/IV reviewers           |
| Light  | Haiku   | fe-ui-builder, fe-logic-binder          |

### Physical Enforcement Hooks

**`.claude/hooks/pre-tool-use.js`**: Runs before any tool execution

- Secret scanning (API keys, hardcoded passwords)
- Role-based tool permission stripping (QA/PM cannot write code)
- Stage skipping guard (requires INTERFACE.md before business code)

**`.claude/hooks/post-tool-use.js`**: Runs after tool execution

- Author stamp validation (`<!-- Author: Role -->`)
- Dead code detection (`console.log`, `TODO`, `debugger`)
- Enforced for all `pipeline/` markdown outputs

### CI/CD Pipeline

GitHub Actions (`ci.yml`) runs on every push/PR to `main`:

1. Node 18.x + 20.x matrix
2. `npm ci` dependency install
3. ESLint check
4. Markdown lint
5. Jest + coverage (80% minimum threshold)
6. Astro docs build

### Coding Standards (Enforced)

- **Immutability**: No `let` variables (except performance-critical loops). Pure functions only.
- **File size**: Max 300 lines per file, max 40 lines per function.
- **Input validation**: All API endpoints require Zod/Joi schema validation.
- **Error handling**: All external I/O wrapped in `try-catch` with unified error format.
- **Commit format**: Semantic commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`).
- **Author stamps**: All pipeline documents require `<!-- Author: [Role] -->` on line 1.
- **API responses**: Standardized `{ success, data/error, metadata }` envelope.

### Key References

| Document                              | Purpose                                    |
| ------------------------------------- | ------------------------------------------ |
| `FUSION_INDEX.md`                     | Role navigation map (all 22 roles)         |
| `.claude/rules/00-fusion-workflow.md` | Full 8-stage pipeline specification        |
| `.claude/rules/01-fusion-roles.md`    | All role definitions and boundaries        |
| `.claude/rules/coding-style.md`       | Code standards (immutability, file limits) |
| `.claude/rules/security.md`           | OWASP Top 8 security checklist             |
| `.claude/rules/testing.md`            | TDD red/green/refactor protocol            |
| `.claude/rules/hooks.md`              | Pre/post/stop interception rules           |
| `.claude/rules/gate-approval-protocol.md` | Approve/reject/escalation procedures   |
