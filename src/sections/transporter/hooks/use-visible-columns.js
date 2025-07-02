import { useColumnVisibility } from 'src/hooks/use-column-visibility';

import { TABLE_COLUMNS } from '../transporter-table-config';

export function useVisibleColumns() {
  return useColumnVisibility(TABLE_COLUMNS);
}
