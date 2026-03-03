<!-- Author: UX-Designer -->

# Stage 0.5: 低保真原型 — 原子级 Checklist

> **Purpose**: 将书面需求转化为可视化低保真原型，让 Commander 在技术介入前确认"这就是我想要的"。
> **如果跳过此阶段**: 架构师基于文字假设做技术决策，开发完成后大概率推倒重来。
> **执行角色**: UX Designer
> **规范参考**: `.claude/rules/atomic-checklist-standard.md`
> **Gate**: Gate 0.5 (Commander 说出"这就是我想要的"方可通过)
> **触发条件**: 包含 UI 或重客户端交互的项目。纯后端/CLI/API 项目由 Commander 标记 SKIP。

---

## 追溯链 (Traceability Chain)

```
FEATURE_LIST (F-ID)
  → Feature_Screen_Map.md   ← Phase A 强制产出，1:1 映射基线
    → User_Flow.md           ← Phase B，按 Screen Map 画流程
      → Wireframes/          ← Phase C，每屏对号入座
        → Phase D 覆盖验证    ← 对照 Screen Map，非 100% 不过
          → UX Consultant     ← 以 Screen Map 为审查基线
```

**铁律**: Phase B/C/D/E 均以 `Feature_Screen_Map.md` 为唯一基线。不得绕过 Screen Map 直接对照 FEATURE_LIST。

---

## Phase A: 前置准备与映射基线建立

- [ ] 0.5.1 确认 Gate 0 已通过: 检查 `pipeline/monitor.md` 中 Stage 0 状态为 ✅ → 验证：状态确认
- [ ] 0.5.2 确认 Stitch MCP 可用: 检查当前环境中 Stitch MCP 是否已配置并可连接 → 若不可用：通知 Commander 协助安装，**不可跳过直接手画**
- [ ] 0.5.3 读取 PRD.md: 理解产品全貌与用户角色定义 → 输出：用户角色清单（角色名 + 一句话描述）
- [ ] 0.5.4 读取 FEATURE_LIST.md: 提取所有 F-ID → 输出：F-ID 清单（编号 + 功能描述）
- [ ] 0.5.5 读取 BDD_Scenarios.md: 理解每个 F-ID 的正常流与异常流边界 → 输出：异常场景清单（供 Phase B 使用）
- [ ] 0.5.6 **建立 Feature_Screen_Map.md**: 逐条 F-ID 分析，确定每个功能对应的页面/屏幕 → 输出：`pipeline/0_5_prototype/Feature_Screen_Map.md`

  ```markdown
  | F-ID | 功能描述 | 屏幕名称           | 屏幕类型 | 备注       |
  | ---- | -------- | ------------------ | -------- | ---------- |
  | F1.1 | 用户登录 | LoginPage          | 独立页面 | —          |
  | F1.2 | 忘记密码 | ForgotPasswordPage | 独立页面 | —          |
  | F2.1 | 商品列表 | ProductListPage    | 独立页面 | —          |
  | F2.2 | 商品详情 | ProductDetailModal | 弹窗     | 从列表触发 |
  ```

  **屏幕类型枚举**: 独立页面 / 弹窗 / 抽屉 / 内嵌组件 / 共享布局区域

### Phase A 自检

```
- [ ] Feature_Screen_Map.md 已创建，包含所有 F-ID
- [ ] 每个 F-ID 至少对应 1 个屏幕（F-ID : 屏幕 ≥ 1:1）
- [ ] 屏幕类型已标注（独立页面/弹窗/抽屉/内嵌）
- [ ] 无 F-ID 遗漏（逐行比对 FEATURE_LIST 确认）
```

---

## Phase B: 用户流程设计 (User Flow Design)

> 基于 Feature_Screen_Map.md 画"用户怎么在屏幕间流转"

- [ ] 0.5.7 逐角色绘制核心路径: 按用户角色，在 Feature_Screen_Map 的屏幕间画主流程（Happy Path）→ 输出：`User_Flow.md` 正常流（每个屏幕名称必须与 Screen Map 一致）
- [ ] 0.5.8 逐角色补充异常路径: 从 Phase A 的异常场景清单中，补充用户可感知的错误流 → 输出：`User_Flow.md` 异常流
- [ ] 0.5.9 标注决策节点: 在流程中标出用户需要做选择的分支点 → 输出：决策点标注（写入 User_Flow.md）

### Phase B 自检

```
- [ ] User_Flow.md 中出现的所有屏幕名称均来自 Feature_Screen_Map.md（无新增、无遗漏）
- [ ] 每个用户角色至少 1 条核心路径
- [ ] 每条核心路径至少 1 条异常分支
- [ ] 无孤立节点（每个屏幕都有入口和出口）
```

---

## Phase C: 线框图绘制 — Stitch MCP 驱动

