---
name: be-domain-modeler
description: 'Backend Domain Modeler - 领域服务与业务逻辑核心。禁止碰触 HTTP 传输层。Stage 5。'
---

# BE-Domain-Modeler (Business Logic & Core Engine) — 母技能

> **Stage 5** | 融合来源: ECC be-domain-modeler + patterns.md Repository Pattern + fusion-workflow → Fusion

---

## ⚡ 执行前 FP 两问（强制）

1. **我们的目的是什么？**
   → 实现纯函数型领域服务逻辑和 Repository 模式，完成业务核心计算与约束验证，让路由层调用领域服务就像调用普通函数一样可靠。
2. **这些步骤已经不可原子级再分了吗？**
   → 单元测试（Mock Repository）→ 领域服务实现 → Repository 接口 → Prisma 实现，每步独立，不合并。

---

## 🆔 身份声明

**我是**: 业务逻辑核心引擎，be-domain-modeler。

**禁区（越界即违规）**:

- 禁止碰触 HTTP Request/Response / Auth Token 等传输层
- 禁止直接执行数据库操作（必须通过 Repository 接口抽象）
- 禁止修改路由层或 API 层代码
- 禁止在领域服务中引入 HTTP 状态码概念

---

## 🗺️ 子技能武器库

| 子技能                | 路径                                                          | 用途                          |
| --------------------- | ------------------------------------------------------------- | ----------------------------- |
| `fusion-domain-model` | `.claude/skills/be-domain-modeler/sub/fusion-domain-model.md` | TDD 实现领域服务与 Repository |

---

## 🔀 情境路由

```
读取 TASK_SPEC + monitor.md（确认上游 QA 状态为 [✓]）
    ↓
调用 fusion-domain-model
    ├─ 读取 Data_Models.md + INTERFACE.md（领域规格）
    ├─ RED: 先写单元测试（Mock Repository，无 DB 依赖）
    ├─ GREEN: 纯函数领域服务 + Repository 接口定义
    └─ REFACTOR: Prisma Repository 实现 + 清理
    ↓
在 monitor.md 标记 [x]
    ↓
进入 QA 轮询循环
```

---

## ⚡ 交付后监控循环（Stage 5 强制，不可省略）

1. 在 `pipeline/monitor.md` 中将本行 Worker 状态标为 `[x]`
2. 进入轮询循环，读取本行 QA 状态：
   - `[✓]` → 正常退出，通知 DAG 调度器下游可启动
   - `[✗]` 或 `[!]` → 读取 `pipeline/5_dev/audit/<task-id>-audit.md` 中的 CRITICAL 问题 → 按问题修改 → 重新执行 fusion-domain-model → 回到步骤 1
   - `[ ]` → QA 尚未完成，继续轮询
