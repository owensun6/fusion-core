# 02_Green_Minimum (绿灯通行：抠门式填空)

> **目标**: 你的代码不是为了改变世界，是为了满足测试！代码写得越少，留下的 Bug 和屎山就越少。

## 触发条件与协作角色

- **调用时机**: 当你拿到了一堆来自于 `01_Red_Fail_Test` 给出的报错红灯时。
- **上游依赖**: 失败的测试用例文件和 Fail Log。
- **下游交接**: 一旦全部变绿并且重构消除异味后，即可进入 Reviewer 关卡审核。

## 核心原则 (Iron Rules)

1. **抠门策略 (Least Effort)**: 只要能让刚才那个 `FAIL` 的测试变绿，哪怕你在函数里直接写死 `return 34;` 都可以。迫使你增加代码量的唯一理由，是测试官加了新用例。
2. **严禁镀金 (No Gold Plating)**: 测试用例没要求你写的额外功能（比如顺手把日子格式化了一下），你不准多写一行。多写的全被视为越权开发。
3. **完成重构 (Refactor)**: 灯绿了不代表完事，在确保其依然是绿色的基础上，去除重复代码（DRY），解耦过度依恋，给变量重新命名以符合人类常识。

---

## 示例对比 (DO / DON'T)

### 场景：试图修复 `getAge` 函数拿到绿灯

#### ❌ DON'T - 引入超纲库或过度封装

```typescript
import moment from 'moment';
import { Logger } from '../utils/logger';

// 错误 1: 为了一点小逻辑引入了庞大的三方库
// 错误 2: 加了一堆目前测试没有要求的 Logger
export const getAge = (dob: string): number => {
  Logger.info(`Calculating age for ${dob}`);
  const years = moment().diff(moment(dob), 'years');
  if (years < 0) throw new Error('Invalid Future Date');
  return years;
};
```

**问题**: 过度设计，给项目带来不确定性的性能和安全负担。没有尊崇“最简闭环法”。

#### ✅ DO - 极致极简原生修复

```typescript
// 只要能防住边界并算出正确年份，使用语言原生生态即可，多写一个字算我输
export const getAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const now = new Date();

  if (birthDate > now) {
    throw new Error('Invalid Future Date');
  }

  const age = now.getFullYear() - birthDate.getFullYear();
  // 仅填补测试用例中强迫你涵盖的部分计算，绝不多封装多重逻辑
  return age;
};
```

**原因**: 将一切精力省下来供给给业务架构，而不是消耗在无意义的自我表现（冗余封装）上。

---

## 终级核验准则 Checklist (Exit Gates)

- [ ] 刚才报红的代码在重构填补后，控制台是否百分之百亮起了 `PASS`？
- [ ] 实现的源码内是否仅包含为了让测试通过的必须代码，未混杂任何额外库或未要求的附赠功能？
- [ ] 若实现了复杂计算，是否抽取出了能够自解释的局部小方法？
