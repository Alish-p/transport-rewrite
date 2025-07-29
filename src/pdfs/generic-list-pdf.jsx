import { Page, Font, Document } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';

import {
  PDFTitle,
  PDFTable,
  PDFHeader,
  PDFFooter,
  PDFStyles,
  PDFDeclaration,
} from 'src/pdfs/common';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

export default function GenericListPdf({
  title,
  rows,
  columns,
  orientation = 'portrait',
  includeTotals = false,
  tenant,
}) {
  const headers = ['S.No', ...columns.map((col) => col.label)];

  const data = rows.map((row, index) => [
    index + 1,
    ...columns.map((col) => (col.getter ? col.getter(row) : row[col.id] || '')),
  ]);

  if (includeTotals) {
    const totals = ['Total'];
    columns.forEach((col) => {
      const values = rows.map((r) => (col.getter ? col.getter(r) : r[col.id]));
      const isNumeric = values.every((v) => typeof v === 'number');
      const totalValue = isNumeric ? values.reduce((sum, v) => sum + (v || 0), 0) : '';
      totals.push(totalValue);
    });
    data.push(totals);
  }

  const columnWidths = new Array(headers.length).fill(1);

  return (
    <Document>
      <Page size="A3" style={PDFStyles.page} orientation={orientation}>
        <PDFTitle title={title} />
        <PDFHeader company={tenant} />
        <PDFDeclaration content={`Report generated on ${fDate(new Date())}.`} />
        <PDFTable headers={headers} data={data} columnWidths={columnWidths} />
        <PDFFooter additionalInfo={`Total ${title}: ${rows.length}`} />
      </Page>
    </Document>
  );
}
