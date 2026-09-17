import { saveAs } from 'file-saver';

import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export const REQUIREMENT_LEVEL = {
  REQUIRED: 'Required',
  RECOMMENDED: 'Recommended',
  OPTIONAL: 'Optional',
  CONDITIONAL: 'Conditional',
  CONFIGURED: 'Configured',
};

export const STATUS = {
  COMPLETED: 'Completed',
  CONFIGURED: 'Configured',
  PARTIAL: 'Partial',
  PENDING: 'Pending',
  NOT_ENABLED: 'Not Enabled',
  OPTIONAL_PENDING: 'Not Configured (Optional)',
};

// System Default Fallbacks
const DEFAULT_SUBTRIP_EXPENSE_TYPES = [
  { label: 'Diesel', value: 'diesel', icon: 'mdi:gas-station' },
  { label: 'Adblue', value: 'adblue', icon: 'mdi:water' },
  { label: 'Trip Advance', value: 'trip-advance', icon: 'mdi:cash-fast' },
  { label: 'Driver Salary', value: 'driver-salary', icon: 'mdi:wallet' },
  { label: 'Extra Advance', value: 'trip-extra-advance', icon: 'mdi:cash-plus' },
  { label: 'Bhatta', value: 'bhatta', icon: 'mdi:hand-coin' },
  { label: 'Greasing', value: 'greasing', icon: 'mdi:oil' },
  { label: 'Excise', value: 'excise', icon: 'mdi:receipt-text' },
  { label: 'Tyre Puncher', value: 'puncher', icon: 'mdi:car-tire-alert' },
  { label: 'Tyre Expense', value: 'tyre-expense', icon: 'solar:wheel-bold-duotone' },
  { label: 'Police', value: 'police', icon: 'mdi:police-badge' },
  { label: 'RTO', value: 'rto', icon: 'mdi:office-building' },
  { label: 'Toll', value: 'toll', icon: 'mdi:gate' },
  { label: 'Vehicle Repair', value: 'vehicle-repair', icon: 'mdi:car-wrench' },
  { label: 'Other', value: 'other', icon: 'mdi:dots-horizontal' },
];

const DEFAULT_VEHICLE_EXPENSE_TYPES = [
  { label: 'Insurance', value: 'insurance', icon: 'mdi:shield-check' },
  { label: 'Permit', value: 'permit', icon: 'mdi:card-account-details' },
  { label: 'Passing', value: 'passing', icon: 'mdi:file-certificate' },
  { label: 'Tyre', value: 'tyre', icon: 'solar:wheel-bold-duotone' },
  { label: 'Major Repair', value: 'major-repair', icon: 'mdi:wrench' },
  { label: 'Fitness Certificate', value: 'fitness-certificate', icon: 'mdi:stethoscope' },
  { label: 'Over-Load Fees', value: 'over-load-fees', icon: 'mdi:scale-balance' },
  { label: 'Other', value: 'other', icon: 'mdi:dots-horizontal' },
];

const DEFAULT_MATERIALS = [
  { label: 'Cement', value: 'Cement' },
  { label: 'Sugar', value: 'Sugar' },
  { label: 'Waste', value: 'Waste' },
  { label: 'Petcoke', value: 'Petcoke' },
  { label: 'Gypsum', value: 'Gypsum' },
  { label: 'Raw sugar', value: 'Raw sugar' },
  { label: 'Bauxite', value: 'Bauxite' },
  { label: 'Bricks', value: 'Bricks' },
  { label: 'Cement pipe', value: 'Cement pipe' },
  { label: 'Steel', value: 'Steel' },
  { label: 'Maize', value: 'Maize' },
  { label: 'Soyabean', value: 'Soyabean' },
  { label: 'Latrite', value: 'Latrite' },
  { label: 'Ethanol', value: 'Ethanol' },
  { label: 'Dolomite', value: 'Dolomite' },
  { label: 'Crushing Stone', value: 'Crushing Stone' },
  { label: 'Lime stone', value: 'Lime stone' },
  { label: 'Molases', value: 'Molases' },
  { label: 'Maida', value: 'Maida' },
  { label: 'Rava', value: 'Rava' },
  { label: 'Tiles', value: 'Tiles' },
  { label: 'Steam coal', value: 'Steam Coal' },
  { label: 'Other', value: 'Other' },
];

const SUBTRIP_FIELDS_METADATA = [
  { key: 'invoiceNo', defaultLabel: 'Invoice No', notes: 'Tax Invoice or Billing reference number.' },
  { key: 'vehicleAssignment', defaultLabel: 'Vehicle Assignment', notes: 'Vehicle assigned for loading and transit.' },
  { key: 'ewayBill', defaultLabel: 'E-Way Bill', notes: 'Government NIC E-Way Bill 12-digit number.' },
  { key: 'ewayExpiryDate', defaultLabel: 'E-Way Expiry Date', notes: 'E-Way Bill valid-until timestamp for validity checks.' },
  { key: 'shipmentNo', defaultLabel: 'Shipment No', notes: 'Customer shipment or consignment number.' },
  { key: 'orderNo', defaultLabel: 'Order No', notes: 'Purchase order (PO) or sales contract number.' },
  { key: 'referenceSubtripNo', defaultLabel: 'Reference Job No', notes: 'Internal / external reference identifier.' },
  { key: 'diNumber', defaultLabel: 'DI/DO No', notes: 'Delivery Instruction / Delivery Order tracking number.' },
  { key: 'consignee', defaultLabel: 'Consignee', notes: 'Receiving party / destination client.' },
  { key: 'loadingPoint', defaultLabel: 'Loading Point', notes: 'Origin factory, plant, yard, or warehouse.' },
  { key: 'unloadingPoint', defaultLabel: 'Unloading Point', notes: 'Destination delivery unloading location.' },
  { key: 'materialType', defaultLabel: 'Material Type', notes: 'Cargo commodity being hauled.' },
  { key: 'grade', defaultLabel: 'Grade', notes: 'Material grade, purity, or packaging standard.' },
  { key: 'quantity', defaultLabel: 'Quantity', notes: 'Loaded quantity, weight, units, or volume.' },
  { key: 'remarks', defaultLabel: 'Remarks', notes: 'Operational notes, dispatch remarks, and instructions.' },
];

const DEFAULT_VEHICLE_TYPES = [
  { label: 'Body', value: 'body' },
  { label: 'Trailer', value: 'trailer' },
  { label: 'Bulker', value: 'bulker' },
  { label: 'Tanker', value: 'tanker' },
  { label: 'Canter', value: 'canter' },
];

const DEFAULT_VEHICLE_COMPANIES = [
  { label: 'Bharat Benz', value: 'bharatBenz' },
  { label: 'Ashok Leyland', value: 'ashokLeyland' },
  { label: 'Tata', value: 'tata' },
  { label: 'Ace', value: 'ace' },
];

const DEFAULT_VEHICLE_MODELS = [
  { label: '3118', value: '3118' },
  { label: '3718', value: '3718' },
  { label: '4018', value: '4018' },
  { label: '4220', value: '4220' },
  { label: '4223', value: '4223' },
  { label: '4825', value: '4825' },
  { label: '1109', value: '1109' },
  { label: '1512', value: '1512' },
];

const DEFAULT_ENGINE_TYPES = [
  { label: 'BS-3', value: 'BS-3' },
  { label: 'BS-4', value: 'BS-4' },
  { label: 'BS-5', value: 'BS-5' },
  { label: 'BS-6', value: 'BS-6' },
];

// Palette definitions
const PALETTE = {
  brandBlue: 'FF1E293B',     // Dark slate blue header
  brandBlueLight: 'FFF1F5F9',// Soft slate background
  categoryBg: 'FFE2E8F0',    // Section header grey-blue
  categoryText: 'FF0F172A',  // Section header dark text
  white: 'FFFFFFFF',
  borderLight: 'FFE2E8F0',
  borderDark: 'FFCBD5E1',
  successBg: 'FFDCFCE7',     // Soft green
  successText: 'FF166534',   // Dark green
  pendingBg: 'FFFEE2E2',     // Soft red
  pendingText: 'FF991B1B',   // Dark red
  infoBg: 'FFE0F2FE',        // Soft sky blue
  infoText: 'FF075985',      // Dark sky blue
  warningBg: 'FFFEF3C7',     // Soft amber
  warningText: 'FF92400E',   // Dark amber
  zebraBg: 'FFF8FAFC',
};

// ----------------------------------------------------------------------

/**
 * Evaluates tenant onboarding status across all fields, configurations, integrations, and master data.
 */
