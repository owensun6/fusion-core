# 🔒 安全政策 (Security Policy)

安全是 Fusion-Core AI Agent 引擎的最高红线。本库被设计为能够自主编写代码和操作本地环境的工具，因此防范提权、恶意提示词注入和密钥泄露至关重要。

## 支持的版本 (Supported Versions)

目前仅主干版本接受安全漏洞修复。

| 版本    | 状态        |
| ------- | ----------- |
| > 2.0.x | ✅ 活跃支持 |
| < 1.0.x | ❌ 停止支持 |

## 漏洞报告机制 (Reporting a Vulnerability)

如果你在 Fusion-Core 的流程钩子 (`hooks.md`) 或是 `dispatch_parallel.sh` 中发现了能够导致**物理逃逸**或**API Key 明文泄露**的漏洞，请仔细阅读以下报告要求：

1. **[!] 严禁公开提 Issue**: 任何已确认的 0-day 级别物理越权漏洞，直接发送邮件至安全负责团队或者通过专有的私密通道（如 DM 统帅）。
2. **所需信息**:
   - 漏洞影响的 Agent/脚本路径 (e.g., `pre-tool-use.js`)。
   - 复现的准确步骤 (通过何种 Payload 绕过了拦截器)。
   - PoC (Proof of Concept) 日志证明。

团队将在 48 小时内确认接收，并根据问题的严重程度启动紧急修复环流 (Hotfix Loop)。

## 架构级别的内置安全盾 (Built-in Security)

在此版本库中，基于 `security.md` 与 `.claude/hooks/pre-tool-use.js`，我们内置了以下被动防御体系：

- **正则表达式防火墙**: 监控所有的写入动作，防止 `sk-ant` 与 `ghp_` 等主流 Token 的明文下盘。
- **物理拦截钩**: 防止未经 Stage 1 (API契约) 的直接代码突击，防止后端被“暗改”。
- **不可变日志追踪**: 所有的 Reject 和审批全线落在 `monitor.md` 供日后审计。
