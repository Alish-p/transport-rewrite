/* eslint-disable react/prop-types */
import { useMemo } from 'react';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

import { pdfStyles } from './pdf-styles';
import { loadingWeightUnit } from '../../vehicle/vehicle-config';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () => useMemo(() => StyleSheet.create(pdfStyles), []);

// ----------------------------------------------------------------------

const COMPANY = CONFIG.company;

export default function LRPDF({ subtrip }) {
  const {
    _id,
    customerId,
    consignee,
    ewayBill,
    invoiceNo,
    loadingPoint,
    loadingWeight,
    orderNo,
    startDate,
    unloadingPoint,
    grade,

    tripId: { driverId, vehicleId },
  } = subtrip;

  const { vehicleType } = vehicleId;

  const styles = useStyles();

  const renderDocumentTitle = () => (
    <View style={[styles.gridContainer]}>
      <Text style={[styles.h2, styles.mb4]}>Lorry Receipt</Text>
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

  const renderConsignorRow = () => (
    <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
      <View style={[styles.gridContainer, styles.col8, styles.borderRight]}>
        {/* vertical cell */}

        <View style={[styles.col6, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Consignor:</Text>
          <Text style={[styles.horizontalCellContent]}>{customerId?.customerName}</Text>
        </View>
        <View style={[styles.col6, styles.horizontalCell]}>
          <Text style={[styles.horizontalCellTitle]}>Consignee :</Text>
          <Text style={styles.horizontalCellContent}>{consignee}</Text>
        </View>
      </View>

      {/* Horizontal Cell */}
      <View style={[styles.col4, styles.gridContainer]}>
        <View style={[styles.col6, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>LR No:</Text>
          <Text style={[styles.horizontalCellContent]}>{_id}</Text>
        </View>
        <View style={[styles.col6, styles.horizontalCell]}>
          <Text style={[styles.horizontalCellTitle]}>Date :</Text>
          <Text style={styles.horizontalCellContent}>{fDate(startDate)}</Text>
        </View>
      </View>
    </View>
  );

  const renderRouteRow = () => (
    <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
      <View style={[styles.gridContainer, styles.col8, styles.borderRight]}>
        {/* Route */}
        <View style={[styles.col6, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>From:</Text>
          <Text style={[styles.horizontalCellContent]}>{loadingPoint}</Text>
        </View>
        <View style={[styles.col6, styles.horizontalCell]}>
          <Text style={[styles.horizontalCellTitle]}>To :</Text>
          <Text style={styles.horizontalCellContent}>{unloadingPoint}</Text>
        </View>
      </View>

      {/* Invoice/Eway  */}
      <View style={[styles.col4, styles.gridContainer]}>
        <View style={[styles.col6, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Invoice No:</Text>
          <Text style={[styles.horizontalCellContent]}>{invoiceNo}</Text>
        </View>
        <View style={[styles.col6, styles.horizontalCell]}>
          <Text style={[styles.horizontalCellTitle]}>Eway No:</Text>
          <Text style={styles.horizontalCellContent}>{ewayBill}</Text>
        </View>
      </View>
    </View>
  );

  const renderTableDetails = () => (
    <>
      {/* Order No Header */}
      <View style={[styles.gridContainer, styles.border]}>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Transporter Code:</Text>
        </View>

        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Order No.:</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Vehicle NO.</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>
            Qty. in ({loadingWeightUnit[vehicleType]})
          </Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>No. Of Bags</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell]}>
          <Text style={[styles.horizontalCellTitle]}>Grade</Text>
        </View>
      </View>
      {/* Values */}
      <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{customerId?.transporterCode}</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{orderNo}</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{vehicleId?.vehicleNo}</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{loadingWeight} </Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{loadingWeight}</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell]}>
          <Text style={[styles.horizontalCellContent]}>{grade}</Text>
        </View>
      </View>
      {/* Vehicle Details Header */}
      <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Driver Name</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Driver Mobile No.</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Driver DL No.</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Vehicle Type</Text>
        </View>
        <View style={[styles.col4, styles.horizontalCell]}>
          <Text style={[styles.horizontalCellTitle]}>Driver Signature</Text>
        </View>
      </View>
      {/* Values */}
      <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{driverId?.driverName}</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{driverId?.driverCellNo}</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{driverId?.driverLicenceNo}</Text>
        </View>
        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{vehicleId?.noOfTyres}</Text>
        </View>
        <View style={[styles.col4, styles.horizontalCell]}>
          <Text style={[styles.horizontalCellContent]}>{}</Text>
        </View>
      </View>
    </>
  );

  const renderEmptyLine = () => (
    <View style={[styles.gridContainer, styles.borderLeft, styles.borderRight]}>
      <View style={[styles.col12]}>
        <Text style={{ textAlign: 'center', padding: 4 }}> </Text>
      </View>
    </View>
  );

  const renderDeclaration = () => (
    <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
      <View style={[styles.col12, styles.p4]}>
        <Text style={[styles.subtitle2, styles.mb4]}>Declaration:</Text>

        <Text style={[styles.body2, styles.mb2]}>
          Delivery Instruction: All goods are accepted subject to terms & conditions given overleaf,
          subject to Mudhol Jurisdiction.
        </Text>

        <Text style={[styles.body2, styles.mb2]}>
          Caution: The consignment will not be detained, diverted, rerouted, or rebooked without the
          consignee Bank&rsquo;s written permission. We will deliver at the destination.
        </Text>
      </View>
    </View>
  );

  const renderSignature = () => (
    <View style={[styles.gridContainer, styles.border, styles.noBorderTop, { height: '80px' }]}>
      <View
        style={[
          styles.col6,
          { display: 'flex', justifyContent: 'flex-end' },
          styles.p4,
          styles.borderRight,
        ]}
      >
        <Text style={[styles.subtitle2]}>Reciever Seal & Signature</Text>
      </View>
      <View style={[styles.col6, { display: 'flex', justifyContent: 'flex-end' }, styles.p4]}>
        <Text style={[styles.subtitle2]}>Authorised Signatory</Text>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A5" style={styles.page} orientation="landscape">
        {renderDocumentTitle()}

        {renderCompanyHeader()}

        {renderConsignorRow()}

        {renderRouteRow()}

        {renderEmptyLine()}

        {renderTableDetails()}

        {renderDeclaration()}

        {renderSignature()}
      </Page>
    </Document>
  );
}
