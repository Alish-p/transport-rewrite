export const CUSTOMER_TYPE = {
  CONSIGNOR: 'consignor',
  CONSIGNEE: 'consignee',
  BOTH: 'both',
};

export const CUSTOMER_TYPE_LABELS = {
  consignor: 'Consignor',
  consignee: 'Consignee',
  both: 'Both',
};

export const CUSTOMER_TYPE_COLORS = {
  consignor: 'info',
  consignee: 'warning',
  both: 'primary',
};

export const CUSTOMER_TYPE_OPTIONS = [
  { value: 'consignor', label: 'Consignor', color: 'info' },
  { value: 'consignee', label: 'Consignee', color: 'warning' },
  { value: 'both', label: 'Both', color: 'primary' },
];
