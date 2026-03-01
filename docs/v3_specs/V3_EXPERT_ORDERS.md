<!-- Author: Lead -->

# Fusion-Core 第一性交接契约：V3.x 专家开发命令

> **⚠️ 统帅下达的死规定**：
> 各位接收任务的兵种，你的活动范围仅限于下述指派你的任务。
> 严禁越权修改非本领域文件。
> 严禁在未通过 `docs/v3_specs/acceptance_tests.md` 验收的情况下，在监控板上标绿！

---

## ⚔️ 专家一：研发组长 (分兵至 `fe-logic-binder` 等 Dev 兵种)

**作战区域**：`.claude/scripts/` 和 `/fusion-tdd` 执行链
**协议依赖**：`docs/v3_specs/healing_protocol.md`

- [ ] **任务 1.1**：编写 `fusion-tdd` 的外挂抓取壳程序（可以新建 `fusion-tdd-fixer.js`）。该脚本必须能截获带有退出码 > 0 的报错流。
- [ ] **任务 1.2**：报错流必须被格式化写出到 `pipeline/3_review/Auto_Heal_Log.json` 中。
- [ ] **任务 1.3**：实现 3 次循环熔断器，失败3次必须写入 `Panic_Report.md` 并中断脚本交给人类。

---

## ⚔️ 专家二：集成测试官 (`iv-01` 兵种)

**作战区域**：`.claude/skills/iv-01/`
**协议依赖**：`docs/v3_specs/vlm_protocol.md`

- [ ] **任务 2.1**：在你的兵营库里引入或编写 Playwright 截图脚本。脚本在执行时必须生成当前页面的 `screenshot_current.png`。
- [ ] **任务 2.2**：编写给 VLM 大模型（如 Claude-3.5-Sonnet）的打分 Prompt，必须携带当前长截图与 `pipeline/1_5_prototype/UI_Mockups/` 中的原型图要求。要求给出满分 100 分的结果。
- [ ] **任务 2.3**：若得分 > 90，在 `pipeline/1_5_prototype/VLM_Report.md` 中写明「通过截图还原度验收」，并在全局 `monitor.md` 为 `Gate 1.5a` 盖上 `✅`；否则打回处理。

---

## ⚔️ 专家三：底层网关护卫室 (Core Foundation)

**作战区域**：`.claude/commands/fusion-router.md` 或相关的 `pre-tool-use.js`
**协议依赖**：`docs/v3_specs/routing_protocol.md`

- [ ] **任务 3.1**：捕获所有兵种（Role）激活信号。
- [ ] **任务 3.2**：如果兵种是重度的领域设计、需求提取（如 `pm`, `lead`），必须分配 `MODEL_ID` 为 Opus 或 Sonnet；若是轻量级页面拼装兵（如 `fe-ui-builder`），请强制注入降级命令切换至 `Haiku` 或更经济的模型。
- [ ] **任务 3.3**：模型发生降级抽点时，控制台上必须向人类打出：“自动路由至经济模型执行，以节省 Token”。

---

> **致 Commander**:
> 请将本文件直接喂给被唤醒的特种兵，或通过 `/fusion-router --role <专家名> --task <当前文件>` 将此军令如数派发。
