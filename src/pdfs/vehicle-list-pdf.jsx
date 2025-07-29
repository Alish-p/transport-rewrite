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

export default function VehicleListPdf({ vehicles, tenant }) {
  const renderVehicleTable = () => {
    const headers = [
      'S.No',
      'Vehicle No',
      'Type',
      'Model',
      'Company',
      'Tyres',
      'Chasis No',
      'Engine No',
      'Year',
      'LoadingCapacity',
      'Fuel Tank Capacity',
      'Transporter',
    ];

    const data = vehicles.map((vehicle, index) => [
      index + 1,
      vehicle.vehicleNo,
      vehicle.vehicleType,
      vehicle.modelType,
      vehicle.vehicleCompany,
      vehicle.noOfTyres,
      vehicle.chasisNo,
      vehicle.engineNo,
      vehicle.manufacturingYear,
      vehicle.loadingCapacity,
      vehicle.fuelTankCapacity,
      vehicle.transporter?.transportName || '-',
    ]);

    const columnWidths = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    return <PDFTable headers={headers} data={data} columnWidths={columnWidths} />;
  };

  return (
    <Document>
      <Page size="A3" style={PDFStyles.page} orientation="landscape">
        <PDFTitle title="Vehicle List" />
        <PDFHeader company={tenant} />
        <PDFDeclaration
          content={`This report contains a list of all vehicles in the system as of ${fDate(new Date())}.`}
        />
        <PDFEmptyLine />
        {renderVehicleTable()}
        <PDFFooter additionalInfo={`Total Vehicles: ${vehicles.length}`} />
      </Page>
    </Document>
  );
}
