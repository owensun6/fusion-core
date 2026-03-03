<!-- Author: Lead -->

# Stage 1: 系统架构设计 — 原子级 Checklist

> **Purpose**: 基于已确认的需求与原型，设计可支撑 Stage 5 并发开发的技术方案。技术决策服务于已确认的用户体验，而不是反过来。
> **如果跳过此阶段**: 6 名特种兵将基于各自假设并发开发，接口不对齐、数据模型冲突，返工成本在 Stage 5 呈指数级增加。
> **执行角色**: Lead (Architect)
> **规范参考**: `.claude/rules/atomic-checklist-standard.md`
> **Gate**: Gate 1 (Commander 签字)

---

## 追溯链 (Traceability Chain)

```
PRD + FEATURE_LIST + BDD (Stage 0)
  → [条件] Feature_Screen_Map + User_Flow (Stage 0.5)
    → ADR/          ← Phase B，技术决策留底
    → System_Design ← Phase C，系统边界与组件
      → INTERFACE   ← Phase D，每接口对应 F-ID，FE/BE 独立开发基线
        → Data_Models ← Phase E，实体 + 并发保护
          → Architecture Consultant ← 以 FEATURE_LIST 为覆盖基线
```

**铁律**: INTERFACE.md 中每个接口必须标注来源 F-ID，确保 FE/BE 兵种可独立开发，不互相等待。

---

## Phase A: 前置校验

- [ ] 1.1 确认 Gate 0 已通过: 检查 `pipeline/monitor.md` 中 Gate 0 状态为 ✅ → 验证：状态确认
- [ ] 1.2 读取 PRD.md: 提取产品全貌、非功能性需求（性能/安全/合规）→ 输出：约束清单
- [ ] 1.3 读取 FEATURE_LIST.md: 提取所有 F-ID → 输出：F-ID 清单（供 Phase D 逐条对齐用）
- [ ] 1.4 读取 BDD_Scenarios.md: 提取行为边界（正常流 + 异常流）→ 输出：边界场景清单
- [ ] 1.5 (条件) 读取 Feature_Screen_Map.md + User_Flow.md: 若 Stage 0.5 已通过 → 输出：交互约束清单（接口设计须支撑这些交互）
- [ ] 1.6 确认技术约束: 已有技术栈？不可更换的外部系统？不可妥协的技术红线？→ 输出：技术红线清单（写入 ADR Phase B 前置条件）

### Phase A 自检

```
- [ ] 所有 Stage 0 产出物已读取（PRD / FEATURE_LIST / BDD）
- [ ] F-ID 清单已建立，数量与 FEATURE_LIST 一致
- [ ] 技术红线已明确记录
```

---

## Phase B: 架构决策记录 (ADR)

- [ ] 1.7 识别选型决策点: 列出需要显式决策的技术选型（框架/数据库/缓存/消息队列/鉴权方案等）→ 输出：选型点清单
- [ ] 1.8 逐点编写 ADR: 每个重大选型编写一份 ADR（背景 + 决策 + 后果 + 被拒方案及原因）→ 输出：`pipeline/1_architecture/ADR/ADR-NNN.md`

  ```markdown
  # ADR-NNN: [决策主题]

  ## 状态: 已接受

  ## 背景

  [为什么需要做这个决策？]

  ## 决策

  [我们选择了什么？]

  ## 后果

  [这个决策带来的影响（正面 + 负面）？]

  ## 被拒方案

  - [方案A]: 被拒原因
  - [方案B]: 被拒原因
  ```

### Phase B 自检

```
- [ ] 每个重大技术选型都有对应 ADR
- [ ] 每份 ADR 包含被拒方案及拒绝理由
- [ ] ADR 未涉及实现细节（那是 Stage 5 的事）
```

---

## Phase C: 系统设计

- [ ] 1.9 定义系统边界: 识别外部系统依赖、服务分层（展示层/业务层/数据层）→ 输出：系统边界描述
- [ ] 1.10 定义组件与交互: 识别核心组件及其职责，定义组件间的调用关系 → 输出：组件交互描述（含并发场景下的交互）
- [ ] 1.11 编写 System_Design.md: 汇总系统边界 + 组件 + 关键流程说明 → 输出：`pipeline/1_architecture/System_Design.md`

### Phase C 自检

