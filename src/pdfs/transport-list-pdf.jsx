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

export default function TransporterListPdf({ transporters }) {
  const renderTransporterTable = () => {
    const headers = [
      'S.No',
      'Transporter Name',
      'Address',
      'Place',
      'Pin No',
      'Cell No',
      'Pan No',
      'Owner Name',
      'GST No',
      'TDS Percentage',
    ];

    const data = transporters.map((transporter, index) => [
      index + 1,
      transporter.transportName,
      transporter.address,
      transporter.place,
      transporter.pinNo,
      transporter.cellNo,
      transporter.panNo,
      transporter.ownerName,
      transporter.gstNo,
      transporter.tdsPercentage,
    ]);

    const columnWidths = [1, 2, 2, 1, 1, 1, 1, 1, 1, 1];

    return <PDFTable headers={headers} data={data} columnWidths={columnWidths} />;
  };

  return (
    <Document>
      <Page size="A3" style={PDFStyles.page} orientation="landscape">
        <PDFTitle title="Transporter List" />
        <PDFHeader />
        <PDFDeclaration
          content={`This report contains a list of all transporters in the system as of ${fDate(new Date())}.`}
        />
        <PDFEmptyLine />
        {renderTransporterTable()}
        <PDFFooter additionalInfo={`Total Transporters: ${transporters.length}`} />
      </Page>
    </Document>
  );
}
