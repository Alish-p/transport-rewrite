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

export default function PumpListPdf({ pumps, tenant }) {
  const renderPumpTable = () => {
    const headers = [
      'S.No',
      'Pump Name',
      'Owner Name',
      'Phone',
      'Address',
      'Bank Name',
      'Account No',
    ];

    const data = pumps.map((pump, index) => [
      index + 1,
      pump.name,
      pump.ownerName,
      pump.phone,
      pump.address,
      pump.bankAccount?.name,
      pump.bankAccount?.accNo,
    ]);

    const columnWidths = [1, 2, 2, 2, 2, 1, 2];

    return <PDFTable headers={headers} data={data} columnWidths={columnWidths} />;
  };

  return (
    <Document>
      <Page size="A4" style={PDFStyles.page} orientation="landscape">
        <PDFTitle title="Pump List" />
        <PDFHeader company={tenant} />
        <PDFDeclaration
          content={`This report contains a list of all pumps in the system as of ${fDate(new Date())}.`}
        />
        <PDFEmptyLine />
        {renderPumpTable()}
        <PDFFooter additionalInfo={`Total Pumps: ${pumps.length}`} />
      </Page>
    </Document>
  );
}
