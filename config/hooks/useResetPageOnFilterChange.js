import { useEffect, useRef } from "react";
import isEqual from "lodash/isEqual"; // Optional: for deep compare

const useResetPageOnFilterChange = (filters, setPage, deepCompare = false) => {
  const prevFiltersRef = useRef(filters);

  useEffect(() => {
    const filtersChanged = deepCompare
      ? !isEqual(prevFiltersRef.current, filters)
      : JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);

    if (filtersChanged) {
      setPage(1);
      prevFiltersRef.current = filters;
    }
  }, [filters, setPage, deepCompare]);
};

export default useResetPageOnFilterChange;
