# 01_Integration (端到端契约试运转)

> **目标**: 前端测绿了，后端也测绿了，但两家一连就崩。你的任务就是在此刻“拧亮开关”，用物理请求让前后端真刀真枪跑一圈。

## 触发条件与协作角色

- **调用时机**: Backend 和 Frontend 的代码都已提交，并通过了静态及安全审查（`qa-01` ~ `qa-04`）后。
- **上游依赖**: 已定稿的 `INTERFACE.md`，及部署或可运行的测试环境实例。
- **下游交接**: 通过了真实连线的节点网，会移交给 `iv-02` 进行数据探坑。

## 核心原则 (Iron Rules)

1. **脱离 Mock 区**: 不允许使用 Sinon 或 Jest 去 `mock` 网络请求。你必须手写真实的 `Supertest`、`Playwright` 或者原生的 `fetch` 脚本去打真实的 Endpoint。
2. **校验握手契约**: 根据 `INTERFACE.md`，前端带 Token 发送一次全量 Payload 到后端，必须断言后端返回的是 200，且结构无误。
3. **隔离依赖**: 跑测试前必须通过脚本清空并重置测试专用的临时沙盒数据库结构。绝不污染其他测试。

---

## 示例对比 (DO / DON'T)

### 场景：测试新增处方 (Frontend Component) 到开药 API (Backend Endpoint) 的连线

#### ❌ DON'T - 依然沉溺于两家各自闭门造车的“假联调”

```typescript
// 用假数据蒙骗过关
it('should return 200 when mock api is called', async () => {
  // 错误 1: 拦截了网络请求，根本没走到后端跑
  global.fetch = jest.fn(() => Promise.resolve({ json: () => ({ success: true }) }));
  const res = await callPrescriptionApi({});
  expect(res.success).toBe(true);
});
```

**问题**: 掩耳盗铃。如果后端今天把字段名从 `doctorId` 改成了 `physician_id`，这个 Mock 测试照样是绿的，但生产环境直接爆炸。

#### ✅ DO - 暴力真实的端到端打桩寻雷

```typescript
import request from 'supertest';
import { app } from '../server/app'; // 物理拉起后端实例
import { initializeTestDB, clearTestDB } from '../utils/test-db';

describe('Integration: Fe-Component <-> Be-Api-Router', () => {
  beforeAll(async () => await initializeTestDB());
  afterAll(async () => await clearTestDB());

  it('真机测试：发送包含错误药方的数据，应该严格返回 400', async () => {
    // 1. 发射真实弹药
    const res = await request(app)
      .post('/api/v1/prescriptions')
      .set('Authorization', 'Bearer test_token_123')
      .send({
        patient_id: 'p_100', // 有效
        fee_cents: -500, // 故意构造的非法参数
      });

    // 2. 断言真实反应
    expect(res.status).toBe(400); // 如果后端没有正确拦截并返回这，说明联调失败
    expect(res.body).toHaveProperty('error_code', 'INVALID_FEE');
  });
});
```

**原因**: 让隐藏在黑暗里的类型对焦问题、路由挂载问题、以及中间件拦截问题，瞬间暴露在阳光下。

---

## 终级核验准则 Checklist (Exit Gates)

- [ ] 该集成测试集内，是否没有任何一处使用了网络层的 Mock/Stub，保证了数据包真实的进出？
- [ ] 测试前与测试后，是否确保了数据库和缓存容器（如 Redis）在沙盒内的干净重置？
- [ ] 该集线流是否至少包含一个基于 `INTERFACE.md` 契约的全量 Happy Path 请求连通测试？
