# 文档标准与交付件溯源 (Document Standards & Traceability)

> **[!] CRITICAL**: 拒绝无头文件。拒绝无署名的产出。文档是跨环节协同的唯一证据链。

## 0. 文件命名规范 (File Naming Convention)

项目中归档性质的文档文件，**文件名必须携带创建日期前缀**，便于在目录中快速识别时间线。

**格式**: `YYYY-MM-DD-原文件名.扩展名`

**适用范围**（需要日期前缀）:
- `docs/`、`research/`、`reports/` 等归档文档目录
- 实验报告、架构概览、技术调研等保存性材料

**不适用**（无需日期前缀）:
- `pipeline/` 下的流水线产出物（`PRD.md`、`System_Design.md`、`INTERFACE.md` 等）——这些有固定文件名，被下游阶段硬引用
- 看板/索引文件（`monitor.md`、`FEATURE_LIST.md`、`CLAUDE.md`）
- 代码文件、配置文件、系统目录

**示例**:

| 场景 | 文件名 |
|------|--------|
| 保存实验报告到 docs/ | `2026-03-17-spike-experiment-report.md` |
| 保存架构概览到 docs/ | `2026-03-17-architecture-overview.html` |
| 保存技术调研到 research/ | `2026-03-17-llm-provider-comparison.md` |
| pipeline 产出的 PRD | `PRD.md`（不加日期） |

## 1. 强制电子签名 (Author Stamp Protocol)

Fusion-Core 规定所有 AI 代理生成的交付物（无论是 PRD、架构图、还是接口文档），**必须在文件头部显式声明负责写入的角色。**

这是为了防止“前端特种兵私自修改后端契约”等越权行为。在发生交叉编译错误时，这是追溯责任人的关键凭证。

**签名格式**:

| 文件类型 | 签名格式 | 位置 |
|---------|---------|------|
| `.md` | `<!-- Author: [角色名] -->` | 文件首行 |
| `.py` | `# Author: [角色名]` | 文件首行（或 docstring 后第一行） |
| `.ts` / `.js` / `.tsx` / `.jsx` | `// Author: [角色名]` | 文件首行 |
| `.sql` | `-- Author: [角色名]` | 文件首行 |

_[角色名] 填入具体兵种名（如 `be-domain-modeler`、`fe-ui-builder`），不可用笼统的 `Dev`。_

**检查方式**: `bin/fusion-lint.sh` 的 L2 检查项会自动扫描产出文件的 Author stamp。

## 2. 架构决策记录 (ADR: Architecture Decision Records)

任何引发**不可逆修改**或**重大约定变更**的决策（例如“从 REST 切换为 GraphQL”，“选定 Prisma 作为 ORM”），必须被固化为 ADR 并永久存放。

**ADR 存放路径**: `pipeline/1_architecture/ADR/`

**ADR 标准模板**:

```markdown
# ADR-[001]: [决策标题]

<!-- Author: Lead -->

## 1. 决策背景 (Context)

_是什么技术难题迫使我们必须做选择？_

## 2. 考虑的选项 (Considered Options)

- 选项 A (及其优缺点)
- 选项 B (及其优缺点)

## 3. 最终决策与理由 (Decision & Justification)

_我们选了什么，以及它是如何平衡了算力/复杂度约束的？_
```

## 3. 看板豁免原则 (No Manual Monitor Edits)

在流水线中，**严禁**任何特种兵直接编辑 `pipeline/monitor.md` 表格。表格的更新已全部下放至 `PostToolUse` 的底层钩子中。你只需专注于写入 `PRD.md` 或 `INTERFACE.md`。

## 4. 零废话纯信噪比 (High SNR)

作为特种兵，你的所有注释、文档请保持“零寒暄”。

- 🛑 **禁止**: "Hello, here is the updated API contract you requested..."
- ✅ **遵循**: 直接给出 `INTERFACE.md` 内容块。
