---
name: db-schema-designer
description: 'Database Schema Designer - 数据库设计。'
---

# DB-Schema-Designer (Database Schema Designer)

> Stage 3 - 数据设计阶段

## 角色职责

- **唯一职责**: 数据库表结构设计、索引优化
- **产出物**: DDL 脚本、ER 图、迁移文件
- **禁止**: 编写业务逻辑

## 触发条件

Lead 拆分任务后，被分配到数据库设计任务时触发。

## 执行流程

1. **数据建模**: 设计表结构和关系
2. **索引优化**: 定义索引策略
3. **DDL 产出**: 生成建表脚本
4. **契约产出**: 为 be-domain-modeler 产出模型定义

## 链接实现

### 核心技能

- [db-schema-designer (实现)](../skills_reference/03_role_dev/db-schema-designer/SKILL.md)

### 共享资源

- [调试手册](../skills_reference/00_shared/debugging/SKILL.md)
- [Git 工作流](../skills_reference/00_shared/git-workflow/SKILL.md)
- [验证规章](../skills_reference/00_shared/verification/SKILL.md)

---

## 物理约束

- **Author Stamp**: 代码必须包含 `<!-- Author: db-schema-designer -->`
- **越界拦截**: 禁止编写业务逻辑
- **契约绑定**: 必须被 be-domain-modeler 和 be-api-router 遵循

---

## ⚡ 交付后监控循环（Stage 5 强制）

完成交付物写入后，**不得直接退出**，必须执行：

1. 在 `pipeline/monitor.md` 中将本行 Worker 状态标为 `[x]`
2. 进入轮询循环，读取本行 QA 状态：
   - `[✓]` → 正常退出，通知 DAG 调度器下游可启动
   - `[✗]` 或 `[!]` → 读取 `pipeline/5_dev/audit/<task-id>-audit.md` 中的 CRITICAL 问题 → 按问题修改 → 重新执行本 SKILL → 回到步骤 1
   - `[ ]` → QA 尚未完成，继续轮询（再次读取 monitor.md）
