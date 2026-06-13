/* eslint-disable react/prop-types */
import { Page, Font, Document } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';
import { fNumber, fCurrency } from 'src/utils/format-number';

import PDFInvoiceFooter from 'src/pdfs/common/PDFInvoiceFooter';
import { PDFTitle, PDFHeader, PDFStyles, NewPDFTable } from 'src/pdfs/common';

import PDFBillToSection from './common/PDFBillTo';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});

export default function TransporterPaymentPdf({ transporterPayment, tenant }) {
  const {
    subtripSnapshot = [],
    summary = {},
    transporterId: transporter,
    issueDate,
    paymentId,
    status,
    taxBreakup = {},
    additionalCharges = [],
  } = transporterPayment || {};

  const renderSubtripTable = () => {
    const columns = [
      { header: 'S.No', accessor: 'sno', width: '4%' },
      { header: 'Disp Date', accessor: 'dispatchDate', width: '8%' },
      { header: 'LR No', accessor: 'lrNo', width: '10%' },
      { header: 'Vehicle', accessor: 'vehicleNo', width: '11%' },
      { header: 'From', accessor: 'from', width: '11%' },
      { header: 'Dest.', accessor: 'destination', width: '11%' },
      { header: 'Invoice', accessor: 'invoiceNo', width: '9%' },
      { header: 'Short.', accessor: 'shortageQty', width: '7%', align: 'right' },
      { header: 'ShortAmt', accessor: 'shortageAmt', width: '8%', align: 'right', showTotal: true, formatter: (v) => fNumber(v) },
      { header: 'FRT-AMT', accessor: 'frtAmt', width: '9%', align: 'right', showTotal: true, formatter: (v) => fNumber(v) },
      { header: 'Advances', accessor: 'expense', width: '9%', align: 'right', showTotal: true, formatter: (v) => fNumber(v) },
      { header: 'Payable', accessor: 'totalPayable', width: '10%', align: 'right', showTotal: true, formatter: (v) => fNumber(v) },
    ];

    const tableData = subtripSnapshot.map((st, idx) => ({
      sno: idx + 1,
      dispatchDate: fDate(st.startDate),
      lrNo: st.subtripNo,
      vehicleNo: st.vehicleNo,
      from: st.loadingPoint,
      destination: st.unloadingPoint,
      invoiceNo: st.invoiceNo,
      shortageQty: st.shortageWeight,
      shortageAmt: st.shortageAmount,
      frtAmt: st.freightAmount || 0,
      expense: st.totalExpense || 0,
      totalPayable: st.totalTransporterPayment || 0,
    }));

    const createExtraRows = () => {
      const extraRows = [];

      // Add TDS row
      if (taxBreakup?.tds?.rate > 0) {
        extraRows.push({
          cells: [
            { startIndex: 0, colspan: 10, value: '', align: 'left' },
            { startIndex: 10, colspan: 1, value: `TDS-${taxBreakup.tds.rate}%`, align: 'right' },
            { startIndex: 11, colspan: 1, value: fCurrency(taxBreakup.tds.amount), align: 'right' },
          ],
          highlight: false,
        });
      }

      // Add additional charges
      if (additionalCharges?.length > 0) {
        additionalCharges.forEach(({ label, amount }) => {
          extraRows.push({
            cells: [
              { startIndex: 0, colspan: 10, value: '', align: 'left' },
              { startIndex: 10, colspan: 1, value: label, align: 'right' },
              { startIndex: 11, colspan: 1, value: fCurrency(amount), align: 'right' },
            ],
            highlight: false,
          });
        });
      }

      // Add CGST row
      if (taxBreakup?.cgst?.rate > 0) {
        extraRows.push({
          cells: [
            {
              startIndex: 0,
              colspan: 10,
              value:
                'Note: I/we have taken registration under the CGST Act, 2017 and have exercised the option to pay tax on services of GTA in relation to transport of goods supplied by us.',
              align: 'left',
            },
            { startIndex: 10, colspan: 1, value: `CGST-${taxBreakup.cgst.rate}%`, align: 'right' },
            {
              startIndex: 11,
              colspan: 1,
              value: fCurrency(taxBreakup.cgst.amount),
              align: 'right',
            },
          ],
          highlight: false,
        });
      }

      // Add SGST row
      if (taxBreakup?.sgst?.rate > 0) {
        extraRows.push({
          cells: [
            { startIndex: 0, colspan: 10, value: '', align: 'left' },
            { startIndex: 10, colspan: 1, value: `SGST-${taxBreakup.sgst.rate}%`, align: 'right' },
            {
              startIndex: 11,
              colspan: 1,
              value: fCurrency(taxBreakup.sgst.amount),
              align: 'right',
            },
          ],
          highlight: false,
        });
      }

      // Add IGST row
      if (taxBreakup?.igst?.rate > 0) {
        extraRows.push({
          cells: [
            {
              startIndex: 0,
              colspan: 10,
              value:
                'Note: I/we have taken registration under the CGST Act, 2017 and have exercised the option to pay tax on services of GTA in relation to transport of goods supplied by us.',
              align: 'left',
            },
            { startIndex: 10, colspan: 1, value: `IGST-${taxBreakup.igst.rate}%`, align: 'right' },
            {
              startIndex: 11,
              colspan: 1,
              value: fCurrency(taxBreakup.igst.amount),
              align: 'right',
            },
          ],
          highlight: false,
        });
      }

      // Add Net Total row
      extraRows.push({
        cells: [
          { startIndex: 0, colspan: 10, value: '', align: 'left' },
          { startIndex: 10, colspan: 1, value: 'Net Total', align: 'right' },
          { startIndex: 11, colspan: 1, value: fCurrency(summary.netIncome), align: 'right' },
        ],
        highlight: true,
      });

      return extraRows;
    };

    const cellStyler = (row, column) => {
      if (column.accessor === 'shortageQty' && row.shortageQty > 0) {
        return 'textDanger';
      }
      if (column.accessor === 'shortageAmt' && row.shortageAmt > 0) {
        return 'textDanger';
      }
      return null;
    };

    return (
      <NewPDFTable
        columns={columns}
        data={tableData}
        showTotals
        totalRowLabel="TOTAL"
        cellStyler={cellStyler}
        extraRows={createExtraRows()}
      />
    );
  };

  const renderExpenseTable = () => {
    const columns = [
      { header: 'S.No', accessor: 'sno', width: '6%' },
      { header: 'Job No', accessor: 'subtripNo', width: '18%' },
      { header: 'Expense Type', accessor: 'expenseType', width: '22%' },
      {
        header: 'Amount',
        accessor: 'amount',
        width: '12%',
        align: 'right',
        showTotal: true,
        formatter: (v) => fNumber(v),
      },
      { header: 'Remarks', accessor: 'remarks', width: '42%' },
    ];

    const expenseRows = subtripSnapshot.flatMap((st) =>
      (st.expenses || []).map((e) => ({
        subtripNo: st.subtripNo,
        expenseType: e.expenseType,
        amount: e.amount,
        remarks: e.remarks || '',
      }))
    );

    const tableData = expenseRows.map((row, idx) => ({ ...row, sno: idx + 1 }));

    return <NewPDFTable columns={columns} data={tableData} showTotals totalRowLabel="TOTAL" />;
  };

  return (
    <Document>
      <Page size="A4" style={PDFStyles.page} orientation="landscape">
        <PDFTitle title="Transporter Payment Receipt" />
        <PDFHeader company={tenant} />

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
            ['Status', status?.toUpperCase()],
          ]}
        />

        {renderSubtripTable()}

        <PDFInvoiceFooter
          declaration="This is a system-generated transporter payment voucher."
          signatory={`For ${tenant.name}`}
        />
      </Page>
      {subtripSnapshot.some((st) => (st.expenses || []).length > 0) && (
        <Page size="A4" style={PDFStyles.page} orientation="landscape">
          <PDFTitle title="Trip Advances" />
          <PDFHeader company={tenant} />
          {renderExpenseTable()}
          <PDFInvoiceFooter
            declaration="This is a system-generated transporter payment voucher."
            signatory={`For ${tenant.name}`}
          />
        </Page>
      )}
    </Document>
  );
}
