type SelectOption = {
  label: string;
  value: string;
};

type FilterSelect = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
};

type ListControlsProps = {
  searchValue: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  sortOptions: SelectOption[];
  filters?: FilterSelect[];
  resultCount?: number;
};

export function ListControls({
  searchValue,
  searchPlaceholder,
  onSearchChange,
  sortValue,
  onSortChange,
  sortOptions,
  filters = [],
  resultCount,
}: ListControlsProps) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Search
          </span>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2 lg:flex">
          {filters.map((filter) => (
            <label key={filter.label} className="block">
              <span className="mb-1 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                {filter.label}
              </span>
              <select
                value={filter.value}
                onChange={(event) => filter.onChange(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white sm:min-w-40"
              >
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ))}

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Sort
            </span>
            <select
              value={sortValue}
              onChange={(event) => onSortChange(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white sm:min-w-44"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {typeof resultCount === "number" ? (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Showing {resultCount.toLocaleString()} result
          {resultCount === 1 ? "" : "s"}
        </p>
      ) : null}
    </div>
  );
}
