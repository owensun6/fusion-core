<!-- Author: PM -->

# Stage 0: 需求深度解构 — 原子级 Checklist

> **Purpose**: 将 Commander 的模糊意图转化为机器可验证的行为契约 (PRD + FEATURE_LIST + BDD)。
> **如果跳过此阶段**: 开发将基于幻觉和假设展开，所有下游产出物的返工成本以指数级累积。
> **执行角色**: PM
> **规范参考**: `.claude/rules/atomic-checklist-standard.md`
> **Gate**: Gate 0 (Commander 签字)

---

## 固定骨架 (Standard Steps)

### Phase A: 前置校验 (Pre-flight)

- [ ] 0.1 读取 ROADMAP.md: 检查当前需求是否符合宏观战略规划 → 输出：对齐判断 (符合 / 偏离 / 无 ROADMAP)
- [ ] 0.2 创建 DISCUSSION_LOG.md: 在 `pipeline/0_requirements/` 建立讨论日志文件 → 验证：文件存在，包含项目名称和日期
- [ ] 0.3 判断项目类型: 确认是"地基 (引擎/平台)"还是"房子 (功能/产品)" → 输出：项目类型标注写入 DISCUSSION_LOG.md

---

### Phase B: 四维度逼问 (Four-Dimension Probing)

> **[!] 铁律**: 四个维度必须逐一执行，不可合并，不可跳过。每完成最多 3 轮 Q&A 必须增量写入 DISCUSSION_LOG.md。

#### 维度 0.4a — 用户体验 [UX]

- [ ] 0.4a.1 宣告进入维度 UX (1/4): 向 Commander 说明本维度目的 → 输出：维度宣告文字
- [ ] 0.4a.2 追问用户操作路径: 核心用户角色是谁？他们的主流程是什么？ → 输出：Q&A 追加至 DISCUSSION_LOG.md，标注 `[UX]`
- [ ] 0.4a.3 追问异常与边界: 操作失败时用户看到什么？最极端的使用场景是什么？ → 输出：Q&A 追加至 DISCUSSION_LOG.md
- [ ] 0.4a.4 (条件) 补充轮逼问: 存在 `[待验证]` 项时触发，直到无歧义 → 输出：补充 Q&A 追加至 DISCUSSION_LOG.md
- [ ] 0.4a.5 宣告维度 UX 完成: 复述核心结论，列出待验证项 → 输出：维度完成宣告文字

#### 维度 0.4b — 技术约束 [TECH]

- [ ] 0.4b.1 宣告进入维度 TECH (2/4): 向 Commander 说明本维度目的 → 输出：维度宣告文字
- [ ] 0.4b.2 追问集成与栈约束: 已有技术栈？必须对接的外部系统？不可妥协的技术红线？ → 输出：Q&A 追加至 DISCUSSION_LOG.md，标注 `[TECH]`
- [ ] 0.4b.3 追问性能边界: 预估并发量？响应时间要求？数据规模？ → 输出：Q&A 追加至 DISCUSSION_LOG.md
- [ ] 0.4b.4 (条件) 补充轮逼问: 存在 `[待验证]` 项时触发 → 输出：补充 Q&A 追加至 DISCUSSION_LOG.md
- [ ] 0.4b.5 宣告维度 TECH 完成: 复述核心结论，列出待验证项 → 输出：维度完成宣告文字

#### 维度 0.4c — 数据与合规 [DATA]

- [ ] 0.4c.1 宣告进入维度 DATA (3/4): 向 Commander 说明本维度目的 → 输出：维度宣告文字
- [ ] 0.4c.2 追问数据结构与迁移: 关键数据实体是什么？是否有历史数据需要迁移？ → 输出：Q&A 追加至 DISCUSSION_LOG.md，标注 `[DATA]`
- [ ] 0.4c.3 追问合规与隐私: 涉及哪些隐私数据？适用哪些法规（GDPR/等保）？数据保留周期？ → 输出：Q&A 追加至 DISCUSSION_LOG.md
- [ ] 0.4c.4 (条件) 补充轮逼问: 存在 `[待验证]` 项时触发 → 输出：补充 Q&A 追加至 DISCUSSION_LOG.md
- [ ] 0.4c.5 宣告维度 DATA 完成: 复述核心结论，列出待验证项 → 输出：维度完成宣告文字

