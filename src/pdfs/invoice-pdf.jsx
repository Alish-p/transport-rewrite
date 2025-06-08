/* eslint-disable react/prop-types */
import { Page, Font, Document } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';
import { fNumber, fCurrency } from 'src/utils/format-number';

import { PDFTitle, PDFTable, PDFHeader, PDFStyles } from 'src/pdfs/common';

import { CONFIG } from '../config-global';
import PDFBillToSection from './common/PDFBillTo';
import PDFInvoiceFooter from './common/PDFInvoiceFooter';

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
      'Invoice No',
      'Disp. Date',
      'LR No',
      'Vehicle',
      'Material',
      'Freight Rate',
      'Dispatch Weight',
      'Freight Amount',
      'Shortage Weight',
    ];

    const data = subtripSnapshot.map((subtrip, index) => [
      index + 1,
      subtrip.consignee,
      subtrip.unloadingPoint,
      subtrip.invoiceNo,
      fDate(subtrip.startDate),
      subtrip.subtripId,
      subtrip.vehicleNo,
      subtrip.materialType || '-',
      fCurrency(subtrip.rate),
      subtrip.loadingWeight,
      fCurrency(subtrip.freightAmount),
      fNumber(subtrip.shortageWeight),
    ]);

    const columnWidths = [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    const columnAlignments = headers.map((_, idx) =>
      idx >= 8 ? 'right' : undefined
    );

    return (
      <PDFTable
        headers={headers}
        data={data}
        columnWidths={columnWidths}
        columnAlignments={columnAlignments}
      />
    );
  };

  const renderTaxBreakup = () => {
    const totalWeight = subtripSnapshot.reduce((acc, subtrip) => acc + subtrip.loadingWeight, 0);
    const headers = [' ', fNumber(totalWeight), fCurrency(totalAmountBeforeTax), ' '];

    const data = [headers];

    if (taxBreakup.cgst.rate !== 0) {
      data.push([' ', `CGST-${taxBreakup.cgst.rate}%`, fCurrency(taxBreakup.cgst.amount), ' ']);
    }

    if (taxBreakup.sgst.rate !== 0) {
      data.push([' ', `SGST-${taxBreakup.sgst.rate}%`, fCurrency(taxBreakup.sgst.amount), ' ']);
    }

    if (taxBreakup.igst.rate !== 0) {
      data.push([' ', `IGST-${taxBreakup.igst.rate}%`, fCurrency(taxBreakup.igst.amount), ' ']);
    }

    data.push([' ', 'Net Total', fCurrency(totalAfterTax), ' ']);

    const getRowStyle = (rowIdx) => {
      const label = data[rowIdx][1];
      if (label === 'Net Total') return { color: 'green' };
      if (label.startsWith('CGST') || label.startsWith('SGST')) return { color: 'red' };
      return undefined;
    };

    return (
      <PDFTable
        headers={headers}
        data={data}
        columnWidths={[10, 1, 1, 1]}
        hideHeader
        cellStyles={(r) => getRowStyle(r)}
      />
    );
  };

  return (
    <Document>
      <Page size="A4" style={PDFStyles.page} orientation="landscape">
        <PDFTitle title="Tax Invoice" />
        <PDFHeader />

        <PDFBillToSection
          title="Consignor / Bill To"
          billToDetails={[
            customerId?.customerName,
            customerId?.address,
            customerId?.GSTNo,
            customerId?.sacCode || 'SAC-CODE : 996791',
            customerId?.pinCode,
            customerId?.state,
          ]}
          metaDetails={[
            ['Bill No.', invoiceNo],
            ['Date', fDate(issueDate)],
            ['PAN NO', CONFIG.company.panNo],
            ['GSTIN NO', CONFIG.company.gstin],
            ['Bank Name', CONFIG.company.bankDetails.name],
            ['IFSC code', CONFIG.company.bankDetails.ifsc],
            ['A/C No', CONFIG.company.bankDetails.accountNumber],
            ['Transporter Code', customerId?.transporterCode || '-'],
          ]}
        />

        {renderInvoiceTable()}
        {renderTaxBreakup()}
        <PDFInvoiceFooter
          declaration="I/we have taken registration under the CGST Act, 2017 and have exercised the option to pay tax on services of GTA in relation to transport of goods supplied by us."
          signatory="For Shree Enterprises"
        />
      </Page>
    </Document>
  );
}