export function evaluateTenantOnboarding(tenant, users = [], stats = {}) {
  const addr = tenant?.address || {};
  const contact = tenant?.contactDetails || {};
  const legal = tenant?.legalInfo || {};
  const bank = tenant?.bankDetails || {};
  const integrations = tenant?.integrations || {};
  const config = tenant?.config || {};
  const subtripConfig = config?.subtrip || {};
  const vehicleConfig = config?.vehicle || {};
  const invoiceConfig = config?.invoice || {};
  const transporterConfig = config?.transporterPayment || {};
  const expenseConfig = config?.expense || {};
  const counts = stats?.counts || {};

  const items = [];

  const addItem = ({ category, name, value, isFilled, requirement, notes, rawValue }) => {
    let status;
    if (isFilled) {
      status = requirement === REQUIREMENT_LEVEL.CONFIGURED ? STATUS.CONFIGURED : STATUS.COMPLETED;
    } else if (requirement === REQUIREMENT_LEVEL.REQUIRED) {
      status = STATUS.PENDING;
    } else if (requirement === REQUIREMENT_LEVEL.RECOMMENDED) {
      status = STATUS.PENDING;
    } else if (requirement === REQUIREMENT_LEVEL.CONDITIONAL) {
      status = STATUS.PENDING;
    } else {
      status = STATUS.OPTIONAL_PENDING;
    }

    items.push({
      category,
      name,
      value: isFilled ? String(value) : '— (Pending / Not Set)',
      rawValue: isFilled ? rawValue ?? value : null,
      isFilled: Boolean(isFilled),
      requirement,
      status,
      notes,
    });
  };

  // 1. Basic Details & Branding
  addItem({
    category: '1. Basic Details & Branding',
    name: 'Company Legal Name',
    value: tenant?.name,
    isFilled: Boolean(tenant?.name?.trim()),
    requirement: REQUIREMENT_LEVEL.REQUIRED,
    notes: 'Printed on all Tax Invoices, LRs, Payment Vouchers, and portal headers. Identifies the organization.',
  });

  addItem({
    category: '1. Basic Details & Branding',
    name: 'Company Tagline / Slogan',
    value: tenant?.tagline,
    isFilled: Boolean(tenant?.tagline?.trim()),
    requirement: REQUIREMENT_LEVEL.OPTIONAL,
    notes: 'Printed below company name on LR, Invoice, and document headers.',
  });

  addItem({
    category: '1. Basic Details & Branding',
    name: 'UI Brand Theme',
    value: tenant?.theme || 'default',
    isFilled: Boolean(tenant?.theme),
    requirement: REQUIREMENT_LEVEL.OPTIONAL,
    notes: 'Sets custom brand accent color scheme across the tenant dashboard portal.',
  });

  const hasLogo = Boolean(tenant?.logoUrl || tenant?.logoKey);
  addItem({
    category: '1. Basic Details & Branding',
    name: 'Company Logo',
    value: hasLogo ? 'Uploaded & Active' : null,
    isFilled: hasLogo,
    requirement: REQUIREMENT_LEVEL.RECOMMENDED,
    notes: 'Printed on top header of all generated LRs, Tax Invoices, Delivery Challans, and portal top-bar.',
  });

  // 2. Address & Contact Details
  addItem({
    category: '2. Address & Contact Details',
    name: 'Street Address (Line 1)',
    value: addr.line1,
    isFilled: Boolean(addr.line1?.trim()),
    requirement: REQUIREMENT_LEVEL.REQUIRED,
    notes: 'Primary registered office address printed on Tax Invoices, LRs, and E-Way bills.',
  });

  addItem({
    category: '2. Address & Contact Details',
    name: 'Address Line 2 / Suite',
    value: addr.line2,
    isFilled: Boolean(addr.line2?.trim()),
    requirement: REQUIREMENT_LEVEL.OPTIONAL,
    notes: 'Secondary address details printed on invoice and document headers.',
  });

  addItem({
    category: '2. Address & Contact Details',
    name: 'City',
    value: addr.city,
    isFilled: Boolean(addr.city?.trim()),
    requirement: REQUIREMENT_LEVEL.REQUIRED,
    notes: 'Official business city printed on documents and used for route default lookups.',
  });

  addItem({
    category: '2. Address & Contact Details',
    name: 'State',
    value: addr.state,
    isFilled: Boolean(addr.state?.trim()),
    requirement: REQUIREMENT_LEVEL.REQUIRED,
    notes: 'Determines Intra-state (CGST + SGST) vs Inter-state (IGST) tax calculation and GST state code.',
  });

  addItem({
    category: '2. Address & Contact Details',
    name: 'PIN Code',
    value: addr.pincode,
    isFilled: Boolean(addr.pincode?.trim()),
    requirement: REQUIREMENT_LEVEL.REQUIRED,
    notes: 'Used for E-Way bill pin-to-pin distance calculations and official postal documentation.',
  });

  addItem({
    category: '2. Address & Contact Details',
    name: 'Official Contact Email',
    value: contact.email,
    isFilled: Boolean(contact.email?.trim()),
    requirement: REQUIREMENT_LEVEL.REQUIRED,
    notes: 'Primary email for receiving invoice copies, account alerts, password resets, and system notices.',
  });

  addItem({
    category: '2. Address & Contact Details',
    name: 'Contact Phone / Mobile',
    value: contact.phone,
    isFilled: Boolean(contact.phone?.trim()),
    requirement: REQUIREMENT_LEVEL.REQUIRED,
    notes: 'Dispatch helpline and customer support number printed on LRs and invoices.',
  });

  addItem({
    category: '2. Address & Contact Details',
    name: 'Website URL',
    value: contact.website,
    isFilled: Boolean(contact.website?.trim()),
    requirement: REQUIREMENT_LEVEL.OPTIONAL,
    notes: 'Printed in invoice footer and displayed on customer portal.',
  });

  // 3. Legal & Tax Compliance
  addItem({
    category: '3. Legal & Tax Compliance',
    name: 'GSTIN (GST Number)',
    value: legal.gstNumber,
    isFilled: Boolean(legal.gstNumber?.trim()),
    requirement: REQUIREMENT_LEVEL.RECOMMENDED,
    notes: 'Mandatory for issuing Tax Invoices, B2B E-Invoicing, E-Way bills, and claiming input tax credit.',
  });

  addItem({
    category: '3. Legal & Tax Compliance',
    name: 'PAN (Permanent Account Number)',
    value: legal.panNumber,
    isFilled: Boolean(legal.panNumber?.trim()),
    requirement: REQUIREMENT_LEVEL.RECOMMENDED,
    notes: 'Printed on B2B invoices and required for TDS calculations and annual financial compliance.',
  });

  addItem({
    category: '3. Legal & Tax Compliance',
    name: 'Registered State Jurisdiction',
    value: legal.registeredState,
    isFilled: Boolean(legal.registeredState?.trim()),
    requirement: REQUIREMENT_LEVEL.RECOMMENDED,
    notes: 'Primary legal registration state jurisdiction for GST filings.',
  });

  // 4. Bank Account Details
  const bankName = bank.name || bank.bankName;
  const bankAcc = bank.accNo || bank.accountNumber;
  const bankIfsc = bank.ifsc || bank.ifscCode;
  const bankBranch = bank.branch;
  const bankPlace = bank.place;

  addItem({
    category: '4. Bank Account Details',
    name: 'Bank Name',
    value: bankName,
    isFilled: Boolean(bankName?.trim()),
    requirement: REQUIREMENT_LEVEL.RECOMMENDED,
    notes: 'Printed on customer invoices in the "Bank Payment Instructions" section for receiving payments.',
  });

  addItem({
    category: '4. Bank Account Details',
    name: 'Bank Account Number',
    value: bankAcc,
    isFilled: Boolean(bankAcc?.trim()),
    requirement: REQUIREMENT_LEVEL.RECOMMENDED,
    notes: 'Customers use this account number to remit freight invoice payments via NEFT/RTGS/IMPS.',
  });

  addItem({
    category: '4. Bank Account Details',
    name: 'IFSC Code',
    value: bankIfsc,
    isFilled: Boolean(bankIfsc?.trim()),
    requirement: REQUIREMENT_LEVEL.RECOMMENDED,
    notes: 'Required on invoice payment instructions for electronic fund transfers.',
  });

  addItem({
    category: '4. Bank Account Details',
    name: 'Bank Branch',
    value: bankBranch,
    isFilled: Boolean(bankBranch?.trim()),
    requirement: REQUIREMENT_LEVEL.OPTIONAL,
    notes: 'Printed on invoice footer to clarify bank branch location.',
  });

  addItem({
    category: '4. Bank Account Details',
    name: 'Bank Location / City',
    value: bankPlace,
    isFilled: Boolean(bankPlace?.trim()),
    requirement: REQUIREMENT_LEVEL.OPTIONAL,
    notes: 'Bank branch city info printed on invoices.',
  });

  // 5. Integrations & Third-Party APIs
  addItem({
    category: '5. Integrations & Third-Party APIs',
    name: 'WhatsApp Automated Notifications',
    value: integrations.whatsapp?.enabled ? 'Enabled' : 'Disabled',
    isFilled: Boolean(integrations.whatsapp?.enabled),
    requirement: REQUIREMENT_LEVEL.OPTIONAL,
    notes: 'Enables automated WhatsApp dispatch alerts, LR PDF sharing, and delivery updates to clients and drivers.',
  });

  const ewayEnabled = Boolean(integrations.ewayBill?.enabled);
  addItem({
    category: '5. Integrations & Third-Party APIs',
    name: 'E-Way Bill Generation Integration',
    value: ewayEnabled ? 'Enabled' : 'Disabled',
    isFilled: ewayEnabled,
    requirement: REQUIREMENT_LEVEL.OPTIONAL,
    notes: 'Enables 1-click automatic E-Way Bill generation and validity extension directly from trip dispatch.',
  });

  if (ewayEnabled) {
    addItem({
      category: '5. Integrations & Third-Party APIs',
      name: 'E-Way Bill NIC Username',
      value: integrations.ewayBill?.username,
      isFilled: Boolean(integrations.ewayBill?.username?.trim()),
      requirement: REQUIREMENT_LEVEL.CONDITIONAL,
      notes: 'Credentials for National Informatics Centre (NIC) E-Way Bill portal API access.',
    });
    addItem({
      category: '5. Integrations & Third-Party APIs',
      name: 'E-Way Bill NIC Password',
      value: integrations.ewayBill?.password ? '••••••••' : null,
      isFilled: Boolean(integrations.ewayBill?.password?.trim()),
      requirement: REQUIREMENT_LEVEL.CONDITIONAL,
      notes: 'API Password for National Informatics Centre (NIC) E-Way Bill portal.',
    });
  }

  const gpsEnabled = Boolean(integrations.vehicleGPS?.enabled);
  addItem({
    category: '5. Integrations & Third-Party APIs',
    name: 'Vehicle GPS Telematics Integration',
    value: gpsEnabled ? `Enabled (${integrations.vehicleGPS?.provider || 'Unknown'})` : 'Disabled',
    isFilled: gpsEnabled,
    requirement: REQUIREMENT_LEVEL.OPTIONAL,
    notes: 'Enables real-time fleet tracking, geofencing, route playback, and live vehicle location on active subtrips.',
  });

  if (gpsEnabled) {
    addItem({
      category: '5. Integrations & Third-Party APIs',
      name: 'GPS Telematics Provider',
      value: integrations.vehicleGPS?.provider,
      isFilled: Boolean(integrations.vehicleGPS?.provider),
      requirement: REQUIREMENT_LEVEL.CONDITIONAL,
      notes: 'Supported telematics providers: Fleetx, LocoNav, BlackBuck, or Other.',
    });
  }

  addItem({
    category: '5. Integrations & Third-Party APIs',
    name: 'VAHAN / Vehicle Verification API',
    value: integrations.vehicleApi?.enabled ? 'Enabled' : 'Disabled',
    isFilled: Boolean(integrations.vehicleApi?.enabled),
    requirement: REQUIREMENT_LEVEL.OPTIONAL,
    notes: 'Auto-fetches RC status, insurance expiry, fitness date, and permit validity on vehicle entry.',
  });

  addItem({
    category: '5. Integrations & Third-Party APIs',
    name: 'Traffic e-Challan API',
    value: integrations.challanApi?.enabled ? 'Enabled' : 'Disabled',
    isFilled: Boolean(integrations.challanApi?.enabled),
    requirement: REQUIREMENT_LEVEL.OPTIONAL,
    notes: 'Monitors pending police challans against fleet vehicles and triggers automated alerts.',
  });

  addItem({
    category: '5. Integrations & Third-Party APIs',
    name: 'GST Verification API',
    value: integrations.gstApi?.enabled ? 'Enabled' : 'Disabled',
    isFilled: Boolean(integrations.gstApi?.enabled),
    requirement: REQUIREMENT_LEVEL.OPTIONAL,
    notes: 'Auto-populates trade name, legal status, and address when entering customer/transporter GSTIN.',
  });

  addItem({
    category: '5. Integrations & Third-Party APIs',
    name: 'Tyre Management Module',
    value: integrations.tyre?.enabled ? 'Enabled' : 'Disabled',
    isFilled: Boolean(integrations.tyre?.enabled),
    requirement: REQUIREMENT_LEVEL.OPTIONAL,
    notes: 'Enables tyre serial number tracking, retreading logs, tread depth inspection, and km analysis.',
  });

  addItem({
    category: '5. Integrations & Third-Party APIs',
    name: 'Electronic Proof of Delivery (ePOD)',
    value: integrations.epod?.enabled ? 'Enabled' : 'Disabled',
    isFilled: Boolean(integrations.epod?.enabled),
    requirement: REQUIREMENT_LEVEL.OPTIONAL,
    notes: 'Enables driver app digital signatures, photo upload, and instant delivery confirmation.',
  });

  addItem({
    category: '5. Integrations & Third-Party APIs',
    name: 'Maintenance & Workshop Inventory',
    value: integrations.maintenanceAndInventory?.enabled ? 'Enabled' : 'Disabled',
    isFilled: Boolean(integrations.maintenanceAndInventory?.enabled),
    requirement: REQUIREMENT_LEVEL.OPTIONAL,
    notes: 'Enables spare parts inventory, job cards, repair work orders, and maintenance schedules.',
  });

  // 6. Accounting & ERP Integration
  const accEnabled = Boolean(integrations.accounting?.enabled);
  addItem({
    category: '6. Accounting & ERP Integration',
    name: 'Accounting Software Sync',
    value: accEnabled ? `Enabled (${integrations.accounting?.provider || 'Unknown'})` : 'Disabled',
    isFilled: accEnabled,
    requirement: REQUIREMENT_LEVEL.OPTIONAL,
    notes: 'Enables automated export/sync of Invoices, Transporter Payouts, and Expenses into accounting software.',
  });

  if (accEnabled) {
    addItem({
      category: '6. Accounting & ERP Integration',
      name: 'Accounting Provider',
      value: integrations.accounting?.provider,
      isFilled: Boolean(integrations.accounting?.provider),
      requirement: REQUIREMENT_LEVEL.CONDITIONAL,
      notes: 'Selected software platform: Tally, Marg, or Zoho Books.',
    });

    const invLedgers = integrations.accounting?.config?.invoiceLedgerNames || {};
    addItem({
      category: '6. Accounting & ERP Integration',
      name: 'Invoice Ledger Mapping Status',
      value: invLedgers.enabled ? 'Enabled' : 'Disabled',
      isFilled: Boolean(invLedgers.enabled),
      requirement: REQUIREMENT_LEVEL.OPTIONAL,
      notes: 'Maps customer invoice line items to specific ledger accounts in Tally/Zoho.',
    });

    if (invLedgers.enabled) {
      ['cgst', 'igst', 'sgst', 'transport_pay', 'shortage'].forEach((key) => {
        addItem({
          category: '6. Accounting & ERP Integration',
          name: `Invoice Ledger: ${key.toUpperCase()}`,
          value: invLedgers[key],
          isFilled: Boolean(invLedgers[key]?.trim()),
          requirement: REQUIREMENT_LEVEL.CONDITIONAL,
          notes: `Exact ledger name in Tally/Zoho for ${key} account posting.`,
        });
      });
    }

    const trLedgers = integrations.accounting?.config?.transporterLedgerNames || {};
    addItem({
      category: '6. Accounting & ERP Integration',
      name: 'Transporter Ledger Mapping Status',
      value: trLedgers.enabled ? 'Enabled' : 'Disabled',
      isFilled: Boolean(trLedgers.enabled),
      requirement: REQUIREMENT_LEVEL.OPTIONAL,
      notes: 'Maps transporter freight payments, advances, and TDS to accounting ledgers.',
    });

    if (trLedgers.enabled) {
      ['cgst', 'igst', 'sgst', 'tds', 'diesel', 'trip_advance', 'shortage'].forEach((key) => {
        addItem({
          category: '6. Accounting & ERP Integration',
          name: `Transporter Ledger: ${key.toUpperCase()}`,
          value: trLedgers[key],
          isFilled: Boolean(trLedgers[key]?.trim()),
          requirement: REQUIREMENT_LEVEL.CONDITIONAL,
          notes: `Exact ledger name in Tally/Zoho for transporter ${key} ledger account posting.`,
        });
      });
    }
  }

  // 7. Operations & Subtrip / Job Configuration
  const defaultFreight = subtripConfig.defaultFreightModel || 'per_ton';
  addItem({
    category: '7. Operations & Subtrip / Job Configuration',
    name: 'Default Freight Calculation Model',
    value: defaultFreight,
    isFilled: Boolean(subtripConfig.defaultFreightModel),
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Sets default pricing calculation basis when booking trips (e.g. per_ton, fixed, per_km, per_trip).',
  });

  const allowedModels = subtripConfig.allowedFreightModels?.length
    ? subtripConfig.allowedFreightModels.join(', ')
    : 'All Supported Models';
  addItem({
    category: '7. Operations & Subtrip / Job Configuration',
    name: 'Allowed Freight Models',
    value: allowedModels,
    isFilled: Boolean(subtripConfig.allowedFreightModels?.length),
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Restricts which pricing models dispatchers can select during trip creation.',
  });

  const defaultBilling = subtripConfig.defaultBillingParty || 'consignor';
  addItem({
    category: '7. Operations & Subtrip / Job Configuration',
    name: 'Default Billing Party',
    value: defaultBilling,
    isFilled: Boolean(subtripConfig.defaultBillingParty),
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Sets default responsible party (Consignor or Consignee) for freight billing.',
  });

  addItem({
    category: '7. Operations & Subtrip / Job Configuration',
    name: 'Allow Billing Party Selection',
    value: subtripConfig.allowBillingPartySelection ? 'Yes (Dynamic per Trip)' : 'No (Locked to Default)',
    isFilled: typeof subtripConfig.allowBillingPartySelection === 'boolean',
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Allows dispatchers to choose billing party (Consignor vs Consignee) on each individual trip.',
  });

  addItem({
    category: '7. Operations & Subtrip / Job Configuration',
    name: 'LR / Bilty Print Template',
    value: subtripConfig.lrTemplate || 'standard',
    isFilled: Boolean(subtripConfig.lrTemplate),
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Visual template design used when generating printable and downloadable Lorry Receipts (LRs).',
  });

  const materialCount = (subtripConfig.materialOptions || DEFAULT_MATERIALS).length;
  addItem({
    category: '7. Operations & Subtrip / Job Configuration',
    name: 'Material Master List',
    value: `${materialCount} materials configured`,
    isFilled: materialCount > 0,
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'List of commodities (Cement, Steel, Sugar, Coal, etc.) available in the material dropdown.',
  });

  // Subtrip Custom Field Rules (15 fields)
  const configuredFieldsCount = Object.keys(subtripConfig.fields || {}).length;
  addItem({
    category: '7. Operations & Subtrip / Job Configuration',
    name: 'Custom Job Form Field Rules (15 Fields)',
    value: `${configuredFieldsCount} of 15 rules customized`,
    isFilled: true,
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Controls whether each custom job field is Required, Optional, or Hidden in trip creation workflow.',
  });

  // 8. Fleet & Vehicle Configuration
  const vMode = vehicleConfig.vehicleMode || 'both';
  addItem({
    category: '8. Fleet & Vehicle Configuration',
    name: 'Fleet Operating Mode',
    value: vMode === 'own_only' ? 'Owned Fleet Only' : vMode === 'market_only' ? 'Market Vehicles Only' : 'Both (Owned + Market)',
    isFilled: Boolean(vehicleConfig.vehicleMode),
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Customizes dashboard and workflows for company-owned fleet, hired market vehicles, or hybrid.',
  });

  const vTypesCount = (vehicleConfig.types || DEFAULT_VEHICLE_TYPES).length;
  addItem({
    category: '8. Fleet & Vehicle Configuration',
    name: 'Vehicle Body Types',
    value: `${vTypesCount} types configured`,
    isFilled: vTypesCount > 0,
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Trailer, Bulker, Tanker, Canter, Body, etc. available in vehicle master.',
  });

  const vMakersCount = (vehicleConfig.companies || DEFAULT_VEHICLE_COMPANIES).length;
  addItem({
    category: '8. Fleet & Vehicle Configuration',
    name: 'Vehicle Manufacturers / Brands',
    value: `${vMakersCount} brands configured`,
    isFilled: vMakersCount > 0,
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Vehicle brands (Tata, Ashok Leyland, BharatBenz, etc.) in vehicle dropdown.',
  });

  // 9. Billing & Invoicing Configuration
  const dueDays = invoiceConfig.defaultDueInDays ?? 10;
  addItem({
    category: '9. Billing & Invoicing Configuration',
    name: 'Default Invoice Due Period',
    value: `${dueDays} Days`,
    isFilled: dueDays != null,
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Sets default payment due date (credit period) from date of invoice generation.',
  });

  const taxRates = invoiceConfig.defaultTaxRates || {};
  addItem({
    category: '9. Billing & Invoicing Configuration',
    name: 'Default CGST Rate %',
    value: `${taxRates.cgst ?? 0}%`,
    isFilled: taxRates.cgst != null,
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Default Central GST % applied on freight billing for intra-state transport.',
  });

  addItem({
    category: '9. Billing & Invoicing Configuration',
    name: 'Default SGST Rate %',
    value: `${taxRates.sgst ?? 0}%`,
    isFilled: taxRates.sgst != null,
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Default State GST % applied on intra-state freight billing.',
  });

  addItem({
    category: '9. Billing & Invoicing Configuration',
    name: 'Default IGST Rate %',
    value: `${taxRates.igst ?? 0}%`,
    isFilled: taxRates.igst != null,
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Default Integrated GST % applied on inter-state freight billing.',
  });

  addItem({
    category: '9. Billing & Invoicing Configuration',
    name: 'Standard Terms & Conditions',
    value: invoiceConfig.termsAndConditions ? 'Custom Terms Configured' : 'Default Terms',
    isFilled: Boolean(invoiceConfig.termsAndConditions?.trim()),
    requirement: REQUIREMENT_LEVEL.RECOMMENDED,
    notes: 'Standard legal and payment terms printed at the bottom of all customer invoices.',
  });

  // 10. Transporter & Vendor Payment Configuration
  const tdsPct = transporterConfig.defaultTdsPercentage ?? 2;
  addItem({
    category: '10. Transporter & Vendor Payment Configuration',
    name: 'Default TDS Deduction %',
    value: `${tdsPct}%`,
    isFilled: tdsPct != null,
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Standard TDS rate deducted from transporter freight settlement vouchers (Sec 194C).',
  });

  const podCharges = transporterConfig.defaultPodCharges ?? 0;
  addItem({
    category: '10. Transporter & Vendor Payment Configuration',
    name: 'Default POD Handling Charges',
    value: `₹${podCharges}`,
    isFilled: podCharges != null,
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Standard deduction applied for physical Proof of Delivery handling.',
  });

  addItem({
    category: '10. Transporter & Vendor Payment Configuration',
    name: 'Transporter Payment Voucher Template',
    value: transporterConfig.template || 'standard',
    isFilled: Boolean(transporterConfig.template),
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Print layout design for transporter payment settlement receipts.',
  });

  // 11. Expense & Fuel Configurations
  const subtripExpCount = (expenseConfig['subtrip-expense-types'] || DEFAULT_SUBTRIP_EXPENSE_TYPES).length;
  addItem({
    category: '11. Expense & Fuel Configurations',
    name: 'Trip Expense Categories',
    value: `${subtripExpCount} expense types configured`,
    isFilled: subtripExpCount > 0,
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Categories like Diesel, Toll, Police, Bhatta, RTO, Adblue available when logging trip expenses.',
  });

  const vehExpCount = (expenseConfig['vehicle-expense-types'] || DEFAULT_VEHICLE_EXPENSE_TYPES).length;
  addItem({
    category: '11. Expense & Fuel Configurations',
    name: 'Vehicle Expense Categories',
    value: `${vehExpCount} expense types configured`,
    isFilled: vehExpCount > 0,
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Categories like Insurance, Permit, Fitness, Tyres, Maintenance available for vehicle expenses.',
  });

  const pumpEnabled = config.pump?.enabled ?? true;
  addItem({
    category: '11. Expense & Fuel Configurations',
    name: 'In-house Fuel Pump Management',
    value: pumpEnabled ? 'Enabled' : 'Disabled',
    isFilled: true,
    requirement: REQUIREMENT_LEVEL.CONFIGURED,
    notes: 'Controls whether the in-house diesel fuel pump dispenser and dipping module is active.',
  });

  // 12. Master Data & Operational Readiness
  const userCount = users.length;
  addItem({
    category: '12. Master Data & Operational Readiness',
    name: 'Team Users & Accounts',
    value: `${userCount} active users created`,
    isFilled: userCount > 0,
    requirement: REQUIREMENT_LEVEL.REQUIRED,
    notes: 'Platform users who can log in, create trips, issue invoices, and manage operations.',
  });

  const custCount = counts.customers ?? 0;
  addItem({
    category: '12. Master Data & Operational Readiness',
    name: 'Client / Customer Master',
    value: `${custCount} customers registered`,
    isFilled: custCount > 0,
    requirement: REQUIREMENT_LEVEL.REQUIRED,
    notes: 'B2B client master accounts with GSTIN, billing address, and contact info.',
  });

  const vehCount = counts.vehicles ?? 0;
  addItem({
    category: '12. Master Data & Operational Readiness',
    name: 'Fleet Vehicles Registered',
    value: `${vehCount} vehicles registered`,
    isFilled: vehCount > 0,
    requirement: REQUIREMENT_LEVEL.RECOMMENDED,
    notes: 'Fleet vehicles added into Tranzit for trip assignments.',
  });

  const drvCount = counts.drivers ?? 0;
  addItem({
    category: '12. Master Data & Operational Readiness',
    name: 'Registered Drivers',
    value: `${drvCount} drivers registered`,
    isFilled: drvCount > 0,
    requirement: REQUIREMENT_LEVEL.RECOMMENDED,
    notes: 'Drivers with mobile numbers and license details for assignment.',
  });

  const transCount = counts.transporters ?? 0;
  addItem({
    category: '12. Master Data & Operational Readiness',
    name: 'Transporter Master Directory',
    value: `${transCount} transporters registered`,
    isFilled: transCount > 0,
    requirement: REQUIREMENT_LEVEL.RECOMMENDED,
    notes: 'Third-party vendors and market vehicle suppliers.',
  });

  const tripCount = counts.subtrips ?? 0;
  addItem({
    category: '12. Master Data & Operational Readiness',
    name: 'Trip Volume Executed',
    value: `${tripCount} trips logged`,
    isFilled: tripCount > 0,
    requirement: REQUIREMENT_LEVEL.OPTIONAL,
    notes: 'Total trip volume logged and managed in the system.',
  });

  // Compute summary metrics
  const totalItems = items.length;
  const completedItems = items.filter((i) => i.isFilled).length;
  const pendingItems = totalItems - completedItems;
  const overallPercentage = Math.round((completedItems / totalItems) * 100);

  const requiredList = items.filter((i) => i.requirement === REQUIREMENT_LEVEL.REQUIRED);
  const requiredTotal = requiredList.length;
  const requiredCompleted = requiredList.filter((i) => i.isFilled).length;
  const requiredPercentage = requiredTotal > 0 ? Math.round((requiredCompleted / requiredTotal) * 100) : 100;

  const recommendedList = items.filter((i) => i.requirement === REQUIREMENT_LEVEL.RECOMMENDED);
  const recommendedTotal = recommendedList.length;
  const recommendedCompleted = recommendedList.filter((i) => i.isFilled).length;

  const categories = [...new Set(items.map((i) => i.category))];
  const categoryStats = categories.map((cat) => {
    const catItems = items.filter((i) => i.category === cat);
    const cTotal = catItems.length;
    const cDone = catItems.filter((i) => i.isFilled).length;
    return {
      category: cat,
      total: cTotal,
      completed: cDone,
      percentage: Math.round((cDone / cTotal) * 100),
    };
  });

  return {
    items,
    totalItems,
    completedItems,
    pendingItems,
    overallPercentage,
    requiredTotal,
    requiredCompleted,
    requiredPercentage,
    recommendedTotal,
    recommendedCompleted,
    categories,
    categoryStats,
  };
}

