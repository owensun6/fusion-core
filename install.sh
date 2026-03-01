#!/usr/bin/env bash

# Fusion Core 一键挂载脚本
# 此脚本将 `.agent-core/.claude/` 的智能体纪律法则全部以符号链接映射到宿主项目。

set -e

echo "🚀 开始挂载 Fusion Core (1+4+13 防幻觉兵团)..."

# 宿主的 .claude 根目录
CLAUDE_DIR=".claude"
CORE_DIR=".agent-core/.claude"

# 如果是从自身项目调用（测试环境），稍微调整路径
if [ ! -d ".agent-core" ]; then
  if [ -d ".claude/skills" ]; then
    echo "⚠️ 检测到正在 Fusion Core 内部运行。该脚本设计为被第三方业务库通过 submodule 挂载后运行。"
    exit 0
  else
    echo "❌ 找不到 .agent-core 文件夹。请确保你已通过 git submodule 引入。"
    exit 1
  fi
fi

mkdir -p $CLAUDE_DIR

# 映射 1：底座兵法
echo "🔗 挂载全局底座兵法 (rules)..."
ln -sfn ../$CORE_DIR/rules $CLAUDE_DIR/rules

# 映射 2：全局挂载的海关阀门
echo "🔗 挂载全局海关阀门 (hooks)..."
ln -sfn ../$CORE_DIR/hooks $CLAUDE_DIR/hooks

# 映射 3：原子化特种兵基地
echo "🔗 挂载 13 号特种兵矩阵 (skills)..."
ln -sfn ../$CORE_DIR/skills $CLAUDE_DIR/skills

echo "✅ 挂载完成！"
echo "你可以通过 \`/fusion_index\` 或查看 FUSION_INDEX.md 了解全兵种指引。"
