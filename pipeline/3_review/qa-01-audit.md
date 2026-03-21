<!-- Author: qa-01 -->

# QA-01 功能逻辑审计报告 — fusion-core v4.1.0

> **审计时间**: 2026-03-21
> **审计范围**: `lib/`, `.claude/scripts/`, `.claude/hooks/`, `bin/`, `tests/`
> **整体结论**: ✅ **CONDITIONAL PASS**（覆盖率达标，HIGH 问题需在生产部署前评估）

---

## 1. 测试覆盖率

| 文件 | Statements | Branches | Functions | Lines |
|------|-----------|---------|-----------|-------|
| `fusion-tdd-fixer.js` | 90.08% | 85.71% | 92.3% | 90.75% |
| `model-routing.js` | 98.5% | 95.45% | 100% | 100% |
| **All files** | **93.08%** | **89.71%** | **96.29%** | **93.75%** |

**基线要求**: ≥ 80% → ✅ 全部通过（133 tests, 5 suites, 0 failures）

---

## 2. 问题清单

### 🔴 HIGH

#### H-1: `bin/fusion-core.js:12` — Shell 命令注入风险

```js
// 有风险的写法
execSync(`bash "${scriptPath}" ${args.join(' ')}`, { stdio: 'inherit' });
```

`args` 直接来自 `process.argv`，若用户传入含 Shell 特殊字符的参数（如 `$(rm -rf /)` 或反引号），将被 Shell 解析执行。`start` 命令中虽然对每个参数做了 `"${a}"` 包裹，但双引号内的 `$()` 和反引号仍可触发命令替换。

**当前缓释因素**: 此工具为本地 CLI，攻击面仅限于本地用户自行构造恶意参数，风险可控。
**建议**: 使用 `execFileSync` 并以数组形式传参，彻底规避 Shell 解析。

---

### 🟡 MEDIUM

#### M-1: `lib/model-routing.js:220` — `discoverRoles()` 的 `catch {}` 静默吞噬异常

```js
try {
  const content = fs.readFileSync(skillPath, 'utf8');
  // ...
} catch {
  // 跳过无法读取的文件  ← 无任何日志
}
```

文件读取失败时完全静默，无法区分"SKILL.md 不存在"（预期行为）与"文件权限错误/磁盘故障"（应报警）。这是覆盖率缺口在 L203-208 的原因，同时也是可观测性死角。

---

#### M-2: `tests/model-routing.test.js:345-348` — 无效死测试

```js
describe('Threshold constant', () => {
  it('should be 90', () => {
    expect(90).toBe(90);  // ← 测试字面量，不测实际模块导出！
  });
});
```

此测试永远为绿，但对代码提供零防护。对应的实际常量 `PASS_THRESHOLD = 90` 在 `vlm-acceptance.js` 中，应该是 `expect(PASS_THRESHOLD).toBe(90)`。

---

#### M-3: `.claude/skills/iv-01/vlm-acceptance.js` — 纯函数未导出，测试套件被迫使用 `vm.runInContext`

`vlm-acceptance.test.js` 用字符串替换 + `vm.runInContext` 来提取 `parseVlmResult` 和 `buildReport`，这是脆弱的测试架构。只要 `vlm-acceptance.js` 的源码格式发生变化（如注释改动），正则替换就可能失效，导致测试静默漏检。

---

### 🔵 LOW

#### L-1: `fusion-tdd-fixer.js:297-311` — `ANALYZE_ONLY` 分支未被测试覆盖

`ANALYZE_ONLY` 模式由 `process.argv` 全局状态控制，当前测试套件未覆盖此路径（分支覆盖率缺口在 L297-311）。绿灯路径（`process.exit(0)` 分支）和红灯路径（`process.exit(1)` 分支）均未测试。

#### L-2: `bin/fusion-core.js` — CLI 入口无单元测试

所有 `switch` 分支（`start`, `init`, `monitor`, `dispatch`, `finish`, `extract-genes`, `uninstall`, `default`）均无测试覆盖。

---

## 3. 正向评分

| 维度 | 评估 |
|------|------|
| **不可变性** | ✅ 全面使用 `Object.freeze`，无违规 `let` |
| **外部 I/O 错误捕获** | ✅ `execFileSync`, `readFileSync`, `writeFileSync` 均有 `try-catch` |
| **纯函数设计** | ✅ `analyzeTestOutput`, `buildFixGuidance`, `createErrorSnapshot` 均为纯函数 |
| **密钥防泄漏** | ✅ `pre-tool-use.js` 的正则模式覆盖 Anthropic/OpenAI/GitHub key + 硬编码密码 |
| **Author Stamp 机制** | ✅ `post-tool-use.js` 正确拦截 `pipeline/` 目录内无签名 Markdown |
| **角色越权防护** | ✅ QA/PM 被禁止写源代码文件，逻辑正确 |
| **熔断器机制** | ✅ `MAX_RETRIES=3` 生效，`Panic_Report.md` 路由建议完整 |

---

## 4. 下游漏斗状态

| 漏斗 | 状态 |
|------|------|
| qa-02（性能/UI/UX） | ⬜ 待启动 |
| qa-03（安全零信任） | ⬜ 待启动（H-1 命令注入需深审） |
| qa-04（领域法务） | ⬜ 待启动 |
| iv-01 ~ iv-03 | ⬜ 待启动 |

**本道漏斗结论**: CONDITIONAL PASS — qa-02 可启动。
