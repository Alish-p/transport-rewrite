export const BORROWER_TYPES = [
  { key: 'Driver', label: 'Driver' },
  { key: 'Transporter', label: 'Transporter' },
];

export const LOAN_REASONS = {
  Driver: [
    { label: 'Advance for Trip', value: 'Advance for Trip' },
    { label: 'Medical Emergency', value: 'Medical Emergency' },
    { label: 'Personal Expense', value: 'Personal Expense' },
    { label: 'Vehicle Maintenance', value: 'Vehicle Maintenance' },
    { label: 'Challan / Fine', value: 'Challan / Fine' },
  ],
  Transporter: [
    { label: 'Advance Payment', value: 'Advance Payment' },
    { label: 'Fuel Advance', value: 'Fuel Advance' },
    { label: 'Toll Advance', value: 'Toll Advance' },
    { label: 'Operational Expense', value: 'Operational Expense' },
    { label: 'Repair & Maintenance', value: 'Repair & Maintenance' },
  ],
};

export const LOAN_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
};

export const LOAN_STATUS_COLOR = {
  active: 'warning',
  closed: 'success',
};
