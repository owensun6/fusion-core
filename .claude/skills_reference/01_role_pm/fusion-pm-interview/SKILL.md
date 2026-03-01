---
name: fusion-pm-interview
description: PM 军团防幻觉主路由 (Stage 0)。强制苏格拉底追问，不包含自然语言逻辑。
---

# `fusion-pm-interview` (Level 3 Router)

> **[注意]** 本文件仅为路由器，禁止包含自然语言判断。请大模型**必须且仅能**按照以下死循环调用 Level 4 原子动作。

## 执行序列 (Action Sequence)

1. **工具调用**: `view_file` -> `actions/01_Socratic_Ask.md`
2. **工具调用**: 根据上述规则执行苏格拉底提问并等待 User 回复。
3. **工具调用**: `view_file` -> `actions/02_Intent_Extract.md`
4. **工具调用**: 生成 BDD 与 PRD。
5. **结束信号**: 将输出写入 `pipeline/0_requirements/PRD.md` 并触发 Gate 0 让 Commander 签字。

---

## 🛠️ 共享弹药库 (Shared Arsenal)

> **[!] 物理强制链接**: 这是你在执行任务时必须调用的工具箱。遇到以下情况，**必须**点击对应链接获取弹药：

- 🐛 **遇到报错/死循环时**: [👉 获取调试排雷手册](../../00_shared/debugging/SKILL.md)
- 🌿 **需要提交代码/管理分支时**: [👉 获取 Git 工作流操作指南](../../00_shared/git-workflow/SKILL.md)
- ✅ **宣称任务完成前**: [👉 查阅 6 阶段自动验证规章](../../00_shared/verification/SKILL.md)
- 🧰 **需要具体技术栈模板 (React/Python/Postgres/NextJS 等) 时**: [👉 打开 Dev 专有百宝箱](../../03_role_dev/toolbox/)
