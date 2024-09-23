/* eslint-disable react/prop-types */
import { useMemo } from 'react';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        col1: { width: '8.33%' },
        col2: { width: '16.67%' },
        col4: { width: '33.33%' },
        col8: { width: '66.67%' },
        col6: { width: '50%' },
        col12: { width: '100%' },
        mb4: { marginBottom: 4 },
        mb8: { marginBottom: 8 },
        mb40: { marginBottom: 40 },
        p4: { padding: 4 },
        p8: { padding: 10 },
        p40: { padding: 40 },

        h1: { fontSize: 20, fontWeight: 700 },
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        subtitle1: { fontSize: 10, fontWeight: 700 },
        subtitle2: { fontSize: 9, fontWeight: 700 },
        alignRight: { textAlign: 'right' },
        page: {
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
          textTransform: 'capitalize',
          padding: '40px 24px 120px 24px',
        },
        border: {
          border: '1px solid black',
        },
        borderNT: {
          borderBottom: '1px solid black',
          borderRight: '1px solid black',
          borderLeft: '1px solid black',
        },
        footer: {
          left: 0,
          right: 0,
          bottom: 0,
          padding: 24,
          margin: 'auto',
          borderTopWidth: 1,
          borderStyle: 'solid',
          position: 'absolute',
          borderColor: '#DFE3E8',
        },

        gridContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        table: {
          display: 'flex',
          width: 'auto',
        },
        tableRow: {
          padding: '8px 0',
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        noBorder: {
          paddingTop: 8,
          paddingBottom: 0,
          borderBottomWidth: 0,
        },
        tableCell_1: {
          width: '5%',
        },
        tableCell_2: {
          width: '50%',
          paddingRight: 16,
        },
        tableCell_3: {
          width: '15%',
        },
      }),
    []
  );

// ----------------------------------------------------------------------

