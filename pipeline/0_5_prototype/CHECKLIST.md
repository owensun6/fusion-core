<!-- Author: UX-Designer -->

# Stage 0.5: 低保真原型 — 原子级 Checklist

> **执行角色**: UX Designer
> **规范参考**: `.claude/rules/atomic-checklist-standard.md`
> **Gate**: Gate 0.5 (Commander 说出"这就是我想要的"方可通过)
> **触发条件**: 包含 UI 或重客户端交互的项目。纯后端/CLI/API 项目由 Commander 标记 SKIP。
> **核心原则**: 原型定义用户体验，架构服务于已确认的体验。不是技术能做什么 → 体验来迁就。

---

## Phase A: 环境与输入验证 (Environment & Input Verification)

- [ ] 0.5.1 确认 Gate 0 已通过: 检查 `pipeline/monitor.md` 中 Stage 0 状态为 ✅
- [ ] 0.5.2 确认 Stitch MCP 可用: 检查当前环境中 Stitch MCP 是否已配置并可连接。若不可用 → 通知 Commander 协助安装，**不可跳过**
- [ ] 0.5.3 读取必读三件: PRD.md + FEATURE_LIST.md + BDD_Scenarios.md → 确认理解无误
- [ ] 0.5.4 提取用户角色清单: 从 PRD 中列出所有用户角色 → 输出：角色清单 (带简述)
- [ ] 0.5.5 提取功能点清单: 从 FEATURE_LIST.md 中列出所有 F-ID → 输出：待设计功能点清单

---

## Phase B: 用户流程设计 (User Flow Design)

> 先画"用户怎么走"，再画"每一步看到什么"

- [ ] 0.5.6 逐角色绘制核心路径: 每个用户角色的主要操作流程 (Happy Path) → 输出：User_Flow.md 中的正常流
- [ ] 0.5.7 逐角色补充异常路径: 从 BDD 异常流中提取用户可感知的错误场景 → 输出：User_Flow.md 中的异常流
- [ ] 0.5.8 标注决策节点: 在流程中标出用户需要做选择的节点 (分支) → 输出：决策点清单

### Phase B 自检

```
- [ ] 每个用户角色至少有 1 条完整的核心路径
- [ ] 每个核心路径至少有 1 条异常分支
- [ ] 所有 BDD 的 Scenario 都能在 User_Flow 中找到对应路径
- [ ] 无孤立节点 (每个节点都有入口和出口)
```

---

## Phase C: 线框图绘制 — Stitch MCP 驱动 (Wireframe Design via Stitch)

> 每一步用户"看到什么"。初稿由 Stitch MCP 生成，人工审查调整。

- [ ] 0.5.9 列出所有屏幕/页面: 从 User_Flow 中提取所有需要展示的界面 → 输出：屏幕清单 (编号 + 一句话功能描述)
- [ ] 0.5.10 编写 Stitch Prompt: 为每个屏幕编写设计 prompt (包含：屏幕用途、用户角色、核心操作、信息层级) → 输出：`Wireframes/stitch-prompts.md`
- [ ] 0.5.11 Stitch MCP 批量生成: 将 prompt 逐屏提交 Stitch MCP 生成初始设计 → 输出：原始结果存入 `Wireframes/stitch-raw/`
- [ ] 0.5.12 人工审查与调整: 逐屏审查 Stitch 生成结果，标注需调整项 (布局/文案/交互区域)
  - 如需微调：通过 Stitch MCP 对话式迭代
  - 审查通过的版本存入 `Wireframes/` (最终版目录)
- [ ] 0.5.13 逐屏标注: 每张最终线框图标注：屏幕名称、用户可操作区域 (按钮/输入框/链接)、操作后的跳转目标
- [ ] 0.5.14 标注信息层级: 每张线框图中标注信息优先级 (什么最重要、什么次要)
- [ ] 0.5.15 标注空状态/加载态: 列表为空时显示什么？数据加载中显示什么？ → 输出：空态/加载态线框

### Phase C 自检

```
- [ ] User_Flow 中的每个节点都有对应的线框图
- [ ] 所有线框图初稿由 Stitch MCP 生成 (stitch-raw/ 有原始产出)
- [ ] 每张线框图都标注了可操作区域和跳转目标
- [ ] 关键页面包含空状态设计
- [ ] 线框图中无技术术语 (不出现 API、Database、Endpoint 等词)
- [ ] stitch-prompts.md 完整保留所有 prompt (可复现)
```

---

## Phase D: 功能覆盖验证 (Feature Coverage Check)

- [ ] 0.5.16 F-ID 覆盖对照: 逐条检查 FEATURE_LIST 中每个 F-ID 在原型中的体现
  - 已覆盖: ✅ (标注对应的线框图编号)
  - 未覆盖: ❌ (标注 `[原型缺失: F-X.X]`，说明原因，报告 Commander)
- [ ] 0.5.17 BDD 场景覆盖对照: 逐条检查 BDD Scenario 在 User_Flow 中的体现
  - 已覆盖: ✅
  - 未覆盖: ❌ (报告 Commander)

### Phase D 自检

```
- [ ] F-ID 覆盖率 = 100% (或已获 Commander 确认的例外)
- [ ] BDD 核心场景覆盖率 = 100%
- [ ] 所有 [原型缺失] 标记已报告 Commander
```

---

## Phase E: Gate 0.5 提交

- [ ] 0.5.18 产出物完整性自检:

  ```
  - [ ] User_Flow.md 已创建，包含所有角色的正常流 + 异常流
  - [ ] Wireframes/stitch-raw/ 包含 Stitch MCP 原始产出
  - [ ] Wireframes/stitch-prompts.md 包含所有生成 prompt (可复现)
  - [ ] Wireframes/ 包含审查后的最终版线框图
  - [ ] F-ID 覆盖率 100% (或例外已确认)
  - [ ] BDD 场景覆盖率 100%
  - [ ] 所有线框图无技术术语
  ```

- [ ] 0.5.19 向 Commander 提交审批: 展示所有产出物，请 Commander 确认"这就是我想要的"
  - **通过标准**: Commander 说出"这就是我想要的"或等效确认
  - **拒绝处理**: 记录 Commander 反馈 → 返回对应 Phase 修改 → 重新提交

---

## 动态扩展 (Project-Specific)

> UX Designer 根据项目复杂度在此添加额外步骤
> 格式: `- [ ] 0.5.N 「动作动词 + 对象」: 产出物 → 验证方式`

- [ ] (由 UX Designer 动态填写)
