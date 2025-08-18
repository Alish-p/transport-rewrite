import { fDateTime } from 'src/utils/format-time';

import { exportToExcel } from './export-multi-sheet-to-excel';

const mapPayments = (payments) =>
  (payments || []).map((p, idx) => ({
    'S.No': idx + 1,
    'Payment ID': p.paymentId,
    'Transporter Name': p.transporterName,
    'Issue Date': fDateTime(p.issueDate),
    Status: p.status,
    'Net Payment': p.netIncome,
  }));

const mapSubtrips = (subtrips) =>
  (subtrips || []).map((st, idx) => ({
    'S.No': idx + 1,
    'Subtrip ID': st._id,
    'Customer Name': st.customerName,
    'Loading Point': st.loadingPoint,
    'Unloading Point': st.unloadingPoint,
    'Start Date': fDateTime(st.startDate),
    'End Date': fDateTime(st.endDate),
    'Loading Weight': st.loadingWeight,
    Rate: st.rate,
    Transporter: st.transporter,
    'Vehicle No': st.vehicleNo,
    Driver: st.driver,
    'Total Freight Amount': st.totalFreightAmount,
    'Total Expense': st.totalExpense,
    'Total Shortage Amount': st.totalShortageAmount,
    'Total Transporter Payment': st.totalTransporterPayment,

  }));

export const exportTransporterPaymentSummaryToExcel = async (
  summary,
  fileName = 'transporter-payment-summary',
) => {
  const pendingTransporterPayments = mapSubtrips(summary?.pendingTransporterPayments);
  const payablePayments = mapPayments(summary?.payablePayments);
  const paidPayments = mapPayments(summary?.paidPayments);

  await exportToExcel(
    [
      { name: 'Pending Subtrips', data: pendingTransporterPayments },
      { name: 'Payable Payments', data: payablePayments },
      { name: 'Paid Payments', data: paidPayments },
    ],
    fileName,
  );
};

export default exportTransporterPaymentSummaryToExcel;
