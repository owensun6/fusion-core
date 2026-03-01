# Fusion-Core vs CCbest vs BMAD-METHOD 三方对比分析报告

> 生成日期: 2026-03-01
> 分析范围: 文档体系、角色分工、工具链、流程约束

---

## 一、执行摘要

本文档对 Fusion-Core、CCbest、BMAD-METHOD 三个 AI 开发方法论框架进行多维度对比分析。

### 核心结论

| 框架            | 定位                   | 核心优势                             | 适用场景             |
| --------------- | ---------------------- | ------------------------------------ | -------------------- |
| **CCbest**      | AI Team 协作框架       | 强制约束、物理锁、80% 测试覆盖率     | 需要强管控的企业项目 |
| **Fusion-Core** | 医疗级专职兵种 AI 框架 | 13 兵种 + 盲打机制、Diátaxis 文档    | 复杂系统并行开发     |
| **BMAD-METHOD** | 敏捷 AI 开发框架       | 完整工具链、活跃社区、Scale-Adaptive | 快速迭代项目         |

---

## 二、基础信息对比

| 维度         | CCbest           | Fusion-Core            | BMAD-METHOD                   |
| ------------ | ---------------- | ---------------------- | ----------------------------- |
| **定位**     | AI Team 协作框架 | 医疗级专职兵种 AI 框架 | 敏捷 AI 开发框架              |
| **规模**     | ~100+ 文件       | ~60+ 文件              | 38.5k Stars, 119 Contributors |
| **License**  | 个人配置         | MIT                    | MIT                           |
| **版本**     | —                | v1.0                   | v6.0.3 (2026-02-23)           |
| **社区**     | 个人项目         | 个人项目               | 活跃 (Discord, YouTube)       |
| **安装方式** | 手动复制         | git submodule + bash   | npx bmad-method               |

---

## 三、文档体系对比

### 3.1 核心文档

| 文档类型            | CCbest          | Fusion-Core         | BMAD-METHOD |
| ------------------- | --------------- | ------------------- | ----------- |
| **CLAUDE.md**       | ✅ 必需         | ✅                  | ❌ 无要求   |
| **README.md**       | ✅ 简单         | ✅                  | ✅ 完整     |
| **CHANGELOG.md**    | ❌              | ✅                  | ✅          |
| **ROADMAP.mdx**     | ❌              | ✅                  | ✅          |
| **SECURITY.md**     | ❌              | ✅                  | ✅          |
| **CONTRIBUTING.md** | ❌              | ✅                  | ✅          |
| **STYLE_GUIDE**     | custom-rules.md | ✅ \_STYLE_GUIDE.md | ✅          |

### 3.2 文档框架

| 维度              | CCbest | Fusion-Core          | BMAD-METHOD |
| ----------------- | ------ | -------------------- | ----------- |
| **Diátaxis 框架** | ❌ 无  | ✅                   | ✅ 完整     |
| **Tutorials**     | ❌     | ✅ docs/tutorials/   | ✅          |
| **How-to**        | ❌     | ✅ docs/how-to/      | ✅          |
| **Explanation**   | ❌     | ✅ docs/explanation/ | ✅          |
| **Reference**     | ❌     | ✅ docs/reference/   | ✅          |

### 3.3 文档评分

| 指标   | CCbest     | Fusion-Core | BMAD-METHOD |
| ------ | ---------- | ----------- | ----------- |
| 完整性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐⭐  |
| 结构化 | ⭐⭐⭐     | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐⭐  |

---

## 四、角色体系对比

### 4.1 角色分工

| 角色                | CCbest        | Fusion-Core | BMAD-METHOD     |
| ------------------- | ------------- | ----------- | --------------- |
| PM                  | ✅            | ✅          | ✅              |
| Lead/Architect      | ✅            | ✅          | ✅              |
| Dev                 | ✅            | ✅          | ✅              |
| Reviewer/QA         | ✅            | ✅          | ⚠️ 集成在 Agent |
| Commander           | ✅ 人类决策者 | ✅          | ❌ 概念弱       |
| Scrum Master        | ❌            | ❌          | ✅              |
| UX Designer         | ❌            | ❌          | ✅              |
| **特种兵/细分角色** | ❌            | ✅ 13 兵种  | ✅ 12+ Agent    |

