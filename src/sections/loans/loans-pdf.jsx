/* eslint-disable react/prop-types */
import { useMemo } from 'react';
import { Page, View, Text, Font, Document, StyleSheet } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () => {
  const styles = useMemo(
    () =>
      StyleSheet.create({
        col: {
          padding: '8px 24px',
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        page: {
          fontSize: 16,
          padding: '40px 24px 0 24px',
          backgroundColor: '#ffffff',
        },
        gridContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 32,
        },
        h1: {
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 24,
        },
        h2: {
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 8,
        },
        h3: {
          fontSize: 14,
          fontWeight: 700,
          marginBottom: 8,
        },
        h4: {
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 8,
        },
        h5: {
          fontSize: 11,
          fontWeight: 700,
          marginBottom: 8,
        },
        h6: {
          fontSize: 10,
          fontWeight: 700,
          marginBottom: 8,
        },
        mb4: {
          marginBottom: 4,
        },
        mb8: {
          marginBottom: 8,
        },
        mb12: {
          marginBottom: 12,
        },
        mb24: {
          marginBottom: 24,
        },
        mb32: {
          marginBottom: 32,
        },
        subtitle1: {
          fontSize: 12,
        },
        subtitle2: {
          fontSize: 11,
        },
        body1: {
          fontSize: 10,
        },
        body2: {
          fontSize: 9,
        },
        overline: {
          fontSize: 8,
        },
        caption: {
          fontSize: 9,
        },
        tableHeader: {
          backgroundColor: '#F4F6F8',
          padding: '8px 4px',
          fontSize: 10,
          fontWeight: 700,
        },
        tableRow: {
          padding: '8px 4px',
          fontSize: 10,
          borderBottomWidth: 1,
          borderColor: '#DFE3E8',
        },
        tableCell: {
          flex: 1,
          textAlign: 'center',
        },
        summaryRow: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          fontSize: 10,
          padding: '4px 8px',
        },
        divider: {
          borderBottomWidth: 1,
          borderStyle: 'dashed',
          borderColor: '#DFE3E8',
          marginVertical: 16,
        },
      }),
    []
  );

  return styles;
};

const COMPANY = CONFIG.company;

export default function LoansPdf({ loan }) {
  const styles = useStyles();
  const { _id, borrowerId: driver, createdAt, installmentsPaid = [] } = loan || {};

  const renderHeader = () => (
    <View style={styles.gridContainer}>
      <View>
        <Text style={styles.h3}>{`Loan Details - ${_id}`}</Text>
        <Text style={styles.body2}>Status: {loan?.status}</Text>
      </View>
    </View>
  );

  const renderBorrowerInfo = () => (
    <View style={[styles.gridContainer, styles.mb32]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.h5}>Borrower Information</Text>
        <Text style={styles.body2}>{driver?.driverName}</Text>
        <Text style={styles.body2}>{driver?.driverPresentAddress}</Text>
        <Text style={styles.body2}>Phone: {driver?.driverCellNo}</Text>
        <Text style={styles.body2}>License: {driver?.driverLicenceNo}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.h5}>Bank Details</Text>
        <Text style={styles.body2}>{driver?.bankDetails?.name}</Text>
        <Text style={styles.body2}>Branch: {driver?.bankDetails?.branch}</Text>
        <Text style={styles.body2}>IFSC: {driver?.bankDetails?.ifsc}</Text>
        <Text style={styles.body2}>A/C: {driver?.bankDetails?.accNo}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.h5}>Loan Details</Text>
        <Text style={styles.body2}>Principal: {fCurrency(loan?.principalAmount)}</Text>
        <Text style={styles.body2}>Interest Rate: {loan?.interestRate}%</Text>
        <Text style={styles.body2}>Tenure: {loan?.tenure} months</Text>
        <Text style={styles.body2}>Created: {fDate(createdAt)}</Text>
      </View>
    </View>
  );

  const renderInstallments = () => (
    <View>
      <View style={[styles.row, { backgroundColor: '#F4F6F8' }]}>
        <Text style={[styles.tableHeader, { flex: 0.5 }]}>No.</Text>
        <Text style={[styles.tableHeader, { flex: 1 }]}>Amount</Text>
        <Text style={[styles.tableHeader, { flex: 1 }]}>Due Date</Text>
        <Text style={[styles.tableHeader, { flex: 1 }]}>Status</Text>
        <Text style={[styles.tableHeader, { flex: 1 }]}>Paid Date</Text>
      </View>

      {Array.from({ length: loan.tenure }).map((_, index) => {
        const paidInstallment = installmentsPaid[index];
        const isPaid = !!paidInstallment;

        return (
          <View key={index} style={[styles.row, styles.tableRow]}>
            <Text style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{fCurrency(loan.installmentAmount)}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>
              {fDate(
                new Date(loan.createdAt).setMonth(new Date(loan.createdAt).getMonth() + index + 1)
              )}
            </Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{isPaid ? 'Paid' : 'Pending'}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>
              {isPaid ? fDate(paidInstallment.paidDate) : '-'}
            </Text>
          </View>
        );
      })}

      <View style={styles.summaryRow}>
        <Text style={[styles.h6, { width: 120 }]}>Total Amount</Text>
        <Text style={[styles.body2, { width: 120, textAlign: 'right' }]}>
          {fCurrency(loan.totalAmount)}
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={[styles.h6, { width: 120 }]}>Paid Amount</Text>
        <Text style={[styles.body2, { width: 120, textAlign: 'right' }]}>
          {fCurrency(loan.totalAmount - (loan.remainingBalance || loan.totalAmount))}
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={[styles.h6, { width: 120 }]}>Remaining Balance</Text>
        <Text style={[styles.body2, { width: 120, textAlign: 'right', color: '#FF4842' }]}>
          {fCurrency(loan.remainingBalance || loan.totalAmount)}
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.mb32}>
      <View style={styles.divider} />
      <Text style={styles.h5}>REMARKS</Text>
      <Text style={styles.body2}>{loan?.remarks}</Text>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        {renderBorrowerInfo()}
        {renderInstallments()}
        {renderFooter()}
      </Page>
    </Document>
  );
}
