import { productAgent } from '@/app/lib/agent/agent';
import { tools } from '@/app/lib/agent/tools';
import { createAgentUIStreamResponse, safeValidateUIMessages, type UIMessage } from 'ai';

// Upper bound for one agent run on Vercel; the step limit should end it well before this
export const maxDuration = 60;

const MAX_MESSAGES = 40;
const MAX_USER_CHARS = 2000;
// The client sends the whole history, so cap the body too: assistant parts are client-controlled input
const MAX_BODY_BYTES = 200_000;

const userText = (m: UIMessage) =>
  m.parts
    .filter((p) => p.type === 'text')
    .map((p) => p.text)
    .join('');

export async function POST(request: Request) {
  // Unsigned approvals could be forged by a modified client, so refuse to run deployed without the secret
  if (process.env.VERCEL && !process.env.TOOL_APPROVAL_SECRET) {
    return Response.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const body = await request.text();
  if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
    return Response.json({ error: 'Conversation too long' }, { status: 413 });
  }

  let raw: unknown;
  try {
    raw = JSON.parse(body);
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const messagesInput = typeof raw === 'object' && raw !== null && 'messages' in raw ? raw.messages : undefined;
  if (!Array.isArray(messagesInput) || messagesInput.length === 0 || messagesInput.length > MAX_MESSAGES) {
    return Response.json({ error: 'Invalid conversation' }, { status: 400 });
  }

  // Checks part shapes and tool inputs/outputs against the real tool schemas
  const validated = await safeValidateUIMessages({ messages: messagesInput, tools });
  if (!validated.success) {
    return Response.json({ error: 'Invalid conversation' }, { status: 400 });
  }
  const messages = validated.data;

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
