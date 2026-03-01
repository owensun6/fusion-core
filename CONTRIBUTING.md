# 开发者贡献指南 (Contributing)

感谢您对 **Fusion-Core AI 工作流引擎**的关注！
无论你是想增强某一个特种兵的战斗力（修改 `SKILL.md`），还是想打磨底层的物理 Hook，这里是你需要了解的规章。

## 1. 我们寻找什么样的贡献？

- 🛡️ **强化物理拦截**: 提供更强大的 `pre-tool-use` 或 `post-tool-use` 扫雷逻辑（例如引入基于 AST 的静态检查）。
- 🔌 **新的流水线集成**: 比如集成 Playwright VLM 到 Stage 6 阶段。
- 📚 **实战的教程用例**: 在 `docs/tutorials/` 补充基于 Fusion-Core 的真实开发流程跑通案例。

> **[!] 注意**: 我们**不接受**引入“全能型 Agent”或是合并兵种特性的 PR。13 名兵种的物理盲区与隔离，是体现“第一性原理”的核心不可变国策。

## 2. 提交代码前的要求 (Pre-Commit PR Checklist)

当你向项目提交 Pull Request 前，必须确认你的增量满足了项目的纪律性要求：

- [ ] **Diátaxis 归档**: 如果你新增了一个概念，它必须进入 `docs/explanation`；如果是一个实操步骤，进入 `docs/how-to`。
- [ ] **签名制**: 你的 Markdown 修改是否遵守了 `document-standards.md` 的 `<!-- Author: XXX -->` 强制署名？
- [ ] **不废话**: 文档或代码注释是否保持了 **零寒暄 (High SNR)** 的克制？
- [ ] **物理闭环**: 如果修改了工作流，确保没有打破原本 8 阶段的上下游拦截锁死结构。

## 3. 开发环境 Setup

由于这是一个基于 Markdown 规则与 Bash 脚本的引擎库：

1. 本地拉取仓库。
2. 配置好 `bash` 和 `node` 运行环境（为测试 hook 脚本）。
3. 使用 `npm run test:hooks` 或直行 `sh tests/run-all.sh`（假设你有对应配置）来检验沙盒环境的防御能力。
