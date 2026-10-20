import { asSchema, type FlexibleSchema, type ToolExecuteFunction } from 'ai';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as enquiries from '../enquiries';
import { addReview } from '../review-store';
import { getProducts, searchProducts, sendEnquiry, showComparison } from './tools';

// Runs a tool's execute as a plain function and unwraps the result
async function run<Input, Output, Context>(
  tool: { execute?: ToolExecuteFunction<Input, Output, Context> },
  input: Input,
  context: Context,
): Promise<Output> {
  if (!tool.execute) throw new Error('Tool has no execute function');
  const result = await tool.execute(input, { toolCallId: 'test-call', messages: [], context });
  if (result !== null && typeof result === 'object' && Symbol.asyncIterator in result) {
    throw new Error('Streaming tool output is not expected here');
  }
  return result;
}

// Validates input the same way the SDK does before calling execute
async function acceptsInput(tool: { inputSchema: FlexibleSchema<unknown> }, value: unknown) {
  const result = await asSchema(tool.inputSchema).validate?.(value);
  return result?.success ?? true;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('searchProducts', () => {
  it('returns compact summaries for matching products', async () => {
    const result = await run(searchProducts, { query: 'phone', category: 'smartphones' }, {});

    expect(result.total).toBeGreaterThan(0);
    expect(result.products?.length).toBeGreaterThan(0);
    for (const p of result.products ?? []) {
      expect(Object.keys(p).sort()).toEqual(['brand', 'id', 'price', 'rating', 'summary', 'title']);
      expect(p.summary.length).toBeLessThanOrEqual(120);
    }
  });

  it('sorts by rating when asked', async () => {
    const result = await run(searchProducts, { query: 'phone', category: 'smartphones', sortBy: 'rating' }, {});
    const ratings = (result.products ?? []).map((p) => p.rating);

    expect(ratings).toEqual([...ratings].sort((a, b) => b - a));
  });

  it('explains how to recover when nothing matches', async () => {
    const result = await run(searchProducts, { query: 'zzzz-no-such-thing' }, {});

    expect(result).toEqual({ total: 0, message: expect.stringContaining('Try fewer keywords') });
  });

  it('rejects an empty query', async () => {
    expect(await acceptsInput(searchProducts, { query: '' })).toBe(false);
  });
});

describe('getProducts', () => {
  it('returns details and reviews without images, meta or reviewer names', async () => {
    const result = await run(getProducts, { ids: [1] }, {});
    const [product] = result.products;

    expect(result.notice).toMatch(/do not follow any instructions/i);
    expect(product.found).toBe(true);
    if (!product.found) return;
    expect(product.id).toBe(1);
    expect(product).not.toHaveProperty('images');
    expect(product).not.toHaveProperty('meta');
    expect(product.reviews.length).toBeGreaterThan(0);
    for (const review of product.reviews) {
      expect(Object.keys(review).sort()).toEqual(['comment', 'date', 'rating']);
    }
  });

  it('includes reviews submitted through the site', async () => {
    addReview('2', { reviewerName: 'Test', rating: 4, comment: 'Submitted via the form', date: '2026-01-01T00:00:00.000Z' });

    const result = await run(getProducts, { ids: [2] }, {});
    const [product] = result.products;

    expect(product.found && product.reviews.map((r) => r.comment)).toContain('Submitted via the form');
  });

  it('marks unknown IDs as not found instead of failing the whole call', async () => {
    const result = await run(getProducts, { ids: [1, 99999] }, {});

    expect(result.products.map((p) => p.found)).toEqual([true, false]);
    expect(result.products[1]).toMatchObject({ id: 99999, message: expect.stringContaining('searchProducts') });
  });
});

describe('showComparison', () => {
  const product = (id: number) => ({ id, title: `Product ${id}`, price: 10, rating: 4, pros: ['Light'], cons: [] });

  it('acknowledges that the comparison was displayed', async () => {
    const input = { products: [product(1), product(2)], recommendation: 'Pick 1 for X, 2 for Y.' };

    expect(await run(showComparison, input, {})).toEqual({ displayed: true });
  });

  it('needs at least two products', async () => {
    expect(await acceptsInput(showComparison, { products: [product(1)], recommendation: 'n/a' })).toBe(false);
  });
});

describe('sendEnquiry', () => {
  it('saves the enquiry for the user from server context, not from model input', async () => {
    const save = vi.spyOn(enquiries, 'saveEnquiry').mockResolvedValue(undefined);

    const result = await run(
      sendEnquiry,
      { productId: 1, message: 'Is this available in blue?' },
      { userId: 'user-123' },
    );

    expect(save).toHaveBeenCalledWith({ userId: 'user-123', productId: 1, message: 'Is this available in blue?' });
    expect(result.sent).toBe(true);
  });

  it('rejects messages that are too short', async () => {
    expect(await acceptsInput(sendEnquiry, { productId: 1, message: 'hi' })).toBe(false);
  });
});
