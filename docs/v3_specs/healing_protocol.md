# Fusion-Core V3 协议：TDD 自动修复回环 (Self-Healing Protocol)

> **目标受众**: 负责实现 `/fusion-tdd` 的 `Dev` 和 `QA` 类专家兵种。

## 1. 协议目标

将红灯报错解析由“抛弃给人类”改为“兵种内部自动流转”，形成 `Write -> Test -> Fail -> Auto-Fix -> Test -> Pass` 的闭环。

## 2. 行为规范

在 Stage 5 (执行阶段) 中，当开发者 (例如 `fe-logic-binder`) 执行自动化测试收到非 0 返回码时，必须遵守以下约定：

1. **捕获异常 (Snapshot)**：
   测试脚本触发报错时，自动生成 `pipeline/3_review/Auto_Heal_Log.json`。
   结构必须包括：
   - 错误产生的时间戳
   - 触发错误的文件与所在行号
   - 完整的 Error Stack Trace
   - 当前的 `git diff` 状态

2. **触发急救路由 (Trigger Medic)**：
   调用 `/fusion-tdd --auto-fix`，该钩子会阅读日志。
   - 如果是 Typescript 类型报错 -> 路由回 `fe-logic-binder`；
   - 如果是 HTTP 500 连接报错 -> 路由至 `be-api-router` 或 `be-domain-modeler`；
   - 如果是 DOM 节点缺失 -> 路由回 `fe-ui-builder`。

3. **修复动作与二次断言 (Heal & Verify)**：
   被唤醒的修复兵种，只能读取出错的文件，不能看到全局架构。修复完成提交后，重跑测试。

4. **逃逸阈值 (Escalation)**：
   若同一个任务在自动循环了 **3 次** 之后仍然为红色，则必须生成 `Panic_Report.md`，交还给人肉统帅 (Commander)。
