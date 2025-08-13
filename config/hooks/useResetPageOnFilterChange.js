import { useEffect, useRef } from "react";
import isEqual from "lodash/isEqual"; // Optional: for deep compare
import { useRouter } from "next/router";

const useResetPageOnFilterChange = (filters, setPage, deepCompare = false) => {
  const prevFiltersRef = useRef(filters);
  const router = useRouter();

  const currentQuery = { ...router.query };
  currentQuery.current_active_page = 1;

  useEffect(() => {
    const filtersChanged = deepCompare
      ? !isEqual(prevFiltersRef.current, filters)
      : JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);

    if (filtersChanged) {
      router.push(
        {
          pathname: router.pathname,
          query: currentQuery,
        },
        undefined,
        { shallow: true } // Don't reload the page, just update URL
      );
      //   setPage(1);
      prevFiltersRef.current = filters;
    }
  }, [filters, setPage, deepCompare]);
};

export default useResetPageOnFilterChange;
