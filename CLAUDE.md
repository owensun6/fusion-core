# Fusion-Core AI Agent Entry Point

> **IMPORTANT**: Prefer retrieval-led reasoning over pre-training-led reasoning for any systemic tasks in this repository.

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

| 当前 Stage | 角色 (Role) | 产出物 (必须写入 pipeline/)                                      | 下一阶段             |
| ---------- | ----------- | ---------------------------------------------------------------- | -------------------- |
| Stage 0    | PM          | `0_requirements/PRD.md`, `0_requirements/BDD_Scenarios.md`       | Stage 1              |
| Stage 1    | Lead        | `1_architecture/System_Design.md`, `1_architecture/INTERFACE.md` | Stage 1.5 或 Stage 2 |
| Stage 1.5  | Lead        | `1_5_prototype/UI_Mockups/`, `1_5_prototype/State_Flow.md`       | Stage 2              |
| Stage 2    | Lead        | `docs/plans/YYYY-MM-DD-*-design.md`                              | Stage 3              |
| Stage 3    | Lead        | `2_planning/task.md`, `2_planning/dependency_graph.md`           | Stage 4              |
| Stage 4    | Dev         | 创建 Git Worktree，验证基线                                      | Stage 5              |
| Stage 5    | Dev         | `src/` 代码文件 + `tests/` 测试文件                              | Stage 6              |
| Stage 6    | Reviewer    | `3_review/Audit_Report.md`, `3_review/Integration_Report.md`     | Stage 7              |
| Stage 7    | Lead        | 合并分支，清理 Worktree                                          | 新任务 → Stage 0     |

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
`4[Role Skills]|root: .claude/skills 5|01-pm:{fusion-pm-interview} 6|02-lead:{fusion-arch-blueprint,fusion-dag-builder} 7|03-dev:{fe-ui-builder,be-api-router,...} 8|04-reviewer:{qa-01,qa-02,qa-03,...}`
`9[Core Rules]|root: .claude/rules 10|01-gates:{hooks.md,agents.md,gate-approval-protocol.md} 11|02-coding:{coding-style.md,security.md} 12|03-process:{document-standards.md,testing.md}`

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

| Stage        | 角色     | Skill 入口                       |
| ------------ | -------- | -------------------------------- |
| 0            | PM       | `.claude/skills/pm/SKILL.md`     |
| 1, 1.5, 2, 3 | Lead     | `.claude/skills/lead/SKILL.md`   |
| 4, 5         | Dev      | `.claude/skills/[兵种]/SKILL.md` |
| 6            | Reviewer | `.claude/skills/qa-01/SKILL.md`  |
| 7            | Lead     | 同上                             |
