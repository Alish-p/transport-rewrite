/* eslint-disable react/prop-types */
import { useMemo } from 'react';
import { Page, View, Text, Font, Document, StyleSheet } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';

import { PDFTitle, PDFTable, PDFHeader, PDFFooter, PDFDeclaration } from 'src/pdfs/common';

import { pdfStyles } from './pdf-styles';
import { loadingWeightUnit } from '../../vehicle/vehicle-config';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () => useMemo(() => StyleSheet.create(pdfStyles), []);

// ----------------------------------------------------------------------

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

  const renderConsignorRow = () => (
    <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
      <View style={[styles.gridContainer, styles.col8, styles.borderRight]}>
        <View style={[styles.col6, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Consignor:</Text>
          <Text style={[styles.horizontalCellContent]}>{customerId?.customerName}</Text>
        </View>
        <View style={[styles.col6, styles.horizontalCell]}>
          <Text style={[styles.horizontalCellTitle]}>Consignee :</Text>
          <Text style={styles.horizontalCellContent}>{consignee}</Text>
        </View>
      </View>

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
        <View style={[styles.col6, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>From:</Text>
          <Text style={[styles.horizontalCellContent]}>{loadingPoint}</Text>
        </View>
        <View style={[styles.col6, styles.horizontalCell]}>
          <Text style={[styles.horizontalCellTitle]}>To :</Text>
          <Text style={styles.horizontalCellContent}>{unloadingPoint}</Text>
        </View>
      </View>

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

  const renderTableDetails = () => {
    const headers = [
      'Transporter Code',
      'Order No.',
      'Vehicle NO.',
      `Qty. in (${loadingWeightUnit[vehicleType]})`,
      'No. Of Bags',
      'Grade',
    ];

    const data = [
      [
        customerId?.transporterCode,
        orderNo,
        vehicleId?.vehicleNo,
        loadingWeight,
        loadingWeight,
        grade,
      ],
    ];

    const driverHeaders = [
      'Driver Name',
      'Driver Mobile No.',
      'Driver DL No.',
      'Vehicle Type',
      'Driver Signature',
    ];

    const driverData = [
      [
        driverId?.driverName,
        driverId?.driverCellNo,
        driverId?.driverLicenceNo,
        vehicleId?.noOfTyres,
        '',
      ],
    ];

    return (
      <>
        <PDFTable styles={styles} headers={headers} data={data} />
        <PDFTable styles={styles} headers={driverHeaders} data={driverData} />
      </>
    );
  };

  const renderEmptyLine = () => (
    <View style={[styles.gridContainer, styles.borderLeft, styles.borderRight]}>
      <View style={[styles.col12]}>
        <Text style={{ textAlign: 'center', padding: 4 }}> </Text>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="portrait">
        <PDFTitle styles={styles} title="Lorry Receipt" />
        <PDFHeader styles={styles} />
        {renderConsignorRow()}
        {renderRouteRow()}
        {renderTableDetails()}
        {renderEmptyLine()}
        <PDFDeclaration
          styles={styles}
          content={[
            "1. Goods are transported at owner's risk.",
            '2. Subject to local jurisdiction.',
            '3. E. & O. E.',
          ]}
        />
        <PDFFooter styles={styles} additionalInfo={`LR No: ${_id}`} />
      </Page>
    </Document>
  );
}
