#!/bin/bash
# ==============================================================================
# Fusion-Core Uninstaller (子模块/特种兵解绑工具)
# ==============================================================================
# 作用: 当宿主项目决定弃用 Fusion-Core 时，物理清理 Agent 挂载的文件与钩子，
# 确保不在宿主仓库遗留大模型配置文件。

echo "🗑️ 正在安全解除 Fusion-Core 挂载..."

TARGET_DIR=${1:-..} # 默认操作上级目录（假设在子项目内）
CLAUDE_DIR="$TARGET_DIR/.claude"
HUSKY_DIR="$TARGET_DIR/.husky"

read -p "🚨 警告: 这将删除宿主项目 ($TARGET_DIR) 中的 .claude 和 .husky 文件夹，是否确认? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # 移除挂载目录
    if [ -d "$CLAUDE_DIR" ]; then
        rm -rf "$CLAUDE_DIR"
        echo "- 已移除 $CLAUDE_DIR 兵种映射与钩子"
    fi
    
    if [ -d "$HUSKY_DIR" ]; then
        rm -rf "$HUSKY_DIR"
        echo "- 已移除 $HUSKY_DIR Git 拦截锁"
    fi

    echo "✅ 卸载完成。Fusion-Core 大军已从您的战区撤退。"
else
    echo "⭕ 操作已取消。"
fi
exit 0