### 4.2 Fusion-Core 特色: 13 兵种体系

```
┌─────────────────────────────────────────────────────┐
│                   Fusion 角色金字塔                    │
├─────────────────────────────────────────────────────┤
│  Commander (人类)                                     │
├─────────────────────────────────────────────────────┤
│  PM ← Lead ← Reviewer                              │
├─────────────────────────────────────────────────────┤
│  Dev (6 盲区特种兵)                                  │
│  ├── fe-ui-builder (前端 UI 构建)                   │
│  ├── fe-logic-binder (前端逻辑绑定)                  │
│  ├── be-api-router (后端 API 路由)                   │
│  ├── be-domain-modeler (后端领域建模)                 │
│  ├── be-ai-integrator (AI 集成)                    │
│  └── db-schema-designer (数据库设计)                │
└─────────────────────────────────────────────────────┘
```

### 4.3 角色分工评分

| 指标     | CCbest   | Fusion-Core | BMAD-METHOD |
| -------- | -------- | ----------- | ----------- |
| 粒度     | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐    |
| 盲打机制 | ❌       | ✅          | ❌          |

---

## 五、流程阶段对比

### 5.1 Stage/Gate 划分

| 维度           | CCbest         | Fusion-Core   | BMAD-METHOD   |
| -------------- | -------------- | ------------- | ------------- |
| **阶段数量**   | 8 Stage (0-7)  | 8 Stage (0-7) | 34+ Workflows |
| **Gate 数量**  | 4 Gate         | 4 Gate        | 无特定        |
| **快速通道**   | ✅ Fast-track  | ⚠️ 提及       | ❌ 无         |
| **Escalation** | ✅ 3次拒绝触发 | ⚠️ 提及       | ❌ 无         |

### 5.2 Stage 对比详情

```
CCbest:       Stage 0 → Gate 0 → Stage 1 → Gate 1 → Stage 1.5 → Gate 1.5
                    → Stage 2 → Stage 3 → Gate 2 → Stage 4 → Stage 5 → Stage 6 → Gate 3 → Stage 7

Fusion-Core:   Stage 0 → Gate 0 → Stage 1 → Gate 1 → Stage 1.5 → Gate 1.5
                    → Stage 2 → Stage 3 → Gate 2 → Stage 4 → Stage 5 → Stage 6 → Gate 3 → Stage 7

BMAD:          34+ 灵活 Workflows，无固定 Gate
```

---

## 六、约束机制对比

### 6.1 防越界机制

| 维度             | CCbest               | Fusion-Core          | BMAD-METHOD |
| ---------------- | -------------------- | -------------------- | ----------- |
| **Author Stamp** | `<!-- Author: -->`   | `<Author: [角色名]>` | ❌ 无       |
| **Cross-Check**  | ✅ 跨阶段审计        | ⚠️ 仅描述            | ❌ 无       |
| **物理锁**       | ✅ Fast-track 硬约束 | ❌ 无                | ❌ 无       |

### 6.2 Hooks 约束

| 维度            | CCbest | Fusion-Core | BMAD-METHOD |
| --------------- | ------ | ----------- | ----------- |
| **PreToolUse**  | ✅     | ⚠️ 提及     | ❌ 无       |
| **PostToolUse** | ✅     | ⚠️ 提及     | ❌ 无       |
| **Git Hooks**   | ❌ 无  | ❌ 无       | ✅ Husky    |

### 6.3 约束评分

| 指标   | CCbest     | Fusion-Core | BMAD-METHOD |
| ------ | ---------- | ----------- | ----------- |
| 强制力 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐      | ⭐⭐⭐      |

---

## 七、工具链生态对比

