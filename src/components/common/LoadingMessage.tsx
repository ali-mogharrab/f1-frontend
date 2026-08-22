type LoadingMessageProps = {
  message?: string;
};

export function LoadingMessage({
  message = "Loading...",
}: LoadingMessageProps) {
  return (
    <div className="state-panel">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">
        {message}
      </p>
      <div className="loading-bar" aria-hidden="true" />
    </div>
  );
}
