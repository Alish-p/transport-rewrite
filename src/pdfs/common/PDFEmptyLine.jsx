/* eslint-disable react/prop-types */
import { View, Text } from '@react-pdf/renderer';

import PDFStyles from './styles';

export default function PDFEmptyLine({ styles = PDFStyles }) {
  return (
    <View style={[styles.gridContainer, styles.border, styles.noBorderTop, styles.noBorderBottom]}>
      <View style={[styles.col12]}>
        <Text style={{ textAlign: 'center', padding: 4 }}> </Text>
      </View>
    </View>
  );
}
