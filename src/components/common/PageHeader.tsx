type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400 sm:text-sm">
          {eyebrow}
        </p>
      ) : null}

      <h1 className="text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl">
        {title}
      </h1>

      {description ? (
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}