import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ExpenseForm from '../subtrip-expense-form';

// ----------------------------------------------------------------------

export function ExpenseEditView({ expense, subtrips, vehicles, pumps }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Expense"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Expenses List',
            href: paths.dashboard.expense.list,
          },
          { name: expense?.expenseType },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ExpenseForm currentExpense={expense} subtrips={subtrips} vehicles={vehicles} pumps={pumps} />
    </DashboardContent>
  );
}
