#!/bin/bash

# ==============================================================================
# Fusion-Core: Start New Project
# ==============================================================================
# Usage: fusion-core start <project-name> [commander-name]
#
# 1. Creates pipeline directory structure
# 2. Initializes monitor.md with project info
# 3. Prints next-step instructions (summon PM)

set -euo pipefail

PROJECT_NAME="${1:-}"
COMMANDER="${2:-Commander}"
TODAY=$(date +%Y-%m-%d)

if [ -z "$PROJECT_NAME" ]; then
  echo "❌ 用法: npx fusion-core start <项目名称> [指挥官名称]"
  echo "   示例: npx fusion-core start \"医院挂号系统\" \"道一\""
  exit 1
fi

echo "🚀 Fusion-Core: 初始化项目「${PROJECT_NAME}」..."

# --- Step 1: Create pipeline directories ---
BASE_DIR="$(pwd)/pipeline"

mkdir -p "$BASE_DIR/0_requirements"
mkdir -p "$BASE_DIR/1_architecture/ADR"
mkdir -p "$BASE_DIR/1_5_prototype/UI_Mockups"
mkdir -p "$BASE_DIR/2_planning"
mkdir -p "$BASE_DIR/3_review/qa_records"
mkdir -p "$BASE_DIR/3_review/integration_records"
mkdir -p "$BASE_DIR/4_delivery"

# --- Step 2: Generate monitor.md with real project info ---
cat << EOF > "$BASE_DIR/monitor.md"
# Fusion Pipeline Monitor (全局监控看板)

> 本文件为 Commander（人类统帅）的实时作战屏幕。

---

## 项目状态卡 (Project Card)

| 字段      | 值                    |
| --------- | --------------------- |
| 项目名称  | \`${PROJECT_NAME}\`   |
| 创建日期  | \`${TODAY}\`          |
| Commander | \`${COMMANDER}\`      |
| 当前阶段  | \`Stage 0\`           |
| 整体状态  | 🟡 进行中              |
| 风险等级  | 🟢 低                  |

---

## 阶段推进看板 (Stage Progress Board)

> 状态枚举: ⬜ 未开始 | 🟡 进行中 | ✅ 已通过 | ❌ 已拒绝 | ⏭️ 已跳过

| 阶段      | 描述                | 状态 | Gate 审批人 | 审批时间 | 备注 |
| --------- | ------------------- | ---- | ----------- | -------- | ---- |
| Stage 0   | 需求深度解构        | 🟡   | —           | —        | —    |
| Gate 0    | Commander 签字      | ⬜   | —           | —        | —    |
| Stage 1   | 系统架构设计        | ⬜   | —           | —        | —    |
| Gate 1    | Commander 签字      | ⬜   | —           | —        | —    |
| Stage 1.5 | UI/逻辑原型         | ⬜   | —           | —        | 条件触发 |
| Gate 1.5  | Commander 签字/SKIP | ⬜   | —           | —        | —    |
| Stage 2   | 头脑风暴            | ⬜   | —           | —        | —    |
| Stage 3   | 微粒规划 & DAG      | ⬜   | —           | —        | —    |
| Gate 2    | Commander 签字      | ⬜   | —           | —        | —    |
| Stage 4   | Git Worktree 隔离   | ⬜   | —           | —        | —    |
| Stage 5   | TDD 并发实施        | ⬜   | —           | —        | —    |
| Stage 6   | 代码审查 & 集成     | ⬜   | —           | —        | —    |
| Gate 3    | Commander 签字      | ⬜   | —           | —        | —    |
| Stage 7   | 分支合并 & 发布     | ⬜   | —           | —        | —    |

---

## 风险与拒绝日志

| 日期 | Gate | 次数 | 原因 | 处置 |
| ---- | ---- | ---- | ---- | ---- |
| —    | —    | —    | —    | —    |
EOF

# --- Step 3: Create empty PRD & BDD templates ---
if [ ! -f "$BASE_DIR/0_requirements/PRD.md" ] || [ ! -s "$BASE_DIR/0_requirements/PRD.md" ]; then
cat << 'EOF' > "$BASE_DIR/0_requirements/PRD.md"
<!-- Author: PM -->

---
project: <待填写>
author: PM
gate: Gate-0
status: PENDING_APPROVAL
---

# PRD: <项目名称>

## 1. 业务背景
> 为什么要做这件事？解决什么痛点？

## 2. 用例清单 (Use Cases)
- UC-01:
- UC-02:

## 3. 非功能性需求
- 预估并发量:
- 安全等保要求:
- 数据保留周期:

## 4. 已澄清的边界决策

| #  | 问题 | Commander 裁定 |
|----|------|---------------|
| Q1 |      |               |
EOF
fi

if [ ! -f "$BASE_DIR/0_requirements/BDD_Scenarios.md" ] || [ ! -s "$BASE_DIR/0_requirements/BDD_Scenarios.md" ]; then
cat << 'EOF' > "$BASE_DIR/0_requirements/BDD_Scenarios.md"
<!-- Author: PM -->

# BDD Scenarios

Feature: <功能名称>

  Scenario: [Success] <正常流描述>
    Given <前置条件>
    When <用户动作>
    Then <系统响应与断言>

  Scenario: [Error] <异常流描述>
    Given <前置条件>
    When <触发异常的动作>
    Then <系统阻断或回滚行为>
EOF
fi

# --- Step 4: Print success & next steps ---
echo ""
echo "✅ 项目「${PROJECT_NAME}」初始化完成！"
echo ""
echo "📁 目录结构:"
echo "   pipeline/"
echo "   ├── 0_requirements/   ← PRD & BDD (Stage 0 产出)"
echo "   ├── 1_architecture/   ← 架构设计 (Stage 1 产出)"
echo "   ├── 1_5_prototype/    ← UI 原型 (Stage 1.5 产出)"
echo "   ├── 2_planning/       ← 任务规划 & DAG (Stage 3 产出)"
echo "   ├── 3_review/         ← QA & IV 审查报告 (Stage 6 产出)"
echo "   ├── 4_delivery/       ← 交付物"
echo "   └── monitor.md        ← 全局看板 (Stage 0 已激活 🟡)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 下一步: 召唤 PM 开始需求对话"
echo ""
echo "   在 Claude Code 中直接说:"
echo ""
echo "   「我要做一个 XXX 系统，帮我做需求分析」"
echo ""
echo "   PM 会以苏格拉底式追问帮你理清需求，"
echo "   最终产出 PRD.md 和 BDD_Scenarios.md。"
echo "   你确认签字 (Approve) 后，流程自动推进到架构阶段。"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
