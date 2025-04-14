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

export default function BankListPdf({ banks }) {
  const renderBankTable = () => {
    const headers = ['S.No', 'Bank Name', 'Branch', 'Place', 'IFSC'];

    const data = banks.map((bank, index) => [
      index + 1,
      bank.name,
      bank.branch,
      bank.place,
      bank.ifsc,
    ]);

    const columnWidths = [1, 3, 3, 3, 2];

    return <PDFTable headers={headers} data={data} columnWidths={columnWidths} />;
  };

  return (
    <Document>
      <Page size="A4" style={PDFStyles.page} orientation="portrait">
        <PDFTitle title="Bank List" />
        <PDFHeader />
        <PDFDeclaration
          content={`This report contains a list of all banks in the system as of ${fDate(new Date())}.`}
        />
        <PDFEmptyLine />
        {renderBankTable()}
        <PDFFooter additionalInfo={`Total Banks: ${banks.length}`} />
      </Page>
    </Document>
  );
}
