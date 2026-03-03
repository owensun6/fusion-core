---
name: fusion-compile-req
description: PM 需求快速编译。需求清晰时一步直出 PRD + FEATURE_LIST + BDD。
---

# fusion-compile-req — 需求快速编译器

> **融合来源**: ECC zero-shot-compiler + CC-Best pm-methodology（增强版）

---

## ⚡ 执行前 FP 两问（强制，不可跳过）

1. **我们的目的是什么？**
   → 产出三份机器可验证的文档，让 Lead 和 Dev 可以完全独立地从中提取信息，不需要再问 PM。
2. **这些步骤已经不可原子级再分了吗？**
   → 三份文档必须顺序产出（PRD → FEATURE_LIST → BDD），不可并联、不可跳步。

---

## 触发条件

| 情境                                     | 触发                          |
| ---------------------------------------- | ----------------------------- |
| `fusion-pm-interview` 完成，需求无歧义   | ✅ 自动衔接                   |
| Commander 明确表示"需求很清楚，直接编译" | ✅ 直接触发                   |
| 需求存在未消歧的模糊项                   | ❌ 退回 `fusion-pm-interview` |

---

## 决策依据来源（优先级顺序）

编译过程中遇到不确定项，按以下优先级自动推断：

| 优先级 | 来源               | 说明                                   |
| ------ | ------------------ | -------------------------------------- |
| 1      | Commander 明确描述 | 对话中明确说明的内容                   |
| 2      | 项目现有实现       | 已有类似功能的模式                     |
| 3      | 架构约束           | `memory-bank/architecture.md` 中的决策 |
| 4      | 技术栈约定         | `memory-bank/tech-stack.md` 中的选型   |
| 5      | 行业惯例           | 该类功能的常见实现方式                 |
| 6      | MVP 原则           | 不确定时选择最小可行方案               |

---

## 编译序列（三步顺序，不可颠倒）

### Step 1: 产出 PRD.md

**路径**: `pipeline/0_requirements/PRD.md`

```markdown
## <!-- Author: PM -->

project: <项目名>
compiled_from: "<Commander 的原始描述，一字不改>"
status: PENDING_GATE_0

---

## 1. 业务背景

<为什么做？解决什么痛点？>

## 2. 用例清单 (Use Cases)

- UC-01: <主流程>
- UC-02: <次流程/异常流>

## 3. 非功能性需求

- 预估并发量: <推断或标记 TBD>
- 安全要求: <推断或标记 TBD>

## 4. 编译器假设与置信度（Commander 需确认）

| #   | 推断问题    | 编译器假设 | 依据来源     | 置信度   | Commander 确认 |
| --- | ----------- | ---------- | ------------ | -------- | -------------- |
| Q1  | <隐含决策1> | <假设>     | <来源优先级> | 高/中/低 | YES/NO         |
| Q2  | <隐含决策2> | <假设>     | <来源优先级> | 高/中/低 | YES/NO         |
| Q3  | <隐含决策3> | <假设>     | <来源优先级> | 高/中/低 | YES/NO         |
```

**置信度说明**:

- 高：有明确依据（Commander 说明 / 现有实现 / 架构约束）→ 直接执行
- 中：基于行业惯例或合理推断 → 执行，Lead 评审时关注
- 低：无明确依据，采用 MVP → 标注"待确认"，Lead 可调整

### Step 2: 产出 FEATURE_LIST.md

**路径**: `pipeline/0_requirements/FEATURE_LIST.md`

**结构（两级，不可扁平化）**:

```markdown
<!-- Author: PM -->

## F1: [大功能名称]

| 编号 | 功能描述（业务语言，零技术术语） | 操作类型                       |
| ---- | -------------------------------- | ------------------------------ |
| F1.1 | [子功能描述]                     | 界面操作 / 接口调用 / 增删改查 |
| F1.2 | [子功能描述]                     | ...                            |

## F2: [大功能名称]

...
```

**验收标准**:

- 每条子功能（F1.1）有唯一编号
- 无技术术语（无 API 路径、无数据库表名、无框架名）
- Commander 逐条过目确认，无遗漏无多余

### Step 3: 产出 BDD_Scenarios.md

**路径**: `pipeline/0_requirements/BDD_Scenarios.md`

**格式（严格 Gherkin）**:

```gherkin
<!-- Author: PM -->

Feature: [功能名称]

  # F1.1 — [对应 FEATURE_LIST 编号]
  Scenario: [Happy Path] [正常流描述]
    Given <前置条件，包含具体数据>
    When <用户动作>
    Then <系统响应，包含状态码或可观测行为>
    And <副作用，如审计日志、状态变更>

  # F1.1 — [对应 FEATURE_LIST 编号]
  Scenario: [Error Case] [异常流描述]
    Given <前置条件>
    When <触发异常的动作>
    Then <系统阻断行为，包含错误码或错误提示>
    And <数据一致性保障，证明无脏写>
```

**强制规则**:

- 每个 FEATURE_LIST 子功能 ≥ 1 个 Happy Path + 1 个 Error Case
- 每条 Scenario 首行注释对应 F-ID（如 `# F1.1`）
- Given/When/Then 中**禁止**出现 SQL、API 路径、字段名、框架名
- Then 必须描述可观测行为，禁止模糊描述（❌"系统处理成功" ✅"用户看到'登录成功'提示"）

---

## Exit Gates（进入 fusion-validate-req 的条件）

- [ ] PRD.md 四章节完整 + Author Stamp 存在
- [ ] FEATURE_LIST.md 所有子功能有唯一 F-ID
- [ ] BDD_Scenarios.md 每个 F-ID 有 Happy Path + Error Case
- [ ] BDD 中无技术术语
- [ ] 三份文档的内容互相一致（PRD 用例 ↔ FEATURE_LIST 功能 ↔ BDD 场景 一一对应）
