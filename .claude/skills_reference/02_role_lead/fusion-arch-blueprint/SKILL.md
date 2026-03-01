---
name: fusion-arch-blueprint
description: Lead 军团架构图纸枢纽 (Stage 1-4)。负责强制规划系统边界，阻止特种兵无头苍蝇式乱敲代码。
---

# `fusion-arch-blueprint` (Level 3 Router)

> **[注意]** 本节点为核心物理封锁线。没有由我签署的 System Design，后面的 Dev 特种兵全部熔断不予执行。

## 执行序列 (Action Sequence)

1. **输入验证**: 检查是否提取到了合规的 PRD/BDD。如果没有，报错并打回到 `Stage 0`。
2. **工具调用**: `view_file` -> `actions/01_System_Design.md`
3. **工具调用**: `view_file` -> `actions/02_API_Contract.md` (如果是重客户端则强制产出 INTERFACE.md)
4. **工具调用**: `view_file` -> `actions/03_DAG_Concurrency.md` (构建多特种兵并行任务树)
5. **挂载规则**: 所有的设计只能围绕架构范畴，坚决不能包含具体的技术栈业务码 (如 React Component 源码)。
6. **结束信号**: 呼叫 Commander 审批 Gate 1。

---

## 🛠️ 共享弹药库 (Shared Arsenal)

> **[!] 物理强制链接**: 这是你在执行任务时必须调用的工具箱。遇到以下情况，**必须**点击对应链接获取弹药：

- 🐛 **遇到报错/死循环时**: [👉 获取调试排雷手册](../../00_shared/debugging/SKILL.md)
- 🌿 **需要提交代码/管理分支时**: [👉 获取 Git 工作流操作指南](../../00_shared/git-workflow/SKILL.md)
- ✅ **宣称任务完成前**: [👉 查阅 6 阶段自动验证规章](../../00_shared/verification/SKILL.md)
- 🧰 **需要具体技术栈模板 (React/Python/Postgres/NextJS 等) 时**: [👉 打开 Dev 专有百宝箱](../../03_role_dev/toolbox/)