```
- [ ] System_Design.md 已创建，包含系统边界、组件图、关键流程
- [ ] 每个组件职责单一（单一职责原则）
- [ ] 无技术实现细节（不出现具体函数名、SQL 语句）
```

---

## Phase D: 接口契约

> **核心目标**: FE 和 BE 兵种读完 INTERFACE.md 后，可以完全独立开发，不互相等待。

- [ ] 1.12 按 F-ID 逐条定义接口: 遍历 F-ID 清单，为每个功能点确定所需 API 端点（方法 + 路径）→ 输出：接口草稿（标注 F-ID 来源）
- [ ] 1.13 定义请求/响应规格: 每个接口定义请求参数、响应格式（正常 + 错误）、HTTP 状态码、鉴权要求 → 输出：完整接口规格
- [ ] 1.14 编写 INTERFACE.md: 汇总所有接口契约 → 输出：`pipeline/1_architecture/INTERFACE.md`

  ```markdown
  ## [F-ID] [接口名称]

  **端点**: POST /api/xxx
  **鉴权**: Bearer Token
  **请求**:
  | 字段 | 类型 | 必填 | 说明 |
  **响应 (200)**:
  | 字段 | 类型 | 说明 |
  **错误码**: 400/401/404/500 各含义
  ```

### Phase D 自检

```
- [ ] INTERFACE.md 中每个接口都标注了来源 F-ID
- [ ] F-ID 清单中每个功能点至少有 1 个对应接口
- [ ] 每个接口定义了完整错误码（不只有 200）
- [ ] 鉴权方案已在每个接口上明确标注
- [ ] FE/BE 读完后可独立开发（无需互相询问）
```

---

## Phase E: 数据模型

- [ ] 1.15 识别核心实体: 从 FEATURE_LIST + BDD 中提取数据实体 → 输出：实体清单
- [ ] 1.16 定义字段规格: 每个实体定义字段名、类型、约束（非空/唯一/默认值）、索引 → 输出：字段规格表
- [ ] 1.17 定义实体关系与并发保护: 定义 1:1/1:N/M:N 关系 + 并发写入保护方案（乐观锁/悲观锁/版本号）→ 输出：实体关系图 + 并发方案
- [ ] 1.18 编写 Data_Models.md: 汇总所有实体定义 → 输出：`pipeline/1_architecture/Data_Models.md`

### Phase E 自检

```
- [ ] 所有 F-ID 中涉及的数据实体都已建模
- [ ] 每个实体都有并发写入保护方案（或明确说明为何不需要）
- [ ] 无孤立实体（每个实体至少与一个其他实体有关联或有独立业务价值）
```

---

## Phase F: Architecture Consultant 审查

- [ ] 1.19 移交 Architecture Consultant: 将全套产出物（System_Design + INTERFACE + Data_Models + ADR/）移交 Architecture Consultant → 验证：Architecture Consultant 开始执行
- [ ] 1.20 处理审查结论:
  - 结论为 **PASS** → 进入 Phase G
  - 结论为 **REVISE** → 读取 `pipeline/1_architecture/audit/Arch-Consultant-audit.md` 的 CRITICAL 问题 → 按问题修改对应文档 → 回到步骤 1.19

---

## Phase G: Gate 1 提交

- [ ] 1.21 产出物完整性自检:

  ```
  - [ ] System_Design.md 存在，包含系统边界 + 组件图 + 关键流程
  - [ ] INTERFACE.md 存在，每个接口标注 F-ID，F-ID 覆盖率 100%
  - [ ] Data_Models.md 存在，核心实体已建模，并发保护方案已定义
  - [ ] ADR/ 存在，重大技术选型均有对应 ADR
  - [ ] Arch-Consultant-audit.md 存在，结论为 PASS
  ```

- [ ] 1.22 向 Commander 提交审批: 展示全套产出物，请 Commander 签字 Gate 1
  - **通过**: Commander 签字 → 更新 monitor.md Gate 1 状态为 ✅
  - **拒绝**: 记录拒绝理由到 monitor.md 风险日志 → 按反馈修改 → 回到对应 Phase

---

## 动态扩展 (Project-Specific)

> Lead 根据项目复杂度在此添加额外步骤
> 格式: `- [ ] 1.N 「动作动词 + 对象」: 产出物 → 验证方式`

- [ ] (由 Lead 动态填写)
