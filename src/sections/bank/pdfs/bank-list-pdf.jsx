/* eslint-disable react/prop-types */
import { useMemo } from 'react';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

import { pdfStyles } from '../../subtrip/pdfs/pdf-styles';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () => useMemo(() => StyleSheet.create(pdfStyles), []);

const COMPANY = CONFIG.company;

export default function BankListPdf({ banks }) {
  const styles = useStyles();

  const renderDocumentTitle = () => (
    <View style={[styles.gridContainer]}>
      <Text style={[styles.h3, styles.mb4]}>Bank List Report</Text>
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
          This report contains a list of all banks in the system as of {fDate(new Date())}.
        </Text>
      </View>
    </View>
  );

  const renderEmptyLine = () => (
    <View style={[styles.gridContainer, styles.border, styles.noBorderTop, styles.noBorderBottom]}>
      <View style={[styles.col12]}>
        <Text style={{ textAlign: 'center', padding: 4 }}> </Text>
      </View>
    </View>
  );

  const renderBankTableHeader = () => (
    <View style={[styles.gridContainer, styles.border]}>
      <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
        <Text style={[styles.horizontalCellTitle]}>S.No</Text>
      </View>
      <View style={[styles.col3, styles.horizontalCell, styles.borderRight]}>
        <Text style={[styles.horizontalCellTitle]}>Bank Name</Text>
      </View>
      <View style={[styles.col3, styles.horizontalCell, styles.borderRight]}>
        <Text style={[styles.horizontalCellTitle]}>Branch</Text>
      </View>
      <View style={[styles.col3, styles.horizontalCell, styles.borderRight]}>
        <Text style={[styles.horizontalCellTitle]}>Place</Text>
      </View>
      <View style={[styles.col2, styles.horizontalCell]}>
        <Text style={[styles.horizontalCellTitle]}>IFSC</Text>
      </View>
    </View>
  );

  const renderBankTableRows = () => (
    <>
      {banks.map((bank, index) => (
        <View key={bank._id} style={[styles.gridContainer, styles.border, styles.noBorderTop]}>
          <View style={[styles.col1, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{index + 1}</Text>
          </View>
          <View style={[styles.col3, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{bank.name}</Text>
          </View>
          <View style={[styles.col3, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{bank.branch}</Text>
          </View>
          <View style={[styles.col3, styles.horizontalCell, styles.borderRight]}>
            <Text style={[styles.horizontalCellContent]}>{bank.place}</Text>
          </View>
          <View style={[styles.col2, styles.horizontalCell]}>
            <Text style={[styles.horizontalCellContent]}>{bank.ifsc}</Text>
          </View>
        </View>
      ))}
    </>
  );

  const renderFooter = () => (
    <View style={[styles.footer]}>
      <Text style={[styles.body2, styles.textCenter]}>
        Generated on {fDate(new Date())} | Total Banks: {banks.length}
      </Text>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="portrait">
        {/* Headers */}
        {renderDocumentTitle()}
        {renderCompanyHeader()}
        {renderDeclaration()}
        {renderEmptyLine()}

        {/* Bank Table */}
        {renderBankTableHeader()}
        {renderBankTableRows()}

        {/* Footer */}
        {renderFooter()}
      </Page>
    </Document>
  );
}
