/* eslint-disable react/prop-types */
import { View, Text } from '@react-pdf/renderer';

import PDFStyles from './styles';

export default function PDFDeclaration({ title = 'Declaration:', content, styles = PDFStyles }) {
  return (
    <View style={[styles.border, styles.p16, styles.mb16, styles.flexColumn]}>
      <Text style={[styles.subtitle1, styles.mb8]}>{title}</Text>

      {Array.isArray(content) ? (
        content.map((line, index) => (
          <Text key={index} style={[styles.body2, styles.mb4]}>
            {line}
          </Text>
        ))
      ) : (
        <Text style={[styles.body2]}>{content}</Text>
      )}
    </View>
  );
}
