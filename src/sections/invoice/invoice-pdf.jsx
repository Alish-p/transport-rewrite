/* eslint-disable react/prop-types */
import { useMemo } from 'react';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';

import { pdfStyles } from '../subtrip/pdfs/pdf-styles';
import { calculateSubtripTotalIncome } from '../../utils/utils';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () => useMemo(() => StyleSheet.create(pdfStyles), []);

const COMPANY = CONFIG.company;

export default function InvoicePdf({ invoice, currentStatus }) {
  const { _id, subtrips, customerId, invoiceStatus, createdDate, dueDate } = invoice;

  const totalIncome = useMemo(() => calculateSubtripTotalIncome(subtrips), [subtrips]);
  const totalQuantity = useMemo(
    () => subtrips.reduce((acc, subtrip) => acc + subtrip.loadingWeight, 0),
    [subtrips]
  );

  const styles = useStyles();

  const renderDocumentTitle = () => (
    <View style={[styles.gridContainer]}>
      <Text style={[styles.h3, styles.mb4]}>Customer Invoice</Text>
    </View>
  );

  const renderCompanyHeader = () => (
    <View style={[styles.gridContainer, styles.border]}>
      <View style={[styles.gridContainer, styles.col8, styles.p8, styles.borderRight]}>
        <View style={[styles.col4]}>
          <Image source="/logo/Company-logo.png" style={{ width: 72, height: 72 }} />
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
          This is a transportation freight bill for {customerId?.customerName}.
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
          <Text style={[styles.subtitle2]}>{customerId?.customerName}</Text>
          <Text style={styles.body2}>+91-{customerId?.cellNo}</Text>
          <Text style={styles.body2}>
            {customerId?.address},{customerId?.state},{customerId?.pinCode}
          </Text>
          <Text style={styles.body2}>
            {`ACC No - ${customerId?.bankDetails?.accNo},${customerId?.bankDetails?.branch}, ${customerId?.bankDetails?.name}`}
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
            <Text style={[styles.horizontalCellTitle]}>Invoice Created</Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellTitle]}>Invoice Due </Text>
          </View>
          <View style={[styles.horizontalCell, styles.borderBottom]}>
            <Text style={[styles.horizontalCellTitle]}>Invoice Status </Text>
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
            <Text style={[styles.horizontalCellContent]}>{currentStatus} </Text>
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
          <Text style={[styles.horizontalCellTitle]}>#</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Consignee</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Destination</Text>
        </View>

        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Vehicle No </Text>
        </View>
        <View style={[styles.horizontalCell, styles.col1, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>LR No </Text>
        </View>
        <View style={[styles.horizontalCell, styles.col1, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Invoice No </Text>
        </View>
        <View style={[styles.horizontalCell, styles.col1, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Disp Date</Text>
        </View>
        <View style={[styles.horizontalCell, styles.col1, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>QTY(MT) </Text>
        </View>
        <View style={[styles.horizontalCell, styles.col1, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}> Rate/MT </Text>
        </View>
        <View style={[styles.horizontalCell, styles.col1, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}> Freight Amount </Text>
        </View>
      </View>
      {/* Values */}
      {subtrips.map((subtrip, idx) => (
        <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
          <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{idx}</Text>
          </View>
          <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{subtrip?.consignee}</Text>
          </View>
          <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{subtrip?.unloadingPoint}</Text>
          </View>
          <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>
              {subtrip?.tripId?.vehicleId?.vehicleNo}
            </Text>
          </View>
          <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{subtrip?._id}</Text>
          </View>
          <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{subtrip?.invoiceNo}</Text>
          </View>
          <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{fDate(subtrip?.startDate)}</Text>
          </View>
          <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{subtrip?.loadingWeight}</Text>
          </View>
          <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{subtrip?.rate}</Text>
          </View>
          <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>
              {subtrip.rate * subtrip.loadingWeight}
            </Text>
          </View>
        </View>
      ))}

      {/* Weight and total row */}
      <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
        <View style={[styles.col9, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{}</Text>
        </View>

        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.subtitle2]}>{totalQuantity}</Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>{}</Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell]}>
          <Text style={[styles.subtitle2]}>{fCurrency(totalIncome)}</Text>
        </View>
      </View>

      {/* CGST */}
      <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
        <View style={[styles.col9, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{}</Text>
        </View>

        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.subtitle2]}>{`CGST-${CONFIG.customerInvoiceTax}%`}</Text>
        </View>

        <View style={[styles.col1, styles.horizontalCell]}>
          <Text style={[styles.subtitle2]}>
            {fCurrency((totalIncome * CONFIG.customerInvoiceTax) / 100)}
          </Text>
        </View>
      </View>

      {/* SGST */}
      <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
        <View style={[styles.col9, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{}</Text>
        </View>

        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.subtitle2]}>{`SGST-${CONFIG.customerInvoiceTax}%`}</Text>
        </View>

        <View style={[styles.col1, styles.horizontalCell]}>
          <Text style={[styles.subtitle2]}>
            {fCurrency((totalIncome * CONFIG.customerInvoiceTax) / 100)}
          </Text>
        </View>
      </View>

      {/* Net Total */}
      <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
        <View style={[styles.col9, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{}</Text>
        </View>

        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.subtitle2]}>Net Total</Text>
        </View>

        <View style={[styles.col1, styles.horizontalCell]}>
          <Text style={[styles.subtitle2]}>
            {fCurrency(totalIncome * (1 + (2 * CONFIG.customerInvoiceTax) / 100))}
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
