<!-- Author: Lead -->

# Fusion Pipeline Monitor (全局监控看板)

> **使用说明**: 本文件为 Commander（人类统帅）的实时作战屏幕。
> 每当一个 Gate 被通过或拒绝，AI Agent 必须即时更新对应行的状态。
> 本文件随项目仓库一同版本控制，是整个开发生命周期的唯一进度源。

---

## 项目状态卡 (Project Card)

| 字段      | 值             |
| --------- | -------------- |
| 项目名称  | `<填写项目名>` |
| 创建日期  | `<YYYY-MM-DD>` |
| Commander | `<人类负责人>` |
| 当前阶段  | `Stage 0`      |
| 整体状态  | 🟡 进行中      |
| 风险等级  | 🟢 低          |

---

## 阶段推进看板 (Stage Progress Board)

> 状态枚举: ⬜ 未开始 | 🟡 进行中 | ✅ 已通过 | ❌ 已拒绝 | ⏭️ 已跳过

| 阶段      | 描述                  | 状态 | Gate 审批人 | 审批时间 | 备注                        |
| --------- | --------------------- | ---- | ----------- | -------- | --------------------------- |
| Stage 0   | 需求深度解构          | ⬜   | —           | —        | —                           |
| Gate 0    | Commander 签字        | ⬜   | —           | —        | —                           |
| Stage 0.5 | 低保真原型            | ⬜   | —           | —        | 条件必选，纯后端可标记 SKIP |
| Gate 0.5  | Commander 签字 / SKIP | ⬜   | —           | —        | —                           |
| Stage 1   | 系统架构设计          | ⬜   | —           | —        | —                           |
| Gate 1    | Commander 签字        | ⬜   | —           | —        | —                           |
| Stage 1.5 | 高保真原型修订        | ⬜   | —           | —        | 条件触发，无调整可标记 SKIP |
| Gate 1.5  | Commander 签字 / SKIP | ⬜   | —           | —        | —                           |
| Stage 2   | 头脑风暴              | ⬜   | —           | —        | —                           |
| Stage 3   | 微粒规划 & DAG        | ⬜   | —           | —        | —                           |
| Gate 2    | Commander 签字        | ⬜   | —           | —        | —                           |
| Stage 4   | Git Worktree 隔离     | ⬜   | —           | —        | —                           |
| Stage 5   | TDD 并发实施          | ⬜   | —           | —        | —                           |
| Stage 6   | 代码审查 & 集成       | ⬜   | —           | —        | —                           |
| Gate 3    | Commander 签字        | ⬜   | —           | —        | —                           |
| Stage 7   | 分支合并 & 发布       | ⬜   | —           | —        | —                           |

---

## 兵力部署追踪 (Troop Deployment Tracker)

> 此表在 Stage 5 启动后由 DAG 调度器自动填写，用于追踪每名特种兵的作战状态。

| 任务编号 | 分配兵种             | 描述 | TDD 红灯 | TDD 绿灯 | QA 通过 | IV 通过 |
| -------- | -------------------- | ---- | -------- | -------- | ------- | ------- |
| 1.1      | `db-schema-designer` | —    | ⬜       | ⬜       | ⬜      | ⬜      |
| 1.2      | `be-domain-modeler`  | —    | ⬜       | ⬜       | ⬜      | ⬜      |
| 1.3      | `fe-ui-builder`      | —    | ⬜       | ⬜       | ⬜      | ⬜      |
| 2.1      | `fe-logic-binder`    | —    | ⬜       | ⬜       | ⬜      | ⬜      |
| 2.2      | `be-api-router`      | —    | ⬜       | ⬜       | ⬜      | ⬜      |

---

## 产出物清单 (Deliverables Checklist)

> **双 Check 机制**: 每个产出物有两个独立状态。
>
> | Worker 状态 | 含义                                      |
> | ----------- | ----------------------------------------- |
> | `[ ]`       | 未开始                                    |
> | `[x]`       | 执行角色已完成交付，等待 QA               |
> | `[!]`       | QA 打回，执行角色须读审计报告修改后重递归 |
>
> | QA 状态 | 含义                           |
> | ------- | ------------------------------ |
> | `[ ]`   | 未审计                         |
> | `[✓]`   | 审计通过，下游可启动           |
> | `[✗]`   | 不通过 → Worker 状态改为 `[!]` |
>
> **⚠️ 下游角色启动前置检查**: 读取上游行 QA 状态，非 `[✓]` 不得启动。
>
> **⚠️ Worker 监控义务（Stage 5 强制）**: 交付后不得退出，轮询本行 QA 状态直到 `[✓]` 或处理 `[✗]`。

