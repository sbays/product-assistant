export function ToolPending({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
      <span aria-hidden="true" className="size-2 rounded-full bg-zinc-400 motion-safe:animate-pulse" />
      {children}
    </p>
  );
}

export function ToolError({ children, detail }: { children: React.ReactNode; detail?: string }) {
  return (
    <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
      {children}
      {detail ? <span className="block text-xs opacity-80">{detail}</span> : null}
    </p>
  );
}
