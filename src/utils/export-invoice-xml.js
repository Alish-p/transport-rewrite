// Utility to build and download an XML for a single invoice

function pad2(n) {
  return String(n).padStart(2, '0');
}

function escapeXml(unsafe = '') {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatIssueDateSlash(date) {
  try {
    const d = new Date(date);
    const dd = pad2(d.getDate());
    const mm = pad2(d.getMonth() + 1);
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch (e) {
    return '';
  }
}

function formatRefDateShort(date) {
  try {
    const d = new Date(date);
    const dd = pad2(d.getDate());
    const yy = String(d.getFullYear()).slice(-2);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mon = months[d.getMonth()];
    return `${dd}-${mon}-${yy}`;
  } catch (e) {
    return '';
  }
}

function buildSheet(invoice) {
  if (!invoice) return '';
  const issueDate = invoice.issueDate || new Date();
  const invoiceNo = invoice.invoiceNo || '';
  const customer = invoice.customerId || {};

  const taxBreakup = invoice.taxBreakup || {};
  const cgst = taxBreakup.cgst || { rate: 0, amount: 0 };
  const sgst = taxBreakup.sgst || { rate: 0, amount: 0 };
  const igst = taxBreakup.igst || { rate: 0, amount: 0 };

  const taxableAmount = Number(invoice.totalAmountBeforeTax || 0);
  const netTotal = Number(invoice.netTotal || 0);

  const totalTaxRate = Number(cgst.rate || 0) + Number(sgst.rate || 0) + Number(igst.rate || 0);

  const lines = [];
  lines.push('  <Sheet1>');
  lines.push(`    <DATE>${escapeXml(formatIssueDateSlash(issueDate))}</DATE>`);
  lines.push('    <VOUCHERTYPE>Sales</VOUCHERTYPE>');
  lines.push('    <NARRATION>Customer Payment</NARRATION>');
  lines.push(`    <VOUCHERNO>${escapeXml(invoiceNo)}</VOUCHERNO>`);
  lines.push(`    <REFERENCE>${escapeXml(invoice.reference || invoiceNo || '')}</REFERENCE>`);
  lines.push(`    <REFERENCEDATE>${escapeXml(formatRefDateShort(issueDate))}</REFERENCEDATE>`);

  // Ledger 1: Customer total as negative of net total
  lines.push(`    <LEDGERNAMEDRCR-1>${escapeXml(customer.customerName || '')}</LEDGERNAMEDRCR-1>`);
  lines.push(`    <LEDGERAMOUNTDRCR-1>-${Math.abs(netTotal).toFixed(2)}</LEDGERAMOUNTDRCR-1>`);

  // Ledger 2: IGST
  lines.push(`    <LEDGERNAMEDRCR-2>IGST OUT PUT@ ${Number(igst.rate || 0)}%</LEDGERNAMEDRCR-2>`);
  const igstAmt = Number(igst.amount || 0);
  lines.push(
    `    <LEDGERAMOUNTDRCR-2>${igstAmt > 0 ? igstAmt.toFixed(2) : ' -   '}</LEDGERAMOUNTDRCR-2>`
  );

  // Ledger 3: SGST
  lines.push(`    <LEDGERNAMEDRCR-3>SGST @${Number(sgst.rate || 0)}% OUT PUT</LEDGERNAMEDRCR-3>`);
  const sgstAmt = Number(sgst.amount || 0);
  lines.push(`    <LEDGERAMOUNTDRCR-3>${sgstAmt > 0 ? sgstAmt.toFixed(2) : ''}</LEDGERAMOUNTDRCR-3>`);

  // Ledger 4: CGST
  lines.push(`    <LEDGERNAMEDRCR-4>CGST @  ${Number(cgst.rate || 0)}% OUT PUT</LEDGERNAMEDRCR-4>`);
  const cgstAmt = Number(cgst.amount || 0);
  lines.push(`    <LEDGERAMOUNTDRCR-4>${cgstAmt > 0 ? cgstAmt.toFixed(2) : ''}</LEDGERAMOUNTDRCR-4>`);

  // Ledger 5: Transportation taxable amount line
  const shortName = (customer.customerName || '').split(' ').slice(0, 1).join(' ');
  lines.push(
    `    <LEDGERNAMEDRCR-5>Transporation Amount Received ${escapeXml(shortName)} (${totalTaxRate} %GST)</LEDGERNAMEDRCR-5>`
  );
  lines.push(`    <LEDGERAMOUNTDRCR-5>${taxableAmount.toFixed(2)}</LEDGERAMOUNTDRCR-5>`);

  // Ledger 6: placeholders
  lines.push('    <LEDGERNAMEDRCR-6 />');
  lines.push('    <LEDGERAMOUNTDRCR-6 />');
  lines.push('    <LEDGERNAMEDRCR-6 />');
  lines.push('    <LEDGERAMOUNTDRCR-6 />');

  // Party details
  lines.push('    <PARTYDETAILSGSTTYPE>Regular</PARTYDETAILSGSTTYPE>');
  lines.push(`    <PARTYDETAILSGSTNUMBER>${escapeXml(customer.GSTNo || '')}</PARTYDETAILSGSTNUMBER>`);
  lines.push(`    <PARTYDETAILSSTATE>${escapeXml(customer.state || '')}</PARTYDETAILSSTATE>`);
  lines.push('    <PARTYDETAILSCOUNTRY>INDIA</PARTYDETAILSCOUNTRY>');
  lines.push(`    <PARTYDETAILSADDRESS-1>${escapeXml(customer.address || '')}</PARTYDETAILSADDRESS-1>`);
  lines.push(`    <PARTYDETAILSPIN>${escapeXml(customer.pinCode || '')}</PARTYDETAILSPIN>`);

  lines.push('  </Sheet1>');
  return lines.join('\n');
}

export function buildInvoicesXml(invoices = []) {
  const lines = [];
  lines.push('<?xml version="1.0" encoding="utf-8"?>');
  lines.push('<root>');
  invoices.forEach((inv) => {
    lines.push(buildSheet(inv));
  });
  lines.push('</root>');
  return lines.join('\n');
}

export function buildInvoiceXml(invoice) {
  return buildInvoicesXml([invoice]);
}

export function downloadInvoiceXml(invoice) {
  const xml = buildInvoiceXml(invoice);
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${invoice?.invoiceNo || 'invoice'}.xml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadInvoicesXml(invoices = [], fileName = 'invoices.xml') {
  const xml = buildInvoicesXml(invoices);
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default {
  buildInvoiceXml,
  buildInvoicesXml,
  downloadInvoiceXml,
  downloadInvoicesXml,
};
