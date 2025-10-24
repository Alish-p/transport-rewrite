import { TABLE_COLUMNS } from 'src/sections/bank/bank-table-config';

import GenericListPdf from './generic-list-pdf';

// ----------------------------------------------------------------------

export default function BankListPdf({ banks, tenant, visibleColumns = [] }) {
  const defaultIds = ['name', 'branch', 'place', 'ifsc'];
  const ids = visibleColumns.length ? visibleColumns : defaultIds;
  const columnsToShow = ids.map((id) => TABLE_COLUMNS.find((c) => c.id === id)).filter(Boolean);

  return (
    <GenericListPdf
      title="Bank List"
      rows={banks}
      columns={columnsToShow}
      orientation="portrait"
      tenant={tenant}
      visibleColumns={ids}
    />
  );
}
