'use client';

import { useChat } from '@ai-sdk/react';
import { lastAssistantMessageIsCompleteWithApprovalResponses, type ChatAddToolApproveResponseFunction } from 'ai';
import { useMemo, useRef, useState, type FormEvent } from 'react';
import MessagePart from './message-part';
import { announcementFor, collectProductTitles, hasPendingApproval } from './chat-helpers';
import type { ChatMessage } from './types';

const SUGGESTIONS = [
  'Compare the two highest-rated smartphones',
  'What are the cheapest fragrances?',
  'What do reviewers say about the iPhone 9?',
];

const primaryButton =
  'rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:outline-white';
const secondaryButton =
  'rounded-full border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:focus-visible:outline-white';

export default function Chat() {
  const [input, setInput] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error, stop, regenerate, addToolApprovalResponse } = useChat<ChatMessage>({
    // Resumes the run once every pending approval has an answer
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
    onFinish: ({ message, isAbort, isError }) => {
      if (!isError) setAnnouncement(announcementFor(message, { isAbort }));
    },
  });

  const inFlight = status === 'submitted' || status === 'streaming';
  const awaitingApproval = hasPendingApproval(messages.at(-1));
  const locked = inFlight || awaitingApproval;
  const productTitles = useMemo(() => collectProductTitles(messages), [messages]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || locked) return;
    sendMessage({ text: trimmed });
    setInput('');
    inputRef.current?.focus();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send(input);
  };

  // The approval card unmounts once answered, so hand focus back to the input rather than losing it
  const respondToApproval: ChatAddToolApproveResponseFunction = (response) => {
    const result = addToolApprovalResponse(response);
    inputRef.current?.focus();
    return result;
  };

  return (
    <div className="flex flex-col gap-6">
      {messages.length === 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Try asking:</p>
          <ul className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <li key={suggestion}>
                <button type="button" onClick={() => send(suggestion)} className={secondaryButton}>
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ol aria-label="Conversation" className="flex flex-col gap-6">
          {messages.map((message) => (
            <li
              key={message.id}
              className={
                message.role === 'user'
                  ? 'max-w-[85%] self-end rounded-2xl bg-zinc-900 px-4 py-3 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'flex flex-col gap-3'
              }
            >
              <span className="sr-only">{message.role === 'user' ? 'You said:' : 'Assistant said:'}</span>
              {message.parts.map((part, i) => (
                <MessagePart
                  key={`${message.id}-${i}`}
                  part={part}
                  productTitles={productTitles}
                  addToolApprovalResponse={respondToApproval}
                />
              ))}
            </li>
          ))}
        </ol>
      )}

      {status === 'submitted' ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 motion-safe:animate-pulse">Thinking…</p>
      ) : null}

      {/* Announces each finished response once, instead of every streamed token */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {error ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
        >
          <span>Something went wrong getting a response. {error.message}</span>
          <button type="button" onClick={() => regenerate()} className={secondaryButton}>
            Try again
          </button>
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-4 flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <label htmlFor="chat-input" className="text-sm font-medium">
          Ask about the catalogue
        </label>
        <div className="flex gap-2">
          {/* readOnly rather than disabled while busy: disabled inputs drop focus, and focus should stay here */}
          <input
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            readOnly={locked}
            aria-disabled={locked}
            aria-describedby={awaitingApproval ? 'chat-input-hint' : undefined}
            maxLength={2000}
            autoComplete="off"
            className="min-w-0 flex-1 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 aria-disabled:bg-zinc-100 aria-disabled:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus-visible:outline-white dark:aria-disabled:bg-zinc-800"
          />
          {inFlight ? (
            <button type="button" onClick={() => stop()} className={secondaryButton}>
              Stop
            </button>
          ) : (
            <button type="submit" disabled={locked || !input.trim()} className={primaryButton}>
              Send
            </button>
          )}
        </div>
        {awaitingApproval ? (
          <p id="chat-input-hint" className="text-xs text-zinc-500 dark:text-zinc-400">
            Approve or decline the enquiry above to continue.
          </p>
        ) : null}
      </form>
    </div>
  );
}
