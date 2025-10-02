
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

function formatDateYYYYMMDD(date) {
  try {
    const d = new Date(date);
    const dd = pad2(d.getDate());
    const mm = pad2(d.getMonth() + 1);
    const yyyy = d.getFullYear();
    return `${yyyy}${mm}${dd}`;
  } catch (e) {
    return '';
  }
}

function toFixed2(n) {
  const v = Number(n || 0);
  return v.toFixed(2);
}

// (Removed) Legacy generator for a custom <root><Sheet1> format.

// Build Tally ENVELOPE XML for a list of invoices
export function buildInvoicesXml(invoices = []) {
  const parts = [];
  parts.push('<?xml version="1.0" encoding="utf-8"?>');
  parts.push('<ENVELOPE>');
  parts.push('  <HEADER>');
  parts.push('    <TALLYREQUEST>Import</TALLYREQUEST>'); // fixed
  parts.push('    <TYPE>Data</TYPE>'); // fixed
  parts.push('    <ID>Vouchers</ID>'); // fixed
  parts.push('  </HEADER>');
  parts.push('  <BODY>');
  parts.push('    <DESC>');
  parts.push('      <STATICVARIABLES>');
  parts.push('      </STATICVARIABLES>');
  parts.push('    </DESC>');
  parts.push('    <DATA>');

  invoices.forEach((invoice) => {
    if (!invoice) return;

    const issueDate = invoice.issueDate || new Date();
    const invoiceNo = invoice.invoiceNo || '';
    const customer = invoice.customerId || {};

    const taxBreakup = invoice.taxBreakup || {};
    const cgst = taxBreakup.cgst || { rate: 0, amount: 0 };
    const sgst = taxBreakup.sgst || { rate: 0, amount: 0 };
    const igst = taxBreakup.igst || { rate: 0, amount: 0 };

    const taxableAmount = Number(invoice.totalAmountBeforeTax || 0);
    const netTotal = Number(invoice.netTotal || 0);

    const isIGST = Number(igst.amount || 0) > 0;

    parts.push('      <TALLYMESSAGE xmlns:UDF="TallyUDF">');
    parts.push(
      '        <VOUCHER VCHTYPE="Sales" ACTION="Create" OBJVIEW="Accounting Voucher View" ISINVOICE="No">'
    );
    const yyyymmdd = escapeXml(formatDateYYYYMMDD(issueDate));
    const customerName = escapeXml(customer.customerName || '');
    const narration = escapeXml(invoice.narration || '');
    parts.push(`          <DATE>${yyyymmdd}</DATE>`);
    parts.push('          <VOUCHERTYPENAME>Sales</VOUCHERTYPENAME>');
    parts.push(`          <VOUCHERNUMBER>${escapeXml(invoiceNo)}</VOUCHERNUMBER>`);
    parts.push(`          <PARTYLEDGERNAME>${customerName}</PARTYLEDGERNAME>`);
    parts.push(`          <EFFECTIVEDATE>${yyyymmdd}</EFFECTIVEDATE>`);
    parts.push(`          <NARRATION>${narration}</NARRATION>`);

    // LEDGER 1: Party / Customer
    parts.push('          <LEDGERENTRIES.LIST>');
    parts.push(`            <LEDGERNAME>${escapeXml(customer.customerName || '')}</LEDGERNAME>`); // customerId.customerName
    parts.push('            <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>'); // fixed
    parts.push('            <ISPARTYLEDGER>Yes</ISPARTYLEDGER>'); // fixed
    parts.push(`            <AMOUNT>-${toFixed2(netTotal)}</AMOUNT>`); // -netTotal
    parts.push('          </LEDGERENTRIES.LIST>');

    // LEDGER 2: Transport_pay (taxable value)
    parts.push('          <LEDGERENTRIES.LIST>');
    parts.push('            <LEDGERNAME>Transport_pay</LEDGERNAME>'); // fixed
    parts.push('            <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>'); // fixed
    parts.push(`            <AMOUNT>${toFixed2(taxableAmount)}</AMOUNT>`); // totalBeforeTax
    parts.push('          </LEDGERENTRIES.LIST>');

    if (isIGST) {
      // LEDGER 3: IGST (inter-state). Only three ledgers in this path.
      const rate = Number(igst.rate || 0);
      parts.push('          <LEDGERENTRIES.LIST>');
      parts.push(`            <LEDGERNAME>IGST OUT PUT@ ${rate}%</LEDGERNAME>`);
      parts.push('            <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>');
      parts.push(`            <AMOUNT>${toFixed2(igst.amount)}</AMOUNT>`);
      parts.push('          </LEDGERENTRIES.LIST>');
    } else {
      // LEDGER 3: CGST
      const cgstRate = Number(cgst.rate || 0);
      parts.push('          <LEDGERENTRIES.LIST>');
      parts.push(`            <LEDGERNAME>CGST @  ${cgstRate}% OUT PUT</LEDGERNAME>`);
      parts.push('            <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>');
      parts.push(`            <AMOUNT>${toFixed2(cgst.amount)}</AMOUNT>`);
      parts.push('          </LEDGERENTRIES.LIST>');

      // LEDGER 4: SGST
      const sgstRate = Number(sgst.rate || 0);
      parts.push('          <LEDGERENTRIES.LIST>');
      parts.push(`            <LEDGERNAME>SGST @${sgstRate}% OUT PUT</LEDGERNAME>`);
      parts.push('            <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>');
      parts.push(`            <AMOUNT>${toFixed2(sgst.amount)}</AMOUNT>`);
      parts.push('          </LEDGERENTRIES.LIST>');
    }

    parts.push('        </VOUCHER>');
    parts.push('      </TALLYMESSAGE>');
  });

  parts.push('    </DATA>');
  parts.push('  </BODY>');
  parts.push('</ENVELOPE>');

  return parts.join('\n');
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
