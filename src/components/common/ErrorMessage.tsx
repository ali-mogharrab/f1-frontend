type ErrorMessageProps = {
  title?: string;
  message?: string;
};

export function ErrorMessage({
  title = "Something went wrong",
  message = "Please try again later.",
}: ErrorMessageProps) {
  return (
    <div className="rounded-2xl border border-red-200/70 bg-red-50/90 p-6 text-red-800 shadow-lg shadow-red-950/5 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
      <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-red-500">Session alert</p>
      <h1 className="mb-2 text-xl font-extrabold tracking-tight">{title}</h1>

      <div className="whitespace-pre-line text-sm leading-6 opacity-80">{message}</div>
    </div>
  );
}
