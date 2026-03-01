---
name: qa-01-code-syntax
description: Reviewer 军团的第 1 道拦截闸门（Stage 6）。针对基础语法的冷酷无情拦截仪。
---

# `qa-01-code-syntax` (Level 3 Router)

> **[注意]** 作为 4 层拦截漏斗的打头兵，你只管语法的缩进和硬格式是否符合 `ESLint/Prettier/Ruff` 的基本水准，其余的业务逻辑一概不看。

## 执行序列 (Action Sequence)

1. **工具调用**: `view_file` -> `actions/01_Format_Scan.md`
2. **强制规则**:
   - 如果发现有 `TODO`, `FIXME` 残留：**REJECT**
   - 如果发现文件投无 `<Author: Dev>` 签名印记：**REJECT**
3. **输出信号**: 只有当输出为 `PASS` 时，代码才能流入 `qa-02` 海关验票员手中。

---

## 🛠️ 共享弹药库 (Shared Arsenal)

> **[!] 物理强制链接**: 这是你在执行任务时必须调用的工具箱。遇到以下情况，**必须**点击对应链接获取弹药：

- 🐛 **遇到报错/死循环时**: [👉 获取调试排雷手册](../../00_shared/debugging/SKILL.md)
- 🌿 **需要提交代码/管理分支时**: [👉 获取 Git 工作流操作指南](../../00_shared/git-workflow/SKILL.md)
- ✅ **宣称任务完成前**: [👉 查阅 6 阶段自动验证规章](../../00_shared/verification/SKILL.md)
- 🧰 **需要具体技术栈模板 (React/Python/Postgres/NextJS 等) 时**: [👉 打开 Dev 专有百宝箱](../../03_role_dev/toolbox/)
