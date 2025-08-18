import { fDateTime } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';

import { exportToExcel } from './export-multi-sheet-to-excel';

export const exportBillingSummaryToExcel = async (summary, fileName = 'customer-billing-summary') => {
  const formatPayments = (payments) =>
    (payments || [])
      .map(
        (p) =>
          `${fNumber(p.amount)} received on ${fDateTime(p.paidAt)}${p.referenceNumber ? ` against ${p.referenceNumber}` : ''}`,
      )
      .join('\n');

  const mapInvoices = (invoices) =>
    (invoices || []).map((inv, idx) => ({
      'S.No': idx + 1,
      'Invoice No': inv.invoiceNo,
      'Customer Name': inv.customerName,
      Status: inv.invoiceStatus,
      'Issue Date': fDateTime(inv.issueDate),
      'Due Date': fDateTime(inv.dueDate),
      'Net Total': inv.netTotal,
      'Total Received': inv.totalReceived,
      'Pending Amount': (inv.netTotal || 0) - (inv.totalReceived || 0),
      Payments: formatPayments(inv.payments),
    }));

  const mapSubtrips = (subtrips) =>
    (subtrips || []).map((st, idx) => ({
      'S.No': idx + 1,
      'Subtrip No': st._id,
      'Customer Name': st.customerName,
      'Start Date': fDateTime(st.startDate),
      'Received Date': fDateTime(st.receivedDate),
      'Loading Point': st.loadingPoint,
      'Loading Weight': st.loadingWeight,
      Rate: st.rate,
      'Unloading Point': st.unloadingPoint,
      'Unloading Date': fDateTime(st.unloadingDate),
      'Vehicle No': st.vehicleNo,
      Driver: st.driver,
      'Subtrip Type': st.subtripType,
    }));

  const pendingInvoices = mapInvoices(summary?.pendingInvoices);
  const receivedInvoices = mapInvoices(summary?.receivedInvoices);
  const unbilledSubtrips = mapSubtrips(summary?.unbilledSubtrips);

  await exportToExcel(
    [
      { name: 'Pending Invoices', data: pendingInvoices, options: { highlightColumns: ['Pending Amount'] } },
      { name: 'Received Invoices', data: receivedInvoices },
      { name: 'Unbilled Subtrips', data: unbilledSubtrips },
    ],
    fileName,
  );
};

export default exportBillingSummaryToExcel;
