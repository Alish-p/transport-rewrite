import { useColumnVisibility } from 'src/hooks/use-column-visibility';

import { TABLE_COLUMNS } from '../config/table-columns';

export function useVisibleColumns() {
  return useColumnVisibility(TABLE_COLUMNS);
}

export default useVisibleColumns;
