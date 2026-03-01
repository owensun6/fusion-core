# 01_Flow_Trace (全影向数据流探针)

> **目标**: HTTP 层是通的，不代表里面没藏着虫子。你的任务是发一条数据进去，然后去落库的地方把它挖出来，看看骨相有没有变形。

## 触发条件与协作角色

- **调用时机**: 代码通过 `iv-01` 集成跑通 HTTP 双向通讯后。
- **上游依赖**: 同样是业务契约 `PRD.md` 中对于数据处理环节（如脱敏、计算）的描述。
- **下游交接**: 将探伤正常的结构送给 `iv-03` 进行毁灭级的混沌实验。

## 核心原则 (Iron Rules)

1. **穿透验证**: 不能只看接口吐出的 JSON `{"success": true}`。必须深入到底层数据库（或者 Elasticsearch/Redis），比对落盘字段是否和抛入的强一致。
2. **计算还原度侦测**: 对于涉及到“价格、日期转换”等需要变异流动的字段，入库前和入库后（含时区转换）如果对不上，打回给后台重新算。
3. **黑盒侧写**: 在这里不允许看实现源码，将整个应用视作一个只暴露输入输出和 DB 的大黑盒。

---

## 示例对比 (DO / DON'T)

### 场景：新建一条医生的处方账单，验证它是否完好落库

#### ❌ DON'T - 表面上的繁荣

```typescript
it('应该成功结算账单', async () => {
  // 错误：仅仅查阅了响应体里面的 ok，就不管了
  const res = await api.post('/billing/pay', { orderId: 'O1', amount: 100 });
  expect(res.body.ok).toBe(true);
});
```

**问题**: 如果底层的汇率算错了导致入库金额是 0.01$，或者日志根本没写进去，这个用例照样是通过的，但它是彻头彻尾的灾难。

#### ✅ DO - 掘地三尺的双端穿透对账

```typescript
import db from '../infra/db';
import { api } from '../utils/test-api';

it('全数据流跟踪：不光要 API 报喜，数据库里的分毫必须全对', async () => {
  // 1. 发起动作
  const orderPayload = { orderId: 'O1', amount_cents: 10000 }; // 100块
  await api.post('/billing/pay', orderPayload);

  // 2. 深入地心取证 (黑盒侧写数据库本身)
  const savedOrder = await db.query('SELECT * FROM orders WHERE id=?', ['O1']);

  // 3. 断层扫描与对账
  expect(savedOrder.status).toBe('PAID');
  expect(savedOrder.amount_cents).toBe(10000); // [关键] 确保存库没丢失精度或被前端篡改
  expect(savedOrder.paid_at).toBeDefined(); // [关键] 确认时间戳生成勾子生效

  // 4. 副作用连查：查审计表里是否生成了流金岁月
  const auditLog = await db.query('SELECT * FROM audit_logs WHERE target_id=?', ['O1']);
  expect(auditLog.action).toBe('PAYMENT_CONFIRMED');
});
```

**原因**: 把隐藏在水管破裂处（如类型强转丢精度、时区存成UTC引发本地前台报错、缺少级联操作）的暗雷全部在沙盒里踩爆。

---

## 终级核验准则 Checklist (Exit Gates)

- [ ] 是否不盲信接口层的 200 响应，直接穿透到底层物理介质（DB/Cache）去比对了落盘的数据痕迹？
- [ ] 数据流中涉及联动变更的副作用表（如主表修改，必定关联写入一张日志表），是否都被纳入了断言观测中？
- [ ] 若流转中存在状态机（例如待付 -> 已付），是否有明确断言去读取落盘后的该枚举变动？
