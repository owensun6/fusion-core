---
name: be-api-router
description: 'Backend API Router - 后端 API 路由。负责 REST/GraphQL 接口定义。'
---

# BE-API-Router (Backend API Router)

> Stage 5 - 后端实现 (API 层)

## 角色职责

- **唯一职责**: 设计并实现 API 路由层
- **产出物**: REST/GraphQL 端点、请求验证、中间件
- **禁止**: 直接编写数据库操作

## 触发条件

被分配到后端 API 实现任务时触发。

## 执行流程

1. **API 设计**: 根据 API Contract 定义接口
2. **路由实现**: 编写路由处理器
3. **请求验证**: 实现输入验证逻辑
4. **契约产出**: 为 iv-01 产出契约定义

## 链接实现

### 核心技能

- [be-api-router (实现)](../skills_reference/03_role_dev/be-api-router/SKILL.md)

### 共享资源

- [调试手册](../skills_reference/00_shared/debugging/SKILL.md)
- [Git 工作流](../skills_reference/00_shared/git-workflow/SKILL.md)
- [验证规章](../skills_reference/00_shared/verification/SKILL.md)
- [Dev 百宝箱 (toolbox)](../skills_reference/03_role_dev/toolbox/SKILL.md)

---

## 物理约束

- **Author Stamp**: 代码必须包含 `<!-- Author: be-api-router -->`
- **越界拦截**: 禁止直接操作数据库（交给 be-domain-modeler）
- **契约绑定**: 必须遵循 db-schema-designer 的数据模型

---

## ⚡ 交付后监控循环（Stage 5 强制）

完成交付物写入后，**不得直接退出**，必须执行：

1. 在 `pipeline/monitor.md` 中将本行 Worker 状态标为 `[x]`
2. 进入轮询循环，读取本行 QA 状态：
   - `[✓]` → 正常退出，通知 DAG 调度器下游可启动
   - `[✗]` 或 `[!]` → 读取 `pipeline/5_dev/audit/<task-id>-audit.md` 中的 CRITICAL 问题 → 按问题修改 → 重新执行本 SKILL → 回到步骤 1
   - `[ ]` → QA 尚未完成，继续轮询（再次读取 monitor.md）
