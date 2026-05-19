type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
          {eyebrow}
        </p>
      ) : null}

      <h1 className="text-3xl font-bold text-slate-950">{title}</h1>

      {description ? (
        <p className="mt-2 max-w-2xl text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}