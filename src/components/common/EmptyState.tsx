type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
      <p className="text-slate-600 dark:text-slate-300">{message}</p>
    </div>
  );
}