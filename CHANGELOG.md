# Changelog (变更日志)

All notable changes to the Fusion-Core project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v4.1.0] - 2026-03-01

### Added

- **Gene Extraction System**: `extract-genes.sh` 自动从成功战役中提取兵种基因规则，反哺 `.claude/skills/`。
- **Zero-Shot Requirement Compiler**: `zero-shot-compiler` SKILL 将自然语言一步编译为 PRD + BDD，无需多轮提问。
- **Dynamic Model Routing**: `lib/model-routing.js` 实现 `matchRoles()` / `discoverRoles()` 按阶段智能匹配模型（Opus/Sonnet/Haiku）。
- **Context Assembler Router**: `bin/fusion-core-router.js` 基于文件系统物理路径的上下文组装引擎 (Context Assembler v4.1)。
- **TDD Self-Healing Shell**: `fusion-tdd-fixer.js` 带 3 次熔断器的自愈循环，自动分析 Jest 报错并生成修复指引。
- **VLM Acceptance Testing**: Playwright + Vision Language Model 集成，用于 Stage 1.5 原型还原度验收。
- **CLI `extract-genes` command**: `npx fusion-core extract-genes` 触发基因提取。
- **Test coverage 93%+**: 全部 133 个测试通过，覆盖 Stmts 93.61% / Branch 85.98% / Funcs 100%。

### Changed

- **FUSION_INDEX.md**: 新增 V4 快速路径入口 (`zero-shot-compiler`) 和全军作战索引。
- **Workflow 升级至 8 阶段**: 新增 Stage 1.5 条件触发和 Fast-track 物理锁。
- **package.json version**: `1.0.0` → `4.1.0`。
- **CLI version string**: `v2.0.0` → `v4.1.0`。

## [v3.0.0] - 2026-03-01

### Added

- **TDD Snapshot Auto-Heal Loop**: `fusion-tdd-engine` 遇到红灯时自动分析报错栈，在兵种间内循环修复。
- **Playwright Visual Acceptance**: 为 `iv-01` 兵种集成自动截图与录屏对比。
- **Model Cost Gateway**: `update_monitor.sh` 中加入动态模型切换网关（PM 用 Opus，小修用 Haiku）。
- Diátaxis documentation structure (`docs/tutorials`, `docs/how-to`, `docs/explanation`, `docs/reference`).
- `SECURITY.md`, `ROADMAP.md`, `CONTRIBUTING.md`, and `_STYLE_GUIDE.md`.

### Changed

- Documentation paradigm shifted to structured Diátaxis matrix.

## [v2.0.0] - 2026-03-01

### Added

- **Physical Enforcement Hooks**: Introduced `pre-tool-use.js` (Secret & Stage-skip scanning) and `post-tool-use.js` (Author Stamp & Dead Code scanning).
- **Automation Scripts**: Added `update_monitor.sh`, `dispatch_parallel.sh` (tmux concurrent executor), and `finish-epic.sh`.
- `CLAUDE.md` root configuration with compressed `AGENTS.md` memory matrix.
- `gate-approval-protocol.md` formalizing Reject loops and Escalation thresholds.
- `dag-task-planning.md` template for Agent concurrency.

### Changed

- Refactored `pipeline/monitor.md` to be fully automated via script instead of consuming AI context tokens.
- Renamed and streamlined roles to remove anthropomorphic names, standardizing on PM, Lead, Dev, and Reviewer.

### Removed

- Removed 3 redundant human-in-the-loop manual sign-off gates to accelerate flow based on First Principles audit.
