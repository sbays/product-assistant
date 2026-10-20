import type { ChatMessage } from './types';

// Product titles seen in earlier tool results, so the approval card can name the product, not just its ID
export function collectProductTitles(messages: ChatMessage[]) {
  const titles = new Map<number, string>();
  for (const message of messages) {
    for (const part of message.parts) {
      if (part.type === 'tool-searchProducts' && part.state === 'output-available' && part.output.products) {
        for (const p of part.output.products) titles.set(p.id, p.title);
      }
      if (part.type === 'tool-getProducts' && part.state === 'output-available') {
        for (const p of part.output.products) if (p.found) titles.set(p.id, p.title);
      }
    }
  }
  return titles;
}

export function hasPendingApproval(message: ChatMessage | undefined) {
  return (
    message?.role === 'assistant' &&
    message.parts.some((part) => part.type === 'tool-sendEnquiry' && part.state === 'approval-requested')
  );
}

// One announcement per finished response, so screen readers don't read every streamed token
export function announcementFor(message: ChatMessage, { isAbort }: { isAbort: boolean }) {
  if (isAbort) return 'Response stopped.';
  const text = message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join(' ')
    .trim();
  const extras = [
    message.parts.some((part) => part.type === 'tool-showComparison' && part.state === 'output-available')
      ? 'Comparison table shown.'
      : '',
    hasPendingApproval(message) ? 'An enquiry needs your approval before it is sent.' : '',
  ];
  return [text, ...extras].filter(Boolean).join(' ');
}
