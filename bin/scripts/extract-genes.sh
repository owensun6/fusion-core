#!/usr/bin/env bash
# Fusion-Core V4: Gene Extractor (Stage 7 Post-Hook)
# 扫描本轮战役的 git diff 和 review 记录，提取可复用模式为 Gene 文件。

set -euo pipefail

GENE_BANK_DIR="${GENE_BANK_DIR:-$(dirname "$0")/../../memory/gene-bank/personal}"
REVIEW_DIR="${REVIEW_DIR:-$(dirname "$0")/../../pipeline/3_review}"
TEMPLATE_PATH="$(dirname "$0")/../../memory/gene-bank/_template.md"

# 确保目标目录存在
mkdir -p "$GENE_BANK_DIR"

# 获取当前战役信息
CAMPAIGN_ID="${FUSION_CAMPAIGN_ID:-$(date +%Y%m%d-%H%M%S)}"
CURRENT_DATE="$(date +%Y-%m-%d)"

echo "========================================================"
echo "🧬 Fusion-Core Gene Extractor v4.0"
echo "> 战役编号: ${CAMPAIGN_ID}"
echo "> 基因库路径: ${GENE_BANK_DIR}"
echo "> 审查记录: ${REVIEW_DIR}"
echo "========================================================"

# 1. 收集 Git Diff 摘要（最近一个合并的变更）
DIFF_SUMMARY=""
if git rev-parse --git-dir > /dev/null 2>&1; then
    DIFF_SUMMARY=$(git log --oneline -20 --no-merges 2>/dev/null || echo "无法读取 git log")
    echo "> Git 历史已读取 (最近 20 条)"
else
    echo "⚠️ 非 Git 仓库，跳过 diff 扫描"
fi

# 2. 收集 Review 记录
REVIEW_CONTENT=""
if [ -d "$REVIEW_DIR" ]; then
    for f in "$REVIEW_DIR"/*.md "$REVIEW_DIR"/**/*.md; do
        [ -f "$f" ] 2>/dev/null && REVIEW_CONTENT="${REVIEW_CONTENT}\n--- $(basename "$f") ---\n$(head -50 "$f")"
    done
    echo "> 审查记录已读取"
else
    echo "⚠️ 审查目录不存在，跳过 review 扫描"
fi

# 3. 生成战役摘要 Gene（占位，由 AI Agent 后续丰富）
GENE_FILE="${GENE_BANK_DIR}/campaign-${CAMPAIGN_ID}.md"

cat > "$GENE_FILE" << EOF
---
id: campaign-${CAMPAIGN_ID}
trigger: "战役复盘"
action: "参考本次战役的模式与经验"
confidence: 0.5
domain: "workflow"
role_binding: "lead"
source: "campaign"
campaign_id: "${CAMPAIGN_ID}"
created: "${CURRENT_DATE}"
updated: "${CURRENT_DATE}"
evidence:
  - date: "${CURRENT_DATE}"
    context: "Stage 7 自动提取"
---

# 战役复盘: ${CAMPAIGN_ID}

## Git 变更摘要

${DIFF_SUMMARY:-"无变更记录"}

## 审查发现

${REVIEW_CONTENT:-"无审查记录"}

## 提取的模式

> 待 AI Agent 分析填充：错误修复模式、调试技巧、架构决策、代码规范等。

## Action

参考本次战役经验，在未来类似任务中复用已验证的模式。
EOF

echo ""
echo "✅ Gene 文件已生成: ${GENE_FILE}"
echo "📊 置信度: 0.5 (初始值，经多次验证后自动提升)"
echo "========================================================"
