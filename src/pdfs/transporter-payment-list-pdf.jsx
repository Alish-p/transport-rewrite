import { Page, Font, Document } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';

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

export default function TransporterPaymentListPdf({ payments, tenant }) {
  const renderTable = () => {
    const headers = ['S.No', 'Payment ID', 'Transporter', 'Status', 'Issue Date', 'Amount'];

    const data = payments.map((p, index) => [
      index + 1,
      p.paymentId,
      p.transporterId?.transportName || '-',
      p.status,
      fDate(p.issueDate),
      fNumber(p.summary?.netIncome),
    ]);

    const columnWidths = [1, 2, 2, 1, 1, 1];

    return <PDFTable headers={headers} data={data} columnWidths={columnWidths} />;
  };

  return (
    <Document>
      <Page size="A4" style={PDFStyles.page} orientation="landscape">
        <PDFTitle title="Transporter Payments" />
        <PDFHeader company={tenant} />
        <PDFDeclaration
          content={`This report contains a list of all transporter payments in the system as of ${fDate(new Date())}.`}
        />
        <PDFEmptyLine />
        {renderTable()}
        <PDFFooter additionalInfo={`Total Payments: ${payments.length}`} />
      </Page>
    </Document>
  );
}
