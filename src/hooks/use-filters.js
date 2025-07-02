import { useCallback } from 'react';

import { useSetState } from './use-set-state';

export function useFilters(initialFilters, options = {}) {
  const { onResetPage } = options;
  const {
    state: filters,
    setField,
    setState,
    onResetState,
    canReset,
  } = useSetState(initialFilters);

  const handleFilters = useCallback(
    (name, value) => {
      if (onResetPage) onResetPage();
      setField(name, value);
    },
    [onResetPage, setField]
  );

  const handleResetFilters = useCallback(() => {
    onResetState();
  }, [onResetState]);

  return {
    filters,
    setFilters: setState,
    handleFilters,
    handleResetFilters,
    canReset,
  };
}
