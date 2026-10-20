import { productAgent } from "@/app/lib/agent/agent";

try {
  const result = await productAgent.generate({
    prompt: 'Compare product 130 with product 9999',
    options: { userId: 'demo-user' },
    onStepFinish: ({ toolCalls, toolResults, content, usage }) => {
      for (const c of toolCalls) console.log('→', c.toolName, JSON.stringify(c.input));
      for (const r of toolResults) console.log('←', r.toolName, JSON.stringify(r.output).slice(0, 200));
      for (const part of content) {
        if (part.type === 'tool-error') console.log('✗', part.toolName, String(part.error));
      }
      console.log('  tokens:', usage.inputTokens, 'in /', usage.outputTokens, 'out');
    },
  });
  console.log(result.text);
} catch (error) {
  console.error((error as Error).message);
}