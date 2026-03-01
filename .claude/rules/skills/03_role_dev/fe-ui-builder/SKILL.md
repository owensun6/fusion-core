---
name: fe-ui-builder
description: Dev 军团的第一名微粒兵种。唯一的职责就是将图纸转化为瞎子都能看清的 Tailwind 色块，绝不碰 API。
---

# `fe-ui-builder` (Level 3 Router)

## 执行序列 (Action Sequence)

1. **工具调用**: `view_file` -> `actions/01_Tailwind_WCAG.md`
2. **工具调用**: 根据上述规则执行前端静态 UI 的编写。
3. **挂载规则**: 必须引入上一层的 TDD 包裹，任何改动必须先出组件的渲染 Snapshots 测试。

---

## 🛠️ 共享弹药库 (Shared Arsenal)

> **[!] 物理强制链接**: 这是你在执行任务时必须调用的工具箱。遇到以下情况，**必须**点击对应链接获取弹药：

- 🐛 **遇到报错/死循环时**: [👉 获取调试排雷手册](../../00_shared/debugging/SKILL.md)
- 🌿 **需要提交代码/管理分支时**: [👉 获取 Git 工作流操作指南](../../00_shared/git-workflow/SKILL.md)
- ✅ **宣称任务完成前**: [👉 查阅 6 阶段自动验证规章](../../00_shared/verification/SKILL.md)
- 🧰 **需要具体技术栈模板 (React/Python/Postgres/NextJS 等) 时**: [👉 打开 Dev 专有百宝箱](../../03_role_dev/toolbox/)
