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

export default function DriverListPdf({ drivers }) {
  const renderDriverTable = () => {
    const headers = ['S.No', 'Driver Name', 'License No', 'Cell No', 'License Expiry', 'Status'];

    const data = drivers.map((driver, index) => [
      index + 1,
      driver.driverName,
      driver.driverLicenceNo,
      driver.driverCellNo,
      driver.driverLicenceExpiryDate || '-',

      driver.isActive ? 'Active' : 'Inactive',
    ]);

    const columnWidths = [1, 3, 2, 2, 2, 2];

    return <PDFTable headers={headers} data={data} columnWidths={columnWidths} />;
  };

  return (
    <Document>
      <Page size="A4" style={PDFStyles.page} orientation="portrait">
        <PDFTitle title="Driver List" />
        <PDFHeader />
        <PDFDeclaration
          content={`This report contains a list of all drivers in the system as of ${fDate(new Date())}.`}
        />
        <PDFEmptyLine />
        {renderDriverTable()}
        <PDFFooter additionalInfo={`Total Drivers: ${drivers.length}`} />
      </Page>
    </Document>
  );
}
