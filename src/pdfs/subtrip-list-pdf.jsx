import { TABLE_COLUMNS } from 'src/sections/subtrip/config/table-columns';

import GenericListPdf from './generic-list-pdf';

// ----------------------------------------------------------------------

export default function SubtripListPdf({ subtrips, visibleColumns = [], tenant }) {
  const columnsToShow =
    (visibleColumns && visibleColumns.length
      ? visibleColumns.map((id) => TABLE_COLUMNS.find((c) => c.id === id)).filter(Boolean)
      : TABLE_COLUMNS.filter((c) => c.defaultVisible)) || [];

  return (
    <GenericListPdf
      title="Job List"
      rows={subtrips}
      columns={columnsToShow}
      orientation="landscape"
      includeTotals
      tenant={tenant}
      visibleColumns={visibleColumns}
    />
  );
}
