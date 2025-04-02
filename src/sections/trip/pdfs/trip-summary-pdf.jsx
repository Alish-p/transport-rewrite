/* eslint-disable react/prop-types */
import { useMemo } from 'react';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';

import { titleCase } from 'src/utils/change-case';
import { fCurrency } from 'src/utils/format-number';
import { fDate, fDateRangeShortLabel } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

import { pdfStyles } from 'src/sections/subtrip/pdfs/pdf-styles';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () => useMemo(() => StyleSheet.create(pdfStyles), []);

const COMPANY = CONFIG.company;

// ----------------------------------------------------------------------

export default function TripSummaryPdf({ trip }) {
  const { _id, tripStatus, fromDate, toDate, subtrips, vehicleId, driverId, transporter } = trip;

  console.log({ trip });

  const styles = useStyles();

  const renderDocumentTitle = () => (
    <View style={[styles.gridContainer]}>
      <Text style={[styles.h3, styles.mb4]}>Trip Summary</Text>
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
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text style={[styles.subtitle2]}>Mobile No</Text>
          <Text style={[styles.subtitle2]}>Email</Text>
          <Text style={[styles.subtitle2]}>Website</Text>
        </View>

        <View style={{ flex: 2 }}>
          <Text style={[styles.body2]}>{COMPANY.contacts[0]}</Text>
          <Text style={[styles.body2]}>{COMPANY.email}</Text>
          <Text style={styles.body2}>{COMPANY.website}</Text>
        </View>
      </View>
    </View>
  );

  const renderTripDetails = () => (
    <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
      {/* Trip Details */}
      <View style={[styles.col4, styles.borderRight, { minHeight: 80 }]}>
        <Text style={[styles.subtitle2, styles.p8]}>Trip Details:</Text>
        <View
          style={[
            styles.col12,
            { display: 'flex', alignItems: 'flex-start', justifyContent: 'center' },
            styles.p8,
          ]}
        >
          <Text style={styles.body2}>Trip ID: {_id}</Text>
          <Text style={styles.body2}>Status: {titleCase(tripStatus)}</Text>
          <Text style={styles.body2}>Start Date: {fDate(fromDate)}</Text>
          <Text style={styles.body2}>End Date: {toDate ? fDate(toDate) : 'N/A'}</Text>
        </View>
      </View>

      {/* Vehicle Details */}
      <View style={[styles.col4, { minHeight: 80 }, styles.borderRight]}>
        <Text style={[styles.subtitle2, styles.p8]}>Vehicle Details:</Text>
        <View
          style={[
            styles.col12,
            { display: 'flex', alignItems: 'flex-start', justifyContent: 'center' },
            styles.p8,
          ]}
        >
          <Text style={[styles.body2]}>Vehicle: {vehicleId?.vehicleNo}</Text>
          <Text style={[styles.body2]}>
            Ownership: {vehicleId?.isOwn ? COMPANY.name : transporter?.transportName}
          </Text>

          <Text style={[styles.body2]}>Type: {vehicleId?.vehicleType}</Text>
          <Text style={[styles.body2]}>Loading Capacity: {vehicleId?.loadingCapacity}</Text>
          <Text style={[styles.body2]}>No Of Tyres: {vehicleId?.noOfTyres}</Text>
          <Text style={[styles.body2]}>Loading Capacity: {vehicleId?.loadingCapacity}</Text>
        </View>
      </View>

      {/* 
      {
    "_id": "67ec3377b5efeb90a84328c7",
    "driverCellNo": "7039103702",
    "driverLicenceNo": "Mh45 20120001814",
    "driverName": "Abaso Kokare",
    "driverPresentAddress": "Pare",
    "permanentAddress": "Pare",
    "guarantorName": "",
    "guarantorCellNo": "9999999999",
    "experience": 5,
    "isActive": true,
    "dob": "1993-04-01T18:30:00.000Z",
    "licenseTo": "2026-02-13T18:30:00.000Z"
}
      
      
      */}

      {/* Driver Details */}
      <View style={[styles.col4, { minHeight: 80 }]}>
        <Text style={[styles.subtitle2, styles.p8]}>Driver Details:</Text>
        <View
          style={[
            styles.col12,
            { display: 'flex', alignItems: 'flex-start', justifyContent: 'center' },
            styles.p8,
          ]}
        >
          <Text style={[styles.body2]}>Name: {driverId?.driverName}</Text>
          <Text style={[styles.body2]}>Cell No: {driverId?.driverCellNo}</Text>
          <Text style={[styles.body2]}>Licence No: {driverId?.driverLicenceNo}</Text>
          <Text style={[styles.body2]}>Present Address: {driverId?.driverPresentAddress}</Text>
          <Text style={[styles.body2]}>Permanent Address: {driverId?.permanentAddress}</Text>
          <Text style={[styles.body2]}>Experience: {driverId?.experience}</Text>
        </View>
      </View>
    </View>
  );

  const renderSummaryDetails = () => (
    <>
      <View style={[styles.gridContainer]}>
        <Text style={[styles.h4, styles.mb4]}>Trip Summary</Text>
      </View>

      <View style={[styles.gridContainer, styles.border]}>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Total Trips</Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Total Income</Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Total Expenses</Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Total Diesel</Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Total KM</Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell]}>
          <Text style={[styles.horizontalCellTitle]}>Net Profit</Text>
        </View>
      </View>

      <View style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>{subtrips?.length || 0}</Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>
            {fCurrency(
              subtrips?.reduce((sum, subtrip) => sum + subtrip.rate * subtrip.loadingWeight, 0) || 0
            )}
          </Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>
            {fCurrency(
              subtrips?.reduce((sum, subtrip) => {
                const subtripExpenses =
                  subtrip.expenses?.reduce((subSum, expense) => subSum + expense.amount, 0) || 0;
                return sum + subtripExpenses;
              }, 0) || 0
            )}
          </Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>
            {fCurrency(
              subtrips?.reduce((sum, subtrip) => {
                const dieselExpenses =
                  subtrip.expenses
                    ?.filter((expense) => expense.expenseType === 'fuel')
                    .reduce((subSum, expense) => subSum + expense.amount, 0) || 0;
                return sum + dieselExpenses;
              }, 0) || 0
            )}
          </Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellContent]}>
            {subtrips?.reduce((sum, subtrip) => {
              const kmCovered = (subtrip.endKm || 0) - (subtrip.startKm || 0);
              return sum + kmCovered;
            }, 0) || 0}
          </Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell]}>
          <Text style={[styles.horizontalCellContent]}>
            {fCurrency(
              subtrips?.reduce((sum, subtrip) => {
                const subtripIncome = subtrip.rate * subtrip.loadingWeight;
                const subtripExpenses =
                  subtrip.expenses?.reduce((subSum, expense) => subSum + expense.amount, 0) || 0;
                return sum + (subtripIncome - subtripExpenses);
              }, 0) || 0
            )}
          </Text>
        </View>
      </View>
    </>
  );

  const renderSubtripDetails = () => (
    <>
      <View style={[styles.gridContainer]}>
        <Text style={[styles.h4, styles.mb4]}>Subtrip Details</Text>
      </View>

      <View style={[styles.gridContainer, styles.border]}>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Sr. No</Text>
        </View>
        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>LR No</Text>
        </View>

        <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Customer</Text>
        </View>

        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Route</Text>
        </View>

        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Dispatch/closed Date</Text>
        </View>

        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Distance</Text>
        </View>

        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Income</Text>
        </View>

        <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
          <Text style={[styles.horizontalCellTitle]}>Expenses</Text>
        </View>

        <View style={[styles.col1, styles.horizontalCell]}>
          <Text style={[styles.horizontalCellTitle]}>Net Amount</Text>
        </View>
      </View>

      {subtrips?.map((subtrip, idx) => {
        const kmCovered = (subtrip.endKm || 0) - (subtrip.startKm || 0);
        const expenses = subtrip.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
        const income = subtrip.rate * subtrip.loadingWeight;
        const netAmount = income - expenses;

        return (
          <View key={subtrip._id} style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
            <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
              <Text style={[styles.horizontalCellContent]}>{idx + 1}</Text>
            </View>

            <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
              <Text style={[styles.horizontalCellContent]}>{subtrip._id}</Text>
            </View>

            <View style={[styles.col2, styles.horizontalCell, styles.borderRight]}>
              <Text style={[styles.horizontalCellContent]}>
                {subtrip?.customerId?.customerName || 'NA'}
              </Text>
            </View>

            <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
              <Text style={[styles.horizontalCellContent]}>
                {subtrip.loadingPoint} to {subtrip.unloadingPoint}
              </Text>
            </View>

            <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
              <Text style={[styles.horizontalCellContent]}>
                {fDateRangeShortLabel(subtrip.startDate, subtrip.endDate)}
              </Text>
            </View>

            <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
              <Text style={[styles.horizontalCellContent]}>{kmCovered}</Text>
            </View>

            <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
              <Text style={[styles.horizontalCellContent]}>{fCurrency(income)}</Text>
            </View>

            <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
              <Text style={[styles.horizontalCellContent]}>{fCurrency(expenses)}</Text>
            </View>

            <View style={[styles.col1, styles.horizontalCell]}>
              <Text style={[styles.horizontalCellContent]}>{fCurrency(netAmount)}</Text>
            </View>
          </View>
        );
      })}
    </>
  );

  return (
    <Document>
      <Page size="A5" style={styles.page} orientation="landscape">
        {renderDocumentTitle()}
        {renderCompanyHeader()}
        {renderTripDetails()}
        {renderSummaryDetails()}
      </Page>

      <Page size="A5" style={styles.page} orientation="landscape">
        {renderSubtripDetails()}
      </Page>
    </Document>
  );
}
