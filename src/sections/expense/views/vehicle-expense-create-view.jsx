import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ExpenseNewForm from '../vehicle-expense-form';

export function VehicleExpenseCreateView({ vehicles }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add New Expense to Vehicle"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Expenses List', href: paths.dashboard.expense.list },
          { name: 'Add New Expense' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ExpenseNewForm vehicles={vehicles} />
    </DashboardContent>
  );
}
