/* eslint-disable react/prop-types */
import { View, Text } from '@react-pdf/renderer';

import PDFStyles from './styles';

// PDFTable renders tabular data inside PDF documents. The `styles` prop allows
// consumers to provide a custom StyleSheet created with `@react-pdf/renderer`.
// When not supplied the default style sheet from `./styles` is used.

export default function PDFTable({
  headers,
  data,
  columnWidths = [],
  showBorders = true,
  hideHeader = false,
  tableFooter,
  styles = PDFStyles,
  cellStyles,
  columnAlignments = [],
}) {
  const getColumnWidth = (index) => {
    if (columnWidths && columnWidths[index]) {
      return styles[`col${columnWidths[index]}`] || {};
    }
    return styles[`col${Math.floor(12 / headers.length)}`];
  };

  const getCellStyle = (rowIdx, colIdx) => {
    if (typeof cellStyles === 'function') {
      return cellStyles(rowIdx, colIdx);
    }
    if (Array.isArray(cellStyles) && cellStyles[rowIdx]) {
      return cellStyles[rowIdx][colIdx];
    }
    return undefined;
  };

  const getAlignStyle = (colIdx) => {
    const align = columnAlignments[colIdx];
    if (align === 'center') return styles.justifyCenter;
    if (align === 'right') return styles.justifyEnd;
    if (align === 'left') return styles.justifyStart;
    return undefined;
  };

  const renderHeader = () => (
    <View style={[styles.gridContainer, styles.border, styles.bgLight]}>
      {headers.map((header, index) => (
        <View
          key={index}
          style={[
            styles.horizontalCell,
            getColumnWidth(index),
            index !== headers.length - 1 && styles.borderRight,
            getAlignStyle(index),
          ]}
        >
          <Text style={[styles.horizontalCellTitle]}>{header}</Text>
        </View>
      ))}
    </View>
  );

  const renderRow = (rowData, rowIndex) => (
    <View
      key={rowIndex}
      style={[
        styles.gridContainer,
        styles.border,
        styles.noBorderTop,
        !showBorders && styles.noBorder,
      ]}
    >
      {rowData.map((cell, cellIndex) => (
        <View
          key={cellIndex}
          style={[
            styles.horizontalCell,
            getColumnWidth(cellIndex),
            cellIndex !== headers.length - 1 && styles.borderRight,
            getAlignStyle(cellIndex),
          ]}
        >
          <Text
            style={[styles.horizontalCellContent, getCellStyle(rowIndex, cellIndex)]}
          >
            {cell}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderFooter = () =>
    tableFooter ? (
      <View style={[styles.gridContainer, styles.border, styles.noBorderTop, styles.bgDark]}>
        {tableFooter.map((footerCell, index) => (
          <View
            key={index}
            style={[
              styles.horizontalCell,
              getColumnWidth(index),
              index !== headers.length - 1 && styles.borderRight,
              getAlignStyle(index),
            ]}
          >
            <Text style={[styles.horizontalCellTitle, styles.textWhite]}>
              {footerCell}
            </Text>
          </View>
        ))}
      </View>
    ) : null;

  return (
    <>
      {!hideHeader && renderHeader()}
      {data.map((row, index) => renderRow(row, index))}
      {renderFooter()}
    </>
  );
}
