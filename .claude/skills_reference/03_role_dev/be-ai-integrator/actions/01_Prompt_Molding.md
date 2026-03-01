# 01_Prompt_Molding (大模型魔法翻译官)

> **目标**: LLM 充满不确定性，你的任务是用 Prompt Engineering 的工程化手段，把它的不确定性关进死盒子里。除了你，别的兵种不允许发起基于大模型的调用。

## 触发条件与协作角色

- **调用时机**: 当系统功能依赖于从乱码文本中提取结构、图像识别或者语义决策时。
- **上游依赖**: 从 Domain/Service 层透传进来的清洗后的数据。
- **下游交接**: 将确定的结构体原封不动地还给 Domain 层去落库或转译。

## 核心原则 (Iron Rules)

1. **绝对脱敏**: 你编写的代码在调用大模型前，必须使用正则等拦截掉所有用户姓名、社保号（SSN），必须全部 `Mask` 成 `***`。
2. **防超限熔断**: 所有大模型调用函数，必须配置 Timeout（超时时间，例如 15 秒）与 Retry 机制（指数退避至少 2 次）。
3. **强制结构化返回 (Function Calling)**: 所有送去大模型的 Prompt，必须要求它使用 JSON 原生返回格式，拿到非 JSON 的数据一律当系统 Error 向上抛出。

---

## 示例对比 (DO / DON'T)

### 场景：从门诊医生的一段语音识别文本中，提取“确诊疾病”与“用药建议”

#### ❌ DON'T - 让大模型自由发挥，产生无法被解析的幻觉输出

```typescript
import { openai } from '../ai-client';

export const extractMedicalInfo = async (voiceText: string) => {
  // 错误 1: 没有对 voiceText 的病人敏感词做脱敏
  // 错误 2: 仅仅给了一个模糊的 prompt，然后直接返回了 string
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: `请提取里面的疾病和用药: ${voiceText}。请用 JSON 给我` }],
  });

  return JSON.parse(response.choices[0].message.content); // 极大的风险：可能会 parse Error，直接导致后端崩溃
};
```

**问题**: 没有任何重试、类型校验底座，不仅导致隐私泄漏协议崩溃，还会在生产环境抛出大量 `JSON.parse` 异常。

#### ✅ DO - 极致防御、参数脱敏与强结构化抽取

```typescript
import { z } from 'zod';
import { generateObject } from 'ai'; // 利用 Vercel AI 等专业抽取库
import { openai } from '../ai-client';

// 1. Zod 前置契约：逼迫 LLM 必须按这个类型产出
const MedicalExtractionSchema = z.object({
  diagnosis: z.string().describe('医生确诊的疾病标准名称'),
  medications: z.array(z.string()).describe('提及的开药清单'),
  confidence: z.number().min(0).max(1).describe('提取置信度'),
});

export const extractMedicalInfo = async (rawVoiceText: string) => {
  // 2. 物理脱敏层 (PII Masking)
  const safeText = rawVoiceText.replace(/(陈|张|李)(.*?)(先生|女士)/g, '***$3');

  try {
    // 3. 强约束：使用 Response Format 机制，只收 JSON
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: MedicalExtractionSchema,
      prompt: `这通常是一段带有口音和术语的门诊原声带，请基于以下文字提取结构化数据：\n\n"${safeText}"`,
    });

    // 判断置信度阈值
    if (object.confidence < 0.8) {
      throw new Error('AI 提取置信度不足以作为病历入库依据');
    }

    return object;
  } catch (error) {
    // 4. 标准熔断捕获：向上层 Domain 抛出专用格式错误，绝不抛原生 error
    throw new RuntimeDomainError('AI_EXTRACTION_FAILED', error.message);
  }
};
```

**原因**: 这个封装让所有不可控的力量被收编在一层厚厚的保护壳之内，无论 AI 发什么疯，系统都不会出现未处理的崩溃。

---

## 终级核验准则 Checklist (Exit Gates)

- [ ] 该方法内是否包含了诸如正则替换或专门的匿名化包裹器来进行 PII/PHI （个人健康信息）脱敏？
- [ ] 调用链上是否有明确的 Retry (重试) 及 Fallback (兜底错误返回) 等异常流覆盖？
- [ ] 返回值是否使用了如 `Zod` 或 `JSON Schema` 的强声明，防止应用拿到无意义的胡言乱语？
