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

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

export default function ExpenseListPdf({ expenses }) {
  const renderExpenseTable = () => {
    const headers = ['S.No', 'Category', 'Vehicle', 'Subtrip', 'Type', 'Remarks', 'Date', 'Amount'];

    const data = expenses.map((expense, index) => [
      index + 1,
      expense.expenseCategory,
      expense.vehicleId?.vehicleNo,
      expense.subtripId?._id || 'N/A',
      expense.expenseType,
      expense.remarks,
      expense.date ? fDate(expense.date) : '',
      expense.amount,
    ]);

    const columnWidths = [1, 1, 1, 1, 1, 2, 1, 1];

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
