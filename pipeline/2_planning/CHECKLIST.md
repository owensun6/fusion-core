<!-- Author: Lead -->

# Stage 2+3: 头脑风暴与微粒规划 — 原子级 Checklist

> **Purpose**: 在编写任何代码之前，将技术方案转化为可并发执行的原子任务网（DAG），让每名特种兵明确知道自己做什么、依赖什么、交付什么。
> **如果跳过此阶段**: 兵种并发开发时互相等待、接口理解不一致、无法判断哪个任务先完成，Stage 5 必然死锁。
> **执行角色**: Lead
> **规范参考**: `.claude/rules/atomic-checklist-standard.md`, `.claude/rules/dag-task-planning.md`
> **Gate**: Gate 2 (Commander 签字)

---

## 追溯链 (Traceability Chain)

```
Stage 1 产出物（System_Design + INTERFACE + Data_Models）
  → Stage 2 设计文档 ← 探索实现路径，锁定技术方案
    → Stage 3 task.md ← 原子任务清单，每任务 2-5 分钟
      → dependency_graph.md ← DAG 有向无环图
        → TASK_SPEC_T-{ID}.md ← 每个任务的独立规格说明书
          → Gate 2 (Commander 签字) → Stage 4 Git Worktree
```

---

## Phase A: Stage 2 — 头脑风暴与设计

- [ ] 2.1 确认 Gate 1（及 Gate 1.5 如适用）已通过: 检查 `pipeline/monitor.md` → 验证：Gate 状态为 ✅
- [ ] 2.2 识别技术实现不确定点: 从 System_Design + INTERFACE + Data_Models 中找出有多种实现路径的关键决策点 → 输出：不确定点清单（每项一句话）
- [ ] 2.3 为每个不确定点探索 2-3 种实现路径: 列出每条路径的优势、风险、对工期的影响 → 输出：路径对比表（每个不确定点）
- [ ] 2.4 给出推荐方案: 综合权衡，对每个不确定点给出推荐路径及理由 → 输出：推荐方案摘要
- [ ] 2.5 编写设计文档: 汇总所有路径分析与推荐方案 → 输出：`docs/plans/YYYY-MM-DD-<topic>-design.md`

### Phase A 自检

```
- [ ] 每个不确定点都有至少 2 条对比路径
- [ ] 推荐方案有明确理由（不是"因为我喜欢"）
- [ ] 设计文档不包含实现代码（那是 Stage 5 的事）
```

---

## Phase B: Stage 3 — 原子任务拆解

> **铁律**: 每个 Task 必须通过三问过滤（见 `.claude/rules/dag-task-planning.md`）。通不过不得写入 task.md。

- [ ] 3.1 按兵种分组识别工作单元: 将 INTERFACE.md 的每个接口、Data_Models.md 的每个实体、Wireframes 的每个屏幕，映射到对应的兵种 → 输出：兵种工作单元清单
- [ ] 3.2 对每个工作单元执行三问过滤: 存在理由 / 删除后 Purpose 是否仍达成 / 粒度是否 2-5 分钟可完成 → 输出：通过过滤的原子任务清单
- [ ] 3.3 识别依赖关系: 对每个任务，确定它的 Blocker（哪些任务必须先完成）→ 输出：依赖关系标注
- [ ] 3.4 分组为并发层次（Phase）: 将无依赖任务归入 Phase 1（完全并发区），依赖 Phase 1 的任务归入 Phase 2，以此类推 → 输出：Phase 分层结构
- [ ] 3.5 编写 task.md: 按标准模板写入所有任务（含 Assignee + Blocker 标注）→ 输出：`pipeline/2_planning/task.md`
- [ ] 3.6 绘制 dependency_graph.md: 以有向图形式展示任务依赖关系 → 输出：`pipeline/2_planning/dependency_graph.md`
- [ ] 3.7 为每个任务编写 TASK_SPEC: 每个 Task 独立一份规格说明书（输入/输出/验收标准/对应 F-ID + 接口编号）→ 输出：`pipeline/2_planning/specs/TASK_SPEC_T-{ID}.md`

### Phase B 自检

```
- [ ] task.md 中每个任务都标注了 Assignee（具体兵种）和 Blocker
- [ ] Phase 1 中的所有任务互相无依赖（可真正并发）
- [ ] 每个任务的预估时长 ≤ 5 分钟（超过则继续拆分）
- [ ] dependency_graph.md 中无环（DAG 验证）
- [ ] 每个任务都有对应的 TASK_SPEC_T-{ID}.md
- [ ] 每份 TASK_SPEC 中标注了对应的 F-ID 和 INTERFACE.md 接口编号
```

---

## Phase C: Gate 2 提交

- [ ] 3.8 产出物完整性自检:

  ```
  - [ ] docs/plans/YYYY-MM-DD-<topic>-design.md 存在
  - [ ] pipeline/2_planning/task.md 存在，每任务有 Assignee + Blocker
  - [ ] pipeline/2_planning/dependency_graph.md 存在，无环
  - [ ] pipeline/2_planning/specs/TASK_SPEC_T-*.md 存在，数量 = task.md 中的任务数
  ```

- [ ] 3.9 向 Commander 提交审批: 展示任务分解 + DAG 图，请 Commander 签字 Gate 2
  - **通过**: Commander 签字 → 更新 monitor.md Gate 2 状态为 ✅ → 进入 Stage 4
  - **拒绝**: 记录理由到 monitor.md 风险日志 → 按反馈修改 → 回到对应 Phase

---

## 动态扩展 (Project-Specific)

> Lead 根据项目复杂度在此添加额外步骤
> 格式: `- [ ] N.M 「动作动词 + 对象」: 产出物 → 验证方式`

- [ ] (由 Lead 动态填写)