export default function LRPDF({ subtripData }) {
  const {
    _id,
    customerId,
    ewayBill,
    invoiceNo,
    loadingPoint,
    loadingWeight,
    materialType,
    orderNo,
    quantity,
    shipmentNo,
    startDate,
    unloadingPoint,

    tripId: { driverId, vehicleId },
  } = subtripData;

  const styles = useStyles();

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        {/* Headers */}
        <View style={[styles.gridContainer, styles.border]}>
          <View style={[styles.gridContainer, styles.col8, styles.p8, styles.border]}>
            <View style={[styles.col4]}>
              <Image
                source="https://images.pexels.com/photos/17966146/pexels-photo-17966146/free-photo-of-trona-pinnacles-in-californian-desert.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                style={{ width: 48, height: 48 }}
              />
            </View>

            <View style={[styles.col8, { display: 'flex', alignItems: 'center' }]}>
              <Text style={[styles.h1]}>Shree Enterprises</Text>
              <Text style={styles.body2}>Transport Contractor & Commission Agents</Text>
              <Text style={styles.body2}>Plot No 16 & 17, Jamakhandi Road, Mudhol-587313. </Text>
              <Text style={styles.body2}>Dist: BagalKot State; Karnataka</Text>
            </View>
          </View>

          <View
            style={[
              styles.gridContainer,
              styles.col4,
              styles.p8,
              styles.border,
              { display: 'flex', alignItems: 'center' },
            ]}
          >
            <View style={[styles.col6]}>
              <Text style={[styles.subtitle2, styles.mb4]}>Office</Text>
              <Text style={[styles.subtitle2, styles.mb4]}>JK</Text>
              <Text style={[styles.subtitle2, styles.mb4]}>SE</Text>
            </View>

            <View style={[styles.col6]}>
              <Text style={[styles.body2, styles.mb4]}>+7575049646</Text>
              <Text style={styles.body2}>+7575049646</Text>
              <Text style={styles.body2}>+7575049646</Text>
            </View>
          </View>
        </View>

        {/* consignor */}
        <View style={[styles.gridContainer, styles, styles.border]}>
          <View
            style={[
              styles.col8,
              styles.border,
              styles.p4,
              {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            ]}
          >
            <View style={[{ display: 'flex' }]}>
              <Text style={[styles.subtitle2]}>Consignor:</Text>
              <Text style={styles.body2}>JK Cement Works Muddapur</Text>
            </View>
            <View style={[{ display: 'flex' }]}>
              <Text style={[styles.subtitle2]}>Consignor:</Text>
              <Text style={styles.body2}>JK Cement Works Muddapur</Text>
            </View>
          </View>

          <View style={[styles.col4, styles.gridContainer]}>
            <View
              style={[
                styles.col6,
                styles.border,
                {
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  paddingHorizontal: '2px',
                },
              ]}
            >
              <Text style={[styles.subtitle2]}>LR No: </Text>
              <Text style={[styles.body2]}>{_id}</Text>
            </View>
            <View style={[styles.col6, styles.border, styles.p4]}>
              <Text style={[styles.body2, styles]}>Date :{fDate(startDate)}</Text>
            </View>
          </View>
        </View>

        {/* Consignee */}
        <View style={[styles.gridContainer, styles, styles.border]}>
          <View
            style={[
              styles.gridContainer,
              styles.col8,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
              { paddingRight: '20px' },
            ]}
          >
            <Text style={[styles.subtitle2]}>Consignee:</Text>
            <Text style={styles.body2}>MS JK Cements Works</Text>
          </View>

          <View style={[styles.col4, styles.gridContainer]}>
            <View
              style={[
                styles.col6,
                styles.border,
                {
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  paddingHorizontal: '2px',
                },
              ]}
            >
              <Text style={[styles.subtitle2, styles]}>Invoice No: </Text>
              <Text style={[styles.body2, { textAlign: 'center' }]}>{invoiceNo}</Text>
            </View>
            <View style={[styles.col6, styles.border, styles.p4]}>
              <Text style={[styles.body2, styles]}>EWay No :{ewayBill}</Text>
            </View>
          </View>
        </View>

        {/* From - To */}
        <View style={[styles.gridContainer, styles, styles.border]}>
          <View
            style={[
              styles.gridContainer,
              styles.col8,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.subtitle2]}>From:</Text>
            <Text style={styles.body2}>{loadingPoint}</Text>
            <Text style={[styles.subtitle2]}>To:</Text>
            <Text style={styles.body2}>{unloadingPoint}</Text>
          </View>

          <View style={[styles.col4, { display: 'flex', alignItems: 'center' }]}>
            <Text style={[styles.body2, styles.mb4]}>Invoice No:{invoiceNo}</Text>
          </View>
        </View>

        {/* Order No Header */}
        <View style={[styles.gridContainer, styles.border]}>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.subtitle2]}>Token No.:</Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.subtitle2]}>Order No.:</Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.subtitle2]}>Vehicle NO.</Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.subtitle2]}>Qty. in (MT)</Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.subtitle2]}>No. Of Bags</Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.subtitle2]}>Description</Text>
          </View>
        </View>

        {/* Values */}
        <View style={[styles.gridContainer, styles, styles.border]}>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.body2]}>0</Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.body2]}>{orderNo}</Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.body2]}>{vehicleId?.vehicleNo}</Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.body2]}>{loadingWeight}</Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.body2]}>{quantity}</Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.body2]}>P.P.C</Text>
          </View>
        </View>

        {/* Vehicle Details Header */}
        <View style={[styles.gridContainer, styles.border]}>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.subtitle2]}>Driver Name</Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.subtitle2]}>Driver Mobile No.</Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.subtitle2]}>Driver DL No.</Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.subtitle2]}>Vehicle Type</Text>
          </View>
          <View
            style={[
              styles.col4,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.subtitle2]}>Driver Signature</Text>
          </View>
        </View>

        {/* Values */}
        <View style={[styles.gridContainer, styles, styles.border]}>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.body2]}>{driverId?.driverName}</Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.body2]}>{driverId?.driverCellNo}</Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.body2]}>{driverId?.driverLicenceNo}</Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.body2]}>{vehicleId?.noOfTyres} Tyre</Text>
          </View>
          <View
            style={[
              styles.col4,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.body2]}>{}</Text>
          </View>
        </View>

        {/* Declaration */}
        <View style={[styles.gridContainer, styles, styles.border]}>
          <View
            style={[
              styles.col12,
              { display: 'flex', justifyContent: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.subtitle2]}>Declaration:</Text>
            <Text style={[styles.subtitle2]}>
              Delivery Instruction: All goods are accepted subject to terms & condition given
              overleaf subject to Mudhol Jurisdiction
            </Text>
            <Text style={[styles.subtitle2]}>
              Caution: The Consignment will not be detained,diverted,rerouted or rebooked without
              consignee Bank&rsquo;s written Permission,we will deliver at the destination.
            </Text>
          </View>
        </View>

        {/* Signatures */}
        <View style={[styles.gridContainer, styles, styles.border, { height: '80px' }]}>
          <View
            style={[
              styles.col6,
              { display: 'flex', justifyContent: 'flex-end' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.subtitle2]}>Reciever Seal & Signature</Text>
          </View>
          <View
            style={[
              styles.col6,
              { display: 'flex', justifyContent: 'flex-end' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.subtitle2]}>Authorised Signatory</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
