# 01_State_Bind (状态机与接口缝合师)

> **目标**: UI 画手已经把“没有灵魂的壳子”画好了。你的任务是把 API 返回的 JSON 灌入壳子，并处理加载、报错等三态。

## 触发条件与协作角色

- **调用时机**: UI 组件 (`fe-ui-builder`) 和 API 契约 (`INTERFACE`) 都已就位时。
- **上游依赖**: 静态壳子组件，以及 Lead 划定的 `INTERFACE.md`。
- **下游交接**: 输出具有真正交互能力的页面及自定义 Hooks，等待 TDD 后续集成测试。

## 核心原则 (Iron Rules)

1. **绝对禁动样式 (No CSS)**: 不允许修改任何 `className`。如果有 UI 跑版，你只能在注释中标出，打回给 UI 重修。
2. **契约即真理**: 所有获取数据的方法（Fetch / React Query / SWR），其 TS 类型必须严格对照 `INTERFACE.md`。
3. **状态防御**: 必须显式处理所有的 `Loading` (加载中) 和 `Error` (错误回滚) 行为，避免出现白屏。

---

## 示例对比 (DO / DON'T)

### 场景：把 `PatientCard` 组件缝合到医生的“患者概览页”

#### ❌ DON'T - 不校验错误、不带类型的意大利面条代码

```tsx
import { PatientCard } from './PatientCard';

export const PatientScreen = () => {
  const [data, setData] = useState([]);

  // 错误 1: 缺少 Try-Catch，一旦 500 页面直接死亡
  // 错误 2: 类型是 any
  useEffect(() => {
    fetch('/api/patients')
      .then((r) => r.json())
      .then((d) => setData(d.data));
  }, []);

  // 错误 3: 没有 Loading 状态兜底
  return (
    <div>
      {data.map((p) => (
        <PatientCard name={p.name} age={p.age} />
      ))}
    </div>
  );
};
```

**问题**: 代码极其脆弱。在真实医疗网络环境下，这绝对会导致系统白屏不可用。

#### ✅ DO - 使用 Custom Hook 隔离状态流，并防御三态边界

```tsx
import { useQuery } from '@tanstack/react-query';
import { PatientCard } from './PatientCard';
import { getPatients } from '../api/patientApi'; // 根据 INTERFACE 强类型生成的请求库

export const PatientScreen = () => {
  // 1. 将复杂的交互委托给成熟的缓存与状态机管家
  const {
    data: patients,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['patientsList'],
    queryFn: getPatients,
  });

  // 2. 防御拦截 1: 错误处理兜底
  if (isError) {
    return <div className="error-banner">加载患者失败：{error.message}</div>;
  }

  // 3. 完美缝合：仅需传入 props 驱动木偶组件
  return (
    <div className="grid gap-4">
      {/* 防御拦截 2: 向下透传 Loading 给壳子让壳子去闪烁 */}
      {isLoading ? (
        <PatientCard isLoading={true} name="" age={0} onEditClick={() => {}} />
      ) : (
        patients.map((p) => (
          <PatientCard
            key={p.id}
            name={p.full_name}
            age={p.calculated_age}
            onEditClick={() => router.push(`/edit/${p.id}`)}
          />
        ))
      )}
    </div>
  );
};
```

**原因**: 让专业的人干专业的事。状态拼接就只负责状态转移和生命周期抛错防御，绝不碰 UI 和纯 DOM 的活。

---

## 终级核验准则 Checklist (Exit Gates)

- [ ] 所有 HTTP 请求返回后，是否包含了明确的失败补偿 (`Error Handling`)？
- [ ] 是否绝对避免了在此处新增任何 Tailwind/CSS 样式操作代码？
- [ ] DTO（数据传输对象）到 View Model 的映射，是否与 `INTERFACE.md` 一字不差？
