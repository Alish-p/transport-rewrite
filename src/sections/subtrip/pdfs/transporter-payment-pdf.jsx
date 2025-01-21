/* eslint-disable react/prop-types */
import { useMemo } from 'react';
import { Page, View, Text, Font, Document, StyleSheet } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';

import { pdfStyles } from './pdf-styles';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () => useMemo(() => StyleSheet.create(pdfStyles), []);

// ----------------------------------------------------------------------

export default function TransporterPaymentPdf({ subtrip }) {
  const {
    _id,
    diNumber,
    customerId,
    startDate,
    expenses,
    initialDiesel,
    tripId: { driverId, vehicleId },
  } = subtrip;

  console.log(subtrip);

  const styles = useStyles();

  return (
    <Document>
      <Page size="A5" style={styles.page} orientation="landscape">
        {/* Headers */}

        <View style={[styles.gridContainer]}>
          <View
            style={[
              styles.gridContainer,
              styles.col12,
              styles.p4,
              { display: 'flex', justifyContent: 'center' },
            ]}
          >
            <Text style={[styles.h4]}>Transporter Payment</Text>
          </View>
        </View>

        {/* Declaration */}
        <View style={[styles.gridContainer, styles.my4]}>
          <View style={[styles.col12, { display: 'flex', justifyContent: 'center' }, styles.p4]}>
            <Text style={[styles.subtitle2]}>Please allow this vehicle to enter for loading.</Text>
          </View>
        </View>

        {/* to Customer */}
        <View style={[styles.gridContainer, styles, styles.border]}>
          <View
            style={[
              styles.col8,
              styles.border,
              styles.p4,
              {
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                paddingHorizontal: '2px',
              },
            ]}
          >
            <Text style={[styles.subtitle2]}>TO: </Text>
            <Text style={[styles.body2, styles.px4]}> {customerId?.customerName}</Text>
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
              <Text style={[styles.subtitle2]}>DI/DO No: </Text>
              <Text style={[styles.body2, styles.px4]}>{diNumber || '-'}</Text>
            </View>
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
              <Text style={[styles.subtitle2]}>Date : </Text>
              <Text style={[styles.body2, styles.px4]}>{fDate(startDate)}</Text>
            </View>
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
            <Text style={[styles.subtitle2]}>Vehicle No.</Text>
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
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.subtitle2]}>LR NO</Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.subtitle2]}>Transporter</Text>
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
            <Text style={[styles.body2]}>{vehicleId?.noOfTyres} Tyre</Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.body2]}>{_id} </Text>
          </View>
          <View
            style={[
              styles.col2,
              { display: 'flex', alignItems: 'center' },
              styles.p4,
              styles.border,
            ]}
          >
            <Text style={[styles.body2]}>Shree Transport </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
