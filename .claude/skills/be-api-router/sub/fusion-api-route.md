---
name: fusion-api-route
description: be-api-router 专用。按 INTERFACE.md 编写 REST/GraphQL 路由、入参校验、权限守卫，TDD RED→GREEN→REFACTOR。
---

# fusion-api-route — 后端 API 路由层

> **融合来源**: ECC be-api-router + fusion-workflow Stage 5 TDD 规约 + security.md 零信任原则

---

## ⚡ 执行前 FP 两问（强制）

1. **我们的目的是什么？**
   → 严格按 INTERFACE.md 定义，将 HTTP 请求路由到 Domain 服务层，在路由层拦截所有非法输入和未授权访问，不碰业务逻辑。
2. **这些步骤已经不可原子级再分了吗？**
   → 路由定义 → 入参校验（Zod）→ 权限守卫 → 转发 Domain → 格式化响应，每步独立，不合并。

---

## 输入文件

| 文件                                            | 用途                                |
| ----------------------------------------------- | ----------------------------------- |
| `pipeline/2_planning/specs/TASK_SPEC_T-{ID}.md` | 本任务验收标准                      |
| `pipeline/1_architecture/INTERFACE.md`          | 接口规格（端点/入参/响应/权限要求） |

---

## TDD 执行循环

### 🔴 RED: 先写接口集成测试

```ts
// 测试要覆盖: 正常流 + 所有 INTERFACE.md 定义的错误状态码
describe('POST /api/auth/login', () => {
  it('返回 200 和 JWT Token（正确凭证）', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('返回 400（缺少必填字段）', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com' }); // 缺少 password
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('返回 401（错误凭证）', async () => {
    // Mock domain service 返回 null
  });
});
```

### 🟢 GREEN: 实现路由层

```ts
// 路由层三件套:
// 1. 入参校验（Zod Schema）
// 2. 权限守卫（JWT 中间件）
// 3. 转发 Domain 服务（不写业务逻辑）

import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { AuthDomainService } from '../domain/auth.service';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post('/auth/login', async (req, res) => {
  // 1. 入参校验
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ success: false, error: { code: 'ERR_INVALID_INPUT', message: '输入格式不正确' } });
  }

  // 2. 调用 Domain 服务（不写业务逻辑）
  const token = await AuthDomainService.login(result.data);
  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        error: { code: 'ERR_INVALID_CREDENTIALS', message: '邮箱或密码错误' },
      });
  }

  // 3. 统一响应格式（见 patterns.md API Response Format）
  return res.status(200).json({ success: true, data: { token } });
});
```

### 🔵 REFACTOR: 清理

- 提取重复的校验/错误响应逻辑为中间件
- 无 `console.log` 残留
- 每个路由文件 < 200 行

---

## 禁区（越界即违规）

- ❌ 禁止写数据库 SQL/Prisma 裸查逻辑（调 Domain 服务）
- ❌ 禁止在路由层写任何业务计算逻辑
- ❌ 禁止跳过 Zod/Joi 入参校验
- ❌ 禁止返回技术错误堆栈给前端

---

## 完成条件

- [ ] 所有 INTERFACE.md 定义的接口均已实现（含所有错误状态码）
- [ ] 每个接口有 Zod Schema 校验
- [ ] 需要认证的接口已加权限守卫
- [ ] 响应格式遵循统一 API Response Format

**完成后 → 在 monitor.md 标记 `[x]` → 进入 QA 轮询循环。**
