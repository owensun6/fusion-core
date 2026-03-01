# Fusion-Core v3.x 专家成果验收测试标准 (Acceptance Criteria)

> 本文档由 Commander 和 Lead 共同定义，用于在 Stage 6 (集成验收) 或单独测试时，黑盒验证各兵种提交的 v3.x 核心功能是否达标。

---

## 验收模块 1：TDD 自修复回环 (Auto-Heal Engine)

**被验收兵种**: `Dev`群组 (如 `fe-logic-binder`)

### 🟢 测试用例 1.1：类型错误拦截与自修复

1. **测试前置 (Setup)**：
   - 故意向 `src/` 中放入一个含有 TypeScript `Type Mismatch` 的受损文件 (例如传入 `string` 到一个需要 `number` 的组件)。
   - `monitor.md` 处于 `Stage 5` 状态。
2. **执行动作 (Action)**：
   - 触发自动化测试命令 `/fusion-tdd`。
3. **预期表现 (Expected Output)**：
   - [ ] 控制台必须爆红，但**脚本不能立即退出报错还给人类**。
   - [ ] 系统必须**自动生成** `pipeline/3_review/Auto_Heal_Log.json` 并记录该类型错误及对应行号。
   - [ ] 必须观察到系统**自动切出（Spawn）**了一个修复用 `Dev` 兵种读取日志。
   - [ ] 最终测试重新运行应为**绿灯通过**。

### 🔴 测试用例 1.2：防死循环断路器 (Panic Threshold)

1. **测试前置 (Setup)**：
   - 向 `src/` 放入一个根本无法修复的逻辑死结（例如缺少关键的三方库依赖）。
2. **执行动作 (Action)**：
   - 触发 `/fusion-tdd`。
3. **预期表现 (Expected Output)**：
   - [ ] 引擎触发自修复循环。
   - [ ] 在正好第 3 次尝试失败后，必须**强制阻断 (Halt)**。
   - [ ] 自动生成 `pipeline/3_review/Panic_Report.md` 并要求 Commander 介入。

---

## 验收模块 2：视觉造影 VLM 验收 (Visual VLM)

**被验收兵种**: `IV`群组 (如 `iv-01`)

### 🟢 测试用例 2.1：高保真原型比对

1. **测试前置 (Setup)**：
   - 在 `pipeline/1_5_prototype/UI_Mockups/` 中放入一张包含特定蓝色的按钮。
   - 在网页上实现一个 100% 同款蓝色、同尺寸的按钮组件。
2. **执行动作 (Action)**：
   - 系统流动至 Gate 1.5a（或手动触发对比命令 `npx fusion-vlm-check`）。
3. **预期表现 (Expected Output)**：
   - [ ] Playwright 必须成功抓取网页截图并保存为 `screenshot_current.png`。
   - [ ] 自动在 `pipeline/1_5_prototype/VLM_Report.md` 打印带有高置信度（如 95 分以上）的绿灯评价。
   - [ ] `monitor.md` 自动给 Gate 1.5a 打上 `✅` 记号。

### 🔴 测试用例 2.2：颜色或排版越权变异 (Hard Reject)

1. **测试前置 (Setup)**：
   - 故意将网页代码中的按钮颜色由蓝色改为**红色**（或者将按钮向右偏离原型 50 像素）。
2. **执行动作 (Action)**：
   - 触发 VLM 对比命令。
3. **预期表现 (Expected Output)**：
   - [ ] `VLM_Report.md` 必须严厉指出“颜色/布局不一致”。
   - [ ] 检查评级必须低于 90，且 `monitor.md` 标记 `Gate 1.5a` 为 `❌` 并打回给 `fe-ui-builder`。

---

## 验收模块 3：动态成本路由 (Cost-Aware Routing)

**被验收兵种**: `Core` 架构组

### 🟢 测试用例 3.1：角色智能降级

1. **测试前置 (Setup)**：
   - 系统全局采用顶级大模型 (如 Claude-3.5-Sonnet) 运行。
2. **执行动作 (Action)**：
   - 当 `monitor.md` 达到 Stage 5，且 `fusion-router` 收到发给体力活兵种（如 `fe-ui-builder` 这个专做 CSS 的兵种）的调度命令。
3. **预期表现 (Expected Output)**：
   - [ ] 命令行中必须打印出高亮警告信息："自动路由至低成本 Haiku 模型执行切图任务"。
   - [ ] 检查背后的 `API 请求体`，`model` 字段必须被降维成低成本型号。
   - [ ] 相对应的，当路由给 `pm` 或 `lead` 时，必须依然是全尺寸高端模型应对第一性原理级别的深度思考。
