import { useMemo, useState, useCallback } from 'react';

export function useColumnVisibility(TABLE_COLUMNS) {
  const defaultVisibleColumns = useMemo(
    () =>
      TABLE_COLUMNS.reduce((acc, column) => {
        acc[column.id] = column.defaultVisible;
        return acc;
      }, {}),
    [TABLE_COLUMNS]
  );

  const disabledColumns = useMemo(
    () =>
      TABLE_COLUMNS.reduce((acc, column) => {
        acc[column.id] = column.disabled;
        return acc;
      }, {}),
    [TABLE_COLUMNS]
  );

  const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);

  const visibleHeaders = useMemo(
    () => TABLE_COLUMNS.filter((column) => visibleColumns[column.id]),
    [TABLE_COLUMNS, visibleColumns]
  );

  const visibleColumnCount = useMemo(
    () => Object.values(visibleColumns).filter(Boolean).length,
    [visibleColumns]
  );

  const toggleColumnVisibility = useCallback(
    (columnName) => {
      if (disabledColumns[columnName]) return;
      setVisibleColumns((prev) => ({
        ...prev,
        [columnName]: !prev[columnName],
      }));
    },
    [disabledColumns]
  );

  const toggleAllColumnsVisibility = useCallback(
    (checked) => {
      setVisibleColumns((prev) =>
        TABLE_COLUMNS.reduce((acc, column) => {
          acc[column.id] = disabledColumns[column.id] ? prev[column.id] : checked;
          return acc;
        }, {})
      );
    },
    [disabledColumns, TABLE_COLUMNS]
  );

  const resetColumnVisibility = useCallback(() => {
    setVisibleColumns(defaultVisibleColumns);
  }, [defaultVisibleColumns]);

  const isColumnVisible = useCallback(
    (columnName) => !!visibleColumns[columnName],
    [visibleColumns]
  );

  return {
    // State
    visibleColumns,
    disabledColumns,
    visibleHeaders,
    visibleColumnCount,

    // Actions
    toggleColumnVisibility,
    toggleAllColumnsVisibility,
    resetColumnVisibility,

    // Utilities
    isColumnVisible,
  };
}

export default useColumnVisibility;
