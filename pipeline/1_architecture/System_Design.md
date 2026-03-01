<!-- Author: lead -->
<!-- 此标签严格遵守 Fusion-Core 防伪标记，修改文件后请保留 -->

# 1. 架构总览 (Architecture Overview)

> 描述系统的顶层架构（例如：BFF模式、微服务、单体架构），以及核心技术栈选型（ADR）。

# 2. 领域模型图 (Domain Models)

> 使用 Mermaid 呈现主要的领域实体及相互关系（Entity-Relationship）。
> \`\`\`mermaid
> erDiagram

    %% 在此绘制实体图

\`\`\`

# 3. 数据流与时序逻辑 (Sequence Flow)

> 使用 Mermaid 描述复杂的数据交互流与三方系统对接。
> \`\`\`mermaid
> sequenceDiagram

    %% 在此绘制时序逻辑

\`\`\`

# 4. 前端组件拓扑树 (Component Topology)

> 声明前端所需的核心哑组件（UI-Builder）与容器流（Logic-Binder）组件结构。

# 5. 后端 API 设计协定 (Interface Contract)

> API 列表，要求使用强类型描述请求与返回载荷，作为前后端分离的铁契约。

- **Endpoint**:
- **Method**:
- **Auth Guard**:
- **Payload/Zod Schema**:

# 6. 数据存储映射 (Database Schema)

> Prisma 或 SQL 结构的初步定义与高频查询（Index）设计方案。
