# 并行网络规划准则与任务清单模板 (DAG & task.md)

> **[!] CRITICAL**: 指挥官（Lead 架构师）在 Stage 3 切分任务时，必须基于图论思想（有向无环图）进行调度。禁止一条线从头跑到尾（那会浪费大模型的并发潜能）。

## 1. 任务切割粒度 (Task Granularity)

- **原子化（不可再分）**: 每个子任务（Task）的生命周期必须控制在 **2 到 5 分钟** 的对话流内能够完成。
- **独立性**: 尽量确保不同兵种的 Task 涉及的文件物理路径是绝对隔离的（你改 Backend Controller，我改 Frontend Button），以适应大规模克隆并发。

## 2. DAG 依赖网络图谱 (Dependency Graph)

Lead 在规划任务前，必须输出一份 `pipeline/2_planning/dependency_graph.md` 的依赖树。
**示例**:

```markdown
# 购物车功能图谱

[DB Schema 定义] --(阻塞)--> [API Controller 实现]
[UI 组件封样] --(阻塞)--> [API Controller 实现] # 需要等前后端约定就绪
[API Controller 实现] --(阻塞)--> [联调与集成测试]
```

## 3. `task.md` 官方标准模板

使用以下格式生成 `pipeline/2_planning/task.md`。使用 GitHub Checkbox 语法与我们专用的兵种标签。

```markdown
# 实施计划与并发检查单 (Execution Plan)

<!-- Author: Lead -->

## [Phase 1] 完全并发区 (无依赖，多 Agent 同时进场)

- [ ] Task 1.1 `[Assignee: db-schema-designer]`: 在 `schema.prisma` 新增 `Cart` 和 `CartItem` 模型 (Blocker: None)
- [ ] Task 1.2 `[Assignee: fe-ui-builder]`: 创建 `components/CartIcon.tsx` (Blocker: None)
- [ ] Task 1.3 `[Assignee: be-domain-modeler]`: 编写购物车价格计算引擎的核心业务逻辑 (Blocker: None)

--- 闸门: Phase 1 全部亮绿后，钩子解封 Phase 2 ---

## [Phase 2] 拼合强依赖区 (单线串行或弱并发)

- [ ] Task 2.1 `[Assignee: be-api-router]`: 将 1.3 的引擎包裹为 RESTful 接口 (Blocker: 1.1, 1.3)
- [ ] Task 2.2 `[Assignee: fe-logic-binder]`: 前端通过 SWR 挂载接口，完成组件状态绑定 (Blocker: 1.2, 2.1)
```

## 4. 特种兵认领规则

当进入 Stage 5（实施阶段）后，处于等待并发池里的特种兵（如 `be-api-router`）必须首先扫描这个 `task.md`，寻找是否有自己带有 `[Assignee: xxx]` 标记的任务，并检查它的 `(Blocker)` 是否已经全部打勾。如果是，则立即投入对应的代码生产。
