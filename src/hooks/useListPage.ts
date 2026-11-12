import { useState } from "react";

// Page selection belongs to its filters or parent record, never another list.
export function useListPage(scope: string) {
  const [selection, setSelection] = useState({ scope, page: 1 });
  const page = selection.scope === scope ? selection.page : 1;
  const setPage = (nextPage: number) => setSelection({ scope, page: nextPage });
  return [page, setPage] as const;
}
