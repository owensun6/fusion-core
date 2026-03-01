---
name: fusion-tdd-engine
description: Dev 军团的 TDD 强制驱使引擎。挂载所有 6 名底层焊工必须遵守的红绿重构铁血法则。
---

# `fusion-tdd-engine` (Level 3 Router)

> **[注意]** 本路由器连接着 `.claude/hooks/pre-commit` 物理锁。任何逃避红绿灯法则的提交都将被拒绝。

## 执行序列 (Action Sequence)

1. **工具调用**: `view_file` -> `actions/01_Red_Fail_Test.md`
2. **动作约束**: 你必须先写失败的测试测试！并执行运行拿到红色的 Fail Log。
3. **工具调用**: `view_file` -> `actions/02_Green_Minimum.md`
4. **动作约束**: 你被允许写能让测试通过的最少生产代码。如果不绿，退回上一步。
5. **挂载规则**: 无论你呼叫 `fe-ui-builder` 还是 `be-domain-modeler`，以上的步骤是包裹在他们外围的绝对域。

---

## 🛠️ 共享弹药库 (Shared Arsenal)

> **[!] 物理强制链接**: 这是你在执行任务时必须调用的工具箱。遇到以下情况，**必须**点击对应链接获取弹药：

- 🐛 **遇到报错/死循环时**: [👉 获取调试排雷手册](../../00_shared/debugging/SKILL.md)
- 🌿 **需要提交代码/管理分支时**: [👉 获取 Git 工作流操作指南](../../00_shared/git-workflow/SKILL.md)
- ✅ **宣称任务完成前**: [👉 查阅 6 阶段自动验证规章](../../00_shared/verification/SKILL.md)
- 🧰 **需要具体技术栈模板 (React/Python/Postgres/NextJS 等) 时**: [👉 打开 Dev 专有百宝箱](../../03_role_dev/toolbox/)
