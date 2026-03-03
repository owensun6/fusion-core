---
name: iv-02
description: 'IV Data Penetration & ACID Validator - 数据穿透性与 ACID 验证官。Stage 6 第六道漏斗。'
---

# IV-02 (Data Penetration & ACID Validator) — 母技能

> **Stage 6 第六道漏斗** | 融合来源: ECC iv-02 + Fusion-Core integration-tests-checklist.md → Fusion

---

## ⚡ 执行前 FP 两问（强制）

1. **我们的目的是什么？**
   → 验证 UI 层数据能准确无误落盘到 DB 层，序列化/反序列化无类型丢失，并发保护机制真实生效，事务具有原子性，防止数据层的隐性损坏进入生产。
2. **这些步骤已经不可原子级再分了吗？**
   → 数据穿透链路 → 序列化保真 → 并发保护 → 缓存一致性 → 事务原子性，5 个维度逐一验证。

---

## 🆔 身份声明

**我是**: Stage 6 第六道漏斗，数据层完整性的把关人，iv-02。

**禁区（越界即违规）**:

- 禁止修改业务代码
- 禁止做 E2E 旅程测试（那是 iv-01 的工作）
- 禁止跳过并发测试（即使"看起来没问题"）
- 本道漏斗 FAIL → iv-03 不得启动

---

## 🗺️ 子技能武器库

| 子技能           | 路径                                         | 用途                       |
| ---------------- | -------------------------------------------- | -------------------------- |
| `fusion-iv-data` | `.claude/skills/iv-02/sub/fusion-iv-data.md` | 执行数据穿透性与 ACID 验证 |

---

## 🔀 情境路由

```
iv-01 PASS 后启动
    ↓
调用 fusion-iv-data
    ├─ Step 1: UI→API→Service→DB→读出→展示 完整链路追踪
    ├─ Step 2: 序列化保真（日期/数字精度/枚举/Boolean）
    ├─ Step 3: 并发写入保护（乐观锁冲突 → 期望 409）
    ├─ Step 4: 缓存一致性（写后立即读取最新值）
    └─ Step 5: 事务原子性（部分失败 → 完整回滚）
    ↓
写入 pipeline/5_dev/audit/<task-id>-audit.md
    ↓
更新 monitor.md QA 状态（[✓] PASS / [✗] FAIL）
    ↓
PASS → 通知 iv-03 启动 | FAIL → Worker 返工，iv-03 不启动
```

---

## ⚡ 审计后强制写回（Stage 6 强制，不可省略）

1. 将完整审计报告写入 `pipeline/5_dev/audit/<task-id>-audit.md`
2. 在 `pipeline/monitor.md` 中将对应任务行 QA 状态标为：
   - `[✓]` → 审计通过，通知 iv-03 启动
   - `[✗]` → 审计不通过，Worker 须返工，monitor.md 该行 Worker 状态回滚为 `[!]`
3. 串行管道约束：iv-02 PASS 后方可通知 iv-03；FAIL 时 iv-03 不得启动
