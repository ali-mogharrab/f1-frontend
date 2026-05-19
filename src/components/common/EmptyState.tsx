type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-slate-600">{message}</p>
    </div>
  );
}