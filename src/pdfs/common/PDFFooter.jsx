/* eslint-disable react/prop-types */
import { View, Text, Link } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';

import PDFStyles from './styles';

export default function PDFFooter({ additionalInfo = [], styles = PDFStyles }) {
  const infoLines = Array.isArray(additionalInfo) ? additionalInfo : [additionalInfo];

  return (
    <View style={[styles.footer, styles.borderTop, styles.p8]}>
      {/* Date + Additional Info Lines */}
      <View style={[styles.flexColumn, styles.alignCenter, styles.mb4]}>
        <Text style={[styles.body2, styles.mb2]}>Generated on {fDate(new Date())}</Text>

        {infoLines.map((line, index) => (
          <Text key={index} style={[styles.body2]}>
            {line}
          </Text>
        ))}
      </View>

      {/* Branding Line */}
      <Text style={[styles.caption, styles.textCenter]}>
        Powered by{' '}
        <Link
          src="https://transport-rewrite.onrender.com/"
          style={[styles.caption, styles.textPrimary, styles.underline]}
        >
          Transport++
        </Link>
      </Text>
    </View>
  );
}
