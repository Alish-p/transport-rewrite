/* eslint-disable react/prop-types */
import { Page, Font, Document } from '@react-pdf/renderer';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fDateRangeShortLabel } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';
import PDFInvoiceFooter from 'src/pdfs/common/PDFInvoiceFooter';
import { PDFTitle, PDFTable, PDFHeader, PDFStyles } from 'src/pdfs/common';

import PDFBillToSection from './common/PDFBillTo';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});

export default function TransporterPaymentPdf({ transporterPayment }) {
  const {
    subtripSnapshot = [],
    summary = {},
    transporterId: transporter,
    issueDate,
    billingPeriod,
    paymentId,
    status,
    taxBreakup = {},
    additionalCharges = [],
  } = transporterPayment || {};

  const renderInvoiceTable = () => {
    const headers = [
      'S.No',
      'Dispatch Date',
      'LR No.',
      'Vehicle No',
      'From',
      'Destination',
      'Invoice No',
      'Load QTY',
      'Shortage QTY',
      'Shortage Amt',
      'FRT-RATE',
      'FRT-AMT',
      'Expense',
      'Total Payable',
    ];

    const data = subtripSnapshot.map((st, idx) => [
      idx + 1,
      fDate(st.startDate),
      st.subtripId,
      st.vehicleNo,
      st.loadingPoint,
      st.unloadingPoint,
      st.invoiceNo,
      st.loadingWeight,
      st.shortageWeight,
      fCurrency(st.shortageAmount),
      fCurrency(st.effectiveFreightRate),
      fCurrency(st.freightAmount),
      fCurrency(st.totalExpense),
      fCurrency(st.freightAmount - st.totalExpense - st.shortageAmount),
    ]);

    const columnWidths = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    return <PDFTable headers={headers} data={data} columnWidths={columnWidths} />;
  };

  const renderTaxBreakup = () => {
    const data = [];

    if (taxBreakup?.tds?.rate > 0) {
      data.push([' ', `TDS-${taxBreakup.tds.rate}%`, fCurrency(taxBreakup.tds.amount)]);
    }

    if (additionalCharges?.length > 0) {
      additionalCharges.forEach(({ label, amount }) => {
        data.push([' ', label, fCurrency(amount)]);
      });
    }

    data.push([' ', 'Net Total', fCurrency(summary.netIncome)]);

    if (taxBreakup?.cgst?.rate > 0) {
      data.push([
        'Note: I/we have taken registration under the CGST Act, 2017 and have exercised the option to pay tax on services of GTA in relation to transport of goods supplied by us. ',
        `CGST-${taxBreakup.cgst.rate}%`,
        fCurrency(taxBreakup.cgst.amount),
      ]);
    }

    if (taxBreakup?.sgst?.rate > 0) {
      data.push([' ', `SGST-${taxBreakup.sgst.rate}%`, fCurrency(taxBreakup.sgst.amount)]);
    }

    if (taxBreakup?.igst?.rate > 0) {
      data.push([
        'Note: I/we have taken registration under the CGST Act, 2017 and have exercised the option to pay tax on services of GTA in relation to transport of goods supplied by us. ',
        `IGST-${taxBreakup.igst.rate}%`,
        fCurrency(taxBreakup.igst.amount),
      ]);
    }

    return <PDFTable headers={['', '', '']} data={data} columnWidths={[12, 1, 1]} hideHeader />;
  };

  return (
    <Document>
      <Page size="A4" style={PDFStyles.page} orientation="landscape">
        <PDFTitle title="Transporter Payment Receipt" />
        <PDFHeader />

        <PDFBillToSection
          title="Transporter Detail"
          billToDetails={[
            transporter?.transportName,
            transporter?.address,
            transporter?.panNo,
            transporter?.gstNo,
            transporter?.bankDetails?.name ? `Bank-${transporter?.bankDetails?.name}` : '',
            transporter?.bankDetails?.branch ? `Bank-${transporter?.bankDetails?.branch}` : '',
            transporter?.bankDetails?.ifsc ? `IFSC-${transporter?.bankDetails?.ifsc}` : '',
            transporter?.bankDetails?.accNo ? `ACC-${transporter?.bankDetails?.accNo}` : '',
          ].filter(Boolean)}
          metaDetails={[
            ['Payment No.', paymentId],
            ['Date', fDate(issueDate)],
            ['Billing Period', fDateRangeShortLabel(billingPeriod?.start, billingPeriod?.end)],
            ['Status', status?.toUpperCase()],
          ]}
        />

        {renderInvoiceTable()}
        {renderTaxBreakup()}

        <PDFInvoiceFooter
          declaration="This is a system-generated transporter payment voucher."
          signatory={`For ${CONFIG.company.name}`}
        />
      </Page>
    </Document>
  );
}
