<!-- Author: Lead -->

# Stage 1.5: 高保真原型修订 — 原子级 Checklist

> **Purpose**: 当 Stage 1 架构设计发现 Stage 0.5 原型中存在技术不可行的交互时，对原型进行最小范围的定点修订，让 Commander 确认调整后的体验仍可接受。
> **如果跳过此阶段**: 技术不可行的交互将进入 Stage 3 任务规划，兵种将基于错误原型并发开发，集成阶段必然冲突。
> **执行角色**: Lead
> **规范参考**: `.claude/rules/atomic-checklist-standard.md`
> **Gate**: Gate 1.5 (Commander 确认调整可接受，或标记 SKIP)
> **触发条件**: Stage 1 架构设计发现 Stage 0.5 原型中有技术不可行的交互。无需调整则由 Commander 标记 SKIP。

---

## 追溯链 (Traceability Chain)

```
Stage 0.5 原型（Feature_Screen_Map + User_Flow + Wireframes）
  → Stage 1 架构约束（System_Design + INTERFACE + Data_Models）
    → 冲突清单（Phase A 产出）
      → Revised_Mockups/  ← Phase B 定点修订，严格限于冲突屏幕
        → State_Flow.md   ← Phase B，受影响屏幕的状态流
          → UX Consultant ← Phase C 审查，以原 Feature_Screen_Map 为基线
```

**铁律**: Phase B 只修改有架构冲突的屏幕，不得借机重新设计无关交互。

---

## Phase A: 冲突识别

- [ ] 1.5.1 确认 Gate 0.5 和 Gate 1 均已通过: 检查 `pipeline/monitor.md` → 验证：两个 Gate 状态均为 ✅
- [ ] 1.5.2 对照 Feature_Screen_Map.md 逐屏核查: 将 Stage 0.5 的每个屏幕与 Stage 1 的 INTERFACE.md + Data_Models.md 做可行性比对 → 输出：冲突清单（屏幕名称 + 不可行原因 + 建议调整方向）
- [ ] 1.5.3 判断触发条件: 冲突清单为空 → 通知 Commander 标记 SKIP；有冲突 → 进入 Phase B

### Phase A 自检

```
- [ ] 每个冲突项都有具体的架构约束来源（INTERFACE.md 行号 或 Data_Models.md 实体名）
- [ ] 冲突清单为空时，停止执行并通知 Commander 标记 SKIP
```

---

## Phase B: 定点修订

- [ ] 1.5.4 为每个冲突屏幕设计调整方案: 基于架构约束提出最小改动方案，保持用户体验影响最小化 → 输出：调整方案描述（每屏一条）
- [ ] 1.5.5 生成修订版线框图: 为每个冲突屏幕生成修订版（可用 Stitch MCP 重新生成，或在原图上标注调整）→ 输出：`pipeline/1_5_prototype/Revised_Mockups/<ScreenName>-revised.*`
- [ ] 1.5.6 更新受影响屏幕的状态流: 若状态转换因架构约束需要调整 → 输出：`pipeline/1_5_prototype/State_Flow.md`（仅受影响的状态节点）

### Phase B 自检

```
- [ ] Revised_Mockups/ 中的文件数量 = 冲突清单中的屏幕数量（不多不少）
- [ ] 每个修订版文件名与原 Feature_Screen_Map 中的屏幕名称对应（加 -revised 后缀）
- [ ] 未冲突的屏幕保持原样，未被修改
```

---

## Phase C: UX Consultant 审查

- [ ] 1.5.7 移交 UX Consultant: 将冲突清单 + 原 Stage 0.5 产出物 + Revised_Mockups/ + State_Flow.md 移交 UX Consultant → 验证：UX Consultant 开始执行
- [ ] 1.5.8 处理审查结论:
  - 结论为 **PASS** → 进入 Phase D
  - 结论为 **REVISE** → 读取 `pipeline/1_5_prototype/audit/UX-Consultant-audit.md` 的 CRITICAL 问题 → 按问题修改 → 回到步骤 1.5.7

---

## Phase D: Gate 1.5 提交

- [ ] 1.5.9 产出物完整性自检:

  ```
  - [ ] 冲突清单已记录（步骤 1.5.2 输出）
  - [ ] Revised_Mockups/ 存在，数量 = 冲突屏幕数量
  - [ ] State_Flow.md 存在（若有状态流变更）
  - [ ] UX-Consultant-audit.md 存在，结论为 PASS
  ```

- [ ] 1.5.10 向 Commander 提交审批: 并排展示原始原型 vs 修订版，请 Commander 确认调整可接受
  - **通过**: Commander 确认 → 更新 monitor.md Gate 1.5 状态为 ✅
  - **拒绝**: 记录理由 → 返回 Phase B 调整 → 重新提交

---

## 动态扩展 (Project-Specific)

> Lead 根据项目复杂度在此添加额外步骤
> 格式: `- [ ] 1.5.N 「动作动词 + 对象」: 产出物 → 验证方式`

- [ ] (由 Lead 动态填写)
