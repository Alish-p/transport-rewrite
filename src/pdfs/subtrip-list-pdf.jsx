import { TABLE_COLUMNS } from 'src/sections/subtrip/config/table-columns';

import GenericListPdf from './generic-list-pdf';

// ----------------------------------------------------------------------

export default function SubtripListPdf({ subtrips, visibleColumns = [], tenant }) {
  const columnsToShow = TABLE_COLUMNS.filter((col) => visibleColumns.includes(col.id));

  return (
    <GenericListPdf
      title="Subtrip List"
      rows={subtrips}
      columns={columnsToShow}
      orientation="landscape"
      includeTotals
      tenant={tenant}
    />
  );
}
