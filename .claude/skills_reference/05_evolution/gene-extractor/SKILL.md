# Gene Extractor (兵种基因萃取引擎)

> **V4 核心能力**: 战役结束后，自动从 git diff、review 记录和 lessons 中提取可复用的经验模式，写入 Gene Bank。

## 触发条件

- Stage 7 完成分支后自动触发
- 或 Commander 手动执行 `npx fusion-core extract-genes`

## 输入源

1. **Git 变更摘要**: 最近 20 条 commit（由 `extract-genes.sh` 自动收集）
2. **审查记录**: `pipeline/3_review/` 下的 Audit Report
3. **Lessons Learned**: `tasks/lessons.md`（如果存在）

## 萃取规则 (Extraction Rules)

### 必须提取的模式类型

| 类型             | 触发信号                               | Gene 格式                           |
| ---------------- | -------------------------------------- | ----------------------------------- |
| **错误修复模式** | commit message 含 `fix`/`bug`/`hotfix` | 问题→根因→修复方案→预防措施         |
| **架构决策**     | commit 涉及多文件结构变更              | 决策背景→备选方案→选择理由→约束条件 |
| **调试技巧**     | review 中标记的 CRITICAL/HIGH 问题     | 症状→诊断路径→解决方案              |
| **代码规范**     | review 中反复出现的同类问题            | 违规模式→正确写法→自动检测方法      |
| **性能优化**     | commit message 含 `perf`/`optimize`    | 瓶颈→度量→优化方案→效果             |

### Gene 文件格式

```markdown
---
id: <type>-<YYYYMMDD>-<short-hash>
trigger: '<触发此 Gene 的场景描述>'
action: '<遇到此场景时应执行的动作>'
confidence: 0.5
domain: '<workflow|code|architecture|security>'
role_binding: '<适用的兵种角色>'
source: 'campaign'
created: '<日期>'
evidence:
  - date: '<日期>'
    context: '<来源说明>'
---

# <Gene 标题>

## 模式描述

<简洁描述这个可复用的经验>

## 触发条件

<什么场景下应该调用此 Gene>

## Action

<具体的执行步骤>

## 反例

<不遵循此 Gene 时会发生什么>
```

### 置信度规则

- 首次提取: `confidence: 0.5`
- 在第二次战役中被验证有效: 提升至 `0.7`
- 在第三次战役中再次有效: 提升至 `0.9`
- 被证明无效或有害: 降至 `0.1` 并标记 `deprecated: true`

## 存储位置

```
memory/gene-bank/
├── _template.md          # Gene 模板
├── personal/             # 个人战役萃取
│   ├── bugfix-20260301-abc123.md
│   └── arch-20260301-def456.md
└── shared/               # 跨项目共享（手动提升）
```

## 质量闸门

萃取完成后自检：

- [ ] 每个 Gene 的 `trigger` 和 `action` 是否具体到可执行（非模糊描述）
- [ ] 是否有 evidence 溯源（指向具体的 commit 或 review 记录）
- [ ] 是否与已有 Gene 重复（重复则合并并提升 confidence）
- [ ] role_binding 是否正确（不应把前端 Gene 绑给 DBA）
