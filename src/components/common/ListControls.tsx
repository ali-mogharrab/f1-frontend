import { Icon } from "./Icon";

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
    <div className="list-controls mb-7">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <label className="block">
          <span className="control-label">Search database</span>
          <span className="search-field-wrap block">
            <Icon name="search" className="search-field-icon" />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="control-field text-sm placeholder:text-slate-400"
            />
          </span>
        </label>

        <div className="grid gap-3 sm:grid-cols-2 lg:flex">
          {filters.map((filter) => (
            <label key={filter.label} className="block">
              <span className="control-label">
                {filter.label}
              </span>
              <select
                value={filter.value}
                onChange={(event) => filter.onChange(event.target.value)}
                className="control-field text-sm font-semibold sm:min-w-40"
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
            <span className="control-label">
              Sort
            </span>
            <select
              value={sortValue}
              onChange={(event) => onSortChange(event.target.value)}
              className="control-field text-sm font-semibold sm:min-w-44"
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
        <p className="result-count">
          {resultCount.toLocaleString()} result
          {resultCount === 1 ? "" : "s"}
        </p>
      ) : null}
    </div>
  );
}