| 维度           | CCbest   | Fusion-Core   | BMAD-METHOD            |
| -------------- | -------- | ------------- | ---------------------- |
| **CLI 工具**   | ❌ 无    | ⚠️ install.sh | ✅ bmad-method         |
| **代码检查**   | ❌ 无    | ❌ 无         | ✅ ESLint + Prettier   |
| **Git Hooks**  | ❌ 无    | ❌ 无         | ✅ Husky + lint-staged |
| **测试框架**   | ❌ 无    | ❌ 无         | ✅ Jest + c8           |
| **文档站点**   | ❌ 无    | ❌ 无         | ✅ Astro + Starlight   |
| **CI/CD**      | ❌ 无    | ❌ 无         | ✅ GitHub Actions      |
| **代码审查**   | ❌ 无    | ❌ 无         | ✅ CodeRabbit          |
| **覆盖率要求** | 80% 强制 | ❌ 无         | ❌ 无                  |

### 工具链评分

| 指标       | CCbest | Fusion-Core | BMAD-METHOD |
| ---------- | ------ | ----------- | ----------- |
| 生态完整度 | ⭐⭐   | ⭐⭐        | ⭐⭐⭐⭐⭐  |

---

## 八、并发执行能力对比

| 维度             | CCbest                           | Fusion-Core | BMAD-METHOD |
| ---------------- | -------------------------------- | ----------- | ----------- |
| **DAG 规划**     | ✅ task.md + dependency_graph.md | ⚠️ 概念提及 | ❌ 无       |
| **并行任务派发** | dispatching-parallel-agents      | ⚠️ 概念     | Party Mode  |
| **盲打机制**     | ❌ 无                            | ✅ 强制解耦 | ❌ 无       |

### 并发能力评分

| 指标     | CCbest   | Fusion-Core | BMAD-METHOD |
| -------- | -------- | ----------- | ----------- |
| 并发设计 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐    |

---

## 九、安装与部署对比

| 维度         | CCbest   | Fusion-Core          | BMAD-METHOD       |
| ------------ | -------- | -------------------- | ----------------- |
| **安装方式** | 手动复制 | git submodule + bash | npx bmad-method   |
| **卸载脚本** | ❌ 无    | ❌ 无                | ✅ bmad:uninstall |
| **子模块化** | ❌       | ✅                   | ❌                |
| **版本管理** | ❌       | ❌                   | ✅ package.json   |

### 部署评分

| 指标   | CCbest | Fusion-Core | BMAD-METHOD |
| ------ | ------ | ----------- | ----------- |
| 便捷性 | ⭐⭐   | ⭐⭐⭐      | ⭐⭐⭐⭐⭐  |

---

## 十、监控与可视化对比

| 维度         | CCbest     | Fusion-Core | BMAD-METHOD |
| ------------ | ---------- | ----------- | ----------- |
| **进度看板** | monitor.md | ✅ 增强版   | ❌ 无       |
| **兵力追踪** | ❌ 无      | ✅ 特色     | ❌ 无       |
| **风险日志** | ✅         | ✅          | ❌ 无       |

### 监控评分

| 指标   | CCbest   | Fusion-Core | BMAD-METHOD |
| ------ | -------- | ----------- | ----------- |
| 可视化 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐  | ⭐⭐        |

---

## 十一、代码规范对比

| 维度            | CCbest        | Fusion-Core | BMAD-METHOD    |
| --------------- | ------------- | ----------- | -------------- |
| **不变性原则**  | ✅            | ❌          | ❌             |
| **文件组织**    | ✅ 200-400 行 | ❌          | ❌             |
| **错误处理**    | ✅ 全面       | ❌          | ❌             |
| **输入验证**    | ✅ 全面       | ❌          | ❌             |
| **ESLint 配置** | ❌ 无         | ❌ 无       | ✅ unicorn + n |

### 代码规范评分

| 指标   | CCbest     | Fusion-Core | BMAD-METHOD |
| ------ | ---------- | ----------- | ----------- |
| 规范度 | ⭐⭐⭐⭐⭐ | ⭐⭐        | ⭐⭐⭐      |

