
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
    income: configuredLedgers.income || 'Freight Income',
  };

  // Company / dispatch-from info from tenant or CONFIG
  const companyName = tenant?.name || tenant?.company?.name || 'Shree Enterprises';
  const companyGstin = tenant?.company?.gstin || tenant?.gstin || '';
  const companyStateCode = (companyGstin || '').slice(0, 2) || '';

  const vouchers = (invoices || [])
    .filter(Boolean)
    .map((invoice) => {
      const issueDate = invoice.issueDate || new Date();
      const invoiceNo = invoice.invoiceNo || '';
      const customer = invoice.customerId || {};

      const taxBreakup = invoice.taxBreakup || {};
      const cgst = taxBreakup.cgst || { rate: 0, amount: 0 };
      const sgst = taxBreakup.sgst || { rate: 0, amount: 0 };
      const igst = taxBreakup.igst || { rate: 0, amount: 0 };

      // Rounded values and net total
      const taxableAmount = Math.round(Number(invoice.totalAmountBeforeTax || 0) * 100) / 100;
      const cgstAmt = Math.round(Number(cgst.amount || 0) * 100) / 100;
      const sgstAmt = Math.round(Number(sgst.amount || 0) * 100) / 100;
      const igstAmt = Math.round(Number(igst.amount || 0) * 100) / 100;
      const isIGST = igstAmt > 0;
      const netTotal = Math.round((taxableAmount + cgstAmt + sgstAmt + igstAmt) * 100) / 100;

      const yyyymmdd = escapeXml(formatDateYYYYMMDD(issueDate));
      const customerName = escapeXml(customer.customerName || '');
      const customerGST = customer.GSTNo || '';
      const customerStateCode = (customerGST || '').slice(0, 2) || '';
      const placeOfSupply = customerStateCode || companyStateCode || '';
      const partyGstType = customerStateCode && companyStateCode && customerStateCode !== companyStateCode
        ? 'Inter-State'
        : 'Intra-State';
      const narration = escapeXml(
        invoice.narration || 'Freight charges for delivery of goods.'
      );

      // Ledger names for taxes as per rates
      const cgstRate = Number(cgst.rate || 0);
      const sgstRate = Number(sgst.rate || 0);
      const igstRate = Number(igst.rate || 0);
      const cgstLedgerName = configuredLedgers.cgst || `Output CGST @${cgstRate}%`;
      const sgstLedgerName = configuredLedgers.sgst || `Output SGST @${sgstRate}%`;
      const igstLedgerName = configuredLedgers.igst || `Output IGST @${igstRate}%`;

      // HSN/SAC for freight services (996511 is common); allow override
      const hsn = invoice.hsnCode || configuredLedgers.hsn || '996511';
      const totalTaxRate = isIGST ? igstRate : cgstRate + sgstRate;

      // Build parts using template literals
      const partyLedger = `
          <LEDGERENTRIES.LIST>
            <LEDGERNAME>${customerName}</LEDGERNAME>
            <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
            <ISPARTYLEDGER>Yes</ISPARTYLEDGER>
            <AMOUNT>-${toFixed2(netTotal)}</AMOUNT>
          </LEDGERENTRIES.LIST>`;

      const incomeLedger = `
          <LEDGERENTRIES.LIST>
            <LEDGERNAME>${escapeXml(LEDGER_NAMES.income)}</LEDGERNAME>
            <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
            <AMOUNT>${toFixed2(taxableAmount)}</AMOUNT>
            <HSNCODE>${escapeXml(hsn)}</HSNCODE>
            <GSTCLASSIFICATIONDETAILS.LIST>
              <TAXABILITY>Taxable</TAXABILITY>
              <TAXRATEDETAILS.LIST>
                <TAXRATE>${String(totalTaxRate)}</TAXRATE>
              </TAXRATEDETAILS.LIST>
            </GSTCLASSIFICATIONDETAILS.LIST>
          </LEDGERENTRIES.LIST>`;

      const taxLedgers = isIGST
        ? `
          <LEDGERENTRIES.LIST>
            <LEDGERNAME>${escapeXml(igstLedgerName)}</LEDGERNAME>
            <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
            <AMOUNT>${toFixed2(igstAmt)}</AMOUNT>
          </LEDGERENTRIES.LIST>`
        : `
          <LEDGERENTRIES.LIST>
            <LEDGERNAME>${escapeXml(cgstLedgerName)}</LEDGERNAME>
            <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
            <AMOUNT>${toFixed2(cgstAmt)}</AMOUNT>
          </LEDGERENTRIES.LIST>
          <LEDGERENTRIES.LIST>
            <LEDGERNAME>${escapeXml(sgstLedgerName)}</LEDGERNAME>
            <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
            <AMOUNT>${toFixed2(sgstAmt)}</AMOUNT>
          </LEDGERENTRIES.LIST>`;

      return `
      <TALLYMESSAGE xmlns:UDF="TallyUDF">
        <VOUCHER VCHTYPE="Sales" ACTION="Create" OBJVIEW="Invoice Voucher View" ISINVOICE="Yes">
          <DATE>${yyyymmdd}</DATE>
          <VOUCHERTYPENAME>Sales</VOUCHERTYPENAME>
          <VOUCHERNUMBER>${escapeXml(invoiceNo)}</VOUCHERNUMBER>
          <EFFECTIVEDATE>${yyyymmdd}</EFFECTIVEDATE>

          <PARTYLEDGERNAME>${customerName}</PARTYLEDGERNAME>
          <PARTYNAME>${customerName}</PARTYNAME>
          <PLACEOFSUPPLY>${escapeXml(placeOfSupply)}</PLACEOFSUPPLY>
          <PARTYGSTTYPE>${partyGstType}</PARTYGSTTYPE>
          <PARTYGSTIN>${escapeXml(customerGST)}</PARTYGSTIN>
          <PARTYSTATENAME>${escapeXml(placeOfSupply)}</PARTYSTATENAME>
          <PARTYCOUNTRYNAME>India</PARTYCOUNTRYNAME>

          <DISPATCHFROMNAME>${escapeXml(companyName)}</DISPATCHFROMNAME>
          <DISPATCHFROMSTATE>${escapeXml(companyStateCode)}</DISPATCHFROMSTATE>
          <DISPATCHFROMGSTIN>${escapeXml(companyGstin)}</DISPATCHFROMGSTIN>

          <NARRATION>${narration}</NARRATION>

${partyLedger}
${incomeLedger}
${taxLedgers}
        </VOUCHER>
      </TALLYMESSAGE>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import</TALLYREQUEST>
    <TYPE>Data</TYPE>
    <ID>Vouchers</ID>
  </HEADER>
  <BODY>
    <DATA>
${vouchers}
    </DATA>
  </BODY>
</ENVELOPE>`;
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

// ----------------------------------
// Tally POST helpers
// ----------------------------------

/**
 * Post one or more invoices to a Tally HTTP server.
 * - In dev, configure Vite proxy to forward '/tally' to 'http://localhost:9000'.
 * - In production, you may point `tallyUrl` to a reachable Tally endpoint.
 * @param {Array|Object} invoicesInput One invoice or an array of invoices
 * @param {Object} tenant Current tenant (for ledger config)
 * @param {Object} opts { tallyUrl?: string }
 * @returns {Promise<{ ok: boolean, status: number, text: string }>} Response summary
 */
export async function postInvoicesToTally(invoicesInput, tenant, opts = {}) {
  const invoices = Array.isArray(invoicesInput) ? invoicesInput : [invoicesInput];
  const xml = buildInvoicesXml(invoices, tenant);

  // Resolve URL: explicit option > env var > dev proxy path
  const envUrl = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_TALLY_URL : undefined;
  const tallyUrl = opts.tallyUrl || envUrl || '/tally';

  try {
    const res = await fetch(tallyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
      },
      body: xml,
    });
    const text = await res.text().catch(() => '');
    return { ok: res.ok, status: res.status, text };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      text:
        (err && (err.message || String(err))) || 'Failed to reach Tally server. Check CORS/proxy.',
    };
  }
}

export const tally = {
  postInvoicesToTally,
};
