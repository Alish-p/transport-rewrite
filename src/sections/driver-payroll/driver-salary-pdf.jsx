/* eslint-disable react/prop-types */
import { useMemo } from 'react';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';

import { pdfStyles } from '../subtrip/pdfs/pdf-styles';
import { calculateDriverSalary, calculatePayslipSummary } from '../../utils/utils';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () => useMemo(() => StyleSheet.create(pdfStyles), []);

const COMPANY = CONFIG.company;

export default function TransporterPaymentPdf({ driverSalary, currentStatus }) {
  const {
    _id,
    subtripComponents,
    driverId: driver,
    status,
    createdDate,
    otherSalaryComponent,
    periodStartDate,
    periodEndDate,
  } = driverSalary || {};

  const { totalFixedIncome, totalTripWiseIncome, totalDeductions, netSalary } = useMemo(
    () => calculatePayslipSummary(driverSalary),
    [driverSalary]
  );

  const styles = useStyles();

  const renderDocumentTitle = () => (
    <View style={[styles.gridContainer]}>
      <Text style={[styles.h3, styles.mb4]}>PaySlip - {_id}</Text>
    </View>
  );

  const renderCompanyHeader = () => (
    <View style={[styles.gridContainer, styles.border]}>
      <View style={[styles.gridContainer, styles.col8, styles.p8, styles.borderRight]}>
        <View style={[styles.col4]}>
          <Image source="/logo/company-logo.png" style={{ width: 48, height: 48 }} />
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
          The total payment amount to the Driver for services between {fDate(periodStartDate)} and{' '}
          {fDate(periodEndDate)}
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

  const renderDriverRow = () => (
    <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
      <View style={[styles.col8, styles.borderRight, { minHeight: 60 }]}>
        {/* Driver */}
        <Text style={[styles.subtitle2, styles.p8]}>Driver Details:</Text>
        <View
          style={[
            styles.col12,
            { display: 'flex', alignItems: 'flex-start', justifyContent: 'center' },
            styles.p8,
          ]}
        >
          <Text style={[styles.subtitle2]}>{driver?.driverName}</Text>
          <Text style={styles.body2}>+91-{driver?.driverCellNo}</Text>
          <Text style={styles.body2}>{driver?.permanentAddress}</Text>
          <Text style={styles.body2}>
            {`ACC No - ${driver?.bankDetails?.accNo}, ${driver?.bankDetails?.branch}, ${driver?.bankDetails?.name}`}
          </Text>
        </View>
      </View>

      {/* LR/Date */}
      <View style={[styles.col4, styles.gridContainer]}>
        <View style={[styles.col6, styles.borderRight]}>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellTitle]}>PaySlip #</Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellTitle]}>From:</Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellTitle]}>To:</Text>
          </View>
          <View style={[styles.horizontalCell]}>
            <Text style={[styles.horizontalCellTitle]}>Payslip Generation Date</Text>
          </View>
        </View>
        <View style={[styles.col6]}>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellContent]}>{_id}</Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellContent]}>{fDate(periodStartDate)}</Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellContent]}>{fDate(periodEndDate)}</Text>
          </View>
          <View style={[styles.horizontalCell]}>
            <Text style={[styles.horizontalCellContent]}>{fDate(createdDate)}</Text>
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
          <Text style={[styles.horizontalCellTitle]}>#</Text>
        </View>
        <View style={[styles.col3, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Trip-Wise</Text>
        </View>
        <View style={[styles.col3, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Fixed Salary</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Deductions</Text>
        </View>
        <View style={[styles.col3, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Total Amount</Text>
        </View>
      </View>
      {/* Values */}
      <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{1}</Text>
        </View>
        <View style={[styles.col3, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{fCurrency(totalTripWiseIncome)}</Text>
        </View>
        <View style={[styles.col3, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{fCurrency(totalFixedIncome)}</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{fCurrency(totalDeductions)}</Text>
        </View>
        <View style={[styles.col3, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{fCurrency(netSalary)}</Text>
        </View>
      </View>
    </>
  );

  const renderTripwiseDetails = () => (
    <>
      <View style={[styles.gridContainer]}>
        <Text style={[styles.h4, styles.mb4]}>Tripwise Salary List</Text>
      </View>
      {/* Salary Details Header */}
      <View style={[styles.gridContainer, styles.border]}>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>LR</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Vehicle No</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Origin</Text>
        </View>
        <View style={[styles.col3, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Destination</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Disp.Date</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Salary Amount</Text>
        </View>
      </View>
      {/* Values */}

      {subtripComponents.map(({ subtripId: st }, idx) => (
        <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
          <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{st._id}</Text>
          </View>
          <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{st?.tripId?.vehicleId?.vehicleNo}</Text>
          </View>
          <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{st?.loadingPoint}</Text>
          </View>
          <View style={[styles.col3, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{st?.unloadingPoint}</Text>
          </View>
          <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{fDate(st?.startDate)}</Text>
          </View>
          <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{calculateDriverSalary(st)}</Text>
          </View>
        </View>
      ))}
      <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
        <View style={[styles.col10, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{}</Text>
        </View>

        <View style={[styles.col2, styles.horizontalCell]}>
          <Text style={[styles.horizontalCellTitle]}>{fCurrency(totalTripWiseIncome)}</Text>
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
        {renderDriverRow()}
        {renderDeclaration()}
        {renderIncomeDetails()}
      </Page>

      <Page size="A5" style={styles.page} orientation="landscape">
        {/* Headers */}

        {renderTripwiseDetails()}
      </Page>
    </Document>
  );
}
