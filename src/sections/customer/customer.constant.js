export const CUSTOMER_TYPE = {
  CONSIGNOR: 'consignor',
  CONSIGNEE: 'consignee',
  TRANSPORTER: 'transporter',
};

export const CUSTOMER_TYPE_LABELS = {
  consignor: 'Consignor',
  consignee: 'Consignee',
  transporter: 'Transporter',
};

export const CUSTOMER_TYPE_COLORS = {
  consignor: 'info',
  consignee: 'warning',
  transporter: 'success',
};

export const CUSTOMER_TYPE_OPTIONS = [
  { value: 'consignor', label: 'Consignor', color: 'info' },
  { value: 'consignee', label: 'Consignee', color: 'warning' },
  { value: 'transporter', label: 'Transporter', color: 'success' },
];