// ----------------------------------------------------------------------
// HELPER FUNCTIONS FOR WORKSHEET STYLING
// ----------------------------------------------------------------------

function createBanner(ws, title, subtitle, colSpan = 'G') {
  ws.mergeCells(`A1:${colSpan}1`);
  const tCell = ws.getCell('A1');
  tCell.value = title;
  tCell.font = { name: 'Calibri', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  tCell.alignment = { vertical: 'middle', horizontal: 'center' };
  tCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.brandBlue } };
  ws.getRow(1).height = 30;

  ws.mergeCells(`A2:${colSpan}2`);
  const sCell = ws.getCell('A2');
  sCell.value = subtitle;
  sCell.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF334155' } };
  sCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.brandBlueLight } };
  ws.getRow(2).height = 22;
}

function addSectionHeader(ws, row, title, colSpan = 'G') {
  ws.mergeCells(`A${row}:${colSpan}${row}`);
  const c = ws.getCell(`A${row}`);
  c.value = title.toUpperCase();
  c.font = { name: 'Calibri', size: 10.5, bold: true, color: { argb: PALETTE.categoryText } };
  c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.categoryBg } };
  c.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  c.border = {
    top: { style: 'thin', color: { argb: PALETTE.borderDark } },
    bottom: { style: 'thin', color: { argb: PALETTE.borderDark } },
    left: { style: 'thin', color: { argb: PALETTE.borderDark } },
    right: { style: 'thin', color: { argb: PALETTE.borderDark } },
  };
  ws.getRow(row).height = 24;
}

