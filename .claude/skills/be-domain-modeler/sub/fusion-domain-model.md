---
name: fusion-domain-model
description: be-domain-modeler 专用。编写纯函数型领域服务逻辑和 Repository 实现，TDD RED→GREEN→REFACTOR。
---

# fusion-domain-model — 领域服务与业务逻辑

> **融合来源**: ECC be-domain-modeler + fusion-workflow Stage 5 TDD 规约 + patterns.md Repository Pattern

---

## ⚡ 执行前 FP 两问（强制）

1. **我们的目的是什么？**
   → 实现核心业务逻辑（计算规则、状态转换、约束验证），通过 Repository 抽象访问数据，保持业务逻辑与基础设施的完全解耦，让业务逻辑可以独立单元测试。
2. **这些步骤已经不可原子级再分了吗？**
   → 先写单元测试（Mock Repository）→ 实现领域服务 → 实现 Repository → 验证集成。

---

## 输入文件

| 文件                                            | 用途                   |
| ----------------------------------------------- | ---------------------- |
| `pipeline/2_planning/specs/TASK_SPEC_T-{ID}.md` | 本任务验收标准         |
| `pipeline/1_architecture/Data_Models.md`        | 核心实体定义           |
| `pipeline/1_architecture/INTERFACE.md`          | 需要实现的业务方法签名 |

---

## TDD 执行循环

### 🔴 RED: 先写单元测试（Mock Repository）

```ts
// 领域服务测试: 完全隔离数据库，使用 Mock Repository
describe('AuthService.login', () => {
  const mockUserRepo = {
    findByEmail: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('返回 JWT Token（有效凭证）', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: await hashPassword('password123'),
    });

    const token = await AuthService.login('test@example.com', 'password123', mockUserRepo);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('返回 null（错误密码）', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({
      passwordHash: await hashPassword('correctPassword'),
    });

    const token = await AuthService.login('test@example.com', 'wrongPassword', mockUserRepo);

    expect(token).toBeNull();
  });

  it('返回 null（用户不存在）', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    const token = await AuthService.login('nonexistent@example.com', 'password', mockUserRepo);
    expect(token).toBeNull();
  });
});
```

### 🟢 GREEN: 实现领域服务（纯函数型）

```ts
// 领域服务规则:
// 1. 纯函数型，不直接依赖数据库
// 2. 通过 Repository 接口访问数据（可注入 Mock）
// 3. 不处理 HTTP Request/Response/Token 等传输层概念

interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

export class AuthService {
  static async login(
    email: string,
    password: string,
    repo: UserRepository,
  ): Promise<string | null> {
    const user = await repo.findByEmail(email);
    if (!user) return null;

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) return null;

    return generateJWT({ userId: user.id, role: user.role });
  }
}
```

### 🔵 REFACTOR: 清理

- 业务规则提取为命名良好的私有方法
- 复杂计算附简短注释说明业务意图
- 函数体 < 40 行（超出则拆分）

---

## Repository 实现规范

```ts
// 真实 Repository 实现（连接数据库）
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
```

---

## 禁区（越界即违规）

- ❌ 禁止直接调用 `prisma` / 数据库连接（通过 Repository 接口）
- ❌ 禁止处理 HTTP Request/Response/JWT 解析（属于路由层）
- ❌ 禁止在业务逻辑中写 SQL 字符串

---

## 完成条件

- [ ] 所有单元测试绿灯（Repository Mock 测试，无数据库依赖）
- [ ] 领域服务通过依赖注入接受 Repository
- [ ] 业务约束验证完整（边界值/空值/权限规则）

**完成后 → 在 monitor.md 标记 `[x]` → 进入 QA 轮询循环。**
