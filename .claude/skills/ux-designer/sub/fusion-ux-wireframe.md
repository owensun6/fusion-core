---
name: fusion-ux-wireframe
description: UX Designer 专用。基于 Feature_Screen_Map，通过 Stitch MCP 生成低保真线框图，输出 User_Flow 和 Wireframes。
---

# fusion-ux-wireframe — 用户流与低保真线框图生成

> **融合来源**: fusion-workflow Stage 0.5（Stitch MCP 铁律）+ fusion-roles UX Designer 核心原则

---

## ⚡ 执行前 FP 两问（强制）

1. **我们的目的是什么？**
   → 将 Feature_Screen_Map 中的每个屏幕变成真实可见的线框图，让 Commander 可以"用眼睛确认"而非"靠想象猜测"。
2. **这些步骤已经不可原子级再分了吗？**
   → 先画流程（User_Flow），再画界面（Wireframe）。流程未确定前，不开始画界面。

---

## 前置验证

必须确认以下文件已存在：

```
[x] pipeline/0_5_prototype/Feature_Screen_Map.md（fusion-ux-explore 完成产出）
```

---

## 执行序列

### Phase A: 输出 User_Flow.md

**规则**: 先确定用户怎么走，再画每一步看到什么。

```markdown
<!-- Author: UX-Designer -->

# User Flow

## [角色名1] 操作路径

### 核心流程: [功能名称]
```

[起点] → [屏幕A：操作X] → [屏幕B：操作Y] → [终点/结果]
↘ [错误时] → [屏幕A：错误提示] → [重试 or 退出]

```

### 边缘流程: [异常场景]

```

[触发条件] → [屏幕C：边界提示] → [替代路径]

```

```

**覆盖要求**:

- 每个用户角色至少 1 个核心流程 + 1 个异常流程
- 每个 BDD Scenario 对应的路径均有体现

### Phase B: Stitch MCP 生成线框图

**铁律**: 每个屏幕的初稿必须通过 Stitch MCP 生成。

**操作步骤**:

1. **确认 Stitch MCP 可用**
   - 检查当前环境是否有 Stitch MCP 工具
   - 不可用时：通知 Commander 并协助安装，等待确认，不可跳过自行手画

2. **为每个屏幕准备 Prompt**

   ```
   屏幕名称: [名称]
   用户角色: [角色]
   页面目的: [这个屏幕要完成什么任务]
   必须包含的元素:
   - [来自 Feature_Screen_Map 的功能描述]
   - [异常/边界时的状态显示]
   语言风格: 低保真线框，黑白灰，无真实图片，文字用占位符
   ```

3. **提交 Stitch MCP，生成初稿**
   - 原始结果保存至 `pipeline/0_5_prototype/Wireframes/stitch-raw/[屏幕名].png`

4. **人工审查调整**
   - 检查每个屏幕是否包含了对应 F-ID 的所有功能点
   - 检查异常状态（错误提示/空状态/加载中）是否有体现
   - 调整后版本保存至 `pipeline/0_5_prototype/Wireframes/[屏幕名].png`

5. **逐屏标注**
   在每张线框图旁边写注释文件 `pipeline/0_5_prototype/Wireframes/[屏幕名]-notes.md`：

   ```markdown
   # [屏幕名称] 线框图注释

   **对应 F-ID**: F1.1, F1.2
   **用户角色**: 普通用户

   | 区域     | 功能说明         | 用户操作                | 跳转目标     |
   | -------- | ---------------- | ----------------------- | ------------ |
   | 头部导航 | 品牌 logo + 菜单 | 点击菜单项              | 对应屏幕     |
   | 主体区   | 登录表单         | 填写账号密码 → 点击登录 | 主界面       |
   | 底部     | 找回密码链接     | 点击                    | 密码找回弹层 |
   ```

---

## 零技术术语原则（强制）

线框图和注释中绝对禁止出现：

| ❌ 禁止    | ✅ 改为          |
| ---------- | ---------------- |
| API 请求   | 数据加载中       |
| 数据库查询 | 查找记录         |
| Token 验证 | 身份确认         |
| HTTP 404   | 页面不存在       |
| SQL 错误   | 操作失败，请重试 |
| 端点路径   | (不出现)         |

---

## 产出物清单

| 产出物         | 路径                                                  | 说明                  |
| -------------- | ----------------------------------------------------- | --------------------- |
| `User_Flow.md` | `pipeline/0_5_prototype/User_Flow.md`                 | 所有角色核心+异常路径 |
| 原始线框图     | `pipeline/0_5_prototype/Wireframes/stitch-raw/`       | Stitch MCP 直接输出   |
| 审查后线框图   | `pipeline/0_5_prototype/Wireframes/`                  | 人工调整版本          |
| 屏幕注释文件   | `pipeline/0_5_prototype/Wireframes/[屏幕名]-notes.md` | 每屏一份              |

---

## 质量闸门

- [ ] User_Flow 覆盖所有用户角色
- [ ] 每个屏幕都有 stitch-raw 原始版 + 人工审查版
- [ ] 每个屏幕都有 notes.md 注释（含 F-ID 引用）
- [ ] 零技术术语（全文扫描确认）
- [ ] Feature_Screen_Map 中所有屏幕都有对应线框图（无遗漏）

**自检通过 → 调用 `fusion-ux-contract`。**
