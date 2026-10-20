import { productAgent } from '@/app/lib/agent/agent';
import { createAgentUIStreamResponse, type UIMessage } from 'ai';

// Upper bound for one agent run on Vercel; the step limit should end it well before this
export const maxDuration = 60;

const MAX_MESSAGES = 40;
const MAX_USER_CHARS = 2000;

const userText = (m: UIMessage) =>
  m.parts
    .filter((p) => p.type === 'text')
    .map((p) => p.text)
    .join('');

export async function POST(request: Request) {
  let messages: UIMessage[];
  try {
    ({ messages } = await request.json());
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return Response.json({ error: 'Invalid conversation' }, { status: 400 });
  }

  const tooLong = messages.some((m) => m.role === 'user' && userText(m).length > MAX_USER_CHARS);
  if (tooLong) {
    return Response.json({ error: 'Message too long' }, { status: 413 });
  }

  return createAgentUIStreamResponse({
    agent: productAgent,
    uiMessages: messages,
    options: { userId: 'demo-user' }, // from the session once there's real auth
  });
}