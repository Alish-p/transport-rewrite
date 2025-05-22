/* eslint-disable react/prop-types */
import { Page, Font, View, Text, Document } from '@react-pdf/renderer';

import { fNumber, fCurrency } from 'src/utils/format-number';
import { fDate, fDateTime, fDateRangeShortLabel } from 'src/utils/format-time';

import { PDFTitle, PDFTable, PDFHeader, PDFStyles } from 'src/pdfs/common';

import { wrapText } from '../../../utils/change-case';
import { SUBTRIP_EXPENSE_TYPES } from '../../expense/expense-config';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});

export default function TripSummaryPdf({ trip }) {
  const {
    _id: tripId,
    tripStatus,
    fromDate,
    endDate,
    vehicleId,
    driverId,
    subtrips = [],
  } = trip || {};

  // Prepare subtrip table data
  const subtripData = subtrips.map((st, idx) => {
    const income = st.rate * st.loadingWeight;
    const expenseTotal = Array.isArray(st.expenses)
      ? st.expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
      : 0;
    const net = income - expenseTotal;
    return [
      idx + 1,
      st._id || '-',
      st.customerId?.customerName || '-',
      st.routeCd?.routeName || '-',
      fDateRangeShortLabel(st?.startDate, st?.endDate),
      `${st.endKm - st.startKm || 0} km`,
      fCurrency(income || 0),
      fCurrency(expenseTotal || 0),
      fCurrency(net || 0),
    ];
  });

  const subtripHeaders = [
    'Sr. No',
    'LR No',
    'Customer',
    'Route',
    'Duration',
    'Distance',
    'Income',
    'Expenses',
    'Net Amount',
  ];

  // Prepare flat expense table with global indexing
  let expenseIndex = 0;
  const allExpenses = subtrips.flatMap((st) =>
    (st.expenses || []).map((e) => {
      expenseIndex += 1;
      return [
        expenseIndex,
        st._id || '-',
        e.expenseType,
        fDateTime(e.date),
        fCurrency(e.amount),
        e.expenseType === SUBTRIP_EXPENSE_TYPES.DIESEL ? `${e.dieselLtr} LTR` : '-',
        wrapText(e.remarks, 60),
      ];
    })
  );

  const expenseHeaders = ['Sr. No', 'LR No', 'Type', 'Date', 'Amount', 'LTR', 'Remarks'];

  // Summary calculations
  const totalDistance = subtrips.reduce((sum, st) => sum + (st.routeCd?.distance || 0), 0);
  const totalIncome = subtrips.reduce((sum, st) => sum + (st.rate * st.loadingWeight || 0), 0);
  const totalExpenses = subtrips.reduce(
    (sum, st) =>
      sum + (Array.isArray(st.expenses) ? st.expenses.reduce((s, e) => s + (e.amount || 0), 0) : 0),
    0
  );
  const totalDiesel = subtrips.reduce(
    (sum, st) =>
      sum +
      (Array.isArray(st.expenses)
        ? st.expenses.reduce(
            (s, e) => (e.expenseType === SUBTRIP_EXPENSE_TYPES.DIESEL ? s + (e.dieselLtr || 0) : s),
            0
          )
        : 0),
    0
  );
  const netTotal = totalIncome - totalExpenses;

  return (
    <Document>
      <Page size="A4" style={PDFStyles.page} orientation="landscape">
        <PDFTitle title="Trip Summary" />
        <PDFHeader />

        {/* Details Section */}
        <View style={{ flexDirection: 'row', marginVertical: 1 }}>
          <View style={[PDFStyles.border, { flex: 1, padding: 8 }]}>
            <Text style={PDFStyles.subtitle1}>Trip Details</Text>
            <Text>Trip ID: {tripId}</Text>
            <Text>Status: {tripStatus}</Text>
            <Text>Start Date: {fDate(fromDate)}</Text>
            <Text>End Date: {endDate ? fDate(endDate) : 'N/A'}</Text>
          </View>
          <View style={[PDFStyles.border, { flex: 1, padding: 8 }]}>
            <Text style={PDFStyles.subtitle1}>Vehicle Details</Text>
            <Text>Vehicle: {vehicleId?.vehicleNo}</Text>
            <Text>Ownership: {vehicleId?.isOwn ? 'Own' : 'Market'}</Text>
            <Text>Type: {vehicleId?.vehicleType}</Text>
            <Text>No. Of Tyres: {vehicleId?.noOfTyres}</Text>
          </View>
          <View style={[PDFStyles.border, { flex: 1, padding: 8 }]}>
            <Text style={PDFStyles.subtitle1}>Driver Details</Text>
            <Text>Name: {driverId?.driverName}</Text>
            <Text>Cell No: {driverId?.driverCellNo}</Text>
          </View>
        </View>

        {/* Subtrip Table */}
        <Text style={[PDFStyles.subtitle1, { marginTop: 8 }]}>Subtrip Details</Text>
        <PDFTable
          headers={subtripHeaders}
          data={subtripData}
          columnWidths={[1, 1, 2, 3, 1, 1, 1, 1, 1]}
        />

        {/* Expense Table */}
        <Text style={[PDFStyles.subtitle1, { marginTop: 8 }]}>Expense Details</Text>
        <PDFTable
          headers={expenseHeaders}
          data={allExpenses}
          columnWidths={[1, 1, 1, 2, 1, 1, 5]}
        />

        {/* Summary Section */}
        <Text style={[PDFStyles.subtitle1, { marginTop: 8 }]}>Summary</Text>
        <PDFTable
          headers={['Total Distance', 'Total Diesel', 'Total Income', 'Total Expenses', 'Profit']}
          data={[
            [
              `${fNumber(totalDistance)} Km`,
              `${fNumber(totalDiesel)} L`,
              fCurrency(totalIncome),
              fCurrency(totalExpenses),
              fCurrency(netTotal),
            ],
          ]}
          columnWidths={[2, 2, 2, 2, 2]}
        />
      </Page>
    </Document>
  );
}
