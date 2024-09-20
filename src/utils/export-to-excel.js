import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (data, fileName) => {
  // Convert JSON data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  // Write the workbook
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  // Create a Blob from the buffer
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  // Save the file using file-saver
  saveAs(blob, `${fileName}.xlsx`);
};
