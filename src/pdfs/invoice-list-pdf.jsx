import { TABLE_COLUMNS } from 'src/sections/invoice/invoice-table-config';
import GenericListPdf from './generic-list-pdf';

export default function InvoiceListPdf({ invoices, visibleColumns = [] }) {
  const columnsToShow = TABLE_COLUMNS.filter((col) => visibleColumns.includes(col.id));
  return (
    <GenericListPdf
      title="Invoice List"
      rows={invoices}
      columns={columnsToShow}
      orientation="landscape"
    />
  );
}
