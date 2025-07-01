import { useState, useCallback } from 'react';

export function useColumnVisibility(TABLE_COLUMNS) {
  const getDefaultVisibleColumns = () =>
    TABLE_COLUMNS.reduce((acc, column) => {
      acc[column.id] = column.defaultVisible;
      return acc;
    }, {});

  const getDisabledColumns = () =>
    TABLE_COLUMNS.reduce((acc, column) => {
      acc[column.id] = column.disabled;
      return acc;
    }, {});

  const [visibleColumns, setVisibleColumns] = useState(getDefaultVisibleColumns());
  const disabledColumns = getDisabledColumns();

  const toggleColumn = useCallback(
    (columnName) => {
      if (disabledColumns[columnName]) return;
      setVisibleColumns((prev) => ({
        ...prev,
        [columnName]: !prev[columnName],
      }));
    },
    [disabledColumns]
  );

  const toggleAllColumns = useCallback(
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

  return { visibleColumns, disabledColumns, toggleColumn, toggleAllColumns };
}

export default useColumnVisibility;
