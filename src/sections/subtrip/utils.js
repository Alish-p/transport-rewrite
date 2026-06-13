import { fNumber } from 'src/utils/format-number';

import { DEFAULT_SUBTRIP_EXPENSE_TYPES } from '../expense/expense-config';

export const mapExpensesToChartData = (items, expenseTypes = DEFAULT_SUBTRIP_EXPENSE_TYPES) => {
  if (!Array.isArray(items)) return [];
  const expenseData = expenseTypes.map((type) => {
    const total = items
      .filter((item) => (item.advanceType || item.expenseType) === type.label)
      .reduce((sum, item) => sum + (item.amount || 0), 0);
    return { label: type.label, value: total };
  });

  return expenseData;
};

export function fFreightRate(rate, model, freightAmount) {
  if (model === 'fixed') {
    return `Fixed (${fNumber(freightAmount || 0)} ₹)`;
  }
  if (model === 'hybrid') {
    return 'Hybrid';
  }
  if (model === 'per_km') {
    return `${fNumber(rate || 0)} ₹ / KM`;
  }
  if (model === 'per_hour') {
    return `${fNumber(rate || 0)} ₹ / Hr`;
  }
  if (model === 'per_ton') {
    return `${fNumber(rate || 0)} ₹ / Ton`;
  }
  if (rate !== undefined && rate !== null) {
    return `${fNumber(rate)} ₹`;
  }
  return '-';
}


