# Fusion-Core 13 兵种技能清单

> 按分工阶段排序，展示每个兵种的职责、技能和状态

---

## Stage 0: 需求分析

### PM (Product Manager)

| 项目         | 内容                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------- |
| **角色代号** | `pm`                                                                                         |
| **职责**     | 需求分析、PRD 产出、BDD 场景定义                                                             |
| **产出物**   | `pipeline/0_requirements/PRD.md`                                                             |
| **技能**     | `fusion-pm-interview` (防幻觉路由器), `brainstorming` (头脑风暴)                             |
| **规则文件** | [`01_role_pm/fusion-pm-interview/`](../rules/skills/01_role_pm/fusion-pm-interview/SKILL.md) |
| **状态**     | ✅ 完整                                                                                      |

---

## Stage 1: 架构设计

### Lead (Tech Lead)

| 项目         | 内容                                                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| **角色代号** | `lead`                                                                                                          |
| **职责**     | 系统架构设计、技术选型、任务拆分                                                                                |
| **产出物**   | `pipeline/1_architecture/System_Design.md`, `pipeline/2_planning/task.md`                                       |
| **技能**     | `fusion-arch-blueprint` (架构蓝图), `fusion-dag-builder` (DAG构建), `planning`, `worktree`, `parallel-dispatch` |
| **规则文件** | [`02_role_lead/`](../rules/skills/02_role_lead/)                                                                |
| **状态**     | ✅ 完整                                                                                                         |

---

## Stage 3: 任务执行 (并行)

### 前端兵种

#### FE-UI-Builder

| 项目         | 内容                                                                               |
| ------------ | ---------------------------------------------------------------------------------- |
| **角色代号** | `fe-ui-builder`                                                                    |
| **职责**     | UI 组件构建、Tailwind 样式实现                                                     |
| **产出物**   | React/Vue 组件、样式文件                                                           |
| **禁止**     | 调用 API、编写业务逻辑                                                             |
| **规则文件** | [`03_role_dev/fe-ui-builder/`](../rules/skills/03_role_dev/fe-ui-builder/SKILL.md) |
| **状态**     | ✅ 完整                                                                            |

#### FE-Logic-Binder

| 项目         | 内容                                                                                   |
| ------------ | -------------------------------------------------------------------------------------- |
| **角色代号** | `fe-logic-binder`                                                                      |
| **职责**     | 业务逻辑绑定、API 调用、状态管理                                                       |
| **产出物**   | 业务组件、API 层、状态管理代码                                                         |
| **禁止**     | 独立编写 UI 样式                                                                       |
| **规则文件** | [`03_role_dev/fe-logic-binder/`](../rules/skills/03_role_dev/fe-logic-binder/SKILL.md) |
| **状态**     | ✅ 完整                                                                                |

---

### 后端兵种

#### BE-API-Router

| 项目         | 内容                                                                               |
| ------------ | ---------------------------------------------------------------------------------- |
| **角色代号** | `be-api-router`                                                                    |
| **职责**     | REST/GraphQL API 路由定义、请求验证                                                |
| **产出物**   | API 端点、中间件、验证逻辑                                                         |
| **禁止**     | 直接操作数据库                                                                     |
| **规则文件** | [`03_role_dev/be-api-router/`](../rules/skills/03_role_dev/be-api-router/SKILL.md) |
| **状态**     | ✅ 完整                                                                            |

#### BE-Domain-Modeler

| 项目         | 内容                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------ |
| **角色代号** | `be-domain-modeler`                                                                        |
| **职责**     | 业务逻辑、领域模型、实体定义                                                               |
| **产出物**   | Service 层、Entity 类、业务规则                                                            |
| **禁止**     | 编写数据库表结构                                                                           |
| **规则文件** | [`03_role_dev/be-domain-modeler/`](../rules/skills/03_role_dev/be-domain-modeler/SKILL.md) |
| **状态**     | ✅ 完整                                                                                    |

#### BE-AI-Integrator

| 项目         | 内容                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------- |
| **角色代号** | `be-ai-integrator`                                                                       |
| **职责**     | AI 能力集成（LLM、OCR、向量搜索）                                                        |
| **产出物**   | AI 服务封装、Prompt 工程                                                                 |
| **禁止**     | 直接编写 UI                                                                              |
| **规则文件** | [`03_role_dev/be-ai-integrator/`](../rules/skills/03_role_dev/be-ai-integrator/SKILL.md) |
| **状态**     | ✅ 完整                                                                                  |

---

### 数据兵种

#### DB-Schema-Designer

| 项目         | 内容                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------- |
| **角色代号** | `db-schema-designer`                                                                         |
| **职责**     | 数据库表结构设计、索引优化                                                                   |
| **产出物**   | DDL 脚本、ER 图、迁移文件                                                                    |
| **禁止**     | 编写业务逻辑                                                                                 |
| **规则文件** | [`03_role_dev/db-schema-designer/`](../rules/skills/03_role_dev/db-schema-designer/SKILL.md) |
| **状态**     | ✅ 完整                                                                                      |

