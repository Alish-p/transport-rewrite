import { useState, useCallback } from 'react';

import {
  TABLE_COLUMNS,
  getDisabledColumns,
  getDefaultVisibleColumns,
} from '../config/table-columns';

export function useVisibleColumns() {
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
    [disabledColumns]
  );

  return { visibleColumns, disabledColumns, toggleColumn, toggleAllColumns };
}
