/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (data, fileName) => {
  console.log({ data });

  // Convert JSON data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Add styling to headers
  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '4472C4' } },
    alignment: { horizontal: 'center' },
  };

  // Get the range of the worksheet
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  const columns = range.e.c + 1;

  // Apply header styling to the first row
  for (let col = 0; col < columns; col++) {
    const headerCell = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[headerCell]) continue;

    worksheet[headerCell].s = headerStyle;
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
    columnWidths[col] = { wch: maxLength + 2 }; // Add padding
  }
  worksheet['!cols'] = columnWidths;

  // Add zebra striping to rows
  for (let row = 1; row <= range.e.r; row++) {
    const rowStyle = {
      fill: { fgColor: { rgb: row % 2 ? 'F2F2F2' : 'FFFFFF' } },
      alignment: { horizontal: 'left' },
    };

    for (let col = 0; col < columns; col++) {
      const cell = XLSX.utils.encode_cell({ r: row, c: col });
      if (!worksheet[cell]) continue;
      worksheet[cell].s = rowStyle;
    }
  }

  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  // Write the workbook with styling
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
    cellStyles: true,
  });
  // Create a Blob from the buffer
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  // Save the file using file-saver
  saveAs(blob, `${fileName}.xlsx`);
};
