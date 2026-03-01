# Fusion-Core 集成验证清单 (IV-01 ~ IV-03)

> **[!] CRITICAL (深水区猎手)**: 这是 Stage 6 护城河的最后 3 道漏斗（Integration Verification）。它们不查语法，只查核心业务血液是否畅通。

## IV-01: 端到端连通性 (End-to-End Connectivity)

- **目标**: 确保系统核心血管畅通，API 接口可以被客户端或 CLI 真实调用。
- **拦截条件 (Checklist)**:
  - [ ] `Playwright` 核心 User Journey 主流程测试全部跑通。
  - [ ] HTTP Request 返回状态码全绿（没有 500，400，404）。
  - [ ] CORS 配置与环境守卫（Middleware）没有错误拦截。

## IV-02: 数据穿透性 (Data Immutability & Penetration)

- **目标**: 验证 UI 层传递的数据，能准确无误地落盘到 DB 层，且满足 ACID。
- **拦截条件 (Checklist)**:
  - [ ] GraphQL / REST 的序列化与反序列化（例如日期类型）无类型丢弃。
  - [ ] 脏数据读写并发测试下（如果涉及），数据库的乐观锁或悲观锁生效。
  - [ ] (如果有缓存) Cache Invalidation（缓存失效）机制表现符合预期。

## IV-03: 混沌与极限破坏 (Chaos & Edge Cases)

- **目标**: 模拟最糟糕的网络和用户习惯。
- **拦截条件 (Checklist)**:
  - [ ] 边界值注入（空字符串、极大数字、非常规特殊符号）未导致系统崩溃。
  - [ ] 长连接或长事务触发超时 (Timeout) 时，是否有优雅的降级报错 (Graceful Degradation)。
  - [ ] 内存或上下文指针溢出预警。
