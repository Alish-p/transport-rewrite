import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ExpenseNewForm from '../subtrip-expense-form';

export function SubtripExpenseCreateView({ subtrips, vehicles }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add New Expense to Subtrip"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Expenses List', href: paths.dashboard.expense.list },
          { name: 'Add New Expense' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ExpenseNewForm subtrips={subtrips} vehicles={vehicles} />
    </DashboardContent>
  );
}
