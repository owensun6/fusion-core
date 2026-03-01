<!-- Author: Lead -->

# V4-P0 实施计划：液态基因融合引擎

> **版本**: v4.0-P0 (Phase Zero — 基础设施铺设)
> **日期**: 2026-03-01
> **状态**: Draft — 待 Commander 审批

---

## 1. 战略目标回顾

| #   | 目标           | 代号                   | 核心交付物                                |
| --- | -------------- | ---------------------- | ----------------------------------------- |
| 1   | 兵种基因提取   | Gene Extraction        | `memory/gene-bank/` + Gene-Extractor 兵种 |
| 2   | 液态组织结构   | Liquid Organization    | Fusion-Composer + 动态路由器              |
| 3   | 零介入需求编译 | Zero-Intervention Spec | Spec-Compiler + 后台静默推演              |

**P0 聚焦**: 目标 1 和 2 的基础设施。目标 3 依赖前两者成熟后再启动（P1 阶段）。

---

## 2. 借鉴融合清单

| 借鉴源                       | 借什么                                     | 怎么融合                          |
| ---------------------------- | ------------------------------------------ | --------------------------------- |
| ECC `continuous-learning-v2` | Instinct 原子模型 + 置信度 0.3-0.9         | 改造为 Gene（增加兵种归属标签）   |
| ECC `/evolve`                | 聚类演化路径（instinct → skill/cmd/agent） | 改造为 Gene Pool → SKILL.md 补丁  |
| ECC `/orchestrate`           | Handoff 文档协议 + 串行/并行编排           | 注入 Fusion-Composer 动态路由逻辑 |
| ECC `multi-workflow`         | 任务类型路由（Frontend/Backend/Fullstack） | 改造为能力标签匹配（非硬编码）    |
| CCBEST `learning`            | 置信度评分 + 会话评估清单 + 本能生命周期   | 融入 Gene 生命周期管理            |
| CCBEST `pm-methodology`      | 决策优先级链 + 自主推断 + 待澄清≤3         | 预留给 P1 Spec-Compiler           |

---

## 3. P0 实施分解

### Phase 1: Memory-Bank 基础设施 [无依赖，可立即启动]

**目标**: 建立 Gene 的物理存储层。

#### Task 1.1 — 创建 Memory 目录结构

- **产出**: `fusion-core/memory/` 目录树
- **规格**:

```
fusion-core/memory/
├── gene-bank/
│   ├── personal/          # 本项目战役产出的 Gene
│   ├── inherited/         # 从外部导入的 Gene
│   └── _template.md       # Gene 标准模板
├── experience/
│   └── EXPERIENCE.md      # 战役经验总结（类 ECCBEST memory-bank）
└── observations.jsonl     # Hook 观察日志（类 ECC homunculus）
```

#### Task 1.2 — 定义 Gene 数据模型

- **产出**: `memory/gene-bank/_template.md`
- **规格** (融合 ECC Instinct + Fusion 兵种标签):

```yaml
---
id: <gene-id>
trigger: "when <条件>"
action: "do <行为>"
confidence: 0.3-0.9
domain: "code-style|testing|architecture|workflow|security"
role_bindng: "<兵种ID>"      # Fusion 独创: 绑定产出兵种
source: "session|campaign|import"
campaign_id: "<战役编号>"     # Fusion 独创: 溯源到具体战役
evidence:
  - date: YYYY-MM-DD
    context: "<观察描述>"
---
# <Gene 名称>

## Action
<具体行为描述>

## Evidence
<观察记录>
```

#### Task 1.3 — 创建 EXPERIENCE.md 模板

- **产出**: `memory/experience/EXPERIENCE.md`
- **规格**: 战役复盘记录，每次 Stage 7 完成后追加条目

---

### Phase 2: 动态路由器重构 [依赖: 无，可与 Phase 1 并行]

**目标**: 将 `model-routing.js` 从静态硬编码表升级为动态发现引擎。

#### Task 2.1 — 重构 model-routing.js

- **改动文件**: `lib/model-routing.js`
- **核心变更**:
  - 保留 `MODEL_ROUTING_MATRIX` 作为基础默认值（向后兼容）
  - 新增 `discoverRoles(skillsDir)` 函数: 扫描 `.claude/skills/` 目录，读取每个 `SKILL.md` 的 frontmatter 提取能力标签
  - 新增 `matchRoles(taskDescriptor)` 函数: 根据任务描述的能力需求，匹配可用兵种
  - 导出新 API: `{ getRoute, isValidRole, getValidRoles, getMatrix, discoverRoles, matchRoles }`
- **兼容性**: 所有现有 API 行为不变，新功能为纯增量

#### Task 2.2 — SKILL.md 增加能力标签规范

- **改动**: 更新 `_STYLE_GUIDE.md` 或新建 `docs/reference/skill-schema.md`
- **规格**: 每个兵种 SKILL.md 的 frontmatter 必须包含:

```yaml
---
name: be-api-router
capabilities: ['rest-api', 'graphql', 'route-definition', 'swagger']
tier: medium
model: sonnet
---
```

#### Task 2.3 — 重构 fusion-core-router.js

- **改动文件**: `bin/fusion-core-router.js`
- **核心变更**:
  - 调用 `discoverRoles()` 替代纯静态 `isValidRole()`
  - 支持新参数 `--capabilities "rest-api,auth"` 自动匹配兵种
  - 保留 `--role <name>` 作为显式指定（向后兼容）

