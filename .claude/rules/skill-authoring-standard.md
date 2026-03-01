# Fusion-Core 特种兵兵法写作规范 (Skill Authoring Standard)

> **[!] CRITICAL (造兵法则)**: 在 Fusion-Core 系统中，无论是官方提供的 13 个角色，还是后续项目中自定义的临时兵种，如果要为其分配专门的领域知识，必须遵守统一的 `SKILL.md` 编写标准。

## 1. 原则 (Core Philosophy)

1. **单一技能，一个入口**: 每个军团或独立特种兵兵种只能拥有一个 `SKILL.md`（例如 `.claude/skills/03_role_dev/fe-ui-builder/SKILL.md`），它是代理理解该角色的第一入口。
2. **强制使用原子能力 (Actions)**: 长篇大论的教导会被大模型遗忘。对于复杂的业务流，应该将它们拆分成独立的动作文件（例如 `actions/01_Red_Fail_Test.md`），并在 `SKILL.md` 里进行引用。

## 2. 目录结构标准

创建新 Skill 时的物理结构：

```text
skills/
└── my-new-special-agent/
    ├── SKILL.md             ← 必需，技能入口与边界定义
    └── actions/             ← 可选，子动作/模板的集合
        ├── action_a.md
        └── action_b.md
```

## 3. `SKILL.md` 官方标准模板

任何特种兵的 `SKILL.md` 必须包含以下 4 个段落，且第一段落必须引入 `00_shared`。

```markdown
# [特种兵全写，例如：Frontend UI Builder (UI特种兵)]

## 0. 共享军火库挂载 (Shared Resources)

在执行任何具体任务前，你**必须**了解并挂载以下通用法则：

- `fusion-core/.claude/rules/hooks.md` (前置与后置拦截)
- `fusion-core/.claude/rules/document-standards.md` (文档与签名拦截)

## 1. 兵种识别 (Identity & Scope)

你是谁？你的职责边界是什么？
**【领域边界】**: 只处理 Web 前端 React 相关的 UI 层。
**【绝对禁区】**: 严禁修改任何后端的 API 路由或触碰数据库 Schema（即使这些文件刚好在同一个仓库内）。

## 2. 核心兵器图谱 (Atomic Actions)

列举你能调用的专门动作，并指定在什么时候使用它们：

- **动作 A (`actions/action_a.md`)**: 当你需要生成新的页面外壳时使用。
- **动作 B (`actions/action_b.md`)**: 当你需要绑定后端 SWR 数据流时使用。

## 3. 铁血清单 (Strict Checklist)

给出 3-5 条基于该兵种的 DO / DON'T 示例。

- **DO**: 组件必须使用 Server Components 优先原则。
- **DON'T**: 绝对不要在 `useEffect` 里进行初始化获取，必须交由父级透传或服务端获取。
```
