/* eslint-disable react/prop-types */
import { useMemo } from 'react';
import { Font, Page, Document } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';
import PDFBillToSection from 'src/pdfs/common/PDFBillTo';
import PDFInvoiceFooter from 'src/pdfs/common/PDFInvoiceFooter';
import { PDFTitle, PDFTable, PDFHeader, PDFStyles } from 'src/pdfs/common';

// register your font
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});

export default function LoansPdf({ loan }) {
  const {
    _id,
    borrowerId: b,
    createdAt,
    disbursementDate,
    emi,
    installments = [],
    totalAmount,
    outstandingBalance,
    status,
    remarks,
    payments,
  } = loan || {};

  // table headers
  const headers = ['No.', 'EMI Amount', 'Due Date', 'Status', 'Paid Amount', 'Paid Date'];

  // build table data
  const data = useMemo(
    () =>
      installments.map((inst) => [
        inst.installmentNumber,
        fCurrency(inst.totalDue),
        fDate(inst.dueDate),
        inst.status.charAt(0).toUpperCase() + inst.status.slice(1),
        inst.paidAmount ? fCurrency(inst.paidAmount) : '-',
        inst.paidDate ? fDate(inst.paidDate) : '-',
      ]),
    [installments]
  );

  // summary rows
  const summaryData = [
    ['Total Amount', fCurrency(totalAmount)],
    ['Outstanding Balance', fCurrency(outstandingBalance)],
  ];

  // BillTo (borrower) details
  const billToDetails = [
    b?.driverName,
    b?.driverPresentAddress,
    b?.driverCellNo && `Phone: ${b.driverCellNo}`,
    b?.driverLicenceNo && `License: ${b.driverLicenceNo}`,
    b?.bankDetails?.name && `Bank: ${b.bankDetails.name}`,
    b?.bankDetails?.branch && `Branch: ${b.bankDetails.branch}`,
    b?.bankDetails?.ifsc && `IFSC: ${b.bankDetails.ifsc}`,
    b?.bankDetails?.accNo && `A/C: ${b.bankDetails.accNo}`,
  ].filter(Boolean);

  const metaDetails = [
    ['Loan No.', _id],
    ['Created', fDate(createdAt)],
    ['Disbursement', fDate(disbursementDate)],
    ['Status', status?.toUpperCase()],
  ];

  // 2) Payments table
  const paymentHeaders = ['Date', 'Amount', 'Remarks'];
  const paymentData = useMemo(
    () => payments.map((p) => [fDate(p.paymentDate), fCurrency(p.amount), p.remarks || '-']),
    [payments]
  );

  return (
    <Document>
      <Page size="A4" style={PDFStyles.page} orientation="landscape">
        <PDFTitle title="Loan Summary" />
        <PDFHeader />

        <PDFBillToSection
          title="Borrower Details"
          billToDetails={billToDetails}
          metaDetails={metaDetails}
        />

        <PDFTable headers={headers} data={data} columnWidths={[2, 2, 2, 2, 2, 2]} />

        <PDFTable headers={['', '']} data={summaryData} columnWidths={[10, 2]} hideHeader />

        <PDFInvoiceFooter declaration={remarks} signatory={`For ${CONFIG.company.name}`} />
      </Page>

      <Page size="A4" style={PDFStyles.page} orientation="landscape">
        {payments.length > 0 && (
          <>
            <PDFTitle title="Payment history" />
            <PDFTable headers={paymentHeaders} data={paymentData} columnWidths={[1, 1, 2]} />
          </>
        )}
      </Page>
    </Document>
  );
}
