// Type-only import: nothing from the server-only agent module reaches the client bundle
import type { ProductAgentUIMessage } from '@/app/lib/agent/agent';

export type ChatMessage = ProductAgentUIMessage;
export type ChatPart = ChatMessage['parts'][number];
export type ToolPart<Name extends string> = Extract<ChatPart, { type: `tool-${Name}` }>;
export type ToolOutput<Name extends string> =
  ToolPart<Name> extends infer P ? (P extends { state: 'output-available'; output: infer O } ? O : never) : never;
