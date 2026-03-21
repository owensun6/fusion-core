<!-- Author: Reviewer -->

# Stage 6 全漏斗审计报告 — fusion-core v4.1.0

> **审计时间**: 2026-03-21
> **审计范围**: `lib/`, `.claude/scripts/`, `.claude/hooks/`, `bin/`, `tests/`, `examples/`
> **7道漏斗整体结论**: ✅ **CONDITIONAL PASS**
> **阻断级别**: 0 CRITICAL · 3 HIGH · 8 MEDIUM · 4 LOW

---

## 漏斗通过状态总览

| 漏斗 | 名称 | 结论 | 主要发现 |
|------|------|------|---------|
| qa-01 | 功能逻辑 | ✅ PASS | 覆盖率 93%, 死测试, vlm导出缺失 |
| qa-02 | 性能/UI-UX | ✅ PASS | RegExp ReDoS 风险, 无 UI_CONTRACT |
| qa-03 | 安全零信任 | ✅ PASS | Shell 注入 ×2 (HIGH), 无 CRITICAL |
| qa-04 | 领域法务 | ✅ PASS | 路由矩阵覆盖缺口, 越权守卫漏洞 |
| iv-01 | E2E 连通性 | ✅ PASS | 133 tests ALL GREEN, CLI 全入口可达 |
| iv-02 | 数据穿透/ACID | ✅ PASS | 浅冻结漏洞 (capabilities 数组可变) |
| iv-03 | 混沌/边界值 | ✅ PASS | 11/11 边界场景全部通过 |

---

## 🔴 HIGH 问题（3个，需在下次迭代修复）

### H-1 `bin/fusion-core.js:12,40` — 双点 Shell 命令注入

**`monitor` 命令（最高危）**：
```js
execSync(`bash "${scriptPath}" ${args.join(' ')}`, { stdio: 'inherit' });
// process.argv.slice(3) 无任何引号包裹，直接拼接
// 攻击向量: fusion-core monitor "foo; cat /etc/passwd"
// 生成的 shell 字符串: bash "script.sh" foo; cat /etc/passwd
```

**`start` 命令（引号逃逸）**：
```js
process.argv.slice(3).map((a) => `"${a}"`).join(' ')
// 攻击向量: fusion-core start 'test"; echo INJECTED; echo "'
// 生成: bash "script.sh" "test"; echo INJECTED; echo ""  ← 引号被闭合
```

**修复方向**: 改用 `execFileSync(cmd, argsArray)` 数组传参，彻底绕过 Shell 解析。

---

### H-2 `lib/model-routing.js` — `capabilities` 数组浅冻结，共享引用可被污染

```js
// Object.freeze 是浅冻结，内部数组未被冻结
const pm = getRoute('pm');
pm.capabilities.push('INJECTED');  // ← 成功！无异常
getRoute('pm').capabilities        // → ['requirements','prd','bdd','user-stories','INJECTED']
// 同一引用，MODULE_ROUTING_MATRIX 全局被污染
```

**影响**：`matchByCapabilities()` 的匹配结果将随污染内容改变，导致角色路由不稳定。
**修复方向**：`Object.freeze(capabilities_array)` 或 `capabilities: Object.freeze([...])`。

---

### H-3 `bin/fusion-core-router.js:182` — `roleName` 注入 `new RegExp()` 存在 ReDoS 向量

