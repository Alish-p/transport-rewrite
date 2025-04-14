/* eslint-disable react/prop-types */
import { View, Text } from '@react-pdf/renderer';

import PDFStyles from './styles';

export default function PDFTable({ headers, data, showBorders = true, columnWidths = [] }) {
  const getColumnWidth = (index) => {
    if (columnWidths && columnWidths[index]) {
      return PDFStyles[`col${columnWidths[index]}`];
    }
    return PDFStyles[`col${Math.floor(12 / headers.length)}`];
  };

  const renderHeader = () => (
    <View style={[PDFStyles.gridContainer, PDFStyles.border]}>
      {headers.map((header, index) => (
        <View
          key={index}
          style={[
            PDFStyles.horizontalCell,
            getColumnWidth(index),
            index !== headers.length - 1 && PDFStyles.borderRight,
          ]}
        >
          <Text style={[PDFStyles.horizontalCellTitle]}>{header}</Text>
        </View>
      ))}
    </View>
  );

  const renderRow = (rowData, rowIndex) => (
    <View
      key={rowIndex}
      style={[
        PDFStyles.gridContainer,
        PDFStyles.border,
        PDFStyles.noBorderTop,
        !showBorders && PDFStyles.noBorder,
      ]}
    >
      {rowData.map((cell, cellIndex) => (
        <View
          key={cellIndex}
          style={[
            PDFStyles.horizontalCell,
            getColumnWidth(cellIndex),
            cellIndex !== headers.length - 1 && PDFStyles.borderRight,
          ]}
        >
          <Text style={[PDFStyles.horizontalCellContent]}>{cell}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <>
      {renderHeader()}
      {data.map((row, index) => renderRow(row, index))}
    </>
  );
}
