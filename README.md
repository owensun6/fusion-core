# 🛡️ Fusion-Core: 第一性原理驱动的重防线大模型协作框架

> **Fusion-Core 不是另一个“好用的 Prompt 助手”，而是一座有着极简规则、隔离防线和持枪哨兵的物理特种兵营。**

## 1. 为什么需要 Fusion-Core？(The Problem)

在当前的大模型（LLM）驱动编程领域，我们习惯了赋予 Agent 极高的自由度——我们给它敏捷的命令（如 CCBest / ECC），寄希望于它自己去阅读规则、选择工具、编写代码、运行测试。

然而，在**医疗级别的严肃软件工程**或大型商业密码库面前，“大模型自觉性”是一剂致命毒药。
Vercel 的评测（_AGENTS.md outperforms skills in our agent evals_）印证了：当大语言模型需要自己决定“我该不该去查看某份文档”时，失误率极高；而当你**剥夺它的选择权、将最少的规定直接物理灌注进首屏**时，通过率跃升至 100%。

**Fusion-Core** 就是基于这一第一性原理诞生的强硬结界。它是为了解决大型 LLM 协作中出现的“架构越权、幻觉覆盖、未测先交、历史规则污染”等问题而打造的。

---

## 2. 核心哲学与双界隔离 (Core Philosophy)

### 2.1 局部绝对锁定原则 (Local Sandbox vs Global Tooling)

- **敏捷在全局 (Global)**：诸如写爬虫、日常助手等轻量任务，您大可使用 `~/.claude/` 里的自由组合全局指令（如普通的 CCbest），保持极度灵动。
- **纪律在局部 (Local)**：一旦代码库关系身家性命，你需要切入 Fusion-Core。此时运行 `npx fusion-init`，框架会在**当前项目**内部植入一堵无法逃脱的“防腐隔离墙”，全局的所有杂乱认知全部被本地铁率拦截失效。

### 2.2 剥夺决断权，被动装载 (No Decision Point)

大模型在进入进程的瞬间，其角色、禁区已被底层的 **Context Assembler (上下文组装器)** 锁死。它不需要、也没有资格去调用某个“角色技能”。

---

## 3. 架构拆解：1+4+13 兵种防线

为了防止“一个主大模型写遍全栈代码还自卖自夸”，系统将工作切分为极其克制的兵种，实行物理强制挂载：

- **1 位人类特权官 (Commander)**：
  - 由人类扮演，是整个项目的总司令。负责在每个阶段（Gate）给出唯一签字决断（Approve / Reject）。没有 Commander 的 `monitor.md` 签字，AI 绝对无法进入下一阶段的代码工作。

- **4 大阶段指挥组 (Stage Groups)**：
  - 【阶段0:需求】、【阶段1-3:设计与切图】、【阶段4-5:执行与TDD】、【阶段6:红蓝对抗审查】。严禁跳关。

- **13 个原子化特种兵 (Atomic Roles)**：
  每个 AI 兵种只懂自己领域的事，绝对看不到全局代码。
  1. `pm`: 纯 Socratic 逼问，不准想代码。
  2. `lead`: 绘制 O-O 图与微粒切分（DAG），不准写测试。
  3. `fe-ui-builder`: 画哑组件，不准用 Fetch 或者状态管理。
  4. `fe-logic-binder`: 写状态钩子，不准改 CSS 样式。
  5. `be-api-router`: 写接口入参校验层 (Zod)，不准写数据库拉取。
  6. `be-domain-modeler`: 写核心领域实体与业务逻辑。
  7. `be-ai-integrator`: 对接大模型中枢接口。
  8. `db-schema-designer`: 写 Prisma 和数据库 Migrate。
  9. `qa-01`: 黑盒逻辑审查与找死循环 BUG。
  10. `qa-02`: 前端 DOM/性能渲染审查。
  11. `qa-03`: OWASP Top 10 安全注入审计防线。
  12. `iv-01`: 跨端游走与 E2E 验证。
  13. `iv-02`: UAT 验收。

---

## 4. 三大物理拘束具 (The Physical Restraints)

大模型的自由天性会被以下三副镣铐束缚：

### 4.1 核心路由组装器 (Fusion-Router 2.0)

当执行 `npx fusion-router --role qa-03 --task target.md` 时，进程绝不会将全库知识给到 Agent。它会动态去切取仅仅属于 `qa-03` 的那一条极短的警告词，通过环境变量将其强行设为主 Prompt。

### 4.2 Git Hooks 底层守门 (pre-tool-use / post-tool-use)

- **Tool 物理降维拦截**：如果当前进程被标定为了 `qa` 或 `pm`，一旦大模型试图使用 `write_file` 去改写业务代码，`pre-tool-use` 钩子会直接将其底层 `Bash` 报错并物理阻断。
- **强制要求物理印章**：所有的文档或分支交互如果不带有 `<!-- Author: 角色名 -->` 或违规跨阶段跳级（如没有接口协议就直接写逻辑），同样在此层被当场斩杀。

### 4.3 产出物铁契约 (Pipeline & Templates)

工程被标准化为一条硬性流水线 `pipeline/`。各军团必须将自己的阶段产物按照母版要求留在这些格子里（`PRD.md`, `System_Design.md`, `task.md`），交给下一个军团查验。

---

## 5. 快速启动与外置装备库 (Quick Start)

### 初始化纯净兵营

在一个新建的商业代码库根目录下，执行环境大清洗：

```bash
npx fusion-init
```

该命令会自动隔绝本地可能产生冲突的旧规则，并挂载全新的 `.claude/` 兵营文件。

### 自动化流转 (Autopilot)

您只需提供一个任务，Agent 便会根据 `CLAUDE.md` 内配置的 **自动工作流引擎**，通过读取根目录下的 `pipeline/monitor.md` 自动加载对应的角色执行进度，完成阶段时自动喊停要求您审批（Commander Sign-Off）。

### 人工干预：13 大门控指令武器库

在极端卡壳、或者你需要人工精确制导时，可以使用战术层覆盖命令：

- **安全快照/兜底**：`/fusion-checkpoint` (打桩防脏字), `/fusion-confidence` (客观自报分数)。
- **深水区手术**：`/fusion-tdd` (重器红绿循环重构), `/fusion-fp-check` (第一性逻辑漏洞盲审), `/fusion-security` (安全漏洞扫描)。
- **架构组装**：`/fusion-clarify` (逼迫需求补全), `/fusion-task` (强行生成 DAG 图)。
- _(所有这 13 个指令的使用说明尽在 `.claude/commands/README.md` 中)_。

---

> **总纲：在 Fusion-Core 中，大模型不再是带有全部权限的上帝，而是流水线上一名盲看、定岗、头顶监控探头的无情士兵。这是唯一通往工业级复杂业务收敛的道路。**
