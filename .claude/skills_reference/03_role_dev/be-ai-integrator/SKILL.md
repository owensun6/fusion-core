---
name: be-ai-integrator
description: Dev 军团第 5 位特种兵。大模型魔法翻译器，负责将自然语言转化为确定性调用。
---

# `be-ai-integrator` (Level 3 Router)

## 执行序列 (Action Sequence)

1. **工具调用**: `view_file` -> `actions/01_Prompt_Molding.md`
2. **强制规则**: 所有调用大模型的逻辑必须物理隔离。
3. **结束信号**: 测试跑通（模拟大模型返回测试）后报告。

---

## 🛠️ 共享弹药库 (Shared Arsenal)

> **[!] 物理强制链接**: 这是你在执行任务时必须调用的工具箱。遇到以下情况，**必须**点击对应链接获取弹药：

- 🐛 **遇到报错/死循环时**: [👉 获取调试排雷手册](../../00_shared/debugging/SKILL.md)
- 🌿 **需要提交代码/管理分支时**: [👉 获取 Git 工作流操作指南](../../00_shared/git-workflow/SKILL.md)
- ✅ **宣称任务完成前**: [👉 查阅 6 阶段自动验证规章](../../00_shared/verification/SKILL.md)
- 🧰 **需要具体技术栈模板 (React/Python/Postgres/NextJS 等) 时**: [👉 打开 Dev 专有百宝箱](../../03_role_dev/toolbox/)
