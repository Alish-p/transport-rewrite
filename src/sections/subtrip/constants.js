export const SUBTRIP_STATUS = {
  IN_QUEUE: 'in-queue',
  LOADED: 'loaded',
  RECEIVED: 'received',
  ERROR: 'error',
  CLOSED: 'closed',
  BILLED: 'billed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const SUBTRIP_STATUS_COLORS = {
  'in-queue': 'warning',
  loaded: 'info',
  received: 'info',
  error: 'error',
  closed: 'secondary',
  billed: 'primary',
  completed: 'success',
  cancelled: 'error',
};
