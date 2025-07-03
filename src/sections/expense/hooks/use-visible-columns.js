import { useColumnVisibility } from 'src/hooks/use-column-visibility';

import { TABLE_COLUMNS } from '../expense-table-config';

export function useVisibleColumns() {
  return useColumnVisibility(TABLE_COLUMNS);
}