function addTableHeaders(ws, row, headers, cols) {
  cols.forEach((col, idx) => {
    const cell = ws.getCell(`${col}${row}`);
    cell.value = headers[idx];
    cell.font = { name: 'Calibri', size: 10.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.brandBlue } };
    cell.alignment = { vertical: 'middle', horizontal: idx === 0 ? 'center' : 'left', indent: idx === 0 ? 0 : 1 };
    cell.border = {
      top: { style: 'medium', color: { argb: PALETTE.brandBlue } },
      bottom: { style: 'medium', color: { argb: PALETTE.brandBlue } },
      left: { style: 'thin', color: { argb: 'FF475569' } },
      right: { style: 'thin', color: { argb: 'FF475569' } },
    };
  });
  ws.getRow(row).height = 24;
}

function applyBordersAndZebra(ws, row, cols, isEven, customFillCol = null) {
  const bg = isEven ? PALETTE.zebraBg : PALETTE.white;
  cols.forEach((col) => {
    const cell = ws.getCell(`${col}${row}`);
    if (col !== customFillCol) {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
    }
    cell.border = {
      top: { style: 'thin', color: { argb: PALETTE.borderLight } },
      bottom: { style: 'thin', color: { argb: PALETTE.borderLight } },
      left: { style: 'thin', color: { argb: PALETTE.borderLight } },
      right: { style: 'thin', color: { argb: PALETTE.borderLight } },
    };
  });
}

// ----------------------------------------------------------------------
// SHEET BUILDERS
// ----------------------------------------------------------------------

