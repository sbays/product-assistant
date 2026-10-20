import { ToolLoopAgent, Output, isStepCount } from 'ai';
import { searchProducts, getProducts } from '../app/lib/agent/tools';
import { comparisonSchema } from '../app/lib/agent/schemas';

const comparer = new ToolLoopAgent({
  model: process.env.AI_MODEL ?? 'minimax/minimax-m3.1-flash',
  instructions:
    'Compare products from the catalogue. Find candidates with searchProducts, then call getProducts ' +
    'once with every product you need. Only make claims supported by the tool results.',
  tools: { searchProducts, getProducts }, // no UI or write tools: this agent only returns data
  stopWhen: isStepCount(5),
  maxOutputTokens: 2048,
  maxRetries: 0,
  output: Output.object({ schema: comparisonSchema }),
});

try {
  const result = await comparer.generate({ prompt: 'Compare the two highest-rated laptops' });
  const comparison = result.output; // typed as Comparison, already validated

  for (const p of comparison.products) {
    console.log(`${p.title}: ${p.price}, rated ${p.rating}`);
    console.log('  +', p.pros.join(' | '));
    console.log('  -', p.cons.join(' | '));
  }
  console.log(comparison.recommendation);
  console.log('steps:', result.steps.length, 'usage:', result.usage);
} catch (error) {
  console.error((error as Error).message);
}