#### 维度 0.4d — 产品演进 [EVO]

- [ ] 0.4d.1 宣告进入维度 EVO (4/4): 向 Commander 说明本维度目的 → 输出：维度宣告文字
- [ ] 0.4d.2 追问演进路径: v1→v2 的扩展方向？哪些决策会堵死未来路径？ → 输出：Q&A 追加至 DISCUSSION_LOG.md，标注 `[EVO]`
- [ ] 0.4d.3 追问优先级与范围: MVP 的边界在哪里？哪些功能明确排除在 v1 之外？ → 输出：Q&A 追加至 DISCUSSION_LOG.md
- [ ] 0.4d.4 (条件) 补充轮逼问: 存在 `[待验证]` 项时触发 → 输出：补充 Q&A 追加至 DISCUSSION_LOG.md
- [ ] 0.4d.5 宣告维度 EVO 完成: 复述核心结论，列出待验证项 → 输出：维度完成宣告文字

---

### Phase C: 文档产出 (Document Production)

> **[!] 顺序锁**: PRD → FEATURE_LIST → BDD，严禁跳步，严禁并联生成。

- [ ] 0.5 全量文档同步: 检查 DISCUSSION_LOG.md 是否完整反映所有四维度结论，缺漏立即补写 → 验证：DISCUSSION_LOG.md 包含四维度完整 Q&A
- [ ] 0.6 编写 PRD.md: 填充模板所有章节（业务背景/用例清单/非功能性需求/已澄清边界决策）→ 验证：Author stamp `<!-- Author: PM -->` + 四章节完整
- [ ] 0.7 编写 FEATURE_LIST.md: 基于 PRD 生成两级功能清单（F1 大功能 → F1.1 子功能，每条含唯一编号）→ 验证：每个 F-ID 有一句话业务描述，无技术术语
- [ ] 0.8 编写 BDD_Scenarios.md: 基于 FEATURE_LIST 逐条生成 Gherkin 场景（每个 F-ID 至少 1 正常流 + 1 异常流）→ 验证：每条 Scenario 首行注释对应 F-ID，Then 语句可观测

---

### Phase D: PM Consultant 审查

- [ ] 0.9 移交 PM-Consultant: 将全套产出物（PRD + FEATURE_LIST + BDD）移交 PM-Consultant 进行独立审查 → 验证：PM-Consultant 开始执行
- [ ] 0.10 处理审查结论:
  - 结论为 **PASS** → 直接进入 Phase E
  - 结论为 **REVISE** → 读取 `pipeline/0_requirements/audit/PM-Consultant-audit.md` 中的 CRITICAL 问题 → 按问题修改对应文档 → 回到步骤 0.9 重新提交审查

---

### Phase E: Gate 0 提交

- [ ] 0.11 产出物完整性自检:

  ```
  - [ ] RAW_CONVERSATION.md 存在
  - [ ] DISCUSSION_LOG.md 存在，包含四维度完整 Q&A
  - [ ] PRD.md 存在，Author stamp 正确，四章节完整
  - [ ] FEATURE_LIST.md 存在，每个 F-ID 有一句话描述
  - [ ] BDD_Scenarios.md 存在，每个 F-ID 至少 1 正常流 + 1 异常流
  - [ ] PM-Consultant-audit.md 存在，结论为 PASS
  ```

- [ ] 0.12 向 Commander 提交审批: 展示全套产出物，请 Commander 签字 Gate 0 → 输出：Gate 0 审批请求
  - **通过**: Commander 签字 → 更新 monitor.md Gate 0 状态为 ✅
  - **拒绝**: 记录拒绝理由到 monitor.md 风险日志 → 按反馈修改 → 回到对应 Phase

---

## 动态扩展 (Project-Specific)

> PM 根据项目复杂度在此添加额外步骤
> 格式: `- [ ] 0.N 「动作动词 + 对象」: 产出物 → 验证方式`

- [ ] (由 PM 动态填写)
