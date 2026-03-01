---
name: fusion-core
description: 'Fusion-Core 13-Soldier AI Development Framework. Use this when working with the Fusion workflow system.'
---

# Fusion-Core Skills System

> 13 兵种技能体系 - 物理化角色路由器

## 架构说明

本技能系统采用**双层结构**：

```
.claude/
├── skills/           # 角色入口 (本目录)
│   ├── pm/           → 需求分析
│   ├── lead/         → 架构规划
│   ├── fe-ui-builder/    → 前端 UI
│   └── ...
└── skills_reference/    # 技能实现
    ├── 01_role_pm/
    ├── 02_role_lead/
    └── ...
```

**使用方式**：

1. 通过 `/fusion-router` 分发任务到指定角色
2. 角色对应的 `SKILL.md` 会链接到具体的 `skills_reference/` 实现
3. 职责边界由物理路由器强制校验

---

## 13 兵种技能树

| 阶段        | 角色 | 技能目录                                                    | 职责               |
| ----------- | ---- | ----------------------------------------------------------- | ------------------ |
| **Stage 0** | PM   | `pm/`                                                       | 需求分析、PRD 产出 |
| **Stage 1** | Lead | `lead/`                                                     | 架构设计、技术选型 |
| **Stage 3** | FE   | `fe-ui-builder/`, `fe-logic-binder/`                        | 前端 UI/逻辑       |
| **Stage 3** | BE   | `be-api-router/`, `be-domain-modeler/`, `be-ai-integrator/` | 后端服务           |
| **Stage 3** | DB   | `db-schema-designer/`                                       | 数据库设计         |
| **Stage 5** | QA   | `qa-01/`, `qa-02/`, `qa-03/`                                | 测试验证           |
| **Stage 6** | IV   | `iv-01/`, `iv-02/`                                          | 集成验证           |

---

## 技能索引

### 管理角色

- [`pm/`](pm/SKILL.md) - Product Manager
- [`lead/`](lead/SKILL.md) - Tech Lead

### 前端兵种

- [`fe-ui-builder/`](fe-ui-builder/SKILL.md) - UI 构建
- [`fe-logic-binder/`](fe-logic-binder/SKILL.md) - 逻辑绑定

### 后端兵种

- [`be-api-router/`](be-api-router/SKILL.md) - API 路由
- [`be-domain-modeler/`](be-domain-modeler/SKILL.md) - 领域建模
- [`be-ai-integrator/`](be-ai-integrator/SKILL.md) - AI 集成

### 数据兵种

- [`db-schema-designer/`](db-schema-designer/SKILL.md) - 数据库设计

### 质量兵种

- [`qa-01/`](qa-01/SKILL.md) - 代码语法检查
- [`qa-02/`](qa-02/SKILL.md) - 规范合规检查
- [`qa-03/`](qa-03/SKILL.md) - 安全审计

### 集成兵种

- [`iv-01/`](iv-01/SKILL.md) - 契约匹配
- [`iv-02/`](iv-02/SKILL.md) - 数据流追踪

---

## 共享资源

### 调试与验证

- [调试手册](../skills_reference/00_shared/debugging/SKILL.md)
- [Git 工作流](../skills_reference/00_shared/git-workflow/SKILL.md)
- [验证规章](../skills_reference/00_shared/verification/SKILL.md)

### 开发工具箱

- [Dev 百宝箱](../skills_reference/03_role_dev/toolbox/SKILL.md)

---

## 触发方式

### 方式 1: CLI 路由（推荐）

```bash
npx fusion-router --role pm --task pipeline/0_requirements/PRD.md
npx fusion-router --role fe-ui-builder --task pipeline/2_planning/task.md
```

### 方式 2: 斜杠命令

```
/fusion-router --role <role_name> --task <task_file>
```

### 方式 3: 直接调用

```markdown
Use the `fe-ui-builder` skill to implement the UI components.
```
