# Fusion Git 工作流 (Git Workflow)

> 关联 Agent: 所有特种兵

本技能提供 Fusion Core 统一的版本控制流程，结合了 GitHub Flow 与传统 Git Flow 的精华。

## 1. 核心流程 (Workflow)

### 1.1 检查当前状态

```bash
git status
git branch -a
git log --oneline -5
```

### 1.2 操作矩阵

| 场景           | 执行流程                                                        |
| :------------- | :-------------------------------------------------------------- |
| **开启新任务** | `git checkout main && git pull` → `git checkout -b feature/xxx` |
| **代码提交**   | `git add .` → `git commit -m "feat/fix: xxx"`                   |
| **合并主分支** | `git fetch origin` → `git rebase origin/main`                   |
| **发起评审**   | `git push -u origin feature/xxx` → `gh pr create --fill`        |

---

## 2. 提交规范 (Conventional Commits)

所有提交必须遵循以下格式：`<type>(<scope>): <subject>`

| 类型         | 说明     | 示例                                 |
| :----------- | :------- | :----------------------------------- |
| **feat**     | 新功能   | `feat(api): add auth guard`          |
| **fix**      | Bug 修复 | `fix(ui): resolve button overflow`   |
| **docs**     | 文档更新 | `docs(readme): update install guide` |
| **refactor** | 重构     | `refactor(db): optimize query logic` |
| **test**     | 测试代码 | `test(user): add unit tests`         |

---

## 3. 分支命名 (Branch Naming)

- `feature/name` - 新功能
- `fix/name` - Bug 修复
- `hotfix/name` - 紧急修复
- `refactor/name` - 代码重构

---

## 4. 冲突解决 (Conflict Resolution)

1. **Rebase 第一原则**：尽量使用 `rebase` 保持历史线整洁。
2. **解决步骤**：
   - 查看冲突文件：`git status`
   - 手动处理标记：`<<<<<<< HEAD` ... `=======` ... `>>>>>>>`
   - 标记解决：`git add <file>`
   - 继续 Rebase：`git rebase --continue`

---

## 5. GitHub CLI (gh) 增强

- 查看待处理 PR: `gh pr list`
- 查看 PR 详情: `gh pr view [number]`
- 快速创建 PR: `gh pr create --title "..." --body "..."`
