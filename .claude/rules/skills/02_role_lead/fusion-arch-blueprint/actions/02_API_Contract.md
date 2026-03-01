# 02_API_Contract (全维契约缔造)

> **目标**: 前端 (FE) 和后端 (BE) 盲打死锁的根源往往是没有强契约。你的任务是强制签署和平协议。

## 触发条件与协作角色

- **调用时机**: `01_System_Design.md` 架构流图勾勒完成后。
- **上游依赖**: 系统架构中的实体名称与行为边界。
- **下游交接**: 唯一且是前端、后端进行 TDD 开发的核心基石。

## 核心原则 (Iron Rules)

1. **唯一真相来源 (SSOT)**: 必须产出唯一一份 `INTERFACE.md`，推荐使用近似 Swagger / OpenAPI 的 Markdown 表格或代码块风格。
2. **格式死板化**: 接口必须包含 Header 期望、Request / Response JSON，最重要的是**所有的异常码约定**。
3. **跨端不可见**: Frontend 和 Backend 特种兵唯一能够查阅的文件就是你写的这份契约。

---

## 示例对比 (DO / DON'T)

### 场景：定义一个“创建挂号订单”的接口

#### ❌ DON'T - 漏掉异常状态和明确类型的黑盒

```json
// 糟糕的设计，全是猜测
POST /api/order
Request: { patientId, doctorId, amount }
Response: { success: true, data: {} }
或者失败返回 { success: false, msg: "余额不足" }
```

**问题**: 下游的前端拿到这个契约后，不知道 patientId 是不是数字，不知道怎么处理 Token 超时，不知道 500 和 400 怎么分别响应。必然产生幻觉缝合！

#### ✅ DO - 军事化、强类型、包含全生命周期的 RESTful 契约

````markdown
### `POST /api/v1/registrations` 创建挂号订单

**鉴权**: `Bearer JWT` (必需)

**Request Body (application/json)**

```json
{
  "patient_id": "uuid-string", // [Required] 挂号人 ID
  "department_id": "number", // [Required] 科室 ID
  "fee_cents": "number" // [Required] 挂号费，严格使用整型分避免精度丢失
}
```
````

**Responses**:

- `201 Created`: 成功出号

  ```json
  { "reg_id": "R1001", "status": "PENDING_PAYMENT" }
  ```

- `400 Bad Request`: 参数不合法 (如费率负数)
- `403 Forbidden`: 此医保卡存在严重违规，禁止挂号
- `409 Conflict`: 医生该时段号源已全部锁死，抛出并发冲突

```
**原因**: 这个粒度下，前后端立刻可以写好各自领域的 `try-catch` Block，Mock 数据也有了唯一标准。

---

## 终级核验准则 Checklist (Exit Gates)
- [ ] 每个 API 路由的入参出参是否清晰列出了数据格式（String, Int）与必填状态？
- [ ] 是否在全局抛弃了模糊的 `200 Success: false`，启用了严格的 4xx/5xx HTTP 核心状态码设计？
- [ ] 针对写库核心操作，是否约定了并发碰撞时的返回机制（如 409）或锁机制协议？
```
