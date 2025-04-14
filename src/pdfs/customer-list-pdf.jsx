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

// customerName: { type: String, required: true },
//   GSTNo: { type: String, required: true },
//   PANNo: { type: String, required: true },
//   address: { type: String },
//   place: { type: String },
//   state: { type: String, required: true },
//   pinCode: { type: String, required: true },
//   cellNo: { type: String, required: true },

export default function CustomerListPdf({ customers }) {
  const renderCustomerTable = () => {
    const headers = [
      'S.No',
      'Customer Name',
      'Address',
      'Place',
      'Pin No',
      'Cell No',
      'Pan No',
      'GST No',
    ];

    const data = customers.map((customer, index) => [
      index + 1,
      customer.customerName,
      customer.address,
      customer.place,
      customer.pinCode,
      customer.cellNo,
      customer.panNo,
      customer.gstNo,
    ]);

    const columnWidths = [1, 2, 2, 2, 1, 1, 2, 2];

    return <PDFTable headers={headers} data={data} columnWidths={columnWidths} />;
  };

  return (
    <Document>
      <Page size="A4" style={PDFStyles.page} orientation="landscape">
        <PDFTitle title="Customer List" />
        <PDFHeader />
        <PDFDeclaration
          content={`This report contains a list of all customers in the system as of ${fDate(new Date())}.`}
        />
        <PDFEmptyLine />
        {renderCustomerTable()}
        <PDFFooter additionalInfo={`Total Customers: ${customers.length}`} />
      </Page>
    </Document>
  );
}
