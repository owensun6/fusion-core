# Fusion-Core V3 协议：视觉造影验收 (VLM Acceptance Protocol)

> **目标受众**: 负责实现 `iv-01` 兵种或系统集成验证模块的专家。

## 1. 协议目标

用 Playwright 截取无头浏览器页面，交由 Vision Language Model (如 Claude-3.5-Sonnet 视觉模式) 与 Stage 1.5 产出的 `UI_Mockups/` (原型图或设计规范) 进行像素级还原度对比。

## 2. 交互流

在到达 **Gate 1.5a** (或在 Stage 6 集成验收阶段) 时，必须触发 VLM 检查机制。

### 阶段一步骤 (截图挂载)

启动 Playwright，自动寻路至新开发的页面，生成 `screenshot_current.png`。

### 阶段二步骤 (对比分析)

将以下材料投递给 `VLM API`：

- 当前页面的全尺寸截图：`screenshot_current.png`
- 最初的架构设计图要求：`pipeline/1_5_prototype/UI_Mockups/*`
- 提示词必须包括硬性检查清单：
  - [ ] 间距与排版结构是否完全一致？
  - [ ] 颜色体系 (Brand Colors) 是否按要求映射？
  - [ ] 是否有明显的 DOM 错位、溢出或重叠？
  - [ ] 表单与按钮位置是否符合交互原点？

### 阶段三步骤 (输出报告)

生成并覆盖 `pipeline/1_5_prototype/VLM_Report.md`。

- 如果分数低于 90 分：标记 `iv-01` 不通过，红灯驳回给前端开发群组。
- 如果分数达到 90 分以上：打分亮绿灯，将 `monitor.md` 中的 `Gate 1.5a` 标记为 `✅ 已通过`。
