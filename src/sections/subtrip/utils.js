export const mapExpensesToChartData = (expenses) => {
  const expenseTypes = [
    'all',
    'diesel',
    'adblue',
    'driver-salary',
    'trip-advance',
    'trip-extra-advance',
    'puncher',
    'tyre-expense',
    'police',
    'rto',
    'toll',
    'vehicle-repair',
    'other',
  ];

  const expenseData = expenseTypes.map((type) => {
    const total = expenses
      .filter((expense) => expense.expenseType === type)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return { label: type, value: total };
  });

  return expenseData;
};
