# FUSION_INDEX (全局作战索引大盘)

这是 `fusion-core` 军事基地的导航路牌。Agent 只能阅读本页以了解当前阶段需要呼叫哪位特种兵。

---

## Stage 0: 需求分诊台 (PM 军团)

- **目标**: 将模糊意图转化为明确的 PRD 和 BDD 契约。
- **快速路径 [V4]**: `zero-shot-compiler` — 一句自然语言直接编译为 PRD + BDD（命令: `/fusion-compile-req`）
- **传统路径**: `fusion-pm-interview` — 苏格拉底式多轮逼问后萃取
- **技能入口**: `/Users/test2/code/fusion-method/fusion-core/.claude/skills/01_role_pm/fusion-pm-interview`

## Stage 1-4: 架构规划局 (Lead 军团)

- **目标**: 设计系统图纸、接口契约（INTERFACE.md），并绘制 DAG 并发拆解图。
- **技能入口 (蓝图规划)**: `/Users/test2/code/fusion-method/fusion-core/.claude/skills/02_role_lead/fusion-arch-blueprint`
- **技能入口 (DAG并排编排)**: `/Users/test2/code/fusion-method/fusion-core/.claude/skills/02_role_lead/fusion-dag-builder`

## Stage 5: 并行焊工组 (Dev 军团)

- **目标**: 死磕 TDD，无测试不成码，100% 并行盲打。
- **全局 TDD 引擎**: `/Users/test2/code/fusion-method/fusion-core/.claude/skills/03_role_dev/fusion-tdd-engine`
- **底层焊工 (UI)**: `fe-ui-builder`
- **底层焊工 (前端逻辑)**: `fe-logic-binder`
- **底层焊工 (API契约)**: `be-api-router`
- **底层焊工 (核心业务)**: `be-domain-modeler`
- **底层焊工 (大模型魔法)**: `be-ai-integrator`
- **底层焊工 (数据库)**: `db-schema-designer`

## Stage 6: 终极审查与集成漏斗 (Reviewer 军团)

- **目标**: 串联闯关，只要有错立马拦截并退回。
- **关卡 1-4 (质量与安全合规)**: `qa-01` ~ `qa-04`
- **关卡 5-7 (端到端集成测试)**: `iv-01` ~ `iv-03`
