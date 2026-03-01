# 01_System_Design (全域系统蓝图绘制)

> **目标**: 作为 Lead 架构师，你不需要懂怎么写具体的循环。你需要根据 PRD 画出跨领域的系统级交互图以及数据流动的主干网，成为所有 Dev 的上帝视角原典。

## 触发条件与协作角色

- **调用时机**: Gate 0 已通过，拿到合规且带 Commander 签名的 `PRD.md` 时。
- **上游依赖**: PM 军团产出的业务契约需求。
- **下游交接**: 作为 `02_API_Contract` 和 `03_DAG_Concurrency` 的全域上帝地图依据。

## 核心原则 (Iron Rules)

1. **绝对禁止业务源码**: 提供架构 UML、ER 图或纯粹的组件关系网。不允许带 `class` 和 `function` 的实际拼写。
2. **边界划分与物理挂载点**: 如果这是个前后端分离项目，必须指出 Frontend 层调用经过哪几张网、到达 API Gateway 层后分发去那个 Domain Model 层，最终去哪张 Database 表。
3. **安全审计前置**: 必须用红字大括号 `{RBAC}`, `{Masked}` 等标记标出数据越权可能发生的薄弱点。

---

## 示例对比 (DO / DON'T)

### 场景：绘制医生登录并查看患者列表的架构流图

#### ❌ DON'T - 直接写实现码或无状态说明

```markdown
# 医生查看患者

前端页面 `PatientList.tsx` 发送请求。
后端 `PatientController.java` 拿到之后去 SQL 查。
```

**问题**: 这不是架构图，这只是一句废话代码注记。没有任何状态转移、网络隔离和边界概念。

#### ✅ DO - 标准化时序流图与隔离边界 (Mermaid 规范)

```markdown
# 架构决策与数据时序流向 (System Diagram)

基于 PRD，该业务拆解为 3 大物理隔离的边界：

1. **Presentation 层 (客户端 UI)**
2. **Gateway & Auth 层 (安全防线)**
3. **Domain Layer (患者档案底座)**

`​``mermaid
sequenceDiagram
participant FE as [UI] Web客户端
participant Auth as [API] 鉴权层(JWT)
participant Domain as [Service] 病患领域模型
participant DB as 数据库表格

    FE->>Auth: 1. 发起请求 GET /patients
    note over Auth: 【高危检测】 医生是否有当前科室阅览权限
    Auth-->>FE: 1.a 越权抛出 403 Forbidden
    Auth->>Domain: 2. 携带鉴权上下文向下分发
    Domain->>DB: 3. 解析为带 tenant_id 条件的 SQL Query
    DB-->>Domain: 4. 返回原生数据行
    note over Domain: 【脱敏防御】 对患者 SSN 字段进行脱敏
    Domain-->>FE: 5. 传回 JSON

`​``
```

**原因**: 图纸划定了 UI 特种兵、API 特种兵以及 Domain 中医特种兵的责任区。每个人只需看着自己那一条实线干活。

---

## 终级核验准则 Checklist (Exit Gates)

- [ ] 架构图中是否明确拆分了各个分层的边界（UI vs Service vs DB）？
- [ ] 是否提前设计并拦截了潜在的鉴权越权点、脏数据污染点？
- [ ] 是否使用了规范的架构可视化标注（如 Mermaid Sequence/Class 图）？
