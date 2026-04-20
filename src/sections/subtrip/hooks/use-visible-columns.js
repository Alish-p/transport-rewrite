import { useMemo } from 'react';

import { useSystemFeatures } from 'src/hooks/use-system-features';
import { useColumnVisibility } from 'src/hooks/use-column-visibility';

import { TABLE_COLUMNS } from '../config/table-columns';

const STORAGE_KEY = 'subtrip-table-columns';

export function useVisibleColumns() {
  const { marketVehicles: managesMarketVehicles } = useSystemFeatures();

  const tableColumns = useMemo(() => {
    if (managesMarketVehicles) return TABLE_COLUMNS;
    return TABLE_COLUMNS.filter((c) => c.id !== 'transport' && c.id !== 'advances');
  }, [managesMarketVehicles]);

  const visibility = useColumnVisibility(tableColumns, STORAGE_KEY);

  return { ...visibility, tableColumns, managesMarketVehicles };
}

export default useVisibleColumns;