> 按 Feature_Screen_Map.md 逐屏生成，每屏名称与 Screen Map 严格对应

- [ ] 0.5.10 从 Screen Map 导出屏幕清单: 以 Feature_Screen_Map.md 为来源，列出所有待绘制屏幕（编号与 Screen Map 一致）→ 输出：屏幕绘制清单（勾选表）
- [ ] 0.5.11 编写 Stitch Prompt: 为每个屏幕编写设计 prompt（包含：F-ID 来源、屏幕用途、用户角色、核心操作、信息层级）→ 输出：`Wireframes/stitch-prompts.md`
- [ ] 0.5.12 Stitch MCP 批量生成: 将 prompt 逐屏提交 Stitch MCP 生成初始设计 → 输出：原始结果存入 `Wireframes/stitch-raw/`
- [ ] 0.5.13 人工审查与调整: 逐屏审查 Stitch 结果，标注需调整项 → 审查通过版本存入 `Wireframes/`（最终版）
- [ ] 0.5.14 逐屏标注: 每张线框图标注屏幕名称（与 Screen Map 一致）、可操作区域、跳转目标
- [ ] 0.5.15 标注信息层级: 每张线框图标注信息优先级
- [ ] 0.5.16 标注空态/加载态: 列表为空时显示什么？加载中显示什么？

### Phase C 自检

```
- [ ] Wireframes/ 中的屏幕数量 = Feature_Screen_Map.md 中的屏幕数量
- [ ] 每张线框图文件名与 Screen Map 中的屏幕名称一致
- [ ] 所有初稿由 Stitch MCP 生成（stitch-raw/ 有原始产出）
- [ ] stitch-prompts.md 完整保留所有 prompt（可复现）
- [ ] 每张线框图标注了可操作区域和跳转目标
- [ ] 无技术术语（不出现 API、Database、Endpoint 等词）
```

---

## Phase D: 覆盖率验证 (Coverage Verification)

> 以 Feature_Screen_Map.md 为基线，逐行核对

- [ ] 0.5.17 F-ID 对照 Screen Map 验覆盖: 逐行检查 Feature_Screen_Map.md，确认每个屏幕都有对应线框图
  - 已覆盖: ✅（标注对应 `Wireframes/` 文件名）
  - 未覆盖: ❌（标注 `[原型缺失: F-X.X / ScreenName]`，上报 Commander，**不得进入 Phase E**）
- [ ] 0.5.18 BDD 场景覆盖对照: 逐条检查 BDD Scenario 在 User_Flow 中是否有对应路径
  - 已覆盖: ✅
  - 未覆盖: ❌（上报 Commander）

### Phase D 自检

```
- [ ] Feature_Screen_Map.md 覆盖率 = 100%（或已获 Commander 确认的豁免）
- [ ] BDD 核心场景覆盖率 = 100%
- [ ] 所有 [原型缺失] 已上报 Commander
```

---

## Phase E: UX Consultant 审查

> UX Consultant 以 Feature_Screen_Map.md 为审查基线

- [ ] 0.5.19 移交 UX-Consultant: 将全套产出物（Feature_Screen_Map.md + User_Flow.md + Wireframes/）移交 UX-Consultant → 验证：UX-Consultant 开始执行
- [ ] 0.5.20 处理审查结论:
  - 结论为 **PASS** → 进入 Phase F
  - 结论为 **REVISE** → 读取 `pipeline/0_5_prototype/audit/UX-Consultant-audit.md` 的 CRITICAL 问题 → 按问题修改 → 回到步骤 0.5.19

---

## Phase F: Gate 0.5 提交

- [ ] 0.5.21 产出物完整性自检:

  ```
  - [ ] Feature_Screen_Map.md 存在，F-ID 覆盖率 100%
  - [ ] User_Flow.md 存在，屏幕名称与 Screen Map 一致
  - [ ] Wireframes/stitch-prompts.md 存在，含所有 prompt
  - [ ] Wireframes/stitch-raw/ 存在，含 Stitch MCP 原始产出
  - [ ] Wireframes/ 存在，屏幕数量 = Screen Map 中屏幕数量
  - [ ] UX-Consultant-audit.md 存在，结论为 PASS
  ```

- [ ] 0.5.22 向 Commander 提交审批: 展示所有产出物，请 Commander 确认"这就是我想要的"
  - **通过标准**: Commander 明确确认
  - **拒绝处理**: 记录反馈 → 返回对应 Phase 修改 → 重新提交

---

## 动态扩展 (Project-Specific)

> UX Designer 根据项目复杂度在此添加额外步骤
> 格式: `- [ ] 0.5.N 「动作动词 + 对象」: 产出物 → 验证方式`

- [ ] (由 UX Designer 动态填写)
