import { EXPENSE_TYPES } from '../../constant';

export const mapExpensesToChartData = (expenses) => {
  const expenseData = EXPENSE_TYPES.map((type) => {
    const total = expenses
      .filter((expense) => expense.expenseType === type)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return { label: type, value: total };
  });

  return expenseData;
};
