<!-- Author: Lead -->

# SKILL.md Frontmatter Schema 规范

> V4.1 — 每个兵种 SKILL.md 必须包含标准化的 frontmatter 元数据

## 必填字段

| 字段          | 类型   | 说明                                                      |
| ------------- | ------ | --------------------------------------------------------- |
| `name`        | string | 兵种唯一标识，必须与 `MODEL_ROUTING_MATRIX` 中的 key 一致 |
| `description` | string | 一句话描述兵种职责                                        |

## 可选字段（V4.1 新增）

| 字段           | 类型                           | 默认值     | 说明                       |
| -------------- | ------------------------------ | ---------- | -------------------------- |
| `capabilities` | string[]                       | 回退到矩阵 | 能力标签列表，用于动态匹配 |
| `tier`         | `heavy` \| `medium` \| `light` | 回退到矩阵 | 算力层级                   |
| `model`        | `opus` \| `sonnet` \| `haiku`  | 回退到矩阵 | 推荐模型                   |

## 示例

```yaml
---
name: be-api-router
description: 'Backend API Router - 后端 API 路由。负责 REST/GraphQL 接口定义。'
capabilities: ['rest-api', 'graphql', 'route-definition', 'swagger']
tier: medium
model: sonnet
---
```

## 能力标签注册表

以下为当前已注册的能力标签，新增兵种应优先复用已有标签：

| 标签                                                        | 所属域   |
| ----------------------------------------------------------- | -------- |
| `requirements`, `prd`, `bdd`, `user-stories`                | 需求分析 |
| `architecture`, `system-design`, `task-planning`, `adr`     | 架构设计 |
| `database`, `schema`, `migration`, `orm`                    | 数据层   |
| `domain-logic`, `business-rules`, `validation`              | 领域建模 |
| `ai-integration`, `llm`, `prompt-engineering`, `embedding`  | AI 集成  |
| `rest-api`, `graphql`, `route-definition`, `swagger`        | API 路由 |
| `syntax-check`, `code-style`, `linting`                     | 代码审查 |
| `spec-compliance`, `contract-validation`                    | 规范合规 |
| `security-audit`, `owasp`, `vulnerability-scan`             | 安全审计 |
| `e2e-test`, `connectivity`, `playwright`                    | 集成测试 |
| `data-flow`, `serialization`, `cache-invalidation`          | 数据流   |
| `html`, `css`, `react-component`, `ui-layout`               | 前端 UI  |
| `api-binding`, `state-management`, `fetch`, `swr`           | 前端逻辑 |
| `gene-extraction`, `pattern-recognition`, `campaign-review` | 基因提取 |

## 回退机制

当 SKILL.md 缺少 `capabilities` / `tier` / `model` 字段时，`discoverRoles()` 会自动从 `MODEL_ROUTING_MATRIX` 中查找同名兵种的值作为回退。这确保了向后兼容——现有 SKILL.md 无需立即迁移。
