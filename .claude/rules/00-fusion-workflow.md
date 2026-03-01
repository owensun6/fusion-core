# Superpowers Workflow (全局 8 阶段融合工作流)

> **[!] CRITICAL (导航与寻路)**:
>
> 1. 本文件是 Fusion Method 的中枢神经。所有 AI Agent 醒来后，**第一件事必须读取根目录下的 `FUSION_INDEX.md`** 以确定当前阶段和自己的角色入口。
> 2. 执行任何具体技术任务前，**必须**前往 `00_shared/` 或 `03_role_dev/toolbox/` 提取对应的操作手册和弹药。
> 3. 每个 Gate 都是一道物理闸门，只有 Commander 签字放行。**看板 `pipeline/monitor.md` 将由底层 Hook 自动同步状态**，无需人工或特种兵干预。

---

## 阶段总览 (Pipeline Overview)

```
Stage 0 ──Gate 0──▶ Stage 1 ──Gate 1──▶ Stage 1.5 ──Gate 1.5──▶ Stage 2
                                         (条件可跳过)
Stage 2 ──▶ Stage 3 ──Gate 2──▶ Stage 4 ──▶ Stage 5 ──▶ Stage 6 ──Gate 3──▶ Stage 7
```

**角色与阶段映射**:

| 阶段      | 主力角色 | 调用的原子技能 (Skills)                                             |
| --------- | -------- | ------------------------------------------------------------------- |
| Stage 0   | PM       | `zero-shot-compiler` (V4快速) 或 `fusion-pm-interview` (传统多轮)   |
| Stage 1   | Lead     | `fusion-arch-blueprint` → `01_System_Design` → `02_API_Contract`    |
| Stage 1.5 | Lead     | UI/UX 原型（条件触发）                                              |
| Stage 2   | Lead     | 头脑风暴 `brainstorming`                                            |
| Stage 3   | Lead     | `fusion-dag-builder` → `03_DAG_Concurrency` + `writing-plans`       |
| Stage 4   | Dev      | `using-git-worktrees` 物理隔离                                      |
| Stage 5   | Dev 全军 | `fusion-tdd-engine` + 6 名专职特种兵并发作业                        |
| Stage 6   | Reviewer | `qa-01` → `qa-02` → `qa-03` → `qa-04` → `iv-01` → `iv-02` → `iv-03` |
| Stage 7   | Lead     | `finishing-a-development-branch` 收尾                               |

---

## Stage 0 — 需求深度解构 `[Gate 0]`

### 角色

PM（产品经理特种兵）

### 执行动作

1. **[强校验锁] 读取 ROADMAP.md**: 检查当前用户的需求是否符合 Roadmap 制定的宏观战略规划。如果不符合，或者严重偏离，需警示 Commander。
2. **路径选择**:
   - **V4 快速路径**: 若需求意图清晰 → 调用 `zero-shot-compiler`，一步直出 PRD + BDD，Commander 只需扫一眼确认编译器假设。
   - **传统路径**: 若需求模糊 → 调用 `01_Socratic_Ask` 多轮逼问，再调用 `02_Intent_Extract` 萃取。
3. 两条路径在 Gate 0 汇合，审批标准一致。

### 产出物模板

```markdown
# PRD.md 模板

---

project: <项目名称>
author: <Author: PM>
gate: Gate-0
status: PENDING_APPROVAL

---

## 1. 业务背景

<为什么要做这件事？解决什么痛点？>

## 2. 用例清单 (Use Cases)

- UC-01: <主流程描述>
- UC-02: <次流程描述>

## 3. 非功能性需求

- 预估并发量: <?>
- 安全等保要求: <?>
- 数据保留周期: <?>

## 4. 已澄清的边界决策

| #   | 问题            | Commander 裁定 |
| --- | --------------- | -------------- |
| Q1  | <苏格拉底问题1> | <裁定结果>     |
| Q2  | <苏格拉底问题2> | <裁定结果>     |
```

```gherkin
# BDD_Scenarios.md 模板
Feature: <功能名称>

  Scenario: [Success] <正常流描述>
    Given <前置条件>
    When <用户动作>
    Then <系统响应与断言>

  Scenario: [Error] <异常流描述>
    Given <前置条件>
    When <触发异常的动作>
    Then <系统阻断或回滚行为>
```

### 产出物存放路径

```
pipeline/0_requirements/PRD.md
pipeline/0_requirements/BDD_Scenarios.md
```

### Gate 0 审批与系统自动看板同步

