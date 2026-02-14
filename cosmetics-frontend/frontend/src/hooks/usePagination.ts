import { useState } from "react";

export const usePagination = (initialPage = 1, limit = 10) => {
  const [page, setPage] = useState(initialPage);

  const next = () => setPage((p) => p + 1);
  const prev = () => setPage((p) => Math.max(1, p - 1));
  const goTo = (num: number) => setPage(num);

  return { page, limit, next, prev, goTo };
};
