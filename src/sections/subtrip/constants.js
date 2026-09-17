export const SUBTRIP_STATUS_COLORS = {
  'in-queue': 'warning',
  loaded: 'info',
  received: 'primary',
  error: 'error',
  closed: 'secondary',
  billed: 'success',
  cancelled: 'default',
};

export const SUBTRIP_STATUS = {
  IN_QUEUE: 'in-queue', // When the consignment is created and assigned a vehicle, waiting for loading
  LOADED: 'loaded', // When the vehicle is fully loaded and has left for delivery
  ERROR: 'error', // When there is a problem with documents or other issues
  RECEIVED: 'received', // When the consignment is successfully received at the destination
  BILLED: 'billed', // When the invoice is generated but pending payment
  CANCELLED: 'cancelled', // When the job is cancelled
};

export const DRIVER_ADVANCE_GIVEN_BY_OPTIONS = {
  SELF: 'Self',
  FUEL_PUMP: 'Fuel Pump',
};

export const FREIGHT_MODEL_OPTIONS = [
  { value: 'per_ton', label: 'Per Ton' },
  { value: 'per_kl', label: 'Per KL' },
  { value: 'fixed', label: 'Fixed' },
  { value: 'per_km', label: 'Per KM' },
  { value: 'per_hour', label: 'Per Hour' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'to_be_billed', label: 'To Be Billed Later' },
];

export const CONCRETE_FREIGHT_MODEL_OPTIONS = FREIGHT_MODEL_OPTIONS.filter(
  (opt) => opt.value !== 'to_be_billed'
);

export const QUANTITY_UNIT_OPTIONS = [
  { value: 'bags', label: 'Bags' },
  { value: 'box', label: 'Box' },
  { value: 'loose', label: 'Loose' },
  { value: 'other', label: 'Other' },
];

export const getQuantityUnitLabel = (unit, defaultLabel = 'Bags') => {
  if (!unit) return defaultLabel;
  const match = QUANTITY_UNIT_OPTIONS.find(
    (opt) => opt.value.toLowerCase() === String(unit).toLowerCase()
  );
  if (match) return match.label;
  return 'Other';
};
