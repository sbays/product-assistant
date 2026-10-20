import type { Metadata } from 'next';
import Chat from './chat';

export const metadata: Metadata = {
  title: 'Assistant · Product Assistant',
};

export default function AssistantPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Shopping assistant</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Ask about products, compare them, or contact a seller. Answers come only from the catalogue.
        </p>
      </div>
      <Chat />
    </div>
  );
}
