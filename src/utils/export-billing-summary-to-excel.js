import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { fDateTime } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';

const C = {
  headerBg: 'FFF2F3F5',
  headerFont: 'FF333333',
  grid: 'FFE6E7EA',
  zebra: 'FFF9FAFB',
  white: 'FFFFFFFF',
  highlight: 'FFFFF3CD',
};

const isNumericLike = (val) =>
  typeof val === 'number' || (typeof val === 'string' && val.trim() !== '' && !Number.isNaN(Number(val)));

const shouldWrap = (val) => {
  if (val == null) return false;
  const s = String(val);
  return s.includes('\n') || s.length > 40;
};

function addSheet(workbook, sheetName, data, options = {}) {
  const { highlightColumns = [] } = options;
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
    row.eachCell((cell, colNumber) => {
      const raw = cell.value;
      const align = isNumericLike(raw) ? 'right' : 'left';
      const header = headers[colNumber - 1];
      const isHighlight = highlightColumns.includes(header);
      cell.alignment = {
        vertical: 'middle',
        horizontal: align,
        wrapText: shouldWrap(raw),
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isHighlight ? C.highlight : zebra },
      };
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

  const formatPayments = (payments) =>
    (payments || [])
      .map(
        (p) =>
          `${fNumber(p.amount)} received on ${fDateTime(p.paidAt)}${p.referenceNumber ? ` against ${p.referenceNumber}` : ''
          }`,
      )
      .join('\n');

  const mapInvoices = (invoices) =>
    (invoices || []).map((inv, idx) => ({
      'S.No': idx + 1,
      'Invoice No': inv.invoiceNo,
      'Customer Name': inv.customerName,
      Status: inv.invoiceStatus,
      'Issue Date': fDateTime(inv.issueDate),
      'Due Date': fDateTime(inv.dueDate),
      'Net Total': inv.netTotal,
      'Total Received': inv.totalReceived,
      'Pending Amount': (inv.netTotal || 0) - (inv.totalReceived || 0),
      Payments: formatPayments(inv.payments),
    }));

  const mapSubtrips = (subtrips) =>
    (subtrips || []).map((st, idx) => ({
      'S.No': idx + 1,
      'Subtrip No': st._id,
      'Customer Name': st.customerName,
      'Start Date': fDateTime(st.startDate),
      'Received Date': fDateTime(st.receivedDate),
      'Loading Point': st.loadingPoint,
      'Loading Weight': st.loadingWeight,
      Rate: st.rate,
      'Unloading Point': st.unloadingPoint,
      'Unloading Date': fDateTime(st.unloadingDate),
      'Vehicle No': st.vehicleNo,
      Driver: st.driver,
      'Subtrip Type': st.subtripType,
    }));

  const pendingInvoices = mapInvoices(summary?.pendingInvoices);
  const receivedInvoices = mapInvoices(summary?.receivedInvoices);
  const unbilledSubtrips = mapSubtrips(summary?.unbilledSubtrips);

  addSheet(workbook, 'Pending Invoices', pendingInvoices, { highlightColumns: ['Pending Amount'] });
  addSheet(workbook, 'Received Invoices', receivedInvoices);
  addSheet(workbook, 'Unbilled Subtrips', unbilledSubtrips);

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}.xlsx`);
};

export default exportBillingSummaryToExcel;