```js
const regex = new RegExp(
  `### \\d+\\.?[\\s\\S]*?(${roleName}|${roleName.split('-')[0]})[\\s\\S]*?(?=### \\d+\\. |## |$)`,
  'i',
);
```

- `--role` 路径：受 `isValidRole()` 白名单保护 ✅
- `--capabilities` 路径：`roleName` 来自 `discoverRoles()` 的 `fm.name` 字段（SKILL.md frontmatter），**未经 regex 元字符转义**，若 SKILL.md 被篡改可触发 ReDoS。
**修复方向**：在注入前对 `roleName` 做 regex 元字符转义（`roleName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`）。

---

## 🟡 MEDIUM 问题（8个）

| ID | 位置 | 描述 |
|----|------|------|
| M-1 | `model-routing.js:220` | `discoverRoles()` `catch {}` 静默吞噬所有异常，无法区分预期"文件不存在"与"磁盘故障" |
| M-2 | `tests/model-routing.test.js:346` | 死测试：`expect(90).toBe(90)` 测字面量，不测 `PASS_THRESHOLD` 导出值，永远绿但零防护 |
| M-3 | `vlm-acceptance.js` | 纯函数未导出，测试用 `vm.runInContext` + 字符串替换提取，源码格式一变测试静默失效 |
| M-4 | `lib/model-routing.js` | `matchByCapabilities(null/undefined)` 抛出未捕获 TypeError，应有入参守卫返回空数组 |
| M-5 | `matchRoles(null)` | 结构化解构 null 抛出异常，缺乏防御性入参校验 |
| M-6 | `model-routing.js` | 路由矩阵覆盖 13/20 角色，`pm-consultant`/`ux-designer`/`ux-consultant`/`architecture-consultant`/`qa-04`/`iv-03`/`gene-extractor` 无模型路由 |
| M-7 | `pre-tool-use.js:44` | 越权守卫只覆盖 `qa-*` + `pm`，`iv-01~03`/`ux-designer`/`architecture-consultant`/`gene-extractor` 等8个非Dev角色可写源代码 |
| M-8 | `lib/model-routing.js` | `discoverRoles()` 每次调用同步读取全部 SKILL.md (22次 I/O)，无结果缓存；CLI工具可接受，若作为热路径将成性能瓶颈 |

---

## 🔵 LOW 问题（4个）

| ID | 位置 | 描述 |
|----|------|------|
| L-1 | `fusion-tdd-fixer.js:297-311` | `ANALYZE_ONLY` 分支无测试覆盖 |
| L-2 | `bin/fusion-core.js` | CLI 所有 switch 分支零单元测试 |
| L-3 | `bin/fusion-core-router.js` | Heal Log 并发写存在 TOCTOU 竞争（无文件锁），仅影响诊断日志，不影响业务 |
| L-4 | `bin/fusion-core-router.js:215` | `spawn` 子进程完整继承父进程 `process.env`，API Key 等敏感变量传递给 Claude 子进程（设计意图可接受，建议文档说明） |

---

## ✅ 正向亮点

| 维度 | 评估 |
|------|------|
| **测试覆盖率** | 93.08% stmts / 89.71% branches / 96.29% funcs — 远超 80% 基线 |
| **不可变性设计** | `Object.freeze` 全面落实（浅冻结，见 H-2），无违规 `let` |
| **纯函数架构** | `analyzeTestOutput`, `buildFixGuidance`, `matchByCapabilities` 等核心函数完全幂等 |
| **外部 I/O 防护** | 所有 `fs`/`execFileSync` 均有 `try-catch`，无裸异常暴露 |
| **密钥防泄漏** | pre-tool-use.js 正则覆盖 Anthropic/OpenAI/GitHub PAT/硬编码密码，扫描有效 |
| **熔断器机制** | MAX_RETRIES=3 + Panic_Report.md 路由建议，降级完整 |
| **边界韧性** | 11/11 混沌场景全部通过，100KB 输入、1000个能力标签、50并发均无崩溃 |
| **序列化保真** | JSON 往返完整保留 null/中文/Unicode/数字类型 |
| **幂等性** | 相同输入三次调用产生完全相同输出 ✅ |

---

## 修复优先级建议

```
P0 (下次发版前必须修复):
  H-2: capabilities 数组深冻结 — 1行fix，Object.freeze(array)

P1 (近期迭代修复):
  H-1: Shell 注入 — 改用 execFileSync 数组传参
  H-3: RegExp roleName 元字符转义
  M-4/M-5: matchByCapabilities/matchRoles 入参守卫

P2 (计划迭代修复):
  M-2: 修复死测试
  M-3: vlm-acceptance.js 导出纯函数
  M-6: 补全7个缺失角色的模型路由
  M-7: 扩展越权守卫覆盖范围
```

---

*本报告由 Stage 6 串行漏斗 (qa-01→qa-02→qa-03→qa-04→iv-01→iv-02→iv-03) 自动生成*
*Gate 3 签字请求已发送至 Commander*
