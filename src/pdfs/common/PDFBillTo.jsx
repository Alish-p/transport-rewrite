/* eslint-disable react/prop-types */
import { View, Text } from '@react-pdf/renderer';

import PDFStyles from './styles';

export default function PDFBillToSection({ billTo, metaDetails = [] }) {
  return (
    <View style={[PDFStyles.border, PDFStyles.p16, PDFStyles.mb16]}>
      {/* Grid Container */}
      <View style={[PDFStyles.gridContainer, PDFStyles.alignStart]}>
        {/* Bill To Section - 70% width */}
        <View style={[PDFStyles.col8, PDFStyles.pr8]}>
          <Text style={[PDFStyles.subtitle1, PDFStyles.mb4]}>Consignor / Bill To</Text>
          <Text style={[PDFStyles.body1, PDFStyles.mb2]}>{billTo?.name}</Text>
          <Text style={[PDFStyles.body1, PDFStyles.mb2]}>{billTo?.address}</Text>
          <Text style={[PDFStyles.body1, PDFStyles.mb2]}>
            {billTo?.pinCode}, {billTo?.state}
          </Text>
          {billTo?.gstin && (
            <Text style={[PDFStyles.body1, PDFStyles.mb2]}>GSTIN: {billTo.gstin}</Text>
          )}
          {billTo?.sacCode && (
            <Text style={[PDFStyles.body1, PDFStyles.mb2]}>SAC / HSN Code: {billTo.sacCode}</Text>
          )}
        </View>

        {/* Meta Info Section - 30% width */}
        <View style={[PDFStyles.col4, PDFStyles.borderLeft, PDFStyles.contactSection]}>
          <View style={[PDFStyles.flexColumn, PDFStyles.p8]}>
            {metaDetails.map(
              ([label, value], index) =>
                value && (
                  <View key={index} style={[PDFStyles.flexRow, PDFStyles.mb4]}>
                    <Text style={[PDFStyles.contactLabel, PDFStyles.col5]}>{label}</Text>
                    <Text style={[PDFStyles.contactValue, PDFStyles.col7]}>{value}</Text>
                  </View>
                )
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
