/* eslint-disable react/prop-types */
import { View, Text } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';

import PDFStyles from './styles';

export default function PDFFooter({ additionalInfo }) {
  return (
    <View style={[PDFStyles.footer]}>
      <Text style={[PDFStyles.body2, PDFStyles.textCenter]}>
        Generated on {fDate(new Date())}
        {additionalInfo && ` | ${additionalInfo}`}
      </Text>
    </View>
  );
}
