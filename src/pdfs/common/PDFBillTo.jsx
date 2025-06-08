/* eslint-disable react/prop-types */
import { View, Text } from '@react-pdf/renderer';

import PDFStyles from './styles';

export default function PDFBillToSection({
  title = 'Bill To',
  billToDetails = [],
  metaDetails = [],
  styles = PDFStyles,
}) {
  return (
    <View style={[styles.border, styles.p8, styles.mb8]}>
      {/* Grid Container */}
      <View style={[styles.gridContainer, styles.alignStart]}>
        {/* Bill To Section - 70% width */}
        <View style={[styles.col8, styles.pr8]}>
          <Text style={[styles.subtitle1, styles.mb4]}>{title}</Text>

          {billToDetails.map(
            (value, index) =>
              value && (
                <Text key={index} style={[styles.body2, styles.mb2]}>
                  {value}
                </Text>
              )
          )}
        </View>

        {/* Meta Info Section - 30% width */}
        <View style={[styles.col4, styles.borderLeft, styles.contactSection]}>
          <View style={[styles.flexColumn]}>
            {metaDetails.map(
              ([label, value], index) =>
                value && (
                  <View key={index} style={[styles.flexRow, styles.mb4]}>
                    <Text style={[styles.contactLabel, styles.col5]}>{label}</Text>
                    <Text style={[styles.contactValue, styles.col7]}>{value}</Text>
                  </View>
                )
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
