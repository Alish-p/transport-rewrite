import { useState } from 'react';

import { Card, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ExpenseCoreForm from '../expense-core-form';
import SubtripsSelector from '../subtrips-selector';

export function SubtripExpenseCreateView({ subtrips, pumps }) {
  const [currentSubtrip, setCurrentSubtrip] = useState({
    _id: '',
    routeCd: { routeName: 'None' },
    loadingPoint: '',
    unloadingPoint: '',
  });

  console.log({ currentSubtrip });

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

      <SubtripsSelector
        subtrips={subtrips}
        currentSubtrip={currentSubtrip}
        onChangeSubtrip={(subtrip) => {
          setCurrentSubtrip(subtrip);
        }}
      />
      <Card sx={{ p: 3, mb: 5 }}>
        {currentSubtrip?._id ? (
          <ExpenseCoreForm currentSubtrip={currentSubtrip} pumps={pumps} />
        ) : (
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Please Select Subtrip to Add Expense
          </Typography>
        )}
      </Card>
    </DashboardContent>
  );
}
