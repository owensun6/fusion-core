#!/bin/bash

# ==============================================================================
# Fusion-Core Pipeline Scaffolding Script
# ==============================================================================
# This script initializes the mandatory 8-stage pipeline directory structure
# required by the Fusion-Core workflow.
# It ensures that Agents have standard locations for all outputs.

echo "Initializing Fusion-Core pipeline directories..."

BASE_DIR="$(pwd)/pipeline"

# Clean up if needed (uncomment for reset)
# rm -rf "$BASE_DIR"

mkdir -p "$BASE_DIR/0_requirements"
mkdir -p "$BASE_DIR/1_architecture/ADR"
mkdir -p "$BASE_DIR/1_5_prototype/UI_Mockups"
mkdir -p "$BASE_DIR/2_planning"
mkdir -p "$BASE_DIR/3_review/qa_records"
mkdir -p "$BASE_DIR/3_review/integration_records"
mkdir -p "$BASE_DIR/4_delivery"

# Ensure the empty monitor board exists
if [ ! -f "$BASE_DIR/monitor.md" ]; then
cat << 'EOF' > "$BASE_DIR/monitor.md"
# 战略全景沙盘 (Fusion Global Monitor)
| Gate | 阶段名称 | 状态 | 产出物链路 | 风险与重审日志 (Reject/Rework Log) |
|---|---|---|---|---|
| Gate 0 | PM 需求对齐 | PENDING | | |
| Gate 1 | Lead 架构契约 | PENDING | | |
| Gate 1.5 | UI 原型交互 | PENDING | | |
| Gate 2 | DAG 兵力分配 | PENDING | | |
| Gate 3 | 全维验收 (QA/IV) | PENDING | | |

## Stage 3: 并发阵地特种兵分配
*(由系统钩子基于 task.md 自动填充更新)*
- [ ] 待命中...
EOF
fi

echo "Pipeline scaffold successfully built at $BASE_DIR"
exit 0
