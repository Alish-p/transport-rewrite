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

export default function SubtripListPdf({ subtrips }) {
  const renderSubtripTable = () => {
    const headers = [
      'S.No',
      'ID',
      'Trip ID',
      'Vehicle No',
      'Driver Name',
      'Customer Name',
      'Route',
      'Dispatch Time',
      'Received Time',
      'Loading Weight',
      'Transporter',
      'Status',
    ];

    const data = subtrips.map((subtrip, index) => [
      index + 1,
      subtrip._id,
      subtrip.tripId?._id,
      subtrip.tripId?.vehicleId?.vehicleNo,
      subtrip.tripId?.driverId?.driverName,
      subtrip.customerId?.customerName,
      subtrip.routeCd?.routeName,
      subtrip.startDate ? fDate(subtrip.startDate) : '',
      subtrip.endDate ? fDate(subtrip.endDate) : '',
      subtrip.loadingWeight,
      subtrip.tripId?.vehicleId?.transporter?.transportName,
      subtrip.subtripStatus,
    ]);

    const columnWidths = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    return <PDFTable headers={headers} data={data} columnWidths={columnWidths} />;
  };

  return (
    <Document>
      <Page size="A3" style={PDFStyles.page} orientation="landscape">
        <PDFTitle title="Subtrip List" />
        <PDFHeader />
        <PDFDeclaration
          content={`This report contains a list of all subtrips in the system as of ${fDate(new Date())}.`}
        />
        <PDFEmptyLine />
        {renderSubtripTable()}
        <PDFFooter additionalInfo={`Total Subtrips: ${subtrips.length}`} />
      </Page>
    </Document>
  );
}
