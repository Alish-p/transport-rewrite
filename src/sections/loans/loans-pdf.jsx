/* eslint-disable react/prop-types */
import { useMemo } from 'react';
import { Page, View, Text, Font, Document, StyleSheet } from '@react-pdf/renderer';

import { CONFIG } from 'src/config-global';

import { pdfStyles } from '../subtrip/pdfs/pdf-styles';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () => useMemo(() => StyleSheet.create(pdfStyles), []);

const COMPANY = CONFIG.company;

export default function DriverSalaryPdf({ loan }) {
  const { _id } = loan || {};

  const styles = useStyles();

  const renderDocumentTitle = () => (
    <View style={[styles.gridContainer]}>
      <Text style={[styles.h3, styles.mb4]}>{`Loan's - ${_id}`}</Text>
    </View>
  );

  return (
    <Document>
      <Page size="A5" style={styles.page} orientation="landscape">
        {/* Headers */}
        {renderDocumentTitle()}
        {/* {renderCompanyHeader()}
        {renderDriverRow()}
        {renderDeclaration()}
        {renderIncomeDetails()} */}
      </Page>

      <Page size="A5" style={styles.page} orientation="landscape">
        {/* Headers */}

        {/* {renderTripwiseDetails()} */}
      </Page>
    </Document>
  );
}
