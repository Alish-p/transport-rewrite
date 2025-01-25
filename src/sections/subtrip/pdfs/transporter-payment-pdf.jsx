/* eslint-disable react/prop-types */
import { useMemo } from 'react';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';

import { pdfStyles } from './pdf-styles';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () => useMemo(() => StyleSheet.create(pdfStyles), []);

const COMPANY = CONFIG.company;

export default function TransporterPaymentPdf({ subtrip }) {
  const {
    _id,
    diNumber,
    customerId,
    startDate,
    expenses,
    invoiceNo,
    initialDiesel,
    rate,
    loadingWeight,
    unloadingWeight,
    tripId: { driverId, vehicleId },
    loadingPoint,
    unloadingPoint,
  } = subtrip;

  const { vehicleNo, transporter } = vehicleId;

  const totalExpense = useMemo(
    () => expenses.reduce((total, expense) => total + expense.amount, 0),
    [expenses]
  );

  const rateAfterCommission = rate - CONFIG.company.transporterCommissionRate;
  const income = rateAfterCommission * unloadingWeight;

  const styles = useStyles();

  const renderDocumentTitle = () => (
    <View style={[styles.gridContainer]}>
      <Text style={[styles.h3, styles.mb4]}>Transporter Payment For Subtrip {_id}</Text>
    </View>
  );

  const renderCompanyHeader = () => (
    <View style={[styles.gridContainer, styles.border]}>
      <View style={[styles.gridContainer, styles.col8, styles.p8, styles.borderRight]}>
        <View style={[styles.col4]}>
          <Image source="/logo/company-logo-green.png" style={{ width: 48, height: 48 }} />
        </View>

        <View style={[styles.col8, { display: 'flex', alignItems: 'center' }]}>
          <Text style={[styles.h1]}>{COMPANY.name}</Text>
          <Text style={styles.body2}>{COMPANY.tagline}</Text>
          <Text style={styles.body2}>{COMPANY.address.line1} </Text>
          <Text style={styles.body2}>{`${COMPANY.address.line2} , ${COMPANY.address.state}`}</Text>
          {/* <Text style={styles.body2}>{COMPANY.email} </Text>
              <Text style={styles.body2}>{COMPANY.website} </Text> */}
        </View>
      </View>

      <View
        style={[
          styles.gridContainer,
          styles.col4,
          styles.p8,
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        ]}
      >
        {/* Left Column: Labels */}
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text style={[styles.subtitle2]}>Mobile No</Text>
          <Text style={[styles.subtitle2]}>Email</Text>
          <Text style={[styles.subtitle2]}>Website</Text>
        </View>

        {/* Right Column: Values */}
        <View style={{ flex: 2 }}>
          <Text style={[styles.body2]}>{COMPANY.contacts[0]}</Text>
          <Text style={[styles.body2]}>{COMPANY.email}</Text>
          <Text style={styles.body2}>{COMPANY.website}</Text>
        </View>
      </View>
    </View>
  );

  const renderDeclaration = () => (
    <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
      <View style={[styles.col12]}>
        <Text style={[styles.p4, styles.subtitle2]}>
          The total payment amount for the transporter associated with this subtrip {_id} is as
          follows:
        </Text>
      </View>
    </View>
  );

  const renderEmptyLine = () => (
    <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
      <View style={[styles.col12]}>
        <Text style={{ textAlign: 'center', padding: 4 }}> </Text>
      </View>
    </View>
  );

  const renderTransporterRow = () => (
    <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
      <View style={[styles.col8, styles.borderRight, { minHeight: 80 }]}>
        {/* Driver */}
        <Text style={[styles.subtitle2, styles.p8]}>Transporter Details:</Text>
        <View
          style={[
            styles.col12,
            { display: 'flex', alignItems: 'flex-start', justifyContent: 'center' },
            styles.p8,
          ]}
        >
          <Text style={[styles.subtitle2]}>{transporter?.transportName}</Text>
          <Text style={styles.body2}>PAN # -{transporter?.panNo}</Text>
          <Text style={styles.body2}>+91-{transporter?.cellNo}</Text>
          <Text style={styles.body2}>{transporter?.address} </Text>

          <Text style={[styles.subtitle2, styles.mt4]}>Bank Details</Text>
          <Text style={styles.body2}>
            {`ACC No - ${transporter?.bankDetails?.accNo},${transporter?.bankDetails?.branch}, ${transporter?.bankDetails?.name}`}
          </Text>
        </View>
      </View>

      {/* LR/Date */}
      <View style={[styles.col4, styles.gridContainer, { minHeight: 80 }]}>
        <View style={[styles.col6, styles.borderRight]}>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellTitle]}>LR No: </Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellTitle]}>Customer</Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellTitle]}>Disp. Date </Text>
          </View>

          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellTitle]}>From: </Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellTitle]}>To: </Text>
          </View>
          <View style={[styles.horizontalCell]}>
            <Text style={[styles.horizontalCellTitle]}>Inv# </Text>
          </View>
        </View>
        <View style={[styles.col6]}>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellContent]}>{_id} </Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellContent]}>{customerId?.customerName} </Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellContent]}>{fDate(startDate)} </Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellContent]}>{loadingPoint}</Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellContent]}>{unloadingPoint}</Text>
          </View>
          <View style={[styles.horizontalCell]}>
            <Text style={[styles.horizontalCellContent]}>{invoiceNo}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderIncomeDetails = () => (
    <>
      {/* Salary Details Header */}
      <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>LR</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Vehicle No</Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Load QTY(MT)</Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Unload QTY(MT)</Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>EFF. Freight Rate</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Freight Amount</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Total Expense</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell]}>
          <Text style={[styles.horizontalCellTitle]}>Total Payment</Text>
        </View>
      </View>
      {/* Values */}
      1,2,1,1,1,2,2,2
      <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{_id}</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{vehicleNo}</Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{loadingWeight}</Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{unloadingWeight}</Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          {/* Rate After Commision */}
          <Text style={[styles.horizontalCellContent]}>{rateAfterCommission}</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{income}</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{totalExpense}</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell]}>
          <Text style={[styles.horizontalCellContent]}>{income - totalExpense}</Text>
        </View>
      </View>
    </>
  );

  const renderExpenseDetails = () => (
    <>
      <View style={[styles.gridContainer]}>
        <Text style={[styles.h4, styles.mb4]}>Expense List</Text>
      </View>
      {/* Salary Details Header */}
      <View style={[styles.gridContainer, styles.border]}>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>#</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Expense Type</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Date</Text>
        </View>
        <View style={[styles.col3, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Remarks</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Paid Through</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Amount</Text>
        </View>
      </View>
      {/* Values */}

      {expenses.map((expense, idx) => (
        <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
          <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{idx}</Text>
          </View>
          <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{expense?.expenseType}</Text>
          </View>
          <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{fDate(expense?.date)}</Text>
          </View>
          <View style={[styles.col3, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{expense.remarks}</Text>
          </View>
          <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{expense.paidThrough}</Text>
          </View>
          <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{expense.amount}</Text>
          </View>
        </View>
      ))}

      <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
        <View style={[styles.col10, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{}</Text>
        </View>

        <View style={[styles.col2, styles.horizontalCell]}>
          <Text style={[styles.horizontalCellTitle]}>{fCurrency(totalExpense)}</Text>
        </View>
      </View>
    </>
  );

  return (
    <Document>
      <Page size="A5" style={styles.page} orientation="landscape">
        {/* Headers */}
        {renderDocumentTitle()}
        {renderCompanyHeader()}
        {renderTransporterRow()}
        {renderDeclaration()}
        {renderIncomeDetails()}
      </Page>

      <Page size="A5" style={styles.page} orientation="landscape">
        {/* Headers */}

        {renderExpenseDetails()}
      </Page>
    </Document>
  );
}
