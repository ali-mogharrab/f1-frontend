type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="state-panel">
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
        No data on track
      </p>
      <p className="relative z-10 text-sm leading-6 text-slate-600 dark:text-slate-300">{message}</p>
    </div>
  );
}
