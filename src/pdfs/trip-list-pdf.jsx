import { TABLE_COLUMNS } from 'src/sections/trip/trip-table-config';

import GenericListPdf from './generic-list-pdf';

export default function TripListPdf({ trips, visibleColumns = [], tenant }) {
  const columnsToShow = TABLE_COLUMNS.filter((col) => visibleColumns.includes(col.id));

  return (
    <GenericListPdf
      title="Trip List"
      rows={trips}
      columns={columnsToShow}
      orientation="landscape"
      tenant={tenant}
    />
  );
}