- Commander 审阅 PRD + BDD，签字 `APPROVED` 或打回 `REJECT`。
- 打回后必须重新执行 `01_Socratic_Ask` 补漏。
- **[AUTOMATED] 约束豁免**: 底层 Hook 将监听产出文件的生成，并静默刷新 `pipeline/monitor.md` 中 `Stage 0` 槽位。特种兵无需手动打卡。

---

## Stage 1 — 系统架构设计 `[Gate 1]`

### 角色

Lead（架构师特种兵）

### 执行动作

1. **调用 `01_System_Design`**: 基于 PRD 绘制时序图、分层图和数据流向。
2. **调用 `02_API_Contract`**: 编写全维度契约文件 `INTERFACE.md`。

### 产出物模板

```markdown
# INTERFACE.md 模板 (每个接口一个大节)

---

author: <Author: Lead>
gate: Gate-1

---

### `POST /api/v1/<resource>` <简述>

**鉴权**: Bearer JWT (必需)

**Request Body (application/json)**:
| 字段 | 类型 | 必填 | 说明 |
| ------- | ------ | ---- | ------ |
| field_a | string | ✅ | <说明> |
| field_b | number | ❌ | <说明> |

**Responses**:

- `201 Created`: <成功描述> `{ "id": "xxx" }`
- `400 Bad Request`: <参数校验失败>
- `403 Forbidden`: <权限不足>
- `409 Conflict`: <并发冲突>
```

### 产出物存放路径

```
pipeline/1_architecture/System_Design.md
pipeline/1_architecture/INTERFACE.md
pipeline/1_architecture/Data_Models.md
```

### Gate 1 审批与系统自动看板同步

- Commander 审阅架构图 + 接口契约，签字或打回。
- **[AUTOMATED] 约束豁免**: 底层 Hook 将监听架构文件的生成，并静默刷新 `pipeline/monitor.md` 中 `Stage 1` 槽位。特种兵无需手动打卡。

---

## Stage 1.5 — UI/逻辑原型 `[Gate 1.5]` `[条件触发]`

### 触发条件

- **必须执行**: 项目包含 UI 界面或客户端交互。
- **可跳过**: 后端服务、CLI 工具、纯 API 项目 → Commander 标记 `SKIP`。

### 产出物存放路径

```
pipeline/1_5_prototype/UI_Mockups/
pipeline/1_5_prototype/State_Flow.md
```

### Gate 1.5 审批与系统自动看板同步

- Commander 确认原型通过。
- **[AUTOMATED] 约束豁免**: 底层 Hook 将静默刷新 `pipeline/monitor.md` 中 `Stage 1.5` 槽位。特种兵无需手动打卡。

---

## Stage 2 — 头脑风暴与设计

### 角色

Lead

### 执行动作

- 调用 `brainstorming` 技能，探索 2~3 种技术实现路径。
- 附上权衡分析与最终推荐方案。

### 产出物存放路径

```
docs/plans/YYYY-MM-DD-<topic>-design.md
```

---

## Stage 3 — 微粒规划与 DAG 兵力分配 `[Gate 2]`

### 角色

Lead

### 执行动作

1. **调用 `writing-plans`**: 将实施拆解为 2~5 分钟可完成的原子任务。
2. **调用 `03_DAG_Concurrency`**: 生成兵力分配有向无环图。

### 产出物模板

```markdown
# task.md 模板

---

author: <Author: Lead>
gate: Gate-2

---

## [Phase 1] 完全并发区

- [ ] Task 1.1 `[Assignee: db-schema-designer]`: <描述> (Blocker: None)
- [ ] Task 1.2 `[Assignee: be-domain-modeler]`: <描述> (Blocker: None)
- [ ] Task 1.3 `[Assignee: fe-ui-builder]`: <描述> (Blocker: None)

--- 闸门: Phase 1 全部完成后方可继续 ---

## [Phase 2] 拼合依赖区

- [ ] Task 2.1 `[Assignee: fe-logic-binder]`: <描述> (Blocker: 1.3)
- [ ] Task 2.2 `[Assignee: be-api-router]`: <描述> (Blocker: 1.2)
```

### 产出物存放路径

```
pipeline/2_planning/task.md
pipeline/2_planning/dependency_graph.md
```

### Gate 2 审批与系统自动看板同步

- Commander 审阅任务分解与并行策略，签字或打回。
- **[AUTOMATED] 约束豁免**: 底层 Hook 将自动读取 `task.md` 提取特种兵派驻任务，并静默刷新 `pipeline/monitor.md` `Stage 3: 兵力分配` 板块。特种兵无需手动干预。

