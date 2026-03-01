---
description: 【记忆唤醒】从意外中断中恢复，重新读取进度看板与任务堆栈
argument-hint: "[可选: '深度']"
allowed-tools: Read, Grep, Bash
---

# /fusion-catchup - 断点恢复与记忆读取

当你因为系统重启、终端死机或上下文被截断后醒来，人类 Commander 会输入 `/fusion-catchup` 来唤醒你。

## 执行动作

1. **绝不瞎猜**：停止输出废话，立即使用 `cat` 或 `view_file` 读取：
   - `pipeline/monitor.md`（了解整体处于 Stage 几，卡在哪个 Gate）
   - `pipeline/2_planning/task.md`（了解哪些微观网络任务被打钩了，哪些处于空白）
2. **状态报告**：用最极简的 3 句话向 Commander 汇报：
   - 当前项目正处于【阶段 X】
   - TDD/并发网络中距离下一个 Gate 还缺【Y 件产出物】
   - “Commander，我已恢复所有位置感，请下达特定兵种激活指令。”
