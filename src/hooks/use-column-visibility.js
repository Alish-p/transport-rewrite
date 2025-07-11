import { useMemo, useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

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

  const defaultColumnOrder = useMemo(
    () => TABLE_COLUMNS.map((column) => column.id),
    [TABLE_COLUMNS]
  );

  const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);
  const [columnOrder, setColumnOrder] = useState(defaultColumnOrder);

  const visibleHeaders = useMemo(
    () =>
      columnOrder
        .map((id) => TABLE_COLUMNS.find((column) => column.id === id))
        .filter((column) => column && visibleColumns[column.id]),
    [columnOrder, TABLE_COLUMNS, visibleColumns]
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

  const moveColumn = useCallback((activeId, overId) => {
    if (activeId === overId) return;
    setColumnOrder((prev) => {
      const oldIndex = prev.indexOf(activeId);
      const newIndex = prev.indexOf(overId);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  const resetColumnOrder = useCallback(() => {
    setColumnOrder(defaultColumnOrder);
  }, [defaultColumnOrder]);

  const isColumnVisible = useCallback(
    (columnName) => !!visibleColumns[columnName],
    [visibleColumns]
  );

  return {
    // State
    visibleColumns,
    disabledColumns,
    columnOrder,
    visibleHeaders,
    visibleColumnCount,

    // Actions
    toggleColumnVisibility,
    toggleAllColumnsVisibility,
    resetColumnVisibility,
    moveColumn,
    resetColumnOrder,

    // Utilities
    isColumnVisible,
  };
}