---

## Stage 4 — Git Worktree 物理隔离

### 角色

Dev

### 执行动作

- 调用 `using-git-worktrees` 创建独立开发环境。
- 验证测试基线在隔离环境中完整通过。

---

## Stage 5 — TDD 并发实施

### 角色

Dev 全军 (6 名专职特种兵按 DAG 并发作业)

### 执行动作

每名特种兵的工作循环:

```
1. 调用 fusion-tdd-engine → 01_Red_Fail_Test (先写失败测试)
2. 调用 fusion-tdd-engine → 02_Green_Minimum (最简且抠门地修复)
3. 调用各自专职 SKILL.md (fe-ui-builder / be-api-router / ...)
4. 重复直至该兵种负责的 Task 全部亮绿
```

### ❌ DON'T — 跳过红灯直接写业务码

```
Commander: "帮我把登录页做了"
Agent: "好的，马上开始写 LoginPage.tsx..."
```

**问题**: 没有经过 Stage 0~3 的战略过滤，代码100%会产生幻觉。

### ✅ DO — 严格按阶段递进

```
Commander: "帮我把登录页做了"
Agent: "Commander，我注意到这个需求尚未经过 Stage 0 需求解构。
       我现在需要先以 PM 身份向您确认 3 个核心边界问题：
       1. 登录失败锁定策略是什么？
       2. 是否需要支持 SSO/OAuth 第三方登录？
       3. 密码找回走邮件还是短信？"
```

---

## Stage 6 — 代码审查与集成测试 `[Gate 3]`

### 角色

Reviewer 全军 (7 道漏斗)

### 执行顺序 (串行管道，前一道不过后一道不开)

```
qa-01 (审查 _STYLE_GUIDE.md 格式) → qa-02 (契约合规) → qa-03 (必查 SECURITY.md 安全断头台) → qa-04 (领域法务)
                                                                     ↓
                                             iv-01 (端到端连通) → iv-02 (数据穿透) → iv-03 (混沌破坏)
```

### 产出物

```
pipeline/3_review/Audit_Report.md
pipeline/3_review/Integration_Report.md
```

### Gate 3 审批与系统自动看板同步

- 所有 7 道漏斗亮绿 → Commander 签字放行至收尾。
- 任意一道亮红 → 打回到 Stage 5 对应的 Dev 特种兵返工。
- **[AUTOMATED] 约束豁免**: 底层 Hook 将静默刷新 `pipeline/monitor.md` 上的测试绿灯盖章。Reviewer 无需手动填写。

---

## Stage 7 — 完成分支与发布

### 角色

Lead

### 执行动作

- 调用 `finishing-a-development-branch` 技能。
- 选择合并策略 (Merge / Squash / Rebase)。
- 更新 `pipeline/monitor.md` 看板状态为 `DONE`。

---

## Gate 审批协议 (全局规则)

### 通过 (Approve)

Commander 签字 → 流程推进至下一阶段。产出物首行标记 `status: APPROVED`。

### 拒绝 (Reject)

Commander 拒绝 → 强制执行闭环:

```
Reject → Rework (返回原阶段修改) → Re-submit (重新提交审批)
```

- 拒绝理由必须记录至 `pipeline/monitor.md` 的风险日志列。
- **连续 3 次拒绝**同一 Gate → 触发 Escalation: 暂停该 Epic，Commander 决定是否重新定义需求。

### 快速通道 (Fast-track)

- **触发条件**: 复杂度评估为"简单"且 Commander 在 Stage 0 明确授权。
- **效果**: 可跳过 Stage 1 / Stage 1.5，直接进入 Stage 2 或 Stage 3。
- **防死锁硬约束 (物理锁)**:
  1. Stage 0 (需求解构) **永远不可跳过**。
  2. 如果任务需要 2 名及以上跨端兵种并行协同（如同时修改前端和后端），则 Fast-track 物理失效，必须强制执行 Stage 1。

---

## 约束指令 (Anti-Hallucination Firewall)

1. 如果用户下达模糊的"帮我写个 XX 功能"的代码编写指令，**必须首先拒绝盲目写代码**，并自动退回至 Stage 0。
2. 每个阶段的产出物首行必须声明 `<Author: 角色名>`，下游环节必须交叉审计。
3. **[AUTOMATED] 看板脱手**: 看板文件 `pipeline/monitor.md` 今后主要由系统钩子与自动化脚本更新，禁止 AI Agent 浪费 Token 手动逐行撰写流水帐。
