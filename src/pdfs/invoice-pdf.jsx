/* eslint-disable react/prop-types */
import { Page, Font, Document } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import {
  PDFTitle,
  PDFTable,
  PDFHeader,
  PDFFooter,
  PDFStyles,
  PDFDeclaration,
} from 'src/pdfs/common';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

export default function InvoicePdf({ invoice }) {
  const {
    customerId,
    invoiceStatus,
    issueDate,
    invoiceNo,
    subtripSnapshot,
    totalAmountBeforeTax,
    totalAfterTax,
    taxBreakup,
  } = invoice || {};

  const renderInvoiceTable = () => {
    const headers = [
      'S.No',
      'Consignee',
      'Destination',
      'Vehicle',
      'LR No',
      'Invoice No',
      'Dispatch Date',
      'Rate',
      'Loading Weight',
      'Freight Amount',
    ];

    const data = subtripSnapshot.map((subtrip, index) => [
      index + 1,
      subtrip.consignee,
      subtrip.unloadingPoint,
      subtrip.vehicleNo,
      subtrip.subtripId,
      subtrip.invoiceNo,
      fDate(subtrip.startDate),
      fCurrency(subtrip.rate),
      subtrip.loadingWeight,
      fCurrency(subtrip.freightAmount),
    ]);

    const columnWidths = [1, 2, 2, 1, 1, 1, 1, 1, 1, 1];

    return <PDFTable headers={headers} data={data} columnWidths={columnWidths} />;
  };

  const renderTaxBreakup = () => {
    const totalWeight = subtripSnapshot.reduce((acc, subtrip) => acc + subtrip.loadingWeight, 0);
    const headers = [' ', totalWeight, fCurrency(totalAmountBeforeTax)];

    const data = [headers];

    if (taxBreakup.cgst.rate !== 0) {
      data.push([' ', `CGST-${taxBreakup.cgst.rate}%`, fCurrency(taxBreakup.cgst.amount)]);
    }

    if (taxBreakup.sgst.rate !== 0) {
      data.push([' ', `SGST-${taxBreakup.sgst.rate}%`, fCurrency(taxBreakup.sgst.amount)]);
    }

    if (taxBreakup.igst.rate !== 0) {
      data.push([' ', `IGST-${taxBreakup.igst.rate}%`, fCurrency(taxBreakup.igst.amount)]);
    }

    data.push([' ', 'Net Total', fCurrency(totalAfterTax)]);

    return <PDFTable headers={headers} data={data} columnWidths={[10, 1, 1, 1]} hideHeader />;
  };

  return (
    <Document>
      <Page size="A4" style={PDFStyles.page} orientation="landscape">
        <PDFTitle title="Tax Invoice" />
        <PDFHeader />

        <PDFDeclaration
          content={`This is a transportation freight bill for ${customerId?.customerName || ''}`}
        />

        {renderInvoiceTable()}
        {renderTaxBreakup()}
        <PDFFooter additionalInfo={[`Issue Date: ${fDate(issueDate)}`]} />
      </Page>
    </Document>
  );
}