---

## 十二、雷达图总结

| 维度       | CCbest     | Fusion-Core | BMAD-METHOD |
| ---------- | ---------- | ----------- | ----------- |
| 文档完整性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐⭐  |
| 工具链生态 | ⭐⭐       | ⭐⭐        | ⭐⭐⭐⭐⭐  |
| 角色分工   | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐    |
| 流程约束   | ⭐⭐⭐⭐⭐ | ⭐⭐⭐      | ⭐⭐⭐      |
| 并发能力   | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐    |
| 安装部署   | ⭐⭐       | ⭐⭐⭐      | ⭐⭐⭐⭐⭐  |
| 社区活跃度 | ⭐         | ⭐          | ⭐⭐⭐⭐⭐  |
| 代码规范   | ⭐⭐⭐⭐⭐ | ⭐⭐        | ⭐⭐⭐      |

---

## 十三、各框架独特优势

### 13.1 CCbest 核心优势

- **强制约束**: 物理锁、Cross-Check、80% 测试覆盖率
- **道一身份体系**: SOUL.md + IDENTITY.md 深度整合
- **不变性原则**: 代码强制不可变

### 13.2 Fusion-Core 核心优势

- **13 兵种体系**: 更细粒度的角色分工
- **盲打机制**: 6 名 Dev 互相不知晓边界，强制解耦
- **Diátaxis 文档**: 专业结构化文档体系
- **子模块化**: 避免污染真实业务库

### 13.3 BMAD-METHOD 核心优势

- **完整工具链**: CLI/ESLint/Husky/Astro/CodeRabbit 全套
- **Diátaxis 文档**: 业界标准
- **活跃社区**: 38.5k Stars, Discord, YouTube
- **Scale-Adaptive**: 从 bug fix 到企业级系统自适应

---

## 十四、改进建议

### 14.1 Fusion-Core 优先改进项

| 优先级 | 任务                       | 理由             |
| ------ | -------------------------- | ---------------- |
| **P1** | 实现 Author Stamp 强制检查 | 跨阶段审计基础   |
| **P2** | 增强 CLI 工具 (安装/卸载)  | 向 BMAD 生态对齐 |
| **P3** | 添加物理锁约束             | 向 CCbest 对齐   |
| **P3** | 引入 80% 测试覆盖率要求    | CCbest 特色      |

### 14.2 CCbest 优先改进项

| 优先级 | 任务                   | 理由         |
| ------ | ---------------------- | ------------ |
| **P1** | 采用 Diátaxis 文档框架 | 专业结构化   |
| **P2** | 添加 CHANGELOG/ROADMAP | 完整开源标配 |

---

## 十五、结论

### 15.1 场景选择建议

| 场景                 | 推荐框架    |
| -------------------- | ----------- |
| 需要强管控的企业项目 | CCbest      |
| 复杂系统并行开发     | Fusion-Core |
| 快速迭代项目         | BMAD-METHOD |
| 个人/小团队项目      | BMAD-METHOD |
| 医疗/高可靠性系统    | Fusion-Core |

### 15.2 融合方向

三个框架各有侧重，未来可能的发展方向：

1. **Fusion-Core + CCbest**: 融合物理锁约束 + 盲打机制
2. **Fusion-Core + BMAD**: 引入完整工具链
3. **CCbest + BMAD**: 强制约束 + 活跃生态

---

## 附录: 文件索引

| 文件                                  | 说明            |
| ------------------------------------- | --------------- |
| `CLAUDE.md`                           | AI 行为入口     |
| `.claude/rules/01-fusion-roles.md`    | 角色定义        |
| `.claude/rules/00-fusion-workflow.md` | 工作流定义      |
| `pipeline/monitor.md`                 | 监控看板        |
| `docs/`                               | Diátaxis 知识库 |

---

_本文档由 Claude MiniMax-M2.5 生成_
