

export const SUBTRIP_STATUS_COLORS = {
  'in-queue': 'warning',
  loaded: 'info',
  received: 'primary',
  error: 'error',
  closed: 'secondary',
  'billed-pending': 'warning',
  'billed-overdue': 'error',
  'billed-paid': 'success',
};

export const SUBTRIP_STATUS = {
  IN_QUEUE: 'in-queue', // When the consignment is created and assigned a vehicle, waiting for loading
  LOADED: 'loaded', // When the vehicle is fully loaded and has left for delivery
  ERROR: 'error', // When there is a problem with documents or other issues
  RECEIVED: 'received', // When the consignment is successfully received at the destination
  BILLED_PENDING: 'billed-pending', // When the invoice is generated but pending payment
  BILLED_OVERDUE: 'billed-overdue', // When the invoice is overdue and not yet paid
  BILLED_PAID: 'billed-paid', // When the invoice is fully paid
};

export const DRIVER_ADVANCE_GIVEN_BY_OPTIONS = {
  SELF: 'Self',
  FUEL_PUMP: 'Fuel Pump',
};
