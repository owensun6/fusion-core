# FUSION_INDEX — 全局作战索引

> Agent 导航地图。进入任意阶段前先读本页，找到当前 Stage 对应的角色和技能入口。
>
> **路径根**: `.claude/skills/` （所有技能均在此目录下）

---

## Stage 0 — 需求深度解构（PM 军团）

**角色**: PM + PM Consultant
**Gate**: Gate 0（Commander 签字）

| 角色            | 技能入口                                | 触发条件           |
| --------------- | --------------------------------------- | ------------------ |
| `pm`            | `.claude/skills/pm/SKILL.md`            | 收到需求，进入逼问 |
| `pm-consultant` | `.claude/skills/pm-consultant/SKILL.md` | PM 自检完成后      |

**PM 子技能路由**:

- 需求模糊 → `pm/sub/fusion-pm-interview.md`
- 需求清晰 → `pm/sub/fusion-compile-req.md`
- Gate 0 自检 → `pm/sub/fusion-validate-req.md`
- 对抗审查 → `pm-consultant/sub/fusion-adversarial-review.md`

**产出物**: `pipeline/0_requirements/PRD.md` + `FEATURE_LIST.md` + `BDD_Scenarios.md`

---

## Stage 0.5 — 低保真原型（UX 军团）`[条件: 含 UI]`

**角色**: UX Designer + UX Consultant
**Gate**: Gate 0.5（Commander 确认体验方向）

| 角色            | 技能入口                                | 触发条件           |
| --------------- | --------------------------------------- | ------------------ |
| `ux-designer`   | `.claude/skills/ux-designer/SKILL.md`   | Gate 0 通过后      |
| `ux-consultant` | `.claude/skills/ux-consultant/SKILL.md` | UX Designer 完成后 |

**UX 子技能路由**:

- 需求解读 → `ux-designer/sub/fusion-ux-explore.md`
- 原型生成 → `ux-designer/sub/fusion-ux-wireframe.md`（Stitch MCP 强制出图）
- 交互契约 → `ux-designer/sub/fusion-ux-contract.md`
- 对抗审查 → `ux-consultant/sub/fusion-ux-adversarial-review.md`

**产出物**: `pipeline/0_5_ux/Feature_Screen_Map.md` + `User_Flow.md` + `Wireframes/` + `UI_CONTRACT.md`

---

## Stage 1 — 系统架构设计（Lead）

**角色**: Lead + Architecture Consultant
**Gate**: Gate 1（Commander 签字）

| 角色                      | 技能入口                                          | 触发条件        |
| ------------------------- | ------------------------------------------------- | --------------- |
| `lead`                    | `.claude/skills/lead/SKILL.md`                    | Gate 0 通过后   |
| `architecture-consultant` | `.claude/skills/architecture-consultant/SKILL.md` | Lead 完成架构后 |

**子技能**: `lead/sub/fusion-arch-blueprint.md`

**产出物**: `pipeline/1_architecture/System_Design.md` + `INTERFACE.md` + `Data_Models.md` + `ADR/`

---

## Stage 1.5 — 高保真原型修订（Lead）`[条件: 架构冲突]`

**子技能**: `lead/sub/fusion-arch-blueprint.md`（定点修订冲突屏幕）

**产出物**: `pipeline/1_5_prototype/Revised_Mockups/` + `State_Flow.md`

---

## Stage 2 — 技术方案头脑风暴（Lead）

**子技能**: `lead/sub/fusion-brainstorm.md`

**产出物**: `docs/plans/YYYY-MM-DD-[功能名]-design.md`

---

## Stage 3 — 微粒任务规划（Lead）

**Gate**: Gate 2（Commander 签字）

**子技能**: `lead/sub/fusion-dag-builder.md`

**产出物**: `pipeline/2_planning/task.md` + `dependency_graph.md` + `specs/TASK_SPEC_T-{ID}.md`

---

## Stage 4 — Git Worktree 物理隔离（Lead）

**子技能**: `lead/sub/fusion-worktree.md`

**产出物**: `.worktrees/feature-[功能名]/`（基线测试全绿）

---

## Stage 5 — TDD 并发实施（Dev 军团）

**角色**: 6 名特种兵按 DAG 并发作业，每人读各自的 SKILL.md

| 特种兵               | 技能入口                                     | 职责            |
| -------------------- | -------------------------------------------- | --------------- |
| `fe-ui-builder`      | `.claude/skills/fe-ui-builder/SKILL.md`      | 哑组件构建      |
| `fe-logic-binder`    | `.claude/skills/fe-logic-binder/SKILL.md`    | 状态绑定 + API  |
| `be-api-router`      | `.claude/skills/be-api-router/SKILL.md`      | 路由 + 入参校验 |
| `be-domain-modeler`  | `.claude/skills/be-domain-modeler/SKILL.md`  | 领域服务 + 业务 |
| `be-ai-integrator`   | `.claude/skills/be-ai-integrator/SKILL.md`   | LLM/MCP 接入    |
| `db-schema-designer` | `.claude/skills/db-schema-designer/SKILL.md` | Schema + 迁移   |

**铁律**: 每名特种兵交付后必须轮询 `pipeline/monitor.md` QA 状态，不得提前退出。

---

## Stage 6 — 代码审查与集成测试（Reviewer 军团）

**串行管道**（前一道 FAIL 后续不得启动）

```
qa-01 → qa-02 → qa-03 → qa-04 → iv-01 → iv-02 → iv-03
```

**Gate**: Gate 3（Commander 签字）

| 漏斗    | 技能入口                        | 职责                       |
| ------- | ------------------------------- | -------------------------- |
| `qa-01` | `.claude/skills/qa-01/SKILL.md` | 功能逻辑 + 单测覆盖率      |
| `qa-02` | `.claude/skills/qa-02/SKILL.md` | 性能 + UI/UX 一致性        |
| `qa-03` | `.claude/skills/qa-03/SKILL.md` | 安全零信任（OWASP Top 10） |
| `qa-04` | `.claude/skills/qa-04/SKILL.md` | 领域法务逻辑验证           |
| `iv-01` | `.claude/skills/iv-01/SKILL.md` | E2E 端到端连通性           |
| `iv-02` | `.claude/skills/iv-02/SKILL.md` | 数据穿透 + ACID 验证       |
| `iv-03` | `.claude/skills/iv-03/SKILL.md` | 混沌 + 极限破坏测试        |

**产出物**: `pipeline/3_review/Audit_Report.md` + `Integration_Report.md`

---

## Stage 7 — 完成分支（Lead）

**子技能**: `lead/sub/fusion-finish-branch.md`

**执行**: 验收测试 → 清脏代码 → 三选一合并（本地/PR/保留） → 清理 Worktree

---

## 辅助角色（任意阶段可触发）

| 角色             | 技能入口                                 | 触发时机              |
| ---------------- | ---------------------------------------- | --------------------- |
| `gene-extractor` | `.claude/skills/gene-extractor/SKILL.md` | 每完成 2-3 轮实质工作 |

---

## 快速角色索引

```
需求: pm → pm-consultant
原型: ux-designer → ux-consultant
架构: lead → architecture-consultant
开发: fe-ui-builder / fe-logic-binder / be-api-router / be-domain-modeler / be-ai-integrator / db-schema-designer
审查: qa-01 → qa-02 → qa-03 → qa-04 → iv-01 → iv-02 → iv-03
收尾: lead (fusion-finish-branch)
提炼: gene-extractor
```
