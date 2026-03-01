# 01_REST_Contract (冷酷门卫：API 契约转译器)

> **目标**: 不要在 `Controller / Router` 里写复杂的扣钱逻辑或核心算法。这里是火车站的检票口：只管“票长得对不对”，一旦伪造立马踹出去。

## 触发条件与协作角色

- **调用时机**: TDD 红色骨架已建好，需要打通 HTTP 层以测试接口行为时。
- **上游依赖**: Lead 在 Stage 1-4 制定的 `INTERFACE.md`。
- **下游交接**: 验证通过后的数据扔给 `be-domain-modeler` 领域老中医去处理。

## 核心原则 (Iron Rules)

1. **只看契约**: 对准 `INTERFACE.md`。如果传进来的参数错误，直接按照规定的状态码抛出 `400 Bad Request` 加上具体原因。
2. **只负责转译 (No Biz Logic)**: Controller 里不允许出现长过 10 行的计算与组合逻辑。拿到 DTO 立马就扔入 Service。
3. **鉴权先行**: 所有接口必须加上全局 Guards 拦污器（如 JWT Token 解析、基于请求头的强身份断言）。

---

## 示例对比 (DO / DON'T)

### 场景：暴露一个供前端调用以取消未结账处方的 API

#### ❌ DON'T - 将数据库和业务揉进检票口 (胖控制器)

```typescript
import { Request, Response } from 'express';
import db from '../db';

export const cancelPrescription = async (req: Request, res: Response) => {
  const { prescriptionId } = req.body;

  // 错误 1: 把医疗核心规则 (判断状态) 泄漏到了 API 控制层
  const p = await db.query('SELECT status FROM pres WHERE id = ?', [prescriptionId]);
  if (p.status === 'PAID') {
    return res.status(400).send('已结账不能取消');
  }

  // 错误 2: 亲属去操刀数据库写入
  await db.query('UPDATE pres SET status = "CANCELLED" WHERE id = ?', [prescriptionId]);
  return res.json({ success: true });
};
```

**问题**: 导致核心业务逻辑无法脱离 HTTP 环境被复用测试。将来如果想要改成通过 gRPC 或者定时任务来取消处方，这段代码等于废钢。

#### ✅ DO - 极薄控制层与强格式拦网 (瘦控制器)

```typescript
import { Controller, Post, Body, UseGuards, Param, HttpCode } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { PrescriptionService } from '../domain/prescription.service'; // 向下召唤中医
import { CancelDto } from './dtos/cancel.dto'; // 基于 INTERFACE 强约定的数据壳

@Controller('api/v1/prescriptions')
@UseGuards(AuthGuard) // 前置鉴权海关锁
export class PrescriptionController {
  constructor(private readonly presService: PrescriptionService) {}

  @Post(':id/cancel')
  @HttpCode(200) // 与契约对接，绝不乱飘状态码
  async cancel(
    @Param('id') prescriptionId: string,
    @Body() dto: CancelDto, // 内置校验装饰器：如果为空直接在网关外抛出 400
  ) {
    // 仅仅作为传声筒：收到票，核对名字无误，立刻移交给主治医生
    return await this.presService.cancelPrescriptionCore(prescriptionId, dto.reason);
  }
}
```

**原因**: 让接口层变薄，这样大模型极不容易出现逻辑幻觉。它的任务就只是查字典和核对类型。

---

## 终级核验准则 Checklist (Exit Gates)

- [ ] 该 Router/Controller 抛出的所有 Status Code 是否完全不多于、不少于、不违背 `INTERFACE.md` 里的异常规定？
- [ ] Controller 的入口参数是否加上了强校验修饰符或 Zod 验证？
- [ ] 是不是绝不包含直接连接 DB 或发起复杂 `if-else` 的深水区业务码？
