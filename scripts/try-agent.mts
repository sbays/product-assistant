import { productAgent } from "@/app/lib/agent/agent";

try {
  const result = await productAgent.generate({
    prompt: 'Compare the two highest-rated smartphones',
    options: { userId: 'demo-user' },
    onStepFinish: ({ toolCalls, toolResults, usage }) => {
      for (const c of toolCalls) console.log('→', c.toolName, JSON.stringify(c.input));
      for (const r of toolResults) console.log('←', r.toolName, JSON.stringify(r.output).slice(0, 200));
      console.log('  tokens:', usage.inputTokens, 'in /', usage.outputTokens, 'out');
    },
  });
  console.log(result.text);
} catch (error) {
  console.error((error as Error).message);
}