| 阶段      | 产出物                | 文件路径                                       | Worker | QA  | 审计角色 → 审计报告路径                                                    |
| --------- | --------------------- | ---------------------------------------------- | ------ | --- | -------------------------------------------------------------------------- |
| Stage 0   | RAW_CONVERSATION.md   | `pipeline/0_requirements/RAW_CONVERSATION.md`  | [ ]    | [ ] | PM-Consultant → `pipeline/0_requirements/audit/PM-Consultant-audit.md`     |
| Stage 0   | PRD.md                | `pipeline/0_requirements/PRD.md`               | [ ]    | [ ] | PM-Consultant → `pipeline/0_requirements/audit/PM-Consultant-audit.md`     |
| Stage 0   | FEATURE_LIST.md       | `pipeline/0_requirements/FEATURE_LIST.md`      | [ ]    | [ ] | PM-Consultant → `pipeline/0_requirements/audit/PM-Consultant-audit.md`     |
| Stage 0   | BDD_Scenarios.md      | `pipeline/0_requirements/BDD_Scenarios.md`     | [ ]    | [ ] | PM-Consultant → `pipeline/0_requirements/audit/PM-Consultant-audit.md`     |
| Stage 0.5 | Feature_Screen_Map.md | `pipeline/0_5_prototype/Feature_Screen_Map.md` | [ ]    | [ ] | UX-Consultant → `pipeline/0_5_prototype/audit/UX-Consultant-audit.md`      |
| Stage 0.5 | User_Flow.md          | `pipeline/0_5_prototype/User_Flow.md`          | [ ]    | [ ] | UX-Consultant → `pipeline/0_5_prototype/audit/UX-Consultant-audit.md`      |
| Stage 0.5 | Wireframes/           | `pipeline/0_5_prototype/Wireframes/`           | [ ]    | [ ] | UX-Consultant → `pipeline/0_5_prototype/audit/UX-Consultant-audit.md`      |
| Stage 1   | System_Design.md      | `pipeline/1_architecture/System_Design.md`     | [ ]    | [ ] | Arch-Consultant → `pipeline/1_architecture/audit/Arch-Consultant-audit.md` |
| Stage 1   | INTERFACE.md          | `pipeline/1_architecture/INTERFACE.md`         | [ ]    | [ ] | Arch-Consultant → `pipeline/1_architecture/audit/Arch-Consultant-audit.md` |
| Stage 1   | Data_Models.md        | `pipeline/1_architecture/Data_Models.md`       | [ ]    | [ ] | Arch-Consultant → `pipeline/1_architecture/audit/Arch-Consultant-audit.md` |
| Stage 1   | ADR/                  | `pipeline/1_architecture/ADR/`                 | [ ]    | [ ] | Arch-Consultant → `pipeline/1_architecture/audit/Arch-Consultant-audit.md` |
| Stage 1.5 | Revised_Mockups/      | `pipeline/1_5_prototype/Revised_Mockups/`      | [ ]    | [ ] | UX-Consultant → `pipeline/1_5_prototype/audit/UX-Consultant-audit.md`      |
| Stage 1.5 | State_Flow.md         | `pipeline/1_5_prototype/State_Flow.md`         | [ ]    | [ ] | UX-Consultant → `pipeline/1_5_prototype/audit/UX-Consultant-audit.md`      |
| Stage 2   | 设计文档              | `docs/plans/YYYY-MM-DD-<topic>-design.md`      | [ ]    | [ ] | Commander → Gate 2 审批                                                    |
| Stage 3   | task.md               | `pipeline/2_planning/task.md`                  | [ ]    | [ ] | Commander → Gate 2 审批                                                    |
| Stage 3   | dependency_graph.md   | `pipeline/2_planning/dependency_graph.md`      | [ ]    | [ ] | Commander → Gate 2 审批                                                    |
| Stage 3   | TASK_SPEC_T-{ID}.md   | `pipeline/2_planning/specs/TASK_SPEC_T-*.md`   | [ ]    | [ ] | Commander → Gate 2 审批                                                    |
| Stage 5   | [各兵种代码+测试]     | `src/` + `tests/`                              | [ ]    | [ ] | qa-01~qa-04 → `pipeline/5_dev/audit/<task-id>-audit.md`                    |
| Stage 6   | Audit_Report.md       | `pipeline/3_review/Audit_Report.md`            | [ ]    | [ ] | meta-QA → `pipeline/3_review/audit/Audit_Report-meta-audit.md`             |
| Stage 6   | Integration_Report.md | `pipeline/3_review/Integration_Report.md`      | [ ]    | [ ] | meta-QA → `pipeline/3_review/audit/Integration_Report-meta-audit.md`       |

---

## 风险与拒绝日志 (Risk & Rejection Log)

> 每次 Gate 被拒绝时，必须在此留痕。连续 3 次拒绝同一 Gate 触发 Escalation。

| 日期 | Gate | 0   |     | ✅  |
| ---- | ---- | --- | --- | --- |
| —    | —    | —   | —   | —   |

---

## 使用范例 (How to Update)

### ✅ 当 Gate 0 通过时

```diff
- | Stage 0 | 需求深度解构 | ⬜ | — | — | — |
- | Gate 0 | Commander 签字 | ⬜ | — | — | — |
+ | Stage 0 | 需求深度解构 | ✅ | — | — | — |
+ | Gate 0 | Commander 签字 | ✅ | Commander | 2026-03-01 | LGTM |
```

### ❌ 当 Gate 1 被拒绝时

```diff
- | Gate 1 | Commander 签字 | ⬜ | — | — | — |
+ | Gate 1 | Commander 签字 | ❌ | Commander | 2026-03-01 | 缺少并发锁机制 |
```

同时必须在「风险与拒绝日志」中追加一行:

```diff
+ | 2026-03-01 | Gate 1 | 1/3 | 缺少并发锁机制 | 打回 Lead 重设计 |
```
