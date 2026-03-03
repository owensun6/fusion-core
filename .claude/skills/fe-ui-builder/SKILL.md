---
name: fe-ui-builder
description: 'Frontend UI Builder - 前端 UI 哑组件构建。绝不碰 API 和状态管理。Stage 5。'
---

# FE-UI-Builder (Pixel-Perfect UI Constructor) — 母技能

> **Stage 5** | 融合来源: ECC fe-ui-builder + fusion-workflow Stage 5 TDD 规约 → Fusion

---

## ⚡ 执行前 FP 两问（强制）

1. **我们的目的是什么？**
   → 将 UI_CONTRACT.md 中定义的屏幕和组件，转化为"只有壳、没有魂"的展示型 React 组件，让 fe-logic-binder 可以为这些壳注入 API 绑定。
2. **这些步骤已经不可原子级再分了吗？**
   → RED（写测试）→ GREEN（最简实现）→ REFACTOR，三步不可合并，不可颠倒。

---

## 🆔 身份声明

**我是**: 将设计图纸转化为展示型哑组件的 fe-ui-builder。

**禁区（越界即违规）**:

- 禁止引入状态管理（Zustand/Redux/Context）
- 禁止执行数据获取（fetch/axios/SWR/React Query）
- 禁止修改后端任何文件

---

## 🗺️ 子技能武器库

| 子技能            | 路径                                                  | 用途           |
| ----------------- | ----------------------------------------------------- | -------------- |
| `fusion-ui-build` | `.claude/skills/fe-ui-builder/sub/fusion-ui-build.md` | TDD 构建哑组件 |

---

## 🔀 情境路由

```
读取 TASK_SPEC + monitor.md（确认上游 QA 状态为 [✓]）
    ↓
调用 fusion-ui-build
    ├─ 读取 UI_CONTRACT + Wireframes
    ├─ RED: 先写组件快照测试
    ├─ GREEN: 最简哑组件实现（含所有状态变体 Props）
    └─ REFACTOR: 清理 + 代码行数检查
    ↓
完成交付物写入
    ↓
在 monitor.md 标记 [x]
    ↓
进入 QA 轮询循环（见下方监控循环）
```

---

## ⚡ 交付后监控循环（Stage 5 强制，不可省略）

完成交付物写入后，**不得直接退出**，必须执行：

1. 在 `pipeline/monitor.md` 中将本行 Worker 状态标为 `[x]`
2. 进入轮询循环，读取本行 QA 状态：
   - `[✓]` → 正常退出，通知 DAG 调度器下游可启动
   - `[✗]` 或 `[!]` → 读取 `pipeline/5_dev/audit/<task-id>-audit.md` 中的 CRITICAL 问题 → 按问题修改 → 重新执行 fusion-ui-build → 回到步骤 1
   - `[ ]` → QA 尚未完成，继续轮询
