type PaginationControlsProps = {
  label?: string;
  page: number;
  next?: string | null;
  previous?: string | null;
  pending: boolean;
  onPageChange: (page: number) => void;
};

export function PaginationControls({
  label = "Results pages",
  page,
  next,
  previous,
  pending,
  onPageChange,
}: PaginationControlsProps) {
  if (!next && !previous && page === 1) return null;

  return (
    <nav aria-label={label} className="my-4 flex items-center justify-between gap-3 text-sm">
      <button
        type="button"
        className="control-field w-auto font-semibold disabled:opacity-40"
        disabled={pending || (!previous && page === 1)}
        onClick={() => onPageChange(page - 1)}
      >
        Previous page
      </button>
      <span aria-live="polite">Page {page}</span>
      <button
        type="button"
        className="control-field w-auto font-semibold disabled:opacity-40"
        disabled={pending || !next}
        onClick={() => onPageChange(page + 1)}
      >
        Next page
      </button>
    </nav>
  );
}
