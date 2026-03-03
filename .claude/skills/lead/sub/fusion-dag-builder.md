---
name: fusion-dag-builder
description: Lead 专用。Stage 3 微粒任务规划：将设计方案切分为 DAG（有向无环图）任务堆栈，写入 task.md + TASK_SPEC。
---

# fusion-dag-builder — DAG 任务规划

> **融合来源**: ECC fusion-dag-builder（DAG 并发图）+ fusion-workflow Stage 3 规约 + atomic-checklist-standard Task 三问过滤

---

## ⚡ 执行前 FP 两问（强制）

1. **我们的目的是什么？**
   → 将设计方案切碎为「2-5 分钟可完成、指定具体特种兵、明确依赖关系」的最小任务单元，让 Stage 5 并发作战成为可能。
2. **这些步骤已经不可原子级再分了吗？**
   → 每个 Task 条目必须过三问过滤才能写入。不过滤就写入 = 违反执行纪律。

---

## ⚠️ Task 三问过滤（强制，每条 Task 都要过滤）

```
问题一：这个 Task 的存在理由是什么？
        → 它解决了哪个具体的、不可接受的问题？

问题二：删掉它，上游阶段的 Purpose 还能达成吗？
        → 能达成 → 冗余，删除
        → 不能达成 → 必须保留

问题三：它的粒度已经不可再分了吗？
        → 能在 2-5 分钟内完成 → 粒度正确
        → 超过 5 分钟 → 必须拆分
```

**通不过三问过滤的 Task 条目，不得写入 task.md。**

---

## 执行序列

### Step 1: 分析设计文档，识别独立任务边界

从 `fusion-brainstorm` 的设计文档中提取所有需要开发的功能点，按以下维度分组：

- **无依赖项**: 可以立刻并发执行的任务
- **有依赖项**: 需要等待上游完成才能开始的任务

### Step 2: 按特种兵分配任务

每个 Task 只能分配给以下一名特种兵（不允许"Dev"或"Backend"等笼统分配）：

| 特种兵               | 任务类型            |
| -------------------- | ------------------- |
| `fe-ui-builder`      | 哑组件/UI 壳子      |
| `fe-logic-binder`    | 状态绑定/API 接入   |
| `be-api-router`      | REST/GraphQL 路由层 |
| `be-domain-modeler`  | 领域服务/业务逻辑   |
| `be-ai-integrator`   | LLM/MCP 接入        |
| `db-schema-designer` | Schema/迁移脚本     |

### Step 3: 产出 dependency_graph.md

```markdown
<!-- Author: Lead -->

# 依赖图谱 (Dependency Graph)

## Phase 1 — 完全并发区（无依赖，多 Agent 同时进场）

- T-001 `[db-schema-designer]`: 建立用户表 Schema (Blocker: None)
- T-002 `[be-domain-modeler]`: 实现登录鉴权领域逻辑 (Blocker: None)
- T-003 `[fe-ui-builder]`: 构建登录页哑组件 (Blocker: None)

--- ⛔ Phase 1 全部绿灯后，闸门解封 Phase 2 ---

## Phase 2 — 拼合依赖区

- T-004 `[be-api-router]`: 封装登录接口（调用 T-002 领域服务）(Blocker: T-001, T-002)
- T-005 `[fe-logic-binder]`: 绑定登录表单状态 + API 调用（接手 T-003）(Blocker: T-003, T-004)

--- ⛔ Phase 2 全部绿灯后，闸门解封 Phase 3 ---
```

**死锁检查**: 确认图中无循环依赖（A 等 B，B 等 A = 死锁）。

### Step 4: 产出 task.md

```markdown
<!-- Author: Lead -->

# 实施计划（Execution Plan）

## [Phase 1] 完全并发区

- [ ] T-001 `[Assignee: db-schema-designer]`: [任务描述] (Blocker: None)
- [ ] T-002 `[Assignee: be-domain-modeler]`: [任务描述] (Blocker: None)
- [ ] T-003 `[Assignee: fe-ui-builder]`: [任务描述] (Blocker: None)

--- 闸门: Phase 1 全部 ✅ 后方可进入 Phase 2 ---

## [Phase 2] 拼合依赖区

- [ ] T-004 `[Assignee: be-api-router]`: [任务描述] (Blocker: T-001, T-002)
- [ ] T-005 `[Assignee: fe-logic-binder]`: [任务描述] (Blocker: T-003, T-004)
```

### Step 5: 为每个任务产出 TASK_SPEC

路径: `pipeline/2_planning/specs/TASK_SPEC_T-{ID}.md`

```markdown
<!-- Author: Lead -->

# TASK_SPEC_T-001

**任务**: 建立用户表 Schema
**Assignee**: db-schema-designer
**来源 F-ID**: F1.1, F1.2
**Blocker**: None

## 输入

- INTERFACE.md 中 User 实体定义
- Data_Models.md 中 User 表规格

## 输出

- `prisma/schema.prisma` 中 User 模型
- 对应的数据库迁移脚本

## 验收标准

- [ ] User 表包含所有在 Data_Models.md 中定义的字段
- [ ] 迁移脚本可成功执行（`prisma migrate dev` 无报错）
- [ ] email 字段有 UNIQUE 索引

## 禁止事项

- 禁止修改任何业务服务代码
- 禁止修改路由或 HTTP 层代码
```

---

## 质量闸门

- [ ] 所有 Task 条目已过三问过滤（无冗余条目）
- [ ] 所有 Task 指定了具体特种兵（无"Dev"等笼统分配）
- [ ] Phase 1 中所有任务互相无依赖（真正可并发）
- [ ] dependency_graph.md 无循环依赖
- [ ] TASK_SPEC 数量 = task.md 中的 Task 数量
- [ ] Commander 签字（Gate 2）

**Gate 2 通过 → 调用 `fusion-worktree`。**
