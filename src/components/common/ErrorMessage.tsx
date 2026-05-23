type ErrorMessageProps = {
  title?: string;
  message?: string;
};

export function ErrorMessage({
  title = "Something went wrong",
  message = "Please try again later.",
}: ErrorMessageProps) {
  return (
    <div className="rounded-2xl bg-red-50 p-6 text-red-700 dark:bg-red-950/40 dark:text-red-300">
      <h1 className="mb-2 text-xl font-bold">{title}</h1>

      <div className="whitespace-pre-line">{message}</div>
    </div>
  );
}