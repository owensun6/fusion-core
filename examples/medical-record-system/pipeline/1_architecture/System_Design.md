<!-- Author: lead -->

# 医疗病案视图系统设计 (System Design)

## 1. 架构原则

- **前端分离**: `fe-ui` 负责无状态渲染，`fe-logic` 负责状态管理树 (Zustand)。
- **后端领域驱动**: `be-domain` 规定数据实体，`be-api` 负责 HTTP JSON 序列化。

## 2. 数据结构拦截 (Zero-Trust)

我们采用 Zod 进行防御：

```typescript
const EmrSchema = z.object({
  patientId: z.string().uuid(),
  chiefComplaint: z.string().min(10),
});
```