function buildExpenseConfigSheet(workbook, tenant) {
  const ws = workbook.addWorksheet('Expense Config', {
    views: [{ showGridLines: true }],
    properties: { defaultRowHeight: 20 },
  });

  ws.columns = [
    { key: 'colA', width: 6 },   // #
    { key: 'colB', width: 28 },  // Category Name
    { key: 'colC', width: 22 },  // System Key
    { key: 'colD', width: 24 },  // Icon / Code
    { key: 'colE', width: 18 },  // Status
    { key: 'colF', width: 60 },  // Description & Usage
  ];

  createBanner(
    ws,
    `TRANZIT — EXPENSE & FUEL CONFIGURATION (${tenant?.name || 'Tenant'})`,
    'Trip Expense Types, Vehicle Expense Types, and Fuel Pump Module Setup',
    'F'
  );

  let r = 4;
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];

  // Section 1: Subtrip Expense Types
  addSectionHeader(ws, r, '1. Subtrip / Trip Expense Categories', 'F');
  r += 1;

  const subtripExpenses = tenant?.config?.expense?.['subtrip-expense-types']?.length
    ? tenant.config.expense['subtrip-expense-types']
    : DEFAULT_SUBTRIP_EXPENSE_TYPES;

  addTableHeaders(ws, r, ['#', 'Expense Category', 'System Key', 'Icon Identifier', 'Type', 'Description & System Usage'], cols);
  r += 1;

  subtripExpenses.forEach((exp, idx) => {
    const row = ws.getRow(r);
    row.height = 22;

    ws.getCell(`A${r}`).value = idx + 1;
    ws.getCell(`A${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`A${r}`).font = { name: 'Calibri', size: 10, color: { argb: 'FF64748B' } };

    ws.getCell(`B${r}`).value = exp.label;
    ws.getCell(`B${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`B${r}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

    ws.getCell(`C${r}`).value = exp.value;
    ws.getCell(`C${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };
    ws.getCell(`C${r}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

    ws.getCell(`D${r}`).value = exp.icon || '—';
    ws.getCell(`D${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF64748B' } };
    ws.getCell(`D${r}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

    ws.getCell(`E${r}`).value = 'Trip Expense';
    ws.getCell(`E${r}`).font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: PALETTE.infoText } };
    ws.getCell(`E${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.infoBg } };
    ws.getCell(`E${r}`).alignment = { vertical: 'middle', horizontal: 'center' };

    ws.getCell(`F${r}`).value = `Logged against individual subtrips by dispatchers/drivers (${exp.label}).`;
    ws.getCell(`F${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };
    ws.getCell(`F${r}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

    applyBordersAndZebra(ws, r, cols, idx % 2 === 0, 'E');
    r += 1;
  });

  r += 1;

  // Section 2: Vehicle Expense Types
  addSectionHeader(ws, r, '2. Vehicle / Fleet Maintenance Expense Categories', 'F');
  r += 1;

  const vehicleExpenses = tenant?.config?.expense?.['vehicle-expense-types']?.length
    ? tenant.config.expense['vehicle-expense-types']
    : DEFAULT_VEHICLE_EXPENSE_TYPES;

  addTableHeaders(ws, r, ['#', 'Expense Category', 'System Key', 'Icon Identifier', 'Type', 'Description & System Usage'], cols);
  r += 1;

  vehicleExpenses.forEach((exp, idx) => {
    const row = ws.getRow(r);
    row.height = 22;

    ws.getCell(`A${r}`).value = idx + 1;
    ws.getCell(`A${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`A${r}`).font = { name: 'Calibri', size: 10, color: { argb: 'FF64748B' } };

    ws.getCell(`B${r}`).value = exp.label;
    ws.getCell(`B${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`B${r}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

    ws.getCell(`C${r}`).value = exp.value;
    ws.getCell(`C${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };
    ws.getCell(`C${r}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

    ws.getCell(`D${r}`).value = exp.icon || '—';
    ws.getCell(`D${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF64748B' } };
    ws.getCell(`D${r}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

    ws.getCell(`E${r}`).value = 'Vehicle Expense';
    ws.getCell(`E${r}`).font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: 'FFB45309' } };
    ws.getCell(`E${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.warningBg } };
    ws.getCell(`E${r}`).alignment = { vertical: 'middle', horizontal: 'center' };

    ws.getCell(`F${r}`).value = `Logged against vehicle assets (Insurance, Passing, Fitness, Major Repair, etc.).`;
    ws.getCell(`F${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };
    ws.getCell(`F${r}`).alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

    applyBordersAndZebra(ws, r, cols, idx % 2 === 0, 'E');
    r += 1;
  });

  r += 1;

  // Section 3: Fuel Pump Configuration
  addSectionHeader(ws, r, '3. In-House Fuel Pump Management Module', 'F');
  r += 1;

  const pumpEnabled = tenant?.config?.pump?.enabled ?? true;
  addTableHeaders(ws, r, ['#', 'Module / Parameter', 'Configuration Key', 'Value', 'Status', 'Description & System Usage'], cols);
  r += 1;

  ws.getCell(`A${r}`).value = 1;
  ws.getCell(`A${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
  ws.getCell(`B${r}`).value = 'In-house Diesel Pump & Dispenser';
  ws.getCell(`B${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
  ws.getCell(`C${r}`).value = 'config.pump.enabled';
  ws.getCell(`C${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };
  ws.getCell(`D${r}`).value = pumpEnabled ? 'Enabled' : 'Disabled';
  ws.getCell(`D${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: pumpEnabled ? PALETTE.successText : PALETTE.pendingText } };
  ws.getCell(`E${r}`).value = pumpEnabled ? 'ACTIVE' : 'DISABLED';
  ws.getCell(`E${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: pumpEnabled ? PALETTE.successBg : PALETTE.pendingBg } };
  ws.getCell(`E${r}`).font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: pumpEnabled ? PALETTE.successText : PALETTE.pendingText } };
  ws.getCell(`E${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
  ws.getCell(`F${r}`).value = 'Enables fuel tank dipping, nozzle meter logs, and internal diesel dispensing allocations.';
  ws.getCell(`F${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };

  applyBordersAndZebra(ws, r, cols, true, 'E');
}

function buildSubtripConfigSheet(workbook, tenant) {
  const ws = workbook.addWorksheet('Subtrip Config', {
    views: [{ showGridLines: true }],
    properties: { defaultRowHeight: 20 },
  });

  ws.columns = [
    { key: 'colA', width: 6 },   // #
    { key: 'colB', width: 28 },  // Setting / Field Name
    { key: 'colC', width: 24 },  // Default Label / Code
    { key: 'colD', width: 26 },  // Tenant Custom Value
    { key: 'colE', width: 18 },  // Visibility / Setting
    { key: 'colF', width: 62 },  // Description & Operational Rules
  ];

  createBanner(
    ws,
    `TRANZIT — OPERATIONS & SUBTRIP (JOB) CONFIGURATION (${tenant?.name || 'Tenant'})`,
    'Pricing Models, Billing Rules, Print Templates, 15 Field Rules, and Material Master',
    'F'
  );

  let r = 4;
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
  const subtripConfig = tenant?.config?.subtrip || {};

  // Section 1: General Job Settings
  addSectionHeader(ws, r, '1. General Dispatch & Pricing Rules', 'F');
  r += 1;

  addTableHeaders(ws, r, ['#', 'Configuration Setting', 'Default Value', 'Configured Value', 'Status', 'Operational Behavior & Usage'], cols);
  r += 1;

  const generalRules = [
    {
      name: 'Default Freight Model',
      def: 'per_ton',
      val: subtripConfig.defaultFreightModel || 'per_ton',
      status: 'CONFIGURED',
      notes: 'Initial freight calculation basis selected when creating a trip (e.g. per_ton, fixed, per_km, per_trip).',
    },
    {
      name: 'Allowed Freight Models',
      def: 'All Models',
      val: subtripConfig.allowedFreightModels?.length ? subtripConfig.allowedFreightModels.join(', ') : 'All Supported Models',
      status: subtripConfig.allowedFreightModels?.length ? 'RESTRICTED' : 'ALL ALLOWED',
      notes: 'Limits the pricing models dispatchers are allowed to pick when creating new jobs.',
    },
    {
      name: 'Default Billing Party',
      def: 'consignor',
      val: subtripConfig.defaultBillingParty || 'consignor',
      status: 'CONFIGURED',
      notes: 'Default responsible party (Consignor or Consignee) assigned for freight charges.',
    },
    {
      name: 'Allow Dynamic Billing Party',
      def: 'false',
      val: subtripConfig.allowBillingPartySelection ? 'Yes (Dynamic per Trip)' : 'No (Locked)',
      status: subtripConfig.allowBillingPartySelection ? 'ENABLED' : 'LOCKED',
      notes: 'Allows dispatchers to change the billing party between Consignor and Consignee per trip.',
    },
    {
      name: 'LR / Bilty Print Template',
      def: 'standard',
      val: subtripConfig.lrTemplate || 'standard',
      status: 'CONFIGURED',
      notes: 'Design template used for printing and generating downloadable Lorry Receipt (LR) PDFs.',
    },
  ];

  generalRules.forEach((rule, idx) => {
    ws.getCell(`A${r}`).value = idx + 1;
    ws.getCell(`A${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`B${r}`).value = rule.name;
    ws.getCell(`B${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`C${r}`).value = rule.def;
    ws.getCell(`C${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF64748B' } };
    ws.getCell(`D${r}`).value = rule.val;
    ws.getCell(`D${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`E${r}`).value = rule.status;
    ws.getCell(`E${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.infoBg } };
    ws.getCell(`E${r}`).font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: PALETTE.infoText } };
    ws.getCell(`E${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`F${r}`).value = rule.notes;
    ws.getCell(`F${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };

    applyBordersAndZebra(ws, r, cols, idx % 2 === 0, 'E');
    r += 1;
  });

  r += 1;

  // Section 2: Subtrip Custom Field Rules (15 Fields)
  addSectionHeader(ws, r, '2. Custom Job Form Field Configurations (15 System Fields)', 'F');
  r += 1;

  addTableHeaders(ws, r, ['#', 'Field Key', 'Default Label', 'Custom Tenant Label', 'Visibility Setting', 'Operational Rules & Impact'], cols);
  r += 1;

  const fieldsMap = subtripConfig.fields || {};

  SUBTRIP_FIELDS_METADATA.forEach((meta, idx) => {
    const fieldConf = fieldsMap[meta.key] || {};
    const customLabel = fieldConf.label || meta.defaultLabel;
    const visibility = fieldConf.visibility || 'optional';

    let visBg = PALETTE.infoBg;
    let visText = PALETTE.infoText;
    if (visibility === 'required') {
      visBg = PALETTE.pendingBg;
      visText = PALETTE.pendingText;
    } else if (visibility === 'hidden') {
      visBg = 'FFF1F5F9';
      visText = 'FF64748B';
    }

    ws.getCell(`A${r}`).value = idx + 1;
    ws.getCell(`A${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`B${r}`).value = meta.key;
    ws.getCell(`B${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`C${r}`).value = meta.defaultLabel;
    ws.getCell(`C${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF64748B' } };
    ws.getCell(`D${r}`).value = customLabel;
    ws.getCell(`D${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`E${r}`).value = visibility.toUpperCase();
    ws.getCell(`E${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: visBg } };
    ws.getCell(`E${r}`).font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: visText } };
    ws.getCell(`E${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`F${r}`).value = meta.notes;
    ws.getCell(`F${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };

    applyBordersAndZebra(ws, r, cols, idx % 2 === 0, 'E');
    r += 1;
  });

  r += 1;

  // Section 3: Material Master Commodities
  addSectionHeader(ws, r, '3. Material & Commodity Master Options', 'F');
  r += 1;

  const materials = subtripConfig.materialOptions?.length ? subtripConfig.materialOptions : DEFAULT_MATERIALS;
  addTableHeaders(ws, r, ['#', 'Material Name', 'System Key / Value', 'Icon / Type', 'Status', 'Dropdown & LR Usage'], cols);
  r += 1;

  materials.forEach((mat, idx) => {
    ws.getCell(`A${r}`).value = idx + 1;
    ws.getCell(`A${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`B${r}`).value = mat.label;
    ws.getCell(`B${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`C${r}`).value = mat.value;
    ws.getCell(`C${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };
    ws.getCell(`D${r}`).value = mat.icon || 'Standard';
    ws.getCell(`D${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF64748B' } };
    ws.getCell(`E${r}`).value = 'ACTIVE';
    ws.getCell(`E${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.successBg } };
    ws.getCell(`E${r}`).font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: PALETTE.successText } };
    ws.getCell(`E${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`F${r}`).value = `Commodity option available in trip creation dropdown and printed on LR (${mat.label}).`;
    ws.getCell(`F${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };

    applyBordersAndZebra(ws, r, cols, idx % 2 === 0, 'E');
    r += 1;
  });
}

function buildVehicleConfigSheet(workbook, tenant) {
  const ws = workbook.addWorksheet('Vehicle Config', {
    views: [{ showGridLines: true }],
    properties: { defaultRowHeight: 20 },
  });

  ws.columns = [
    { key: 'colA', width: 6 },   // #
    { key: 'colB', width: 28 },  // Category / Item
    { key: 'colC', width: 24 },  // System Code / Key
    { key: 'colD', width: 22 },  // Scope / Group
    { key: 'colE', width: 18 },  // Status
    { key: 'colF', width: 60 },  // Fleet Usage & Description
  ];

  createBanner(
    ws,
    `TRANZIT — FLEET & VEHICLE CONFIGURATION (${tenant?.name || 'Tenant'})`,
    'Operating Fleet Mode, Body Types, Manufacturers, Models, and Engine Standards',
    'F'
  );

  let r = 4;
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
  const vehicleConfig = tenant?.config?.vehicle || {};

  // Section 1: Fleet Operating Mode
  addSectionHeader(ws, r, '1. Fleet Operating Mode', 'F');
  r += 1;

  addTableHeaders(ws, r, ['#', 'Configuration Parameter', 'Configured Mode', 'Scope', 'Status', 'System Impact & Workflow Behavior'], cols);
  r += 1;

  const vMode = vehicleConfig.vehicleMode || 'both';
  const modeLabel = vMode === 'own_only' ? 'Owned Fleet Only' : vMode === 'market_only' ? 'Market Vehicles Only' : 'Both (Owned Fleet + Market Vehicles)';
  const modeDesc = vMode === 'own_only'
    ? 'Client manages only company-owned fleet. Transporter hiring features are disabled.'
    : vMode === 'market_only'
    ? 'Client hires external market trucks exclusively. Owned vehicle maintenance modules are hidden.'
    : 'Client operates both company-owned vehicles and hires external third-party market transporters.';

  ws.getCell(`A${r}`).value = 1;
  ws.getCell(`A${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
  ws.getCell(`B${r}`).value = 'Fleet Operating Mode';
  ws.getCell(`B${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
  ws.getCell(`C${r}`).value = vMode;
  ws.getCell(`C${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };
  ws.getCell(`D${r}`).value = modeLabel;
  ws.getCell(`D${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
  ws.getCell(`E${r}`).value = 'ACTIVE';
  ws.getCell(`E${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.successBg } };
  ws.getCell(`E${r}`).font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: PALETTE.successText } };
  ws.getCell(`E${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
  ws.getCell(`F${r}`).value = modeDesc;
  ws.getCell(`F${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };

  applyBordersAndZebra(ws, r, cols, true, 'E');
  r += 2;

  // Section 2: Vehicle Body Types
  addSectionHeader(ws, r, '2. Vehicle Body Types', 'F');
  r += 1;

  const vTypes = vehicleConfig.types?.length ? vehicleConfig.types : DEFAULT_VEHICLE_TYPES;
  addTableHeaders(ws, r, ['#', 'Body Type Name', 'System Key / Value', 'Group', 'Status', 'Usage Notes'], cols);
  r += 1;

  vTypes.forEach((t, idx) => {
    ws.getCell(`A${r}`).value = idx + 1;
    ws.getCell(`A${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`B${r}`).value = t.label;
    ws.getCell(`B${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`C${r}`).value = t.value;
    ws.getCell(`C${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };
    ws.getCell(`D${r}`).value = 'Body Type';
    ws.getCell(`D${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF64748B' } };
    ws.getCell(`E${r}`).value = 'ACTIVE';
    ws.getCell(`E${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.infoBg } };
    ws.getCell(`E${r}`).font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: PALETTE.infoText } };
    ws.getCell(`E${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`F${r}`).value = `Body configuration available in vehicle registration form (${t.label}).`;
    ws.getCell(`F${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };

    applyBordersAndZebra(ws, r, cols, idx % 2 === 0, 'E');
    r += 1;
  });

  r += 1;

  // Section 3: Manufacturers / Brands
  addSectionHeader(ws, r, '3. Vehicle Manufacturers / Brands', 'F');
  r += 1;

  const vCompanies = vehicleConfig.companies?.length ? vehicleConfig.companies : DEFAULT_VEHICLE_COMPANIES;
  addTableHeaders(ws, r, ['#', 'Manufacturer Brand', 'System Key / Value', 'Group', 'Status', 'Usage Notes'], cols);
  r += 1;

  vCompanies.forEach((c, idx) => {
    ws.getCell(`A${r}`).value = idx + 1;
    ws.getCell(`A${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`B${r}`).value = c.label;
    ws.getCell(`B${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`C${r}`).value = c.value;
    ws.getCell(`C${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };
    ws.getCell(`D${r}`).value = 'Manufacturer';
    ws.getCell(`D${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF64748B' } };
    ws.getCell(`E${r}`).value = 'ACTIVE';
    ws.getCell(`E${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.infoBg } };
    ws.getCell(`E${r}`).font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: PALETTE.infoText } };
    ws.getCell(`E${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`F${r}`).value = `Vehicle manufacturer brand in dropdown selection (${c.label}).`;
    ws.getCell(`F${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };

    applyBordersAndZebra(ws, r, cols, idx % 2 === 0, 'E');
    r += 1;
  });

  r += 1;

  // Section 4: Models & Engine Types
  addSectionHeader(ws, r, '4. Vehicle Models & Emission Norms', 'F');
  r += 1;

  const vModels = vehicleConfig.models?.length ? vehicleConfig.models : DEFAULT_VEHICLE_MODELS;
  const vEngines = vehicleConfig.engineTypes?.length ? vehicleConfig.engineTypes : DEFAULT_ENGINE_TYPES;

  addTableHeaders(ws, r, ['#', 'Model / Standard', 'System Key / Value', 'Classification', 'Status', 'Usage Notes'], cols);
  r += 1;

  vModels.forEach((m, idx) => {
    ws.getCell(`A${r}`).value = idx + 1;
    ws.getCell(`A${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`B${r}`).value = m.label;
    ws.getCell(`B${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`C${r}`).value = m.value;
    ws.getCell(`C${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };
    ws.getCell(`D${r}`).value = 'Vehicle Model Series';
    ws.getCell(`D${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF64748B' } };
    ws.getCell(`E${r}`).value = 'ACTIVE';
    ws.getCell(`E${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.infoBg } };
    ws.getCell(`E${r}`).font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: PALETTE.infoText } };
    ws.getCell(`E${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`F${r}`).value = `Vehicle model classification in fleet asset master.`;
    ws.getCell(`F${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };

    applyBordersAndZebra(ws, r, cols, idx % 2 === 0, 'E');
    r += 1;
  });

  vEngines.forEach((e, idx) => {
    ws.getCell(`A${r}`).value = vModels.length + idx + 1;
    ws.getCell(`A${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`B${r}`).value = e.label;
    ws.getCell(`B${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`C${r}`).value = e.value;
    ws.getCell(`C${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };
    ws.getCell(`D${r}`).value = 'Engine Emission Standard';
    ws.getCell(`D${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF64748B' } };
    ws.getCell(`E${r}`).value = 'ACTIVE';
    ws.getCell(`E${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.infoBg } };
    ws.getCell(`E${r}`).font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: PALETTE.infoText } };
    ws.getCell(`E${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`F${r}`).value = `Emission standard (BS-3, BS-4, BS-6, EV) for compliance tracking.`;
    ws.getCell(`F${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };

    applyBordersAndZebra(ws, r, cols, (vModels.length + idx) % 2 === 0, 'E');
    r += 1;
  });
}

function buildInvoiceConfigSheet(workbook, tenant) {
  const ws = workbook.addWorksheet('Invoice Config', {
    views: [{ showGridLines: true }],
    properties: { defaultRowHeight: 20 },
  });

  ws.columns = [
    { key: 'colA', width: 6 },   // #
    { key: 'colB', width: 28 },  // Parameter Name
    { key: 'colC', width: 22 },  // System Code
    { key: 'colD', width: 26 },  // Configured Value
    { key: 'colE', width: 18 },  // Status
    { key: 'colF', width: 60 },  // System Usage & Billing Impact
  ];

  createBanner(
    ws,
    `TRANZIT — BILLING & INVOICE CONFIGURATION (${tenant?.name || 'Tenant'})`,
    'Default Payment Terms, GST Tax Rates, and Standard Invoicing Terms',
    'F'
  );

  let r = 4;
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
  const inv = tenant?.config?.invoice || {};

  addSectionHeader(ws, r, '1. Default Invoicing & Tax Parameters', 'F');
  r += 1;

  addTableHeaders(ws, r, ['#', 'Parameter Name', 'System Key', 'Configured Value', 'Status', 'System Usage & Billing Impact'], cols);
  r += 1;

  const invParams = [
    {
      name: 'Default Credit Due Period',
      key: 'config.invoice.defaultDueInDays',
      val: `${inv.defaultDueInDays ?? 10} Days`,
      notes: 'Sets default invoice payment due date automatically upon invoice generation.',
    },
    {
      name: 'Default CGST Tax Rate',
      key: 'config.invoice.defaultTaxRates.cgst',
      val: `${inv.defaultTaxRates?.cgst ?? 0}%`,
      notes: 'Default Central GST % applied for intra-state freight customer billing.',
    },
    {
      name: 'Default SGST Tax Rate',
      key: 'config.invoice.defaultTaxRates.sgst',
      val: `${inv.defaultTaxRates?.sgst ?? 0}%`,
      notes: 'Default State GST % applied for intra-state freight customer billing.',
    },
    {
      name: 'Default IGST Tax Rate',
      key: 'config.invoice.defaultTaxRates.igst',
      val: `${inv.defaultTaxRates?.igst ?? 0}%`,
      notes: 'Default Integrated GST % applied for inter-state freight customer billing.',
    },
    {
      name: 'Standard Terms & Conditions',
      key: 'config.invoice.termsAndConditions',
      val: inv.termsAndConditions ? 'Custom Terms Configured' : 'Default / None',
      notes: 'Standard legal terms, interest clauses, and payment instructions printed on customer invoices.',
    },
  ];

  invParams.forEach((item, idx) => {
    ws.getCell(`A${r}`).value = idx + 1;
    ws.getCell(`A${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`B${r}`).value = item.name;
    ws.getCell(`B${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`C${r}`).value = item.key;
    ws.getCell(`C${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };
    ws.getCell(`D${r}`).value = item.val;
    ws.getCell(`D${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`E${r}`).value = 'CONFIGURED';
    ws.getCell(`E${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.infoBg } };
    ws.getCell(`E${r}`).font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: PALETTE.infoText } };
    ws.getCell(`E${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`F${r}`).value = item.notes;
    ws.getCell(`F${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };

    applyBordersAndZebra(ws, r, cols, idx % 2 === 0, 'E');
    r += 1;
  });

  if (inv.termsAndConditions) {
    r += 1;
    addSectionHeader(ws, r, '2. Configured Standard Terms & Conditions Text', 'F');
    r += 1;

    ws.mergeCells(`A${r}:F${r + 2}`);
    const tcCell = ws.getCell(`A${r}`);
    tcCell.value = inv.termsAndConditions;
    tcCell.font = { name: 'Calibri', size: 9.5, italic: true, color: { argb: 'FF0F172A' } };
    tcCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true, indent: 1 };
    tcCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    tcCell.border = {
      top: { style: 'thin', color: { argb: PALETTE.borderDark } },
      bottom: { style: 'thin', color: { argb: PALETTE.borderDark } },
      left: { style: 'thin', color: { argb: PALETTE.borderDark } },
      right: { style: 'thin', color: { argb: PALETTE.borderDark } },
    };
  }
}

function buildTransporterConfigSheet(workbook, tenant) {
  const ws = workbook.addWorksheet('Transporter Config', {
    views: [{ showGridLines: true }],
    properties: { defaultRowHeight: 20 },
  });

  ws.columns = [
    { key: 'colA', width: 6 },   // #
    { key: 'colB', width: 28 },  // Parameter Name
    { key: 'colC', width: 24 },  // System Code
    { key: 'colD', width: 24 },  // Configured Value
    { key: 'colE', width: 18 },  // Status
    { key: 'colF', width: 60 },  // Description & Operational Rules
  ];

  createBanner(
    ws,
    `TRANZIT — TRANSPORTER & VENDOR PAYMENT CONFIGURATION (${tenant?.name || 'Tenant'})`,
    'TDS Rates, POD Handling Deductions, and Payment Settlement Layouts',
    'F'
  );

  let r = 4;
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
  const tr = tenant?.config?.transporterPayment || {};

  addSectionHeader(ws, r, '1. Transporter Settlement & Payout Rules', 'F');
  r += 1;

  addTableHeaders(ws, r, ['#', 'Configuration Parameter', 'System Key', 'Configured Value', 'Status', 'Description & Operational Rules'], cols);
  r += 1;

  const trParams = [
    {
      name: 'Default TDS Rate % (Sec 194C)',
      key: 'config.transporterPayment.defaultTdsPercentage',
      val: `${tr.defaultTdsPercentage ?? 2}%`,
      notes: 'Standard Income Tax TDS percentage deducted on transporter freight payment settlement vouchers.',
    },
    {
      name: 'Default POD Handling Charges',
      key: 'config.transporterPayment.defaultPodCharges',
      val: `₹${tr.defaultPodCharges ?? 0}`,
      notes: 'Default handling fee deducted from transporter payout for physical Proof of Delivery handling.',
    },
    {
      name: 'Settlement Voucher Template',
      key: 'config.transporterPayment.template',
      val: tr.template || 'standard',
      notes: 'Layout design used for printing and generating transporter payment receipts.',
    },
  ];

  trParams.forEach((item, idx) => {
    ws.getCell(`A${r}`).value = idx + 1;
    ws.getCell(`A${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`B${r}`).value = item.name;
    ws.getCell(`B${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`C${r}`).value = item.key;
    ws.getCell(`C${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };
    ws.getCell(`D${r}`).value = item.val;
    ws.getCell(`D${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`E${r}`).value = 'CONFIGURED';
    ws.getCell(`E${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.infoBg } };
    ws.getCell(`E${r}`).font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: PALETTE.infoText } };
    ws.getCell(`E${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`F${r}`).value = item.notes;
    ws.getCell(`F${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };

    applyBordersAndZebra(ws, r, cols, idx % 2 === 0, 'E');
    r += 1;
  });
}

function buildAccountingConfigSheet(workbook, tenant) {
  const ws = workbook.addWorksheet('Accounting Config', {
    views: [{ showGridLines: true }],
    properties: { defaultRowHeight: 20 },
  });

  ws.columns = [
    { key: 'colA', width: 6 },   // #
    { key: 'colB', width: 28 },  // Ledger / Setting Name
    { key: 'colC', width: 24 },  // Accounting Code / Key
    { key: 'colD', width: 26 },  // Configured Ledger Name
    { key: 'colE', width: 18 },  // Status
    { key: 'colF', width: 60 },  // ERP System Role & Journal Mapping
  ];

  createBanner(
    ws,
    `TRANZIT — ACCOUNTING & ERP INTEGRATION CONFIGURATION (${tenant?.name || 'Tenant'})`,
    'Tally, Marg, and Zoho Books Ledger Account Mappings',
    'F'
  );

  let r = 4;
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
  const accounting = tenant?.integrations?.accounting || {};
  const isEnabled = Boolean(accounting.enabled);
  const provider = accounting.provider || 'None / Not Selected';

  // Section 1: Overview & Provider
  addSectionHeader(ws, r, '1. Accounting Software & Sync Status', 'F');
  r += 1;

  addTableHeaders(ws, r, ['#', 'Configuration Item', 'System Key', 'Configured Value', 'Status', 'ERP Integration Impact'], cols);
  r += 1;

  const general = [
    {
      name: 'Accounting Sync Status',
      key: 'integrations.accounting.enabled',
      val: isEnabled ? 'Enabled' : 'Disabled',
      status: isEnabled ? 'ACTIVE' : 'DISABLED',
      statusColor: isEnabled ? PALETTE.successBg : PALETTE.pendingBg,
      statusText: isEnabled ? PALETTE.successText : PALETTE.pendingText,
      notes: 'Controls automated export/sync of Invoices and Transporter Payments to external ERP.',
    },
    {
      name: 'Accounting Software Provider',
      key: 'integrations.accounting.provider',
      val: provider,
      status: isEnabled ? 'CONFIGURED' : 'PENDING',
      statusColor: isEnabled ? PALETTE.infoBg : 'FFF1F5F9',
      statusText: isEnabled ? PALETTE.infoText : 'FF64748B',
      notes: 'Supported accounting software platforms: Tally, Marg, or Zoho Books.',
    },
  ];

  general.forEach((g, idx) => {
    ws.getCell(`A${r}`).value = idx + 1;
    ws.getCell(`A${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`B${r}`).value = g.name;
    ws.getCell(`B${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`C${r}`).value = g.key;
    ws.getCell(`C${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };
    ws.getCell(`D${r}`).value = g.val;
    ws.getCell(`D${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`E${r}`).value = g.status;
    ws.getCell(`E${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: g.statusColor } };
    ws.getCell(`E${r}`).font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: g.statusText } };
    ws.getCell(`E${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`F${r}`).value = g.notes;
    ws.getCell(`F${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };

    applyBordersAndZebra(ws, r, cols, idx % 2 === 0, 'E');
    r += 1;
  });

  r += 1;

  // Section 2: Customer Invoice Ledgers
  addSectionHeader(ws, r, '2. Customer Invoice Sales & Tax Ledger Accounts', 'F');
  r += 1;

  const invLedgers = accounting?.config?.invoiceLedgerNames || {};
  addTableHeaders(ws, r, ['#', 'Invoice Account Type', 'Ledger Field Key', 'Configured Ledger in ERP', 'Status', 'Tally / Zoho Journal Posting Rule'], cols);
  r += 1;

  const invFields = [
    { name: 'Central GST (CGST)', key: 'cgst', val: invLedgers.cgst, notes: 'CGST Duties & Taxes output ledger for intra-state freight.' },
    { name: 'State GST (SGST)', key: 'sgst', val: invLedgers.sgst, notes: 'SGST Duties & Taxes output ledger for intra-state freight.' },
    { name: 'Integrated GST (IGST)', key: 'igst', val: invLedgers.igst, notes: 'IGST Duties & Taxes output ledger for inter-state freight.' },
    { name: 'Freight Income / Sales', key: 'transport_pay', val: invLedgers.transport_pay, notes: 'Primary sales / freight revenue account ledger.' },
    { name: 'Shortage Deduction Income', key: 'shortage', val: invLedgers.shortage, notes: 'Shortage debit ledger deducted from customer billing.' },
  ];

  invFields.forEach((item, idx) => {
    const isFilled = Boolean(item.val?.trim());
    ws.getCell(`A${r}`).value = idx + 1;
    ws.getCell(`A${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`B${r}`).value = item.name;
    ws.getCell(`B${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`C${r}`).value = `invoiceLedgerNames.${item.key}`;
    ws.getCell(`C${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };
    ws.getCell(`D${r}`).value = isFilled ? item.val : '— (Not Mapped)';
    ws.getCell(`D${r}`).font = { name: 'Calibri', size: 10, bold: isFilled, italic: !isFilled, color: { argb: isFilled ? 'FF0F172A' : 'FF94A3B8' } };
    ws.getCell(`E${r}`).value = isFilled ? 'MAPPED' : 'UNMAPPED';
    ws.getCell(`E${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isFilled ? PALETTE.successBg : 'FFF1F5F9' } };
    ws.getCell(`E${r}`).font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: isFilled ? PALETTE.successText : 'FF64748B' } };
    ws.getCell(`E${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`F${r}`).value = item.notes;
    ws.getCell(`F${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };

    applyBordersAndZebra(ws, r, cols, idx % 2 === 0, 'E');
    r += 1;
  });

  r += 1;

  // Section 3: Transporter Payment Ledgers
  addSectionHeader(ws, r, '3. Transporter Freight Payment & TDS Ledger Accounts', 'F');
  r += 1;

  const trLedgers = accounting?.config?.transporterLedgerNames || {};
  addTableHeaders(ws, r, ['#', 'Transporter Account Type', 'Ledger Field Key', 'Configured Ledger in ERP', 'Status', 'Tally / Zoho Journal Posting Rule'], cols);
  r += 1;

  const trFields = [
    { name: 'Central GST (CGST)', key: 'cgst', val: trLedgers.cgst, notes: 'CGST input tax credit ledger for transporter payments.' },
    { name: 'State GST (SGST)', key: 'sgst', val: trLedgers.sgst, notes: 'SGST input tax credit ledger for transporter payments.' },
    { name: 'Integrated GST (IGST)', key: 'igst', val: trLedgers.igst, notes: 'IGST input tax credit ledger for inter-state transporter payments.' },
    { name: 'TDS on Contractor (194C)', key: 'tds', val: trLedgers.tds, notes: 'TDS payable ledger for deductions under Section 194C.' },
    { name: 'Diesel Advance Account', key: 'diesel', val: trLedgers.diesel, notes: 'Diesel fuel card / pump advance debit ledger.' },
    { name: 'Trip Cash / Bank Advance', key: 'trip_advance', val: trLedgers.trip_advance, notes: 'Cash or bank trip advance ledger given to drivers/transporters.' },
    { name: 'Shortage Deduction Penalty', key: 'shortage', val: trLedgers.shortage, notes: 'Cargo shortage damage penalty deducted from transporter.' },
  ];

  trFields.forEach((item, idx) => {
    const isFilled = Boolean(item.val?.trim());
    ws.getCell(`A${r}`).value = idx + 1;
    ws.getCell(`A${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`B${r}`).value = item.name;
    ws.getCell(`B${r}`).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    ws.getCell(`C${r}`).value = `transporterLedgerNames.${item.key}`;
    ws.getCell(`C${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };
    ws.getCell(`D${r}`).value = isFilled ? item.val : '— (Not Mapped)';
    ws.getCell(`D${r}`).font = { name: 'Calibri', size: 10, bold: isFilled, italic: !isFilled, color: { argb: isFilled ? 'FF0F172A' : 'FF94A3B8' } };
    ws.getCell(`E${r}`).value = isFilled ? 'MAPPED' : 'UNMAPPED';
    ws.getCell(`E${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isFilled ? PALETTE.successBg : 'FFF1F5F9' } };
    ws.getCell(`E${r}`).font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: isFilled ? PALETTE.successText : 'FF64748B' } };
    ws.getCell(`E${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell(`F${r}`).value = item.notes;
    ws.getCell(`F${r}`).font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };

    applyBordersAndZebra(ws, r, cols, idx % 2 === 0, 'E');
    r += 1;
  });
}

// ----------------------------------------------------------------------
// MAIN WORKBOOK EXPORT FUNCTION
// ----------------------------------------------------------------------

/**
 * Generates and downloads the Multi-Sheet Excel Onboarding Tracker & Tenant Configuration (.xlsx)
 */
export async function exportTenantOnboardingToExcel(tenant, users = [], stats = {}) {
  const { default: ExcelJS } = await import('exceljs');
  const evaluation = evaluateTenantOnboarding(tenant, users, stats);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Tranzit Platform';
  workbook.lastModifiedBy = 'Tranzit Super Admin';
  workbook.created = new Date();
  workbook.modified = new Date();

  // 1. Sheet 1: Master Onboarding Tracker
  const wsMain = workbook.addWorksheet('Onboarding Tracker', {
    views: [{ showGridLines: true }],
    properties: { defaultRowHeight: 20 },
  });

  wsMain.columns = [
    { key: 'colA', width: 6 },   // #
    { key: 'colB', width: 32 },  // Module / Category
    { key: 'colC', width: 36 },  // Field / Setting Name
    { key: 'colD', width: 34 },  // Current Value / Setting
    { key: 'colE', width: 16 },  // Requirement
    { key: 'colF', width: 18 },  // Status
    { key: 'colG', width: 68 },  // Where Visible & How It's Used
  ];

  let r = 1;

  // Row 1: Main Title Banner
  wsMain.mergeCells(`A${r}:G${r}`);
  const titleCell = wsMain.getCell(`A${r}`);
  titleCell.value = `TRANZIT — TENANT ONBOARDING PROGRESS TRACKER`;
  titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.brandBlue } };
  wsMain.getRow(r).height = 32;
  r += 1;

  // Row 2: Subtitle info
  wsMain.mergeCells(`A${r}:G${r}`);
  const subTitleCell = wsMain.getCell(`A${r}`);
  subTitleCell.value = `Tenant: ${tenant?.name || 'Unknown'}  |  Generated On: ${fDate(new Date())}  |  Overall Readiness: ${evaluation.overallPercentage}%  |  Required Fields: ${evaluation.requiredCompleted}/${evaluation.requiredTotal} (${evaluation.requiredPercentage}%)`;
  subTitleCell.font = { name: 'Calibri', size: 10.5, italic: true, color: { argb: 'FF334155' } };
  subTitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  subTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.brandBlueLight } };
  wsMain.getRow(r).height = 24;
  r += 1;

  // Empty spacer
  r += 1;

  // Executive Summary Card Table
  wsMain.mergeCells(`A${r}:G${r}`);
  const sumHeader = wsMain.getCell(`A${r}`);
  sumHeader.value = 'EXECUTIVE ONBOARDING SUMMARY';
  sumHeader.font = { name: 'Calibri', size: 11, bold: true, color: { argb: PALETTE.categoryText } };
  sumHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
  sumHeader.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  wsMain.getRow(r).height = 24;
  r += 1;

  const kpis = [
    ['Tenant Legal Name', tenant?.name || '—', 'Overall Readiness Score', `${evaluation.overallPercentage}% (${evaluation.completedItems}/${evaluation.totalItems} Items)`],
    ['Primary Contact', `${tenant?.contactDetails?.phone || '—'} / ${tenant?.contactDetails?.email || '—'}`, 'Required Fields Readiness', `${evaluation.requiredPercentage}% (${evaluation.requiredCompleted}/${evaluation.requiredTotal} Fulfilled)`],
    ['Operating Fleet Mode', tenant?.config?.vehicle?.vehicleMode || 'both', 'Recommended Fields Readiness', `${Math.round((evaluation.recommendedCompleted / (evaluation.recommendedTotal || 1)) * 100)}% (${evaluation.recommendedCompleted}/${evaluation.recommendedTotal} Set)`],
    ['Subscription Plan', tenant?.subscription?.planName || 'Standard', 'Master Data Status', `${users.length} Users, ${stats?.counts?.vehicles ?? 0} Vehicles, ${stats?.counts?.customers ?? 0} Customers`],
  ];

  kpis.forEach(([label1, val1, label2, val2]) => {
    wsMain.mergeCells(`A${r}:B${r}`);
    wsMain.mergeCells(`C${r}:D${r}`);
    wsMain.mergeCells(`E${r}:E${r}`);
    wsMain.mergeCells(`F${r}:G${r}`);

    const c1 = wsMain.getCell(`A${r}`);
    c1.value = label1;
    c1.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF475569' } };
    c1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };

    const c2 = wsMain.getCell(`C${r}`);
    c2.value = val1;
    c2.font = { name: 'Calibri', size: 10.5, color: { argb: 'FF0F172A' } };

    const c3 = wsMain.getCell(`E${r}`);
    c3.value = label2;
    c3.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF475569' } };
    c3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };

    const c4 = wsMain.getCell(`F${r}`);
    c4.value = val2;
    c4.font = { name: 'Calibri', size: 10.5, bold: true, color: { argb: 'FF0F172A' } };

    [wsMain.getCell(`A${r}`), wsMain.getCell(`B${r}`), wsMain.getCell(`C${r}`), wsMain.getCell(`D${r}`), wsMain.getCell(`E${r}`), wsMain.getCell(`F${r}`), wsMain.getCell(`G${r}`)].forEach((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: PALETTE.borderLight } },
        bottom: { style: 'thin', color: { argb: PALETTE.borderLight } },
        left: { style: 'thin', color: { argb: PALETTE.borderLight } },
        right: { style: 'thin', color: { argb: PALETTE.borderLight } },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    });

    wsMain.getRow(r).height = 22;
    r += 1;
  });

  // Spacer
  r += 1;

  // Main Table Header
  const headers = ['#', 'Module / Category', 'Field / Parameter', 'Current Value / Setting', 'Requirement', 'Status', 'Where Visible & How It Is Used'];
  const headerCols = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  headerCols.forEach((col, idx) => {
    const cell = wsMain.getCell(`${col}${r}`);
    cell.value = headers[idx];
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.brandBlue } };
    cell.alignment = { vertical: 'middle', horizontal: idx === 0 ? 'center' : idx === 4 || idx === 5 ? 'center' : 'left', indent: idx === 0 ? 0 : 1 };
    cell.border = {
      top: { style: 'medium', color: { argb: PALETTE.brandBlue } },
      bottom: { style: 'medium', color: { argb: PALETTE.brandBlue } },
      left: { style: 'thin', color: { argb: 'FF475569' } },
      right: { style: 'thin', color: { argb: 'FF475569' } },
    };
  });
  wsMain.getRow(r).height = 26;
  r += 1;

  // Rows by category
  let currentCategory = '';
  let rowIdx = 1;

  evaluation.items.forEach((item) => {
    if (item.category !== currentCategory) {
      currentCategory = item.category;

      wsMain.mergeCells(`A${r}:G${r}`);
      const catCell = wsMain.getCell(`A${r}`);
      catCell.value = currentCategory.toUpperCase();
      catCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: PALETTE.categoryText } };
      catCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALETTE.categoryBg } };
      catCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
      catCell.border = {
        top: { style: 'thin', color: { argb: PALETTE.borderDark } },
        bottom: { style: 'thin', color: { argb: PALETTE.borderDark } },
        left: { style: 'thin', color: { argb: PALETTE.borderDark } },
        right: { style: 'thin', color: { argb: PALETTE.borderDark } },
      };
      wsMain.getRow(r).height = 24;
      r += 1;
    }

    const isEven = rowIdx % 2 === 0;
    const baseBg = isEven ? PALETTE.zebraBg : PALETTE.white;

    const row = wsMain.getRow(r);
    row.height = 24;

    const cellA = wsMain.getCell(`A${r}`);
    cellA.value = rowIdx;
    cellA.alignment = { vertical: 'middle', horizontal: 'center' };
    cellA.font = { name: 'Calibri', size: 10, color: { argb: 'FF64748B' } };

    const cellB = wsMain.getCell(`B${r}`);
    cellB.value = item.category;
    cellB.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    cellB.font = { name: 'Calibri', size: 10, color: { argb: 'FF334155' } };

    const cellC = wsMain.getCell(`C${r}`);
    cellC.value = item.name;
    cellC.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    cellC.font = { name: 'Calibri', size: 10.5, bold: true, color: { argb: 'FF0F172A' } };

    const cellD = wsMain.getCell(`D${r}`);
    cellD.value = item.value;
    cellD.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
    cellD.font = {
      name: 'Calibri',
      size: 10,
      italic: !item.isFilled,
      color: { argb: item.isFilled ? 'FF0F172A' : 'FF94A3B8' },
    };

    const cellE = wsMain.getCell(`E${r}`);
    cellE.value = item.requirement;
    cellE.alignment = { vertical: 'middle', horizontal: 'center' };
    cellE.font = {
      name: 'Calibri',
      size: 9.5,
      bold: item.requirement === REQUIREMENT_LEVEL.REQUIRED,
      color: {
        argb:
          item.requirement === REQUIREMENT_LEVEL.REQUIRED
            ? 'FFB91C1C'
            : item.requirement === REQUIREMENT_LEVEL.RECOMMENDED
            ? 'FFB45309'
            : 'FF475569',
      },
    };

    const cellF = wsMain.getCell(`F${r}`);
    cellF.value = item.isFilled ? 'COMPLETED' : item.requirement === REQUIREMENT_LEVEL.REQUIRED ? 'MISSING (REQ)' : 'PENDING';
    cellF.alignment = { vertical: 'middle', horizontal: 'center' };

    let statusBg = PALETTE.pendingBg;
    let statusText = PALETTE.pendingText;

    if (item.isFilled) {
      statusBg = PALETTE.successBg;
      statusText = PALETTE.successText;
    } else if (item.requirement === REQUIREMENT_LEVEL.OPTIONAL) {
      statusBg = 'FFF1F5F9';
      statusText = 'FF64748B';
    }

    cellF.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: statusBg } };
    cellF.font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: statusText } };

    const cellG = wsMain.getCell(`G${r}`);
    cellG.value = item.notes;
    cellG.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
    cellG.font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };

    headerCols.forEach((col) => {
      const cell = wsMain.getCell(`${col}${r}`);
      if (col !== 'F') {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: baseBg } };
      }
      cell.border = {
        top: { style: 'thin', color: { argb: PALETTE.borderLight } },
        bottom: { style: 'thin', color: { argb: PALETTE.borderLight } },
        left: { style: 'thin', color: { argb: PALETTE.borderLight } },
        right: { style: 'thin', color: { argb: PALETTE.borderLight } },
      };
    });

    rowIdx += 1;
    r += 1;
  });

  r += 1;
  wsMain.mergeCells(`A${r}:G${r}`);
  const footerCell = wsMain.getCell(`A${r}`);
  footerCell.value = 'Tranzit Multi-Tenant Logistics Management System  •  Confidential & Proprietary';
  footerCell.font = { name: 'Calibri', size: 9, italic: true, color: { argb: 'FF94A3B8' } };
  footerCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // 2. Build Additional Configuration Sheets
  buildExpenseConfigSheet(workbook, tenant);
  buildSubtripConfigSheet(workbook, tenant);
  buildVehicleConfigSheet(workbook, tenant);
  buildInvoiceConfigSheet(workbook, tenant);
  buildTransporterConfigSheet(workbook, tenant);
  buildAccountingConfigSheet(workbook, tenant);

  // Write and download
  const buffer = await workbook.xlsx.writeBuffer();
  const safeName = (tenant?.name || 'Tenant').replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `Onboarding_Tracker_${safeName}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  saveAs(new Blob([buffer]), fileName);
}
