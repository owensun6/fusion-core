# Fusion 角色技能融合进度看板

> 递归循环任务。每完成一个角色，在对应行打 ✅。所有角色完成后方可 commit & push。
> **方法论**: 先按名字选候选技能 → 读内容对比 → 融合写子技能 → 写母技能 → 打叉

---

## 融合规则

- 所有融合产物加 `fusion-` 前缀
- 每个角色: `skills/[role]/SKILL.md`（母技能）+ `skills/[role]/sub/fusion-*.md`（子技能）
- 每个子技能顶部必须有 FP 两问（Commander 原创）
- 母技能必须包含：身份声明 + 禁区 + 情境路由表 + 精确子技能路径

---

## 三大技能库参考目录

| 库          | 根路径                                                                      |
| ----------- | --------------------------------------------------------------------------- |
| ECC         | `fusion-core/.claude/skills_reference/`                                     |
| CC-Best     | `~/.claude/plugins/cc-best/`                                                |
| Superpowers | `~/.claude/plugins/cache/claude-plugins-official/superpowers/4.3.1/skills/` |

---

## 进度追踪

### 需求组 (Stage 0 / 0.5)

- [x] **PM** — 母技能 ✅ | 子技能: fusion-pm-interview ✅ fusion-compile-req ✅ fusion-validate-req ✅（含 CC-Best requirement-validator 清晰度补充）
- [x] **PM Consultant** — 母技能 ✅ | 子技能: fusion-adversarial-review ✅
- [x] **UX Designer** — 母技能 ✅ | 子技能: fusion-ux-explore ✅ fusion-ux-wireframe ✅ fusion-ux-contract ✅
- [x] **UX Consultant** — 母技能 ✅ | 子技能: fusion-ux-adversarial-review ✅

### 架构组 (Stage 1-3 / 7)

- [x] **Lead** — 母技能 ✅ | 子技能: fusion-arch-blueprint ✅ fusion-dag-builder ✅ fusion-brainstorm ✅ fusion-worktree ✅
- [x] **Architecture Consultant** — 母技能 ✅ | 子技能: fusion-arch-adversarial-review ✅

### 前端组 (Stage 5)

- [x] **fe-ui-builder** — 母技能 ✅ | 子技能: fusion-ui-build ✅
- [x] **fe-logic-binder** — 母技能 ✅ | 子技能: fusion-logic-bind ✅

### 后端组 (Stage 5)

- [x] **be-api-router** — 母技能 ✅ | 子技能: fusion-api-route ✅
- [x] **be-domain-modeler** — 母技能 ✅ | 子技能: fusion-domain-model ✅
- [x] **be-ai-integrator** — 母技能 ✅ | 子技能: fusion-ai-integrate ✅
- [x] **db-schema-designer** — 母技能 ✅ | 子技能: fusion-db-schema ✅

### QA 漏斗组 (Stage 6)

- [x] **qa-01** (Functional Logic) — 母技能 ✅ | 子技能: fusion-qa-functional ✅
- [x] **qa-02** (Performance & UX) — 母技能 ✅ | 子技能: fusion-qa-performance ✅
- [x] **qa-03** (Security) — 母技能 ✅ | 子技能: fusion-qa-security ✅
- [x] **qa-04** (Domain Logic) — 母技能 ✅ | 子技能: fusion-qa-domain ✅

### IV 漏斗组 (Stage 6)

- [x] **iv-01** (E2E Connectivity) — 母技能 ✅ | 子技能: fusion-iv-e2e ✅
- [x] **iv-02** (Data Penetration) — 母技能 ✅ | 子技能: fusion-iv-data ✅
- [x] **iv-03** (Chaos) — 母技能 ✅ | 子技能: fusion-iv-chaos ✅

### 辅助角色

- [x] **Gene Extractor** — 母技能 ✅ | 子技能: fusion-extract-genes ✅

---

## 最终收尾

- [x] 全量验证目录结构
- [x] git commit（commit: `286950b` — feat: 20 角色融合技能体系完整交付）
- [x] git push → owensun6/fusion-core

---

_最后更新: 2026-03-04 — 所有 20 个角色融合完成，已 commit & push ✅_