---

### Phase 3: Fusion-Composer 核心 [依赖: Phase 2]

**目标**: 实现角色动态编排器——液态组织的心脏。

#### Task 3.1 — 创建 lib/fusion-composer.js

- **产出**: 新文件 `lib/fusion-composer.js`
- **核心能力**:
  - `compose(taskDescriptor)`: 分析任务，调用 `matchRoles()` 获取匹配兵种列表
  - `fuse(roles[])`: 当任务需要多兵种协同时，临时合成复合 Agent Protocol
  - `decompose(compositeAgent)`: 任务完成后，拆回原子兵种，产出物归档到各兵种目录
- **编排模板** (借鉴 ECC `/orchestrate`):
  - `sequential`: 串行流水线（Handoff 传递）
  - `parallel`: 并行独立执行
  - `fused`: 熔炼为单一复合体
- **Handoff 协议** (借鉴 ECC):

```markdown
## HANDOFF: [source-role] -> [target-role]

### Context

### Findings

### Files Modified

### Open Questions
```

#### Task 3.2 — 新增 CLI 命令 `compose`

- **改动文件**: `bin/fusion-core.js`
- **新增 case**:

```javascript
case 'compose':
    runScript('compose.sh', process.argv.slice(3));
    break;
```

---

### Phase 4: Gene-Extractor 兵种 [依赖: Phase 1]

**目标**: 创建基因提取器——战役复盘后自动提炼经验。

#### Task 4.1 — 创建 Gene-Extractor Skill

- **产出**: `.claude/skills/gene-extractor/SKILL.md`
- **触发条件**: Stage 7 完成后自动触发
- **工作流程** (融合 ECC learn + evolve):
  1. 扫描本轮战役的 Git diff 和 `pipeline/3_review/` 审查记录
  2. 识别模式: 错误修复、调试技巧、架构决策、代码模式
  3. 为每个模式生成 Gene 文件（置信度初始 0.5）
  4. 写入 `memory/gene-bank/personal/`
  5. 更新 `memory/experience/EXPERIENCE.md`

#### Task 4.2 — Hook 集成

- **改动**: 在 Stage 7 的 finish 流程中注入 Gene-Extractor 调用
- **机制**: Stage 7 完成 → 自动触发 Gene-Extractor → 产出 Gene → 更新 EXPERIENCE.md

---

## 4. DAG 依赖图

```
Phase 1 (Memory)  ──┐
                     ├──▶ Phase 4 (Gene-Extractor)
Phase 2 (Router)  ──┤
                     └──▶ Phase 3 (Composer)
```

- Phase 1 和 Phase 2 **完全并行**
- Phase 3 依赖 Phase 2（需要动态路由能力）
- Phase 4 依赖 Phase 1（需要 Gene 存储层）
- Phase 3 和 Phase 4 **可并行**

---

## 5. 文件变更矩阵

| 文件                                     | 操作                      | Phase |
| ---------------------------------------- | ------------------------- | ----- |
| `memory/gene-bank/personal/`             | 新建目录                  | 1     |
| `memory/gene-bank/inherited/`            | 新建目录                  | 1     |
| `memory/gene-bank/_template.md`          | 新建                      | 1     |
| `memory/experience/EXPERIENCE.md`        | 新建                      | 1     |
| `memory/observations.jsonl`              | 新建                      | 1     |
| `lib/model-routing.js`                   | 修改（增量）              | 2     |
| `bin/fusion-core-router.js`              | 修改（增量）              | 2     |
| `lib/fusion-composer.js`                 | 新建                      | 3     |
| `bin/fusion-core.js`                     | 修改（增加 compose 命令） | 3     |
| `.claude/skills/gene-extractor/SKILL.md` | 新建                      | 4     |

---

## 6. 验收标准

### P0 完成的定义

- [ ] `memory/` 目录结构建立，Gene 模板可用
- [ ] `model-routing.js` 支持 `discoverRoles()` 和 `matchRoles()`
- [ ] `fusion-core-router.js` 支持 `--capabilities` 参数
- [ ] `fusion-composer.js` 支持 `compose/fuse/decompose` 三操作
- [ ] Gene-Extractor 可在 Stage 7 后手动触发并产出 Gene 文件
- [ ] 所有现有功能向后兼容（13 兵种静态路由不受影响）
- [ ] 测试覆盖率 ≥ 80%

### 不在 P0 范围内

- Spec-Compiler（零介入需求编译）→ P1
- Hook 自动观察（实时 Gene 捕获）→ P1
- Gene 导入/导出（跨项目共享）→ P1
- Composer 自动熔炼（目前为手动触发）→ P1

---

## 7. 风险识别

| 风险                                  | 等级 | 缓解措施                                |
| ------------------------------------- | ---- | --------------------------------------- |
| 动态路由性能 — 扫描 skills 目录可能慢 | 低   | 增加缓存层，首次扫描后缓存结果          |
| SKILL.md frontmatter 格式不统一       | 中   | 先定义 Schema，再迁移现有 SKILL.md      |
| Composer 复合体的上下文膨胀           | 中   | 限制单次熔炼最多 3 个兵种               |
| 向后兼容破坏                          | 高   | 所有新 API 为纯增量，不修改现有接口签名 |

---

_V4-P0: 不重新发明轮子，借 ECC 的灵动 + CCBEST 的记忆，套上 Fusion 的物理装甲。_
