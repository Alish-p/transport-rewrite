/* eslint-disable react/prop-types */
import { View, Text } from '@react-pdf/renderer';

import PDFStyles from './styles';

export default function PDFInvoiceFooter({
  declaration,
  signatory = 'For Shree Enterprises',
  styles = PDFStyles,
}) {
  return (
    <View style={[styles.border, styles.p16, styles.mt16]}>
      <View style={[styles.gridContainer]}>
        {/* Declaration - 70% Width */}
        <View style={[styles.col8]}>
          <Text style={[styles.body1]}>{declaration}</Text>
        </View>

        {/* Signature Block - 30% Width */}
        <View style={[styles.col4, styles.alignEnd]}>
          <Text style={[styles.body1, styles.mb8]}>{signatory}</Text>

          {/* Empty space for stamp or sign */}
          <View style={{ height: 40 }} />

          <Text style={[styles.subtitle2]}>Authorised Signatory</Text>
        </View>
      </View>
    </View>
  );
}
