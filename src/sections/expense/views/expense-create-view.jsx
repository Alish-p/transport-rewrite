import ExpenseNewForm from '../expense-form';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

export function ExpenseCreateView({ subtrips, vehicles }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add New Expense"
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
