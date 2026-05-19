type LoadingMessageProps = {
  message?: string;
};

export function LoadingMessage({
  message = "Loading...",
}: LoadingMessageProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-slate-600">{message}</p>
    </div>
  );
}