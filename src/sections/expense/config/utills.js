import { TABLE_COLUMNS } from './table-columns';

export function transformExpensesForExcel(expenses, visibleColumnIds = []) {
  // Step 1: Get visible column configs and maintain label-to-id mapping
  const visibleColumns = TABLE_COLUMNS.filter((col) => visibleColumnIds.includes(col.id));

  const rows = expenses.map((subtrip) => {
    const row = {};

    visibleColumns.forEach((col) => {
      row[col.label] = col.getter(subtrip);
    });

    return row;
  });

  // Step 2: Optional: Add a totals row only for numeric columns (basic implementation)
  const totals = visibleColumns.reduce(
    (acc, col) => {
      const isNumeric =
        expenses.every((s) => typeof col.getter(s) === 'number') && ![''].includes(col.label);

      acc[col.label] = isNumeric
        ? expenses.reduce((sum, subtrip) => sum + (col.getter(subtrip) || 0), 0)
        : '';

      return acc;
    },
    { [visibleColumns[0]?.label || '']: 'TOTAL' }
  );

  return [...rows, totals];
}
