/* eslint-disable react/prop-types */
import { useMemo } from 'react';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { calculateTransporterPayment } from 'src/utils/utils';

import { CONFIG } from 'src/config-global';

import { pdfStyles } from '../subtrip/pdfs/pdf-styles';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () => useMemo(() => StyleSheet.create(pdfStyles), []);

const COMPANY = CONFIG.company;

export default function TransporterPaymentPdf({ transporterPayment, currentStatus }) {
  const {
    _id,
    associatedSubtrips,
    transporterId: transporter,
    status,
    createdDate,
    dueDate,
  } = transporterPayment;

  const totalPayment = useMemo(
    () =>
      associatedSubtrips.reduce((acc, st) => {
        const { totalTransporterPayment } = calculateTransporterPayment(st);
        return acc + totalTransporterPayment;
      }, 0),
    [associatedSubtrips]
  );

  const totalQuantity = useMemo(
    () => associatedSubtrips.reduce((acc, subtrip) => acc + subtrip.loadingWeight, 0),
    [associatedSubtrips]
  );

  const styles = useStyles();

  const renderDocumentTitle = () => (
    <View style={[styles.gridContainer]}>
      <Text style={[styles.h3, styles.mb4]}>Transporter Payment</Text>
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

  // eslint-disable-next-line no-shadow
  const renderDeclaration = () => (
    <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
      <View style={[styles.col12]}>
        <Text style={[styles.p4, styles.subtitle2]}>
          This is a Payment Voucher to {transporter?.transportName} for period between{' '}
          {fDate(createdDate)} and {fDate(dueDate)}.
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
      <View style={[styles.col8, styles.borderRight, { minHeight: 80 }]}>
        {/* Customer */}
        <Text style={[styles.subtitle2, styles.p8]}>Customer Details:</Text>
        <View
          style={[
            styles.col12,
            { display: 'flex', alignItems: 'flex-start', justifyContent: 'center' },
            styles.p8,
          ]}
        >
          <Text style={[styles.subtitle2]}>{transporter?.transportName}</Text>
          <Text style={styles.body2}>+91-{transporter?.cellNo}</Text>
          <Text style={styles.body2}>
            {transporter?.address},{transporter?.place},{transporter?.pinNo}
          </Text>
          <Text style={styles.body2}>
            {`ACC No - ${transporter?.bankDetails?.accNo},${transporter?.bankDetails?.branch}, ${transporter?.bankDetails?.name}`}
          </Text>
        </View>
      </View>

      {/* LR/Date */}
      <View style={[styles.col4, styles.gridContainer, { minHeight: 80 }]}>
        <View style={[styles.col6, styles.borderRight]}>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellTitle]}>INV No: </Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellTitle]}>Payment Created</Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellTitle]}> Payment Due </Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellTitle]}> Payment Status </Text>
          </View>
        </View>
        <View style={[styles.col6]}>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellContent]}>{_id} </Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellContent]}>{fDate(createdDate)} </Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellContent]}>{fDate(dueDate)} </Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellContent]}>{status} </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderTableDetails = () => (
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
      {associatedSubtrips.map((subtrip, idx) => {
        const { tripId, loadingWeight, unloadingWeight } = subtrip || {};
        const { effectiveFreightRate, totalFreightAmount, totalExpense, totalTransporterPayment } =
          calculateTransporterPayment(subtrip);
        return (
          <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
            <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
              <Text style={[styles.horizontalCellContent]}>{subtrip?._id}</Text>
            </View>
            <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
              <Text style={[styles.horizontalCellContent]}>{tripId?.vehicleId?.vehicleNo}</Text>
            </View>
            <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
              <Text style={[styles.horizontalCellContent]}>{loadingWeight}</Text>
            </View>
            <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
              <Text style={[styles.horizontalCellContent]}>{unloadingWeight}</Text>
            </View>
            <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
              {/* Rate After Commision */}
              <Text style={[styles.horizontalCellContent]}>{effectiveFreightRate}</Text>
            </View>
            <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
              <Text style={[styles.horizontalCellContent]}>{totalFreightAmount}</Text>
            </View>
            <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
              <Text style={[styles.horizontalCellContent]}>{totalExpense}</Text>
            </View>
            <View style={[styles.col2, styles.horizontalCell]}>
              <Text style={[styles.horizontalCellContent]}>{totalTransporterPayment}</Text>
            </View>
          </View>
        );
      })}

      {/* CGST */}
      <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
        <View style={[styles.col8, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{}</Text>
        </View>

        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.subtitle2]}>{`CGST-${CONFIG.customerInvoiceTax}%`}</Text>
        </View>

        <View style={[styles.col2, styles.horizontalCell]}>
          <Text style={[styles.subtitle2]}>
            {fCurrency((totalPayment * CONFIG.customerInvoiceTax) / 100)}
          </Text>
        </View>
      </View>

      {/* SGST */}
      <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
        <View style={[styles.col8, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{}</Text>
        </View>

        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.subtitle2]}>{`SGST-${CONFIG.customerInvoiceTax}%`}</Text>
        </View>

        <View style={[styles.col2, styles.horizontalCell]}>
          <Text style={[styles.subtitle2]}>
            {fCurrency((totalPayment * CONFIG.customerInvoiceTax) / 100)}
          </Text>
        </View>
      </View>

      {/* Net Total */}
      <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
        <View style={[styles.col8, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{}</Text>
        </View>

        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.subtitle2]}>Net Total</Text>
        </View>

        <View style={[styles.col2, styles.horizontalCell]}>
          <Text style={[styles.subtitle2]}>
            {fCurrency(totalPayment * (1 + (2 * CONFIG.customerInvoiceTax) / 100))}
          </Text>
        </View>
      </View>
    </>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        {/* Headers */}

        {renderDocumentTitle()}
        {renderCompanyHeader()}
        {renderDriverRow()}
        {renderDeclaration()}
        {renderTableDetails()}
      </Page>
    </Document>
  );
}
