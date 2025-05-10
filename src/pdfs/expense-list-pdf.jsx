import { Page, Font, Document } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';

import {
  PDFTitle,
  PDFTable,
  PDFHeader,
  PDFFooter,
  PDFStyles,
  PDFEmptyLine,
  PDFDeclaration,
} from 'src/pdfs/common';

import { TABLE_COLUMNS } from 'src/sections/expense/config/table-columns';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

export default function ExpenseListPdf({ expenses, visibleColumns = [] }) {
  const renderExpenseTable = () => {
    // Filter columns to include only the visible ones
    const columnsToShow = TABLE_COLUMNS.filter((col) => visibleColumns.includes(col.id));

    const headers = ['S.No', ...columnsToShow.map((col) => col.label)];

    const data = expenses.map((expense, index) => [
      index + 1,
      ...columnsToShow.map((col) => col.getter(expense) || ''),
    ]);

    // Optional total row (only for numeric values)
    const totals = ['Total'];
    columnsToShow.forEach((col) => {
      const isNumeric = expenses.every((e) => typeof col.getter(e) === 'number');
      const totalValue = isNumeric
        ? expenses.reduce((sum, e) => sum + (col.getter(e) || 0), 0)
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
        <PDFTitle title="Expense List" />
        <PDFHeader />
        <PDFDeclaration
          content={`This report contains a list of all expenses in the system as of ${fDate(new Date())}.`}
        />
        <PDFEmptyLine />
        {renderExpenseTable()}
        <PDFFooter additionalInfo={`Total Expenses: ${expenses.length}`} />
      </Page>
    </Document>
  );
}
