// @mui
// mock data
import { useState } from 'react';
// components
import { useNavigate } from 'react-router';

import { Box, Grid, Card, Stack, Button, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import LRInfo from '../widgets/subtrip-info-widget';
import SimpleExpenseList from '../basic-expense-table';
import SubtripToolbar from '../subtrip-detail-toolbar';
import InsightsWidget from '../widgets/insights-widget';
import AnalyticsWidgetSummary from '../widgets/summary-widget';
import { ExpenseChart } from '../widgets/expense-chart-widget';
import IncomeWidgetSummary from '../widgets/income-expense-widget';
import { SubtripCloseDialog } from '../subtrip-close-dialogue-form';
import { SUBTRIP_EXPENSE_TYPES } from '../../expense/expense-config';
import { SubtripTimeline } from '../widgets/subtrip-timeline-widget';
import { RecieveSubtripDialog } from '../subtrip-recieve-dialogue-form';
import { AddExpenseDialog } from '../subtrip-add-expense-dialogue-form';
import { ResolveSubtripDialog } from '../subtrip-resolve-dialogue-form';
import { SubtripStatusStepper } from '../widgets/subtrip-status-stepper';
import { mapExpensesToChartData, generateInsightsForSubtrip } from '../utils';
import { SubtripMaterialInfoDialog } from '../subtrip-material-info-dialogue-form';

// ----------------------------------------------------------------------

export function SubtripDetailView({ subtrip }) {
  const navigate = useNavigate();

  // State for dialog visibility
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [showRecieveDialog, setShowRecieveDialog] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);

  const totalExpenses = subtrip?.expenses?.reduce((sum, expense) => sum + expense.amount, 0);
  const totalDieselLtr = subtrip?.expenses?.reduce(
    (sum, expense) =>
      sum + (expense.expenseType === SUBTRIP_EXPENSE_TYPES.DIESEL ? expense.dieselLtr : 0),
    0
  );
  const totalAdblueLtr = subtrip?.expenses?.reduce(
    (sum, expense) =>
      sum + (expense.expenseType === SUBTRIP_EXPENSE_TYPES.DIESEL ? expense.dieselLtr : 0),
    0
  );
  const expenseChartData = mapExpensesToChartData(subtrip?.expenses);

  const insights = generateInsightsForSubtrip(subtrip);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Subtrip Dashboard"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: `${subtrip.tripId._id ?? 'Trip Dashboard'}`,
              href: paths.dashboard.trip.details(subtrip.tripId._id),
            },
            { name: `${subtrip._id ?? 'Subtrip Dashboard'}` },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <SubtripToolbar
          backLink={paths.dashboard.trip.details(subtrip.tripId._id)}
          tripId={subtrip.tripId._id}
          status={subtrip.subtripStatus}
          subtrip={subtrip}
          onAddMaterialInfo={() => setShowMaterialDialog(true)}
          onRecieve={() => setShowRecieveDialog(true)}
          onEdit={() => {
            navigate(paths.dashboard.subtrip.edit(subtrip._id));
          }}
          onResolve={() => setShowResolveDialog(true)}
          onSubtripClose={() => setShowCloseDialog(true)}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Stack spacing={3} direction={{ xs: 'column', md: 'column' }}>
              <SubtripStatusStepper status={subtrip?.subtripStatus} />

              <InsightsWidget insights={insights} />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <IncomeWidgetSummary
                  title="Income"
                  type="income"
                  color="primary"
                  icon="eva:diagonal-arrow-right-up-fill"
                  total={subtrip.rate * subtrip.loadingWeight || 0}
                  chart={{
                    series: [7, 208, 76, 48, 74, 54, 157, 84],
                  }}
                />
                <IncomeWidgetSummary
                  title="Expenses"
                  type="expense"
                  color="warning"
                  icon="eva:diagonal-arrow-right-up-fill"
                  total={-totalExpenses || 0}
                  chart={{
                    series: [7, 208, 76, 48, 74, 54, 157, 84],
                  }}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <AnalyticsWidgetSummary
                  title="Total Diesel Liters"
                  total={totalDieselLtr || 0}
                  color="warning"
                  icon="ant-design:fire-filled"
                  sx={{ flexGrow: { xs: 0, sm: 1 }, flexBasis: { xs: 'auto', sm: 0 } }}
                />
                <AnalyticsWidgetSummary
                  title="Total Adblue Liters"
                  total={subtrip.detentionTime || 0}
                  color="info"
                  icon="ant-design:clock-circle-filled"
                  sx={{ flexGrow: { xs: 0, sm: 1 }, flexBasis: { xs: 'auto', sm: 0 } }}
                />
                <AnalyticsWidgetSummary
                  title={`${subtrip.subtripStatus.toUpperCase()}`}
                  total={subtrip.subtripStatus || '0'}
                  color={subtrip.subtripStatus === 'completed' ? 'error' : 'error'}
                  icon="ant-design:check-circle-filled"
                  sx={{ flexGrow: { xs: 0, sm: 1 }, flexBasis: { xs: 'auto', sm: 0 } }}
                />
              </Stack>
              <Grid item>
                <Card sx={{ minHeight: 400 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 3,
                      px: 3,
                    }}
                  >
                    <CardHeader title="Expense List" subheader="Detail of Expenses" />
                    <Button variant="contained" onClick={() => setShowExpenseDialog(true)}>
                      New Expense
                    </Button>
                  </Box>
                  <SimpleExpenseList expenses={subtrip?.expenses || []} />
                </Card>
              </Grid>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <ExpenseChart
                  title="Expense Details"
                  chart={{
                    series: expenseChartData || [],
                  }}
                  sx={{ flexGrow: { xs: 0, sm: 1 }, flexBasis: { xs: 'auto', sm: 0 } }}
                />
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4} gap={2}>
            <LRInfo subtrip={subtrip} />
            <SubtripTimeline events={subtrip?.events || []} />
          </Grid>

          <Grid item xs={12} md={6} lg={4} />
        </Grid>
      </DashboardContent>

      {/* Add Material Dialogue Form */}
      <SubtripMaterialInfoDialog
        showDialog={showMaterialDialog}
        setShowDialog={setShowMaterialDialog}
        subtrip={subtrip}
      />

      {/* Render the RecieveSubtripDialog */}
      <RecieveSubtripDialog
        showDialog={showRecieveDialog}
        setShowDialog={setShowRecieveDialog}
        subtrip={subtrip}
      />

      {/* Resolve Subtrip Dialogue */}
      <ResolveSubtripDialog
        showDialog={showResolveDialog}
        setShowDialog={setShowResolveDialog}
        subtripId={subtrip._id}
      />

      {/* Resolve Subtrip Dialogue */}
      <SubtripCloseDialog
        showDialog={showCloseDialog}
        setShowDialog={setShowCloseDialog}
        subtripId={subtrip._id}
      />

      {/* Add Expense Dialog */}
      <AddExpenseDialog
        showDialog={showExpenseDialog}
        setShowDialog={setShowExpenseDialog}
        subtripData={subtrip}
      />
    </>
  );
}
