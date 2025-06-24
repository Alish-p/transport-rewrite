import { Page, Font, Text, Document } from '@react-pdf/renderer';

import { fCurrency } from 'src/utils/format-number';
import { fDateRangeShortLabel } from 'src/utils/format-time';

import { PDFTitle, PDFTable, PDFHeader, PDFStyles } from 'src/pdfs/common';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});

export default function VehiclePnlPdf({ vehicleNo, startDate, endDate, subtrips = [] }) {
  const headers = [
    'S.No',
    'ID',
    'Customer',
    'Route',
    'Date',
    'Weight',
    'Rate',
    'Amount',
    'Expense',
    'Net Profit',
  ];

  const data = subtrips.map((st, idx) => [
    idx + 1,
    st._id || '-',
    st.customerName || '-',
    st.routeName || '-',
    fDateRangeShortLabel(st.startDate, st.endDate),
    st.loadingWeight,
    st.rate,
    fCurrency(st.amt || 0),
    fCurrency(st.totalExpense || 0),
    fCurrency((st.amt || 0) - (st.totalExpense || 0)),
  ]);

  const totalAmt = subtrips.reduce((sum, st) => sum + (st.amt || 0), 0);
  const totalExpense = subtrips.reduce((sum, st) => sum + (st.totalExpense || 0), 0);
  const netTotal = totalAmt - totalExpense;

  return (
    <Document>
      <Page size="A4" style={PDFStyles.page} orientation="landscape">
        <PDFTitle
          title={`Vehicle P&L Report ${vehicleNo}- ${fDateRangeShortLabel(startDate, endDate)}`}
        />
        <PDFHeader />

        {/* Subtrip Table */}
        <PDFTable headers={headers} data={data} columnWidths={[1, 2, 2, 2, 2, 1, 1, 1, 1, 1]} />

        {/* Summary Section */}
        <Text style={[PDFStyles.subtitle1, { marginTop: 8 }]}>Summary</Text>
        <PDFTable
          headers={['Total Amount', 'Total Expense', 'Net Profit']}
          data={[[fCurrency(totalAmt), fCurrency(totalExpense), fCurrency(netTotal)]]}
          columnWidths={[2, 2, 2]}
        />
      </Page>
    </Document>
  );
}
