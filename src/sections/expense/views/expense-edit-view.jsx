import { Card, CardHeader, CardContent } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import SubtripExpenseForm from '../subtrip-expense-form';
import VehicleExpenseForm from '../vehicle-expense-form';

// ----------------------------------------------------------------------

export function ExpenseEditView({ expense, vehicles, pumps }) {
  const isVehicleExpense = expense?.expenseCategory === 'vehicle';

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={`Edit ${isVehicleExpense ? 'Vehicle Expense' : 'Subtrip Expense'}`}
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
      <Card sx={{}}>
        <CardHeader
          title={
            isVehicleExpense
              ? `Vehicle Detail - ${expense?.vehicleId?.vehicleNo}`
              : `Subtrip Detail - ${expense?.subtripId}`
          }
        />
        <CardContent sx={{ p: 3, mb: 5 }}>
          {isVehicleExpense ? (
            <VehicleExpenseForm currentExpense={expense} vehicles={vehicles} />
          ) : (
            <SubtripExpenseForm
              currentExpense={expense}
              fromDialog
              currentSubtrip={expense?.subtripId}
            />
          )}
        </CardContent>
      </Card>
    </DashboardContent>
  );
}
