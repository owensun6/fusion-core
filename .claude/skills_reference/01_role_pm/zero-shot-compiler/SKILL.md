# Zero-Shot Requirement Compiler (零介入需求编译器)

> **V4 核心能力**: 将用户的单句自然语言直接编译为 PRD + BDD 契约，跳过多轮苏格拉底式问答。

## 触发条件

当 Commander 提供了足够明确的需求描述（一句话或一段话），且满足以下条件时自动触发：

- 需求意图清晰，无重大歧义
- 不涉及多个互相矛盾的业务方向
- Commander 明确表示"直接编译"或使用 `compile-req` 命令

若需求模糊到无法推断出至少一个 Success 场景和一个 Error 场景，则退回 `01_Socratic_Ask` 走传统路径。

## 编译规则 (Compilation Rules)

### 输入

一段自然语言需求描述。

### 输出

两个文件，严格遵循以下格式：

#### 1. PRD.md

```markdown
---
project: <从需求推断>
author: Author: PM (Zero-Shot Compiler)
gate: Gate-0
status: PENDING_APPROVAL
compiled_from: "<原始自然语言输入，一字不改>"
---

## 1. 业务背景

<从需求推断：为什么要做？解决什么痛点？>

## 2. 用例清单 (Use Cases)

- UC-01: <主流程>
- UC-02: <次流程/异常流>

## 3. 非功能性需求

- 预估并发量: <推断或标记 TBD>
- 安全要求: <推断或标记 TBD>

## 4. 编译器自动推断的边界决策

| #   | 推断问题                       | 编译器假设 | 需 Commander 确认 |
| --- | ------------------------------ | ---------- | ----------------- |
| Q1  | <编译器识别出的第一个隐含决策> | <默认假设> | YES/NO            |
| Q2  | <第二个>                       | <默认假设> | YES/NO            |
| Q3  | <第三个>                       | <默认假设> | YES/NO            |
```

**关键**: 第 4 节不是提问，是编译器主动做出假设并标注。Commander 只需扫一眼确认或推翻，零上下文切换。

#### 2. BDD_Scenarios.md

```gherkin
Feature: <从需求推断的功能名称>

  # 编译自: "<原始自然语言输入>"

  Scenario: [Success] <正常流描述>
    Given <前置条件 — 必须包含具体数据>
    When <用户动作>
    Then <系统响应 — 必须包含状态码或断言>
    And <副作用 — 如审计日志、状态变更>

  Scenario: [Error] <异常流描述>
    Given <前置条件>
    When <触发异常的动作>
    Then <系统阻断行为 — 必须包含错误码>
    And <数据一致性保障 — 证明无脏写>
```

## 质量闸门 (Exit Gates)

编译完成后自检：

- [ ] PRD 中无任何技术实现细节（无 API 路径、无数据库表名、无框架名称）
- [ ] BDD 至少包含 1 个 [Success] + 1 个 [Error] 场景
- [ ] BDD 中所有 Given/When/Then 包含具体数据，非模糊描述
- [ ] 第 4 节的"编译器假设"覆盖了至少 3 个隐含决策点
- [ ] `compiled_from` 字段保留了用户原始输入，一字不改

## 与传统路径的关系

```
传统路径: 用户 → 苏格拉底逼问(3轮) → PRD + BDD → Gate 0
零介入:   用户 → 零介入编译(1步)   → PRD + BDD → Gate 0
```

两条路径在 Gate 0 汇合。Commander 的审批标准完全一致。
