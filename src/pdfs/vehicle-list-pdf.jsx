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

// vehicleNo: { type: String, required: true, unique: true },
//   vehicleType: { type: String, required: true },
//   modelType: { type: String, required: true },
//   vehicleCompany: { type: String, required: true },
//   noOfTyres: { type: Number, required: true },
//   chasisNo: { type: String },
//   engineNo: { type: String },
//   manufacturingYear: { type: Number, required: true },
//   loadingCapacity: { type: Number, required: true },
//   engineType: { type: String, required: true },
//   fuelTankCapacity: { type: Number, required: true },
//   trackingLink: { type: String },
//   isActive: { type: Boolean, default: true },
//   isOwn: { type: Boolean, default: true },
//   transporter: {
//     type: Schema.Types.ObjectId,
//     ref: "Transporter",
//   },

export default function VehicleListPdf({ vehicles }) {
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
        <PDFHeader />
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
