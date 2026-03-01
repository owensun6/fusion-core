---
name: ghost-supervisor
description: Use when launching and monitoring automated scripts (e.g., DAG pipelines, multi-agent orchestrators) that run multiple phases with quality gates. Enables real-time log monitoring, per-phase output auditing, and automatic intervention by modifying task description files and restarting the script. Triggers on '启动并监控', '幽灵监督', 'ghost supervise', 'monitor pipeline', '监控流水线'.
---

# Ghost Supervisor — 幽灵监督者

## Overview

**幽灵协议：脚本永远不依赖你。你在时，质量更高；你不在时，一切照常。**

Ghost Supervisor 让 Antigravity 以非阻塞监督者身份参与自动化脚本的执行。你不直接修改代码，而是通过修改 Agent 的**任务说明文件**来教导 Agent 避免已知 Bug，然后重启脚本让 Agent 自行修复。

## 核心工作流

```
┌─────────────────────────────────────────────────┐
│  Pre-flight (启动前)                              │
│  1. 读取脚本结构，识别所有 Phase 和 Gate           │
│  2. 读取 INTERFACE.md / spec 文件                 │
│  3. 生成监测检查单 (checklist.md)                 │
│  4. 在后台启动脚本                                │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│  Monitor Loop (监控循环)                          │
│  轮询 logs/ 目录，检测文件更新                      │
│  每当一个 Phase 完成 (日志文件 size > 0):          │
│    → 读取该阶段产出文件                            │
│    → 对照检查单逐项审查                            │
│    → 如发现问题 → 进入 Intervene                  │
│    → 如无问题 → 勾选检查单，继续监控               │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│  Intervene (干预)                                 │
│  1. 分析根因 (import 路径? 字段缺失? 类型?)        │
│  2. 将规避指令追加到对应的 tasks_*.md 文件          │
│  3. 终止当前脚本 (kill PID)                       │
│  4. 重启脚本                                      │
│  5. 回到 Monitor Loop                            │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│  Complete (完成)                                   │
│  全部 Gate 通过 → 更新检查单为全绿                  │
│  向用户报告最终结果                                 │
└─────────────────────────────────────────────────┘
```

## 幽灵降级协议

| 状态      | 行为                                   |
| --------- | -------------------------------------- |
| 在线      | 主动轮询日志、审查产出、必要时干预     |
| 离线/断连 | 脚本完全独立运行，无任何副作用         |
| 重新上线  | 读取最后日志状态，评估是否需要追溯修复 |

**铁律：永远不在脚本中注入对 Antigravity 的依赖。脚本的 Gate 机制是基线防御，Antigravity 是增益。**

## Pre-flight 操作指南

### Step 1: 识别脚本结构

读取目标脚本，识别：

- 所有 Phase（如 Phase 0 Spec, Phase 1 BE/FE）
- 所有 Gate（如 Gate 0.5 Spec Audit, Gate 1.5 Code Audit）
- 对应的日志文件路径（如 `logs/spec.log`, `logs/be.log`）
- 对应的任务说明文件（如 `tasks_spec.md`, `tasks_be_dag.md`, `tasks_fe_dag.md`）

### Step 2: 读取接口规范

读取 `INTERFACE.md` 或等效 spec 文件，提取：

- 所有函数签名（参数类型、返回类型）
- 所有异常定义
- 所有必填字段

### Step 3: 生成监测检查单

基于 Step 1-2 的信息，在项目目录生成 `ghost_checklist.md`。
参见 [checklist-template.md](references/checklist-template.md) 获取模板。

### Step 4: 后台启动脚本

```bash
bash <script_path> &
```

记录 PID 供后续终止使用。

## Monitor Loop 操作指南

### 轮询策略

```bash
ls -lt <logs_dir>/
```

每 5-10 秒轮询一次。当日志文件大小从 0 变为 > 0，表示该阶段完成。

### 阶段完成后的审查流程

1. **读取日志文件**：确认 Phase 是否成功（exit code、关键字）
2. **读取产出文件**：如 `INTERFACE.md`、`user_api.py`、`test_user_display.py`
3. **对照检查单逐项验证**
4. **交叉比对**：产出文件之间是否一致（如 test 的 import 是否匹配代码的包路径）

### Gate 通过但产出有隐患时

即使 Gate 判定 PASS，也要检查：

- import 路径是否使用包模式（`from frontend.xxx` 而非 `from xxx`）
- 是否验证了 INTERFACE.md 定义的所有必填字段
- 测试用例是否覆盖了所有异常场景
- 函数签名是否与 INTERFACE.md 严格一致

## Intervene 干预指南

### 干预决策树

```
发现问题?
├── 问题在 Gate 范围内 (Gate 会拦截)?
│   └── 是 → 不干预，让 Gate 自行处理
│        (Gate 失败后脚本会自动中断)
│
└── 问题超出 Gate 检测范围?
    └── 是 → 主动干预
         1. 定位问题根因
         2. 编写规避指令
         3. 追加到 tasks_*.md
         4. 终止 + 重启脚本
```

### 修改任务说明的规范

在对应的 `tasks_*.md` 文件**末尾**追加一个 `## ⚠️ Ghost Supervisor 补充要求` 段落：

```markdown
## ⚠️ Ghost Supervisor 补充要求

以下是监督者在上一轮执行中发现的问题，请务必遵守：

1. **import 路径必须使用包模式**
   - ✅ `from frontend.user_display import format_user_display`
   - ❌ `from user_display import format_user_display`

2. **必须验证 INTERFACE.md 定义的所有必填字段**
   - UserDict 包含 id, name, role 三个字段，缺一不可
```

这段指令会被 Agent 在下一次执行时读取并遵守。

### 终止与重启

```bash
# 终止当前脚本及其子进程
kill <PID>

# 重启
bash <script_path>
```

## 常见 Bug 模式库

| Bug 模式           | 检测方法                             | 写入任务说明的指令                    |
| ------------------ | ------------------------------------ | ------------------------------------- |
| import 路径错误    | `grep "from user_display"`           | "import 必须使用 `from frontend.xxx`" |
| 缺少字段验证       | 比对 INTERFACE.md 的字段列表 vs 代码 | "必须检查 id, name, role 三个字段"    |
| 测试断言不精确     | `grep "assertIn\|assertEqual"`       | "assertRaises 必须验证异常消息内容"   |
| 返回类型不匹配     | 比对函数签名 vs INTERFACE.md         | "返回类型必须为 Dict[str, Any]"       |
| 中文异常消息不一致 | 比对代码 vs 测试中的字符串           | "错误消息必须与测试用例严格一致"      |

## 最终报告

监控结束后，更新 `ghost_checklist.md` 为全绿状态，向用户提供：

1. ✔/✘ 每阶段审查结果
2. 干预次数和干预原因
3. Agent 在指令补充后的改进对比
4. 总耗时

## 关键约束

- **不直接修改代码文件** — 只修改任务说明，让 Agent 自行修正
- **不阻塞脚本执行** — 脚本可以在没有你的情况下独立运行
- **可中途加入** — 如果脚本已经在运行，读取当前日志状态，从当前 Phase 开始监控
- **可中途离开** — 如果你断连，脚本继续运行，不受任何影响
