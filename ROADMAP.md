# Fusion-Core 演进路线图 (Roadmap)

> **[!] CRITICAL**: 这是一份活文档。由统帅 (Commander) 和架构师 (Lead) 维护，用以指引 Fusion-Core 引擎的长远规划。

## 🏆 Past Milestone: Q1 2026 (v2.x) - "物理约束与全自动闭环"

- [x] **8 阶段核心流水线确立**: Stage 0 到 Stage 7 管道铺轨。
- [x] **物理执法 Hook 部署**: Pre/Post 钩子拦截越界写码，确保架构图领先于业务代码。
- [x] **无血缘盲打并发**: 基于 `task.md` 与 `dispatch_parallel.sh` 实现无头 Agent 的多路并发执行。
- [x] **BM-AD 文档矩阵对齐**: 引入 Diátaxis 四象限分类法，完善 `SECURITY.md` 与 `CONTRIBUTING.md`。

## 🏆 Past Milestone: Q2 2026 (v3.x) - "测试驱动的自我修复"

- [x] **TDD 快照自动修复回环**: `fusion-tdd-engine` 遇到红灯时，不再回退给人类，而是自动分析报错栈并在 `fe-logic` 等兵种间自行内循环修复。
- [x] **视觉造影验收 (Playwright 集成)**: 为 `iv-01` 兵种集成自动截图与录屏对比分析功能，通过 VLM (Vision Language Model) 验收 Stage 1.5 原型还原度。
- [x] **极简模型切换 (Model Routing)**: 在 `update_monitor.sh` 阶段加入动态成本网关，在 Stage 0 (PM) 使用 Opus，在 Stage 5 (修改小函数) 自动降级至 Haiku 节约计算量。

## 🎯 Current Milestone: 2026 H2 (v4.x) - "液态组织结构与兵种基因提取"

- [x] **兵种基因自动提取**: Agent 在执行完一次成功的战役后，能够自动总结出 `.claude/skills/` 下的新兵种规则，反哺给主基地。
- [x] **零介入需求编译**: 将用户的自然语言聊天流自动编译为 `BDD_Scenarios.md` 而不需要多轮提问。(`zero-shot-compiler` SKILL + `/fusion-compile-req` 命令)
