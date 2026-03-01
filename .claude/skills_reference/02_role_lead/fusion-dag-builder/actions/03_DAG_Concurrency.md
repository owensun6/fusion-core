# 03_DAG_Concurrency (并行任务网解剖手)

> **目标**: 将串行的代码思维，打破为多名特种兵可以瞬间并发执行的 DAG（有向无环图）。极大缩短 LLM 的总体工作流。

## 触发条件与协作角色

- **调用时机**: Stage 1-4 架构收尾，准备冲锋进 Stage 5 (Dev 开发) 前。
- **上游依赖**: 已定稿的 `PRD.md`, `System_Design`, `INTERFACE.md`。
- **下游交接**: 你的产出将直接给 Swarm 并发调度工具下发兵力分配。

## 核心原则 (Iron Rules)

1. **寻找无状态互不依赖项**: `fe-ui-builder` 在根据设计图调色时，完全不需要等 `db-schema-designer` 建表。这就是可以齐构的并行分支。
2. **定义依赖图**: 必须产出严格的 `dependency_graph.md`，明确标记 Blockers。
3. **特种兵点对点派发**: 每个任务项只能召唤**1名且只有1名** Level 4 原子特种兵。不允许分配给笼统的 "Dev"。

---

## 示例对比 (DO / DON'T)

### 场景：拆解“挂号中心重构”任务群

#### ❌ DON'T - 串行思维的一条龙流水线

```markdown
任务1：建号源数据库表
任务2：写出号源 API 和扣费业务逻辑
任务3：查漏补缺，写前端，联调。
```

**问题**: 人类的开发节奏。AI 干这件事的时候，前一个特种兵跑完了可能上下文就断了。并且没有发挥 LLM 可以多核并发的优势。

#### ✅ DO - 带有强制等待闸门的 DAG 图网

```markdown
# 任务兵团分配图 (dependency_graph)

**[Phase 1] 完全并发区 (此时可派遣 3 路并进)**

- 任务 1.1 `[Assignee: db-schema-designer]`: 依据 PRD，构建 `registrations` 结构 SQL 迁移脚本。 (Blocker: None)
- 任务 1.2 `[Assignee: be-domain-modeler]`: 依据 INTERFACE.md，写好 403 医保拦污逻辑与 `Service` 核心。 (Blocker: None)
- 任务 1.3 `[Assignee: fe-ui-builder]`: 搭建带有 Skeleton Loading 骨架的挂号前端组件。 (Blocker: None)

--- 闸门 1 必须等待上方 3 军全部跑绿 ---

**[Phase 2] 拼合依赖区**

- 任务 2.1 `[Assignee: fe-logic-binder]`: 把 1.3 的漂亮外壳连上 API 状态机。 (Blocker: 1.3)
- 任务 2.2 `[Assignee: be-api-router]`: 把 1.2 写好的老中医脑子接上 Controller 网络端口。 (Blocker: 1.2)
```

**原因**: 把单线程耗时 30 分钟的任务，因为完美解耦，压缩到了 10 分钟。

---

## 终级核验准则 Checklist (Exit Gates)

- [ ] 是否确保每一个划定的独立子 Task，其处理上下文都不超过当前单兵模型（如 8k/16k）的极容易幻觉边界？
- [ ] 所有的 Assignment 是否使用了军团内注册的正规军代号（如 `be-api-router` 而非 `backend`）？
- [ ] 闸门 (Blocker) 设置是否合理，不存在相互等待的死锁循环？
