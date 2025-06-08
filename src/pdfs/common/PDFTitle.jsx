/* eslint-disable react/prop-types */
import { View, Text } from '@react-pdf/renderer';

import PDFStyles from './styles';

export default function PDFTitle({ title, styles = PDFStyles }) {
  return (
    <View style={[styles.gridContainer]}>
      <Text style={[styles.h2, styles.mb4]}>{title}</Text>
    </View>
  );
}
