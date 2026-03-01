---
name: qa-04-domain-logic
description: Reviewer 军团的第 4 道医疗法务关卡（深水区）。
---

# `qa-04-domain-logic` (Level 3 Router)

## 执行序列 (Action Sequence)

1. **工具调用**: `view_file` -> `actions/01_Biz_Rules.md`
2. **强制校验**: 参照 Stage 0 的 BDD。
3. **输出信号**: 校验通过则 PASS 允许进入边缘拼接测试。

---

## 🛠️ 共享弹药库 (Shared Arsenal)

> **[!] 物理强制链接**: 这是你在执行任务时必须调用的工具箱。遇到以下情况，**必须**点击对应链接获取弹药：

- 🐛 **遇到报错/死循环时**: [👉 获取调试排雷手册](../../00_shared/debugging/SKILL.md)
- 🌿 **需要提交代码/管理分支时**: [👉 获取 Git 工作流操作指南](../../00_shared/git-workflow/SKILL.md)
- ✅ **宣称任务完成前**: [👉 查阅 6 阶段自动验证规章](../../00_shared/verification/SKILL.md)
- 🧰 **需要具体技术栈模板 (React/Python/Postgres/NextJS 等) 时**: [👉 打开 Dev 专有百宝箱](../../03_role_dev/toolbox/)
