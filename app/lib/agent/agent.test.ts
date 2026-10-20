import { MockLanguageModelV4 } from 'ai/test';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createProductAgent } from './agent';
import { searchProducts, sendEnquiry } from './tools';

const usage = {
  inputTokens: { total: 10, noCache: 10, cacheRead: undefined, cacheWrite: undefined },
  outputTokens: { total: 5, text: 5, reasoning: undefined },
};

const toolCall = (toolName: string, input: object) => ({
  content: [{ type: 'tool-call' as const, toolCallId: 'call-1', toolName, input: JSON.stringify(input) }],
  finishReason: { unified: 'tool-calls' as const, raw: undefined },
  usage,
  warnings: [],
});

const text = (value: string) => ({
  content: [{ type: 'text' as const, text: value }],
  finishReason: { unified: 'stop' as const, raw: undefined },
  usage,
  warnings: [],
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('productAgent', () => {
  it('runs searchProducts with the arguments the model chose, then answers', async () => {
    const execute = vi.spyOn(searchProducts, 'execute');
    const model = new MockLanguageModelV4({
      doGenerate: [
        toolCall('searchProducts', { query: 'phone', category: 'smartphones', sortBy: 'rating' }),
        text('Here are the top-rated smartphones.'),
      ],
    });

    const result = await createProductAgent(model).generate({
      prompt: 'What are the best smartphones?',
      options: { userId: 'test-user' },
    });

    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith(
      { query: 'phone', category: 'smartphones', sortBy: 'rating' },
      expect.objectContaining({ toolCallId: 'call-1' }),
    );
    expect(result.steps[0].toolResults[0]).toMatchObject({
      toolName: 'searchProducts',
      output: { total: expect.any(Number), products: expect.any(Array) },
    });
    expect(model.doGenerateCalls).toHaveLength(2);
    expect(result.text).toBe('Here are the top-rated smartphones.');
  });

  it('pauses for approval instead of sending an enquiry', async () => {
    const execute = vi.spyOn(sendEnquiry, 'execute');
    const model = new MockLanguageModelV4({
      doGenerate: [toolCall('sendEnquiry', { productId: 1, message: 'Is this still in stock?' })],
    });

    const result = await createProductAgent(model).generate({
      prompt: 'Ask the seller if product 1 is in stock',
      options: { userId: 'test-user' },
    });

    expect(execute).not.toHaveBeenCalled();
    expect(result.content).toContainEqual(
      expect.objectContaining({ type: 'tool-approval-request', toolCall: expect.objectContaining({ toolName: 'sendEnquiry' }) }),
    );
    expect(model.doGenerateCalls).toHaveLength(1);
  });
});
