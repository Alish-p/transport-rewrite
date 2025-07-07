/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (data, fileName) => {
  console.log({ data });

  const worksheet = XLSX.utils.json_to_sheet(data);

  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 12 },
    fill: { fgColor: { rgb: '305496' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } },
    },
  };

  const bodyStyle = (isOddRow) => ({
    fill: { fgColor: { rgb: isOddRow ? 'F9F9F9' : 'FFFFFF' } },
    alignment: { horizontal: 'left', vertical: 'top', wrapText: true },
    border: {
      top: { style: 'thin', color: { rgb: 'DDDDDD' } },
      bottom: { style: 'thin', color: { rgb: 'DDDDDD' } },
      left: { style: 'thin', color: { rgb: 'DDDDDD' } },
      right: { style: 'thin', color: { rgb: 'DDDDDD' } },
    },
  });

  const range = XLSX.utils.decode_range(worksheet['!ref']);
  const columns = range.e.c + 1;

  for (let col = 0; col < columns; col++) {
    const headerCell = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[headerCell]) continue;
    worksheet[headerCell].s = headerStyle;
  }

  for (let row = 1; row <= range.e.r; row++) {
    for (let col = 0; col < columns; col++) {
      const cell = XLSX.utils.encode_cell({ r: row, c: col });
      if (!worksheet[cell]) continue;
      worksheet[cell].s = bodyStyle(row % 2);
    }
  }

  // Auto-size columns
  const columnWidths = [];
  for (let col = 0; col < columns; col++) {
    let maxLength = 0;
    for (let row = 0; row <= range.e.r; row++) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
      if (cell && cell.v) {
        const { length } = cell.v.toString();
        maxLength = Math.max(maxLength, length);
      }
    }
    columnWidths[col] = { wch: maxLength + 4 }; // more padding
  }
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Subtrip Report');

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
    cellStyles: true,
  });

  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, `${fileName}.xlsx`);
};

// Formats a list of items for export, including only the user - selected columns.
export function prepareDataForExport(data, columnConfig, visibleColumns = []) {
  const columns = columnConfig.filter((col) => visibleColumns.includes(col.id));
  const totals = {};

  const formattedRows = data.map((item) => {
    const row = {};
    columns.forEach((col) => {
      row[col.label] = col.getter(item);

      if (col.showTotal) {
        const val = item[col.id];
        const num = typeof val === 'number' ? val : parseFloat(val) || 0;
        totals[col.id] = (totals[col.id] || 0) + num;
      }
    });
    return row;
  });

  if (Object.keys(totals).length > 0) {
    const totalRow = {};
    columns.forEach((col, index) => {
      if (index === 0) {
        totalRow[col.label] = 'TOTAL';
      } else if (col.showTotal) {
        const dummy = { [col.id]: totals[col.id] };
        totalRow[col.label] = col.getter(dummy);
      } else {
        totalRow[col.label] = '';
      }
    });

    formattedRows.push(totalRow);
  }

  return formattedRows;
}
