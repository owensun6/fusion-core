<!-- Author: lead -->
<!-- 此标签严格遵守 Fusion-Core 防伪标记，修改文件后请保留 -->

# 任务切分与执行看板 (Task & Execution Board)

> 本工程图必须遵循 DAG (有向无环图) 进行任务切分，明确依赖关系与目标物理兵种。

## 0. 基建核心 (Infrastructure Core)

- [ ] **Task 0.1**: 初始化数据库表结构映射 (Prisma Schema)
  - **Assignee**: `db-schema-designer`
  - **Dependencies**: 无
- [ ] **Task 0.2**: 搭建基础 API 路由与入参校验拦截层 (Zod)
  - **Assignee**: `be-api-router`
  - **Dependencies**: 无

## 1. 领域引擎层 (Domain Engine Layer)

- [ ] **Task 1.1**: 实现用户与权限的核心领域服务 (Domain Service)
  - **Assignee**: `be-domain-modeler`
  - **Dependencies**: Task 0.1

## 2. 前置展示层 (Presentation Layer)

- [ ] **Task 2.1**: 根据 Figma 切图，编写纯静态无逻辑哑 UI 组件 (Dumb Components)
  - **Assignee**: `fe-ui-builder`
  - **Dependencies**: 无 (可并行)
- [ ] **Task 2.2**: 绑定前端状态钩子与 API 请求层 (State & Hooks)
  - **Assignee**: `fe-logic-binder`
  - **Dependencies**: Task 2.1, Task 0.2

## 3. 防线与封版验收 (Review & Sign-Off)

- [ ] **Task 3.1**: 执行后置单元测试审查与性能诊断
  - **Assignee**: `qa-01`, `qa-02`
  - **Dependencies**: Task 1.1, Task 2.2

## V3 修复验证 (2026-03-01)

- [x] **Task V3.1**: TDD 自愈引擎增加 `analyzeTestOutput` + `buildFixGuidance` 分析能力
  - **文件**: `.claude/scripts/fusion-tdd-fixer.js`
  - **验证**: 78 个单元测试全绿，`--analyze-only` 输出结构化 JSON
- [x] **Task V3.2**: VLM 截图脚本安全修复 — 去掉临时文件注入，改用 Playwright API 直调 + URL 校验
  - **文件**: `.claude/skills/iv-01/vlm-screenshot.js`
  - **验证**: `validateUrl` 拒绝非 http/https 协议
- [x] **Task V3.3**: VLM 验收判定 — 新增 15 个测试覆盖 `parseVlmResult`, `buildReport`, 阈值边界值
  - **文件**: `.claude/skills/iv-01/vlm-acceptance.js`, `tests/vlm-acceptance.test.js`
  - **验证**: 89/90/91 边界测试全绿
- [x] **Task V3.4**: 模型路由重构为共享模块 `lib/model-routing.js`，Router 通过 `--model` 传参
  - **文件**: `lib/model-routing.js`, `bin/fusion-core-router.js`, `.claude/hooks/pre-tool-use.js`
  - **验证**: `getRoute('pm')` → `{"model":"opus",...}`, 模块 100% 覆盖
- [x] **Task V3.5**: 编写真正测试 — 4 个测试文件，78 个测试用例，`lib/model-routing.js` 100% 覆盖
  - **验证**: `npm test` 全绿
- [x] **Task V3.6**: 更新本看板，标记 V3 修复任务完成
