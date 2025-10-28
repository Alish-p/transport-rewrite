import { DEFAULT_SUBTRIP_EXPENSE_TYPES } from '../expense/expense-config';

export const mapExpensesToChartData = (expenses, expenseTypes = DEFAULT_SUBTRIP_EXPENSE_TYPES) => {
  const expenseData = expenseTypes.map((type) => {
    const total = expenses
      .filter((expense) => expense.expenseType === type.label)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return { label: type.label, value: total };
  });

  return expenseData;
};


