# 01_Red_Fail_Test (红灯阻断：TDD 试脉石)

> **目标**: 作为全村最无孔不入的扫地僧，你的第一步绝不是秀业务算法，而是写一个坚固的“脚手架”让它挂掉。

## 触发条件与协作角色

- **调用时机**: 每次任何底层 Dev (`fe-`, `be-`, `db-`) 特种兵被派发了编码任务之后，执笔的第一秒。
- **上游依赖**: 只能依靠 `INTERFACE.md` 和 `PRD.md`，无视目前任何环境。
- **下游交接**: 你的满江红 Fail Logs 必须抛射给 `02_Green_Minimum` 进行修复。

## 核心原则 (Iron Rules)

1. **先写失败断言**: 强行要求先写 `.spec.ts`, `_test.go` 或 `test_*.py`。
2. **拿不到红色红灯就不准走**: 必须执行测试引擎（如 Jest/PyTest/RSpec），并且输出结果必须是真正的 `FAIL`（这意味着环境和测试基座搭建完成）。
3. **隔离边界**: 测试代码不能试图 Mock 全宇宙，比如你要测 Service，那就得把 DB 和 API 请求拦在沙盒外面。

---

## 示例对比 (DO / DON'T)

### 场景：测试一个患者年龄计算函数

#### ❌ DON'T - 直接写实现或只测 Happy Path

```typescript
// 错误 1: 没写测试就先写了计算函数
export const getAge = (dob: string) => { ...计算逻辑... }

// 错误 2: 这时回补的测试，只测了一条明路，而且没拿到 fail log
it("should return correct age", () => {
   expect(getAge("1990-01-01")).toBe(34);
});
```

**问题**: 这是为了 KPI 补测试，并没有防范到“输入未来日期”、“空字符串”等核武器引发的服务击穿风险。

#### ✅ DO - 真正的 TDD 失败驱动思维

```typescript
// 第一步：只写骨架，故意抛错
export const getAge = (dob: string): number => {
  throw new Error('Method not implemented.');
};

// 第二步：穷举 3 种边界断言，拿 3 个 Fail Log
describe('getAge Domain Engine', () => {
  it('【基础流】 传递过去的合法年份应结算出正确年龄', () => {
    expect(getAge('1990-01-01')).toBe(34); // 测试框架抛出异常 (拿红)
  });

  it('【边界防守】 出生日期在未来，应直接熔断报错', () => {
    expect(() => getAge('2050-01-01')).toThrow('Invalid Future Date'); // 测试框架收不到错误 (拿红)
  });
});
```

**原因**: 通过强制先拿到 RED LOG，证明你的这把测试锁是牢固可用的，不会是一把永远为绿的“假锁”。

---

## 终级核验准则 Checklist (Exit Gates)

- [ ] 测试是否在跑之前确保业务实现是空的/故意写错的？
- [ ] 控制台上是否真实捕捉到了预期的 `Test Suite Failed` 报错痕迹？
- [ ] 测试用例是否囊括了 `Null`, `Malformed String` 这类极易触发空指针的死亡场景？
