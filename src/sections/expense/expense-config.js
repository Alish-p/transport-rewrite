
export const DEFAULT_SUBTRIP_EXPENSE_TYPES = [
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

export const DEFAULT_VEHICLE_EXPENSE_TYPES = [
  { label: 'Insurance', value: 'insurance' },
  { label: 'Permit', value: 'permit' },
  { label: 'Passing', value: 'passing' },
  { label: 'Tyre', value: 'tyre' },
  { label: 'Major Repair', value: 'major-repair' },
  { label: 'Fitness Certificate', value: 'fitness-certificate' },
  { label: 'Over-Load Fees', value: 'over-load-fees' },

  { label: 'Electrical Work', value: 'electrical-work' },
  { label: 'Mechanical Work', value: 'mechanical-work' },
  { label: 'Phata Work', value: 'phata-work' },
  { label: 'Body Work', value: 'body-work' },
  { label: 'Minor Engine Work', value: 'minor-engine-work' },
  { label: 'Major Engine Work', value: 'major-engine-work' },
  { label: 'Outside Garage Expense', value: 'outside-garage-expense' },
  { label: 'Showroom Expence', value: 'showroom-expence' },
  { label: 'Other', value: 'other' },
];

// Standard set of payment methods for consistency across forms
export const DEFAULT_PAYMENT_METHODS = [
  { label: 'Cash', value: 'Cash' },
  { label: 'Bank Transfer', value: 'Bank Transfer' },
  { label: 'Credit Card', value: 'Credit Card' },
  { label: 'Debit Card', value: 'Debit Card' },
  { label: 'UPI (Google Pay, PhonePe, Paytm, etc.)', value: 'UPI' },
  { label: 'Cheque', value: 'Cheque' },
  { label: 'Other', value: 'Other' },
];

export function useSubtripExpenseTypes() {
  return DEFAULT_SUBTRIP_EXPENSE_TYPES;
}

export function useVehicleExpenseTypes() {
  return DEFAULT_VEHICLE_EXPENSE_TYPES;
}

export function usePaymentMethods() {
  return DEFAULT_PAYMENT_METHODS;
}

export const SUBTRIP_EXPENSE_TYPES = {
  DIESEL: 'diesel',
  ADBLUE: 'adblue',
  DRIVER_SALARY: 'driver-salary',
  DRIVER_ADVANCE: 'trip-advance',
  EXTRA_ADVANCE: 'trip-extra-advance',
  BHATTA: 'bhatta',
  TYRE_PUNCHER: 'puncher',
  TYRE_EXPENSE: 'tyre-expense',
  POLICE: 'police',
  RTO: 'rto',
  TOLL: 'toll',
  VEHICLE_REPAIR: 'vehicle-repair',
  GREASING: 'greasing',
  EXCISE: 'excise',
  OTHER: 'other',
};
