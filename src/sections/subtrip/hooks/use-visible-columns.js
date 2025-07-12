import { useColumnVisibility } from 'src/hooks/use-column-visibility';

import { TABLE_COLUMNS } from '../config/table-columns';

const STORAGE_KEY = 'subtrip-table-columns';

export function useVisibleColumns() {
  return useColumnVisibility(TABLE_COLUMNS, STORAGE_KEY);
}

export default useVisibleColumns;
