---
name: fusion-ai-integrate
description: be-ai-integrator 专用。接入 LLM/MCP 子系统，调优 Prompt 与 Function Calling，TDD RED→GREEN→REFACTOR。
---

# fusion-ai-integrate — AI 能力集成

> **融合来源**: ECC be-ai-integrator + fusion-workflow Stage 5 TDD 规约

---

## ⚡ 执行前 FP 两问（强制）

1. **我们的目的是什么？**
   → 将 LLM/MCP 等 AI 能力封装为稳定、可测试的内部服务，让 Domain 层调用 AI 能力就像调用普通函数一样可靠，并有明确的降级方案。
2. **这些步骤已经不可原子级再分了吗？**
   → AI 集成接口定义 → Mock 测试 → 真实调用实现 → 降级策略，每步独立。

---

## 输入文件

| 文件                                            | 用途            |
| ----------------------------------------------- | --------------- |
| `pipeline/2_planning/specs/TASK_SPEC_T-{ID}.md` | 本任务验收标准  |
| `pipeline/1_architecture/INTERFACE.md`          | AI 能力接口定义 |
| `pipeline/1_architecture/ADR/`                  | AI 技术选型决策 |

---

## TDD 执行循环

### 🔴 RED: 先写测试（Mock LLM 响应）

```ts
// AI 集成测试必须 Mock，避免依赖真实 API
describe('AIService.analyzeMedicalText', () => {
  const mockLLMClient = {
    complete: jest.fn(),
  };

  it('成功分析并返回结构化结果', async () => {
    mockLLMClient.complete.mockResolvedValue({
      content: '{"diagnosis": "高血压", "confidence": 0.85}',
    });

    const result = await AIService.analyzeMedicalText('患者血压180/120', mockLLMClient);

    expect(result.diagnosis).toBe('高血压');
    expect(result.confidence).toBeGreaterThan(0.8);
  });

  it('LLM 超时时返回降级结果', async () => {
    mockLLMClient.complete.mockRejectedValue(new Error('Timeout'));

    const result = await AIService.analyzeMedicalText('测试文本', mockLLMClient);

    // 降级策略: 返回空结果而非抛出错误
    expect(result).toEqual({ diagnosis: null, confidence: 0, error: 'AI_TIMEOUT' });
  });
});
```

### 🟢 GREEN: 实现 AI 服务

```ts
// AI 集成规则:
// 1. Prompt 工程封装在专用函数中，便于调优
// 2. 必须有降级策略（LLM 超时/失败 → 不崩溃）
// 3. 响应解析有容错处理（LLM 输出格式不稳定）
// 4. Token 使用量日志记录（成本可观察）

export class AIService {
  static async analyzeMedicalText(text: string, llmClient: LLMClient): Promise<AnalysisResult> {
    const prompt = buildMedicalAnalysisPrompt(text); // Prompt 独立函数，便于调优

    try {
      const response = await Promise.race([
        llmClient.complete(prompt),
        timeout(30000), // 30秒超时
      ]);

      return parseAnalysisResponse(response.content); // 有容错的解析
    } catch (error) {
      logger.error('AI analysis failed', { error, textLength: text.length });
      return { diagnosis: null, confidence: 0, error: 'AI_TIMEOUT' }; // 降级而非抛出
    }
  }
}

function buildMedicalAnalysisPrompt(text: string): string {
  return `你是医疗文本分析助手。请分析以下文本并以 JSON 格式返回诊断结果。
格式: {"diagnosis": "...", "confidence": 0.0-1.0}
文本: ${text}`;
}
```

### 🔵 REFACTOR: 清理

- Prompt 模板版本化管理
- 响应解析逻辑有单元测试覆盖
- AI 调用结果缓存策略（如适用）

---

## 禁区（越界即违规）

- ❌ 禁止修改主业务线的 CRUD 模型
- ❌ 禁止修改数据库 Schema
- ❌ 禁止在无降级策略的情况下集成 AI（AI 挂了不能崩整个系统）

---

## 完成条件

- [ ] 所有测试绿灯（含 LLM 失败/超时的降级测试）
- [ ] Prompt 封装在独立可调优函数中
- [ ] 明确的降级策略（不返回 500 给前端）

**完成后 → 在 monitor.md 标记 `[x]` → 进入 QA 轮询循环。**
