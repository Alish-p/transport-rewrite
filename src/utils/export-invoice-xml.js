
function pad2(n) {
  return String(n).padStart(2, '0');
}

function escapeXml(unsafe) {
  const safe = unsafe == null ? '' : unsafe;
  return String(safe)
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
  // Round to 2 decimals avoiding FP drift, then format
  const rounded = Math.round(v * 100) / 100;
  return rounded.toFixed(2);
}

// (Removed) Legacy generator for a custom <root><Sheet1> format.

// Build Tally ENVELOPE XML for a list of invoices
// Accepts optional tenant to derive ledger names from accounting integration config
export function buildInvoicesXml(invoicesInput, tenant) {
  const invoices = invoicesInput || [];
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

  // Resolve ledger names (fallback to legacy defaults if not configured)
  const accountingEnabled = !!(
    tenant?.integrations?.accounting && tenant?.integrations?.accounting?.enabled
  );
  const invoiceLedgersEnabled = !!(
    tenant?.integrations?.accounting?.config?.invoiceLedgerNames?.enabled
  );

  const configuredLedgers = accountingEnabled && invoiceLedgersEnabled
    ? tenant?.integrations?.accounting?.config?.invoiceLedgerNames || {}
    : {};

  const LEDGER_NAMES = {
    transport_pay: configuredLedgers.transport_pay || 'Transport_pay',
  };

  invoices.forEach((invoice) => {
    if (!invoice) return;

    const issueDate = invoice.issueDate || new Date();
    const invoiceNo = invoice.invoiceNo || '';
    const customer = invoice.customerId || {};

    const taxBreakup = invoice.taxBreakup || {};
    const cgst = taxBreakup.cgst || { rate: 0, amount: 0 };
    const sgst = taxBreakup.sgst || { rate: 0, amount: 0 };
    const igst = taxBreakup.igst || { rate: 0, amount: 0 };

    // Round components to 2 decimals and enforce netTotal consistency
    const taxableAmount = Math.round(Number(invoice.totalAmountBeforeTax || 0) * 100) / 100;
    const cgstAmt = Math.round(Number(cgst.amount || 0) * 100) / 100;
    const sgstAmt = Math.round(Number(sgst.amount || 0) * 100) / 100;
    const igstAmt = Math.round(Number(igst.amount || 0) * 100) / 100;
    const isIGST = igstAmt > 0;
    // Compute net as exact sum of components (2-decimal rounded)
    const netTotal = Math.round((taxableAmount + cgstAmt + sgstAmt + igstAmt) * 100) / 100;

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
    parts.push(`          <REFERENCEDATE>${yyyymmdd}</REFERENCEDATE>`);
    parts.push(`          <REFERENCE>${escapeXml(invoiceNo)}</REFERENCE>`);
    parts.push(`          <NARRATION>${narration}</NARRATION>`);

    // LEDGER 1: Party / Customer
    parts.push('          <LEDGERENTRIES.LIST>');
    parts.push(`            <LEDGERNAME>${escapeXml(customer.customerName || '')}</LEDGERNAME>`); // customerId.customerName
    parts.push('            <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>'); // fixed
    parts.push('            <ISPARTYLEDGER>Yes</ISPARTYLEDGER>'); // fixed
    parts.push(`            <AMOUNT>-${toFixed2(netTotal)}</AMOUNT>`); // -netTotal (sum of components)
    parts.push('          </LEDGERENTRIES.LIST>');

    // LEDGER 2: Transport_pay (taxable value)
    parts.push('          <LEDGERENTRIES.LIST>');
    parts.push(`            <LEDGERNAME>${escapeXml(LEDGER_NAMES.transport_pay)}</LEDGERNAME>`); // from config
    parts.push('            <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>'); // fixed
    parts.push(`            <AMOUNT>${toFixed2(taxableAmount)}</AMOUNT>`); // totalBeforeTax
    parts.push('          </LEDGERENTRIES.LIST>');

    if (isIGST) {
      // LEDGER 3: IGST (inter-state). Only three ledgers in this path.
      const rate = Number(igst.rate || 0);
      parts.push('          <LEDGERENTRIES.LIST>');
      // If configured ledger name exists, use it as-is; otherwise fall back to the legacy pattern with rate
      const igstLedger = configuredLedgers.igst
        ? configuredLedgers.igst
        : `IGST OUT PUT@ ${rate}%`;
      parts.push(`            <LEDGERNAME>${escapeXml(igstLedger)}</LEDGERNAME>`);
      parts.push('            <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>');
      parts.push(`            <AMOUNT>${toFixed2(igstAmt)}</AMOUNT>`);
      parts.push('          </LEDGERENTRIES.LIST>');
    } else {
      // LEDGER 3: CGST
      const cgstRate = Number(cgst.rate || 0);
      parts.push('          <LEDGERENTRIES.LIST>');
      const cgstLedger = configuredLedgers.cgst
        ? configuredLedgers.cgst
        : `CGST @  ${cgstRate}% OUT PUT`;
      parts.push(`            <LEDGERNAME>${escapeXml(cgstLedger)}</LEDGERNAME>`);
      parts.push('            <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>');
      parts.push(`            <AMOUNT>${toFixed2(cgstAmt)}</AMOUNT>`);
      parts.push('          </LEDGERENTRIES.LIST>');

      // LEDGER 4: SGST
      const sgstRate = Number(sgst.rate || 0);
      parts.push('          <LEDGERENTRIES.LIST>');
      const sgstLedger = configuredLedgers.sgst
        ? configuredLedgers.sgst
        : `SGST @${sgstRate}% OUT PUT`;
      parts.push(`            <LEDGERNAME>${escapeXml(sgstLedger)}</LEDGERNAME>`);
      parts.push('            <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>');
      parts.push(`            <AMOUNT>${toFixed2(sgstAmt)}</AMOUNT>`);
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

export function buildInvoiceXml(invoice, tenant) {
  return buildInvoicesXml([invoice], tenant);
}

export function downloadInvoiceXml(invoice, tenant) {
  const xml = buildInvoiceXml(invoice, tenant);
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

export function downloadInvoicesXml(invoicesInput, fileNameInput, tenant) {
  const invoices = invoicesInput || [];
  const fileName = fileNameInput || 'invoices.xml';
  const xml = buildInvoicesXml(invoices, tenant);
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
