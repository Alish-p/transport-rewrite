export const pdfStyles = {
  // Column widths
  col1: { width: '8.33%' },
  col2: { width: '16.67%' },
  col3: { width: '25%' },
  col4: { width: '33.33%' },
  col5: { width: '41.67%' },
  col6: { width: '50%' },
  col7: { width: '58.33%' },
  col8: { width: '66.67%' },
  col9: { width: '75%' },
  col10: { width: '83.33%' },
  col11: { width: '91.67%' },
  col12: { width: '100%' },

  // Margin styles
  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  mb40: { marginBottom: 40 },
  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
  mt16: { marginTop: 16 },
  mx4: { marginHorizontal: 4 },
  mx8: { marginHorizontal: 8 },
  my4: { marginVertical: 4 },
  my8: { marginVertical: 8 },

  // Padding styles
  p4: { padding: 4 },
  p8: { padding: 8 },
  p16: { padding: 16 },
  p40: { padding: 40 },
  px4: { paddingHorizontal: 4 },
  px8: { paddingHorizontal: 8 },
  py4: { paddingVertical: 4 },
  py8: { paddingVertical: 8 },

  // Text alignment
  textCenter: { textAlign: 'center' },
  textRight: { textAlign: 'right' },
  textLeft: { textAlign: 'left' },

  // Fonts
  h1: { fontSize: 20, fontWeight: 700 },
  h2: { fontSize: 18, fontWeight: 700 },
  h3: { fontSize: 16, fontWeight: 700 },
  h4: { fontSize: 13, fontWeight: 700 },
  body1: { fontSize: 10 },
  body2: { fontSize: 9 },
  subtitle1: { fontSize: 10, fontWeight: 700 },
  subtitle2: { fontSize: 9, fontWeight: 700 },

  // Miscellaneous styles
  bold: { fontWeight: 700 },
  italic: { fontStyle: 'italic' },
  underline: { textDecoration: 'underline' },

  // Page styles
  page: {
    fontSize: 9,
    lineHeight: 1.6,
    fontFamily: 'Roboto',
    backgroundColor: '#FFFFFF',
    padding: '20px 24px 80px 24px',
  },
  footer: {
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    margin: 'auto',
    borderTopWidth: 1,
    borderStyle: 'solid',
    position: 'absolute',
    borderColor: '#DFE3E8',
  },

  // Grid system
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 1,
    margin: 4,
  },

  // Table styles
  table: {
    display: 'flex',
    width: 'auto',
  },
  tableRow: {
    padding: '8px 0',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8',
  },

  tableCell_1: {
    width: '5%',
  },
  tableCell_2: {
    width: '50%',
    paddingRight: 16,
  },
  tableCell_3: {
    width: '15%',
  },

  // General border
  border: {
    borderWidth: 1,
    borderColor: 'black',
  },

  // Border sides
  borderTop: {
    borderTopWidth: 1,
    borderColor: 'black',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderColor: 'black',
  },
  borderRight: {
    borderRightWidth: 1,
    borderColor: 'black',
  },

  // No border sides
  noBorder: {
    borderWidth: 0,
  },
  noBorderTop: {
    borderTopWidth: 0,
  },
  noBorderBottom: {
    borderBottomWidth: 0,
  },
  noBorderLeft: {
    borderLeftWidth: 0,
  },
  noBorderRight: {
    borderRightWidth: 0,
  },

  // Combined borders (for merging)
  borderHorizontal: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  borderVertical: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'black',
  },

  // Exclude specific combinations
  borderNoTopBottom: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'black',
  },
  borderNoLeftRight: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'black',
  },

  // Horizontal cell styles
  horizontalCell: {
    padding: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalCellTitle: {
    fontSize: 9,
    fontWeight: 700,
    marginRight: 6,
  },
  horizontalCellContent: {
    fontSize: 9,
  },

  // Vertical cell styles
  verticalCell: {
    padding: 4,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  verticalCellTitle: {
    fontSize: 9,
    fontWeight: 700,
    marginBottom: 4,
  },
  verticalCellContent: {
    fontSize: 9,
  },

  // Flex utilities
  flexRow: { flexDirection: 'row' },
  flexColumn: { flexDirection: 'column' },
  justifyCenter: { justifyContent: 'center' },
  justifyEnd: { justifyContent: 'flex-end' },
  justifyStart: { justifyContent: 'flex-start' },
  alignCenter: { alignItems: 'center' },
  alignEnd: { alignItems: 'flex-end' },
  alignStart: { alignItems: 'flex-start' },

  // Colors
  bgLight: { backgroundColor: '#f8f9fa' },
  bgDark: { backgroundColor: '#343a40' },
  textPrimary: { color: '#007bff' },
  textSecondary: { color: '#6c757d' },
  textDanger: { color: '#dc3545' },
};
