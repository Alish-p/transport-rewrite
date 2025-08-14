import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const C = {
  headerBg: 'FFF2F3F5',
  headerFont: 'FF333333',
  grid: 'FFE6E7EA',
  zebra: 'FFF9FAFB',
  white: 'FFFFFFFF',
};

const isNumericLike = (val) =>
  typeof val === 'number' || (typeof val === 'string' && val.trim() !== '' && !Number.isNaN(Number(val)));

const shouldWrap = (val) => {
  if (val == null) return false;
  const s = String(val);
  return s.includes('\n') || s.length > 40;
};

function addSheet(workbook, sheetName, data) {
  const ws = workbook.addWorksheet(sheetName, {
    properties: { defaultRowHeight: 18 },
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  ws.properties.defaultRowHeight = 18;
  ws.eachRow((row) => {
    row.font = { name: 'Calibri', size: 11 };
  });

  if (!Array.isArray(data) || data.length === 0) {
    return;
  }

  const headers = Object.keys(data[0]);
  const computeWidth = (v) => {
    if (v == null) return 0;
    return String(v).length;
  };
  const colWidths = headers.map((h, idx) => {
    let maxLen = computeWidth(h);
    for (let r = 0; r < data.length; r += 1) {
      const len = computeWidth(data[r][headers[idx]]);
      if (len > maxLen) maxLen = len;
    }
    return Math.min(Math.max(maxLen + 4, 10), 50);
  });

  ws.columns = headers.map((header, i) => ({
    header,
    key: header,
    width: colWidths[i],
    style: { font: { name: 'Calibri', size: 11 } },
  }));

  ws.addRows(data);

  const headerRow = ws.getRow(1);
  headerRow.height = 18;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: C.headerFont } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.headerBg } };
    cell.border = {
      bottom: { style: 'thin', color: { argb: C.grid } },
    };
  });

  for (let r = 2; r <= ws.rowCount; r += 1) {
    const zebra = r % 2 === 0 ? C.white : C.zebra;
    const row = ws.getRow(r);
    row.height = 18;
    row.eachCell((cell) => {
      const raw = cell.value;
      const align = isNumericLike(raw) ? 'right' : 'left';
      cell.alignment = {
        vertical: 'middle',
        horizontal: align,
        wrapText: shouldWrap(raw),
      };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: zebra } };
      cell.border = {
        top: { style: 'thin', color: { argb: C.grid } },
        left: { style: 'thin', color: { argb: C.grid } },
        bottom: { style: 'thin', color: { argb: C.grid } },
        right: { style: 'thin', color: { argb: C.grid } },
      };
      if (typeof raw === 'number') {
        cell.numFmt = '#,##0.00';
      }
    });
  }
}

export const exportBillingSummaryToExcel = async (summary, fileName = 'customer-billing-summary') => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Tranzit';
  workbook.created = new Date();

  addSheet(workbook, 'Pending Invoices', summary?.pendingInvoices || []);
  addSheet(workbook, 'Received Invoices', summary?.receivedInvoices || []);
  addSheet(workbook, 'Unbilled Subtrips', summary?.unbilledSubtrips || []);

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}.xlsx`);
};

export default exportBillingSummaryToExcel;
