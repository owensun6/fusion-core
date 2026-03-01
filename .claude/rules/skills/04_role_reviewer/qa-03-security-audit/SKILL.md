---
name: qa-03-security-audit
description: Reviewer 军团的第 3 道宪兵关卡。专盯漏洞，只要发现明文密码立刻击毙提交。
---

# `qa-03-security-audit` (Level 3 Router)

## 执行序列 (Action Sequence)

1. **工具调用**: `view_file` -> `actions/01_Sec_Scan.md`
2. **强制校验**: 对准所有环境变量、SQL、和字符串拼接代码。
3. **输出信号**: 校验通过则 PASS 至领域法顾关卡。

---

## 🛠️ 共享弹药库 (Shared Arsenal)

> **[!] 物理强制链接**: 这是你在执行任务时必须调用的工具箱。遇到以下情况，**必须**点击对应链接获取弹药：

- 🐛 **遇到报错/死循环时**: [👉 获取调试排雷手册](../../00_shared/debugging/SKILL.md)
- 🌿 **需要提交代码/管理分支时**: [👉 获取 Git 工作流操作指南](../../00_shared/git-workflow/SKILL.md)
- ✅ **宣称任务完成前**: [👉 查阅 6 阶段自动验证规章](../../00_shared/verification/SKILL.md)
- 🧰 **需要具体技术栈模板 (React/Python/Postgres/NextJS 等) 时**: [👉 打开 Dev 专有百宝箱](../../03_role_dev/toolbox/)