---

## Stage 6: 质量验证

### QA 兵种

#### QA-01 (Code Syntax)

| 项目         | 内容                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| **角色代号** | `qa-01`                                                                                              |
| **职责**     | 代码语法检查、类型检查、格式化                                                                       |
| **工具**     | ESLint, TypeScript, Prettier                                                                         |
| **规则文件** | [`04_role_reviewer/qa-01-code-syntax/`](../rules/skills/04_role_reviewer/qa-01-code-syntax/SKILL.md) |
| **状态**     | ✅ 完整                                                                                              |

#### QA-02 (Spec Compliance)

| 项目         | 内容                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| **角色代号** | `qa-02`                                                                                                      |
| **职责**     | 架构规范检查、编码标准核对                                                                                   |
| **规则文件** | [`04_role_reviewer/qa-02-spec-compliance/`](../rules/skills/04_role_reviewer/qa-02-spec-compliance/SKILL.md) |
| **状态**     | ✅ 完整                                                                                                      |

#### QA-03 (Security Audit)

| 项目         | 内容                                                                                                                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **角色代号** | `qa-03`                                                                                                                                                                                 |
| **职责**     | 安全漏洞扫描、OWASP Top 10                                                                                                                                                              |
| **规则文件** | [`04_role_reviewer/qa-03-security-audit/`](../rules/skills/04_role_reviewer/qa-03-security-audit/SKILL.md), [`security-deep/`](../rules/skills/04_role_reviewer/security-deep/SKILL.md) |
| **状态**     | ✅ 完整                                                                                                                                                                                 |

---

### IV 集成验证兵种

#### IV-01 (Contract Matcher)

| 项目         | 内容                                                                                                           |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| **角色代号** | `iv-01`                                                                                                        |
| **职责**     | API 契约匹配验证                                                                                               |
| **规则文件** | [`04_role_reviewer/iv-01-contract-matcher/`](../rules/skills/04_role_reviewer/iv-01-contract-matcher/SKILL.md) |
| **状态**     | ✅ 完整                                                                                                        |

#### IV-02 (Dataflow Tracer)

| 项目         | 内容                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| **角色代号** | `iv-02`                                                                                                      |
| **职责**     | 端到端数据流追踪                                                                                             |
| **规则文件** | [`04_role_reviewer/iv-02-dataflow-tracer/`](../rules/skills/04_role_reviewer/iv-02-dataflow-tracer/SKILL.md) |
| **状态**     | ✅ 完整                                                                                                      |

---

## 技能状态总览

| 阶段    | 角色               | 代码                 | 状态 |
| ------- | ------------------ | -------------------- | ---- |
| Stage 0 | PM                 | `pm`                 | ✅   |
| Stage 1 | Lead               | `lead`               | ✅   |
| Stage 3 | FE-UI-Builder      | `fe-ui-builder`      | ✅   |
| Stage 3 | FE-Logic-Binder    | `fe-logic-binder`    | ✅   |
| Stage 3 | BE-API-Router      | `be-api-router`      | ✅   |
| Stage 3 | BE-Domain-Modeler  | `be-domain-modeler`  | ✅   |
| Stage 3 | BE-AI-Integrator   | `be-ai-integrator`   | ✅   |
| Stage 3 | DB-Schema-Designer | `db-schema-designer` | ✅   |
| Stage 6 | QA-01              | `qa-01`              | ✅   |
| Stage 6 | QA-02              | `qa-02`              | ✅   |
| Stage 6 | QA-03              | `qa-03`              | ✅   |
| Stage 6 | IV-01              | `iv-01`              | ✅   |
| Stage 6 | IV-02              | `iv-02`              | ✅   |

**13/13 兵种全部完整** ✅

---

## 共享资源

| 资源       | 位置                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------ |
| 调试手册   | [`00_shared/debugging/`](../rules/skills/00_shared/debugging/SKILL.md)                     |
| Git 工作流 | [`00_shared/git-workflow/`](../rules/skills/00_shared/git-workflow/SKILL.md)               |
| 验证规章   | [`00_shared/verification/`](../rules/skills/00_shared/verification/SKILL.md)               |
| Dev 百宝箱 | [`03_role_dev/toolbox/`](../rules/skills/03_role_dev/toolbox/SKILL.md)                     |
| TDD 引擎   | [`03_role_dev/fusion-tdd-engine/`](../rules/skills/03_role_dev/fusion-tdd-engine/SKILL.md) |

---

## 使用方式

### CLI 路由

```bash
npx fusion-router --role pm --task pipeline/0_requirements/PRD.md
npx fusion-router --role fe-ui-builder --task pipeline/2_planning/task.md
```

### 斜杠命令

```
/fusion-router --role <role> --task <task_file>
```
