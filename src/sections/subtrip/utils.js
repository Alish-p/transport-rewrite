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


