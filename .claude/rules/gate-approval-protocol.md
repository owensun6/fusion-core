# Fusion-Core Gate 审批验证与异常处置协议

> **[!] CRITICAL**: 每一个 Gate 都是一道生死门。绝不允许未携带绿灯盖戳的交付物越界进入下一个阶段。

## 1. 批准流程 (Approve)

- **动作**: Commander 在审阅输入产物后，明确回复文字或由自动化 Hook 拉起绿色盖章。
- **后置执行**:
  1. Agent 立即将当前阶段的核心产出物加上 `<!-- status: APPROVED -->` 的元数据标签。
  2. Hook 自动更新 `pipeline/monitor.md` 对应的 Gate 槽位状态为 `✅`。
  3. 全局 Agent 将被授权进入下一个预设的 Stage。

## 2. 拒绝与返工流 (Reject & Rework Loop)

绝不允许 Commander 拒绝后，Agent 在当前杂乱的上下文里“乱改一通”然后强推。

- **触发条件**: 任何维度的不过关（需求模糊、架构错乱、检查亮红灯）。
- **强制闭环执行路线**:
  1. **Reject 签收**: 立即冻结当前进程。将 Commander 的拒绝理由（哪怕是一句话）原样记录至 `pipeline/monitor.md` 尾部的“风险日志列”。
  2. **Rework 物理回退**: 负责该阶段的 Agent 必须重新拉起其核心动作（若是 Stage 0，必须重新呼叫 `01_Socratic_Ask`；若是 Stage 5，必须重新运行 TDD 的 Red 阶段）。
  3. **Re-submit 重新递交**: 将修改后的完整文件作为新的交付物，打上 `<!-- status: RE-SUBMITTED -->` 标签，再次叩关求过。

## 3. 熔断与升级处置 (Escalation)

AI 工作流极易陷入“越修越错”的死亡螺旋。我们通过硬锁死机制防止 Token 燃烧。

- **触发阈值**: 同一 Gate，连续遭受 Commander **3 次** Reject。
- **强制动作**:
  1. 立即触发 Escalation 警报。当前 Agent 需停止一切技术尝试。
  2. 输出：“Commander，已连续 3 轮无法令您满意，触发系统熔断机制。请问我们是否需要**废弃当前史诗 (Epic)**，重新回退到 Stage 0 重新定义需求？”
  3. 在 Commander 回复之前，系统挂起。

## 4. 快速通道物理锁 (Fast-Track Limitations)

- **触发**: 仅针对单文件修改或极轻量脚本需求，且 Commander 在初始意图时明确授权 `跳过架构设计`。
- **效果**: 只允许绕过 Stage 1 (系统架构) 和 Stage 1.5 (原型交互)。
- **物理反向锁死**:
  1. Stage 0 (需求定义) **永远不可跳过**。系统必须知道你在干嘛。
  2. 只要此次开发任务横跨 **前端 + 后端**，或者需要涉及数据库修改，Fast-Track 许可令牌立即自动回收销毁。必须滚回 Stage 1 老老实实画架构图。
