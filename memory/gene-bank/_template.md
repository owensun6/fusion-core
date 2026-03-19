---
id: <gene-id>
trigger: 'when <触发条件>'
action: 'do <具体行为>'
confidence: 0.5
topic: '<workflow|architecture|code-style|testing|security>'
universality: '<global|conditional>'
project_types: []
# universality 说明:
#   global      → 任何项目/技术栈均适用，直接注入
#   conditional → 仅特定技术栈/行业适用，需按 project_types 过滤
# project_types 说明（conditional 时必填，global 时留空）:
#   示例: ['medical-his', 'spring-boot', 'flutter', 'fastapi', 'vue3']
role_binding: '<兵种ID>'
source: '<session|campaign|import>'
campaign_id: '<战役编号>'
created: 'YYYY-MM-DD'
updated: 'YYYY-MM-DD'
evidence:
  - date: 'YYYY-MM-DD'
    context: '<观察描述>'
---

# <Gene 名称>

## Action

<具体行为描述>

## Evidence

<观察记录列表>
