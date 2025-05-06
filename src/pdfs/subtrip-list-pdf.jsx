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

import { TABLE_COLUMNS } from 'src/sections/subtrip/config/table-columns';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

export default function SubtripListPdf({ subtrips, visibleColumns = [] }) {
  const renderSubtripTable = () => {
    // Filter columns to include only the visible ones
    const columnsToShow = TABLE_COLUMNS.filter((col) => visibleColumns.includes(col.id));

    const headers = ['S.No', ...columnsToShow.map((col) => col.label)];

    const data = subtrips.map((subtrip, index) => [
      index + 1,
      ...columnsToShow.map((col) => col.getter(subtrip) || ''),
    ]);

    // Optional total row (only for numeric values)
    const totals = ['Total'];
    columnsToShow.forEach((col) => {
      const isNumeric = subtrips.every((s) => typeof col.getter(s) === 'number');
      const totalValue = isNumeric
        ? subtrips.reduce((sum, s) => sum + (col.getter(s) || 0), 0)
        : '';
      totals.push(totalValue);
    });

    data.push(totals);

    const columnWidths = new Array(headers.length).fill(1); // equal width columns

    return <PDFTable headers={headers} data={data} columnWidths={columnWidths} />;
  };

  return (
    <Document>
      <Page size="A3" style={PDFStyles.page} orientation="landscape">
        <PDFTitle title="Subtrip List" />
        <PDFHeader />
        <PDFDeclaration
          content={`This report contains a list of subtrips as of ${fDate(new Date())}.`}
        />
        {renderSubtripTable()}
        <PDFFooter additionalInfo={`Total Subtrips: ${subtrips.length}`} />
      </Page>
    </Document>
  );
}
