import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

import { Box, Grid, Stack, Button, Dialog, DialogActions } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import IndentPdf from 'src/pdfs/petrol-pump-indent';
import { DashboardContent } from 'src/layouts/dashboard';
import { useSubtripEvents } from 'src/query/use-subtrip-events';

import { Iconify } from 'src/components/iconify';
import { HeroHeader } from 'src/components/hero-header-card';

import { useTenantContext } from 'src/auth/tenant';

import { SUBTRIP_STATUS } from '../constants';
// PDFs
import LRPDF from '../pdfs/lorry-reciept-pdf';
import EntryPassPdf from '../pdfs/entry-pass-pdf';
import { mapExpensesToChartData } from '../utils';
import LRInfo from '../widgets/subtrip-info-widget';
import DriverPaymentPdf from '../pdfs/driver-payment-pdf';
import { SubtripTimeline } from '../widgets/subtrip-timeline';
import AnalyticsWidgetSummary from '../widgets/summary-widget';
import { ExpenseChart } from '../widgets/expense-chart-widget';
import TransporterPayment from '../pdfs/transporter-payment-pdf';
import IncomeWidgetSummary from '../widgets/income-expense-widget';
import { BasicExpenseTable } from '../widgets/basic-expense-table';
import { SubtripCloseDialog } from '../subtrip-close-dialogue-form';
import { SUBTRIP_EXPENSE_TYPES } from '../../expense/expense-config';
import { ResolveSubtripDialog } from '../subtrip-resolve-dialogue-form';
import { SubtripStatusStepper } from '../widgets/subtrip-status-stepper';
import { SubtripCloseEmptyDialog } from '../subtrip-close-empty-dialogue-form';
import { EmptySubtripStatusStepper } from '../widgets/empty-subtrip-status-stepper';

// ----------------------------------------------------------------------

export function SubtripDetailView({ subtrip }) {
  const navigate = useNavigate();

  // State for dialog visibility
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showCloseEmptyDialog, setShowCloseEmptyDialog] = useState(false);

  // Function to check if editing is allowed based on status
  const isEditingAllowed = () => {
    const restrictedStatuses = [SUBTRIP_STATUS.BILLED];
    return !restrictedStatuses.includes(subtrip.subtripStatus);
  };

  const { data: events = [] } = useSubtripEvents(subtrip._id);

  const totalExpenses = subtrip?.expenses?.reduce((sum, expense) => sum + expense.amount, 0);
  const totalDieselLtr = subtrip?.expenses?.reduce(
    (sum, expense) =>
      sum + (expense.expenseType === SUBTRIP_EXPENSE_TYPES.DIESEL ? expense.dieselLtr : 0),
    0
  );

  const expenseChartData = mapExpensesToChartData(subtrip?.expenses);

  // Route-based insights removed

  const { _id, subtripNo, vehicleId = {}, driverId = {}, subtripStatus } = subtrip;

  // Trip may be absent for Market vehicles; guard trip-dependent UI
  const hasTrip = Boolean(subtrip?.tripId?._id);

  const viewLR = useBoolean();
  const viewIntent = useBoolean();
  const viewEntryPass = useBoolean();
  const viewDriverPayment = useBoolean();
  const viewTransporterPayment = useBoolean();
  const tenant = useTenantContext();

  const hasDieselIntent = subtrip?.intentFuelPump;
  const hasEntryPass = subtrip?.diNumber;
  const hasTransporterPayment = !subtrip?.vehicleId?.isOwn;

  const getActions = () => {
    if (subtrip.isEmpty) {
      return [
        {
          label: 'Close Empty Job',
          action: () => setShowCloseEmptyDialog(true),
          disabled: !isEditingAllowed(),
        },
      ];
    }
    return [
      {
        label: 'Receive',
        action: () =>
          navigate(
            `${paths.dashboard.subtrip.receive}?currentSubtrip=${subtrip._id}&redirectTo=${encodeURIComponent(window.location.pathname)}`
          ),
        disabled: subtrip.subtripStatus !== SUBTRIP_STATUS.LOADED,
      },
      {
        label: 'Resolve',
        action: () => setShowResolveDialog(true),
        disabled: subtrip.subtripStatus !== SUBTRIP_STATUS.ERROR,
      },
    ];
  };

  return (
    <>
      <DashboardContent>
        <HeroHeader
          offsetTop={70}
          title={`Job #${subtripNo}`}
          status={subtripStatus}
          icon="mdi:routes"
          meta={[
            {
              icon: 'mdi:truck-outline',
              label: vehicleId?.vehicleNo,
              href: vehicleId?._id ? paths.dashboard.vehicle.details(vehicleId._id) : undefined,
            },
            {
              icon: 'mdi:account',
              label: driverId?.driverName,
              href: driverId?._id ? paths.dashboard.driver.details(driverId._id) : undefined,
            },
            // Show Trip only when associated (non-market vehicles)
            ...(hasTrip
              ? [
                  {
                    icon: 'mdi:routes',
                    label: `Trip #${subtrip.tripId.tripNo}`,
                    href: paths.dashboard.trip.details(subtrip.tripId._id),
                  },
                ]
              : []),
          ]}
          menus={[
            {
              label: 'Actions',
              icon: 'eva:settings-2-fill',
              items: getActions().map((a) => ({
                label: a.label,
                onClick: a.action,
                disabled: a.disabled,
              })),
            },
            {
              label: 'View',
              icon: 'solar:eye-bold',
              items: [
                {
                  label: 'Lorry Receipt (LR)',
                  icon: 'mdi:file-document-outline',
                  onClick: () => viewLR.onTrue(),
                  disabled: subtrip.subtripStatus === SUBTRIP_STATUS.IN_QUEUE,
                },
                hasDieselIntent && {
                  label: 'Petrol Pump Intent',
                  icon: 'mdi:file-document-outline',
                  onClick: () => viewIntent.onTrue(),
                  disabled: subtrip.subtripStatus === SUBTRIP_STATUS.IN_QUEUE,
                },
                hasEntryPass && {
                  label: 'Entry Pass',
                  icon: 'mdi:file-document-outline',
                  onClick: () => viewEntryPass.onTrue(),
                },
                {
                  label: 'Driver Payment',
                  icon: 'mdi:file-document-outline',
                  onClick: () => viewDriverPayment.onTrue(),
                  disabled: subtrip.subtripStatus === SUBTRIP_STATUS.IN_QUEUE,
                },
                hasTransporterPayment && {
                  label: 'Transporter Payment',
                  icon: 'mdi:file-document-outline',
                  onClick: () => viewTransporterPayment.onTrue(),
                  disabled: subtrip.subtripStatus === SUBTRIP_STATUS.IN_QUEUE,
                },
              ].filter(Boolean),
            },
            {
              label: 'Download',
              icon: 'material-symbols:download',
              items: [
                {
                  label: 'Lorry Receipt (LR)',
                  render: ({ close }) => (
                    <PDFDownloadLink
                      document={<LRPDF subtrip={subtrip} tenant={tenant} />}
                      fileName={`${subtrip.subtripNo}_lr.pdf`}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                      }}
                      onClick={() => setTimeout(close, 0)}
                    >
                      {({ loading }) => (
                        <>
                          <Iconify
                            icon={loading ? 'line-md:loading-loop' : 'eva:download-fill'}
                            sx={{ mr: 2 }}
                          />
                          Lorry Receipt (LR)
                        </>
                      )}
                    </PDFDownloadLink>
                  ),
                  disabled: subtrip.subtripStatus === SUBTRIP_STATUS.IN_QUEUE,
                },
                hasDieselIntent && {
                  label: 'Petrol Pump Indent',
                  render: ({ close }) => (
                    <PDFDownloadLink
                      document={<IndentPdf subtrip={subtrip} tenant={tenant} />}
                      fileName={`${subtrip.subtripNo}_indent.pdf`}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                      }}
                      onClick={() => setTimeout(close, 0)}
                    >
                      {({ loading }) => (
                        <>
                          <Iconify
                            icon={loading ? 'line-md:loading-loop' : 'eva:download-fill'}
                            sx={{ mr: 2 }}
                          />
                          Petrol Pump Indent
                        </>
                      )}
                    </PDFDownloadLink>
                  ),
                  disabled: subtrip.subtripStatus === SUBTRIP_STATUS.IN_QUEUE,
                },
                hasEntryPass && {
                  label: 'Entry Pass',
                  render: ({ close }) => (
                    <PDFDownloadLink
                      document={<EntryPassPdf subtrip={subtrip} tenant={tenant} />}
                      fileName={`${subtrip.subtripNo}_entry_pass.pdf`}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                      }}
                      onClick={() => setTimeout(close, 0)}
                    >
                      {({ loading }) => (
                        <>
                          <Iconify
                            icon={loading ? 'line-md:loading-loop' : 'eva:download-fill'}
                            sx={{ mr: 2 }}
                          />
                          Entry Pass
                        </>
                      )}
                    </PDFDownloadLink>
                  ),
                },
                {
                  label: 'Driver Payment',
                  render: ({ close }) => (
                    <PDFDownloadLink
                      document={<DriverPaymentPdf subtrip={subtrip} tenant={tenant} />}
                      fileName={`${subtrip.subtripNo}_driver_payment.pdf`}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                      }}
                      onClick={() => setTimeout(close, 0)}
                    >
                      {({ loading }) => (
                        <>
                          <Iconify
                            icon={loading ? 'line-md:loading-loop' : 'eva:download-fill'}
                            sx={{ mr: 2 }}
                          />
                          Driver Payment
                        </>
                      )}
                    </PDFDownloadLink>
                  ),
                  disabled: subtrip.subtripStatus === SUBTRIP_STATUS.IN_QUEUE,
                },
                hasTransporterPayment && {
                  label: 'Transporter Payment',
                  render: ({ close }) => (
                    <PDFDownloadLink
                      document={<TransporterPayment subtrip={subtrip} tenant={tenant} />}
                      fileName={`${subtrip.subtripNo}_transporter_payment.pdf`}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                      }}
                      onClick={() => setTimeout(close, 0)}
                    >
                      {({ loading }) => (
                        <>
                          <Iconify
                            icon={loading ? 'line-md:loading-loop' : 'eva:download-fill'}
                            sx={{ mr: 2 }}
                          />
                          Transporter Payment
                        </>
                      )}
                    </PDFDownloadLink>
                  ),
                  disabled: subtrip.subtripStatus === SUBTRIP_STATUS.IN_QUEUE,
                },
              ].filter(Boolean),
            },
          ]}
          actions={[
            {
              label: 'Edit',
              icon: 'solar:pen-bold',
              onClick: () => navigate(paths.dashboard.subtrip.edit(subtrip._id)),
              disabled: !isEditingAllowed(),
            },
          ]}
        />

        {/* PDF Viewers */}
        <Dialog fullScreen open={viewLR.value}>
          <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
            <DialogActions sx={{ p: 1.5 }}>
              <Button color="primary" variant="outlined" onClick={viewLR.onFalse}>
                Close
              </Button>
            </DialogActions>
            <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
              <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                <LRPDF subtrip={subtrip} tenant={tenant} />
              </PDFViewer>
            </Box>
          </Box>
        </Dialog>

        <Dialog fullScreen open={viewIntent.value}>
          <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
            <DialogActions sx={{ p: 1.5 }}>
              <Button color="primary" variant="outlined" onClick={viewIntent.onFalse}>
                Close
              </Button>
            </DialogActions>
            <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
              <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                <IndentPdf subtrip={subtrip} tenant={tenant} />
              </PDFViewer>
            </Box>
          </Box>
        </Dialog>

        <Dialog fullScreen open={viewEntryPass.value}>
          <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
            <DialogActions sx={{ p: 1.5 }}>
              <Button color="primary" variant="outlined" onClick={viewEntryPass.onFalse}>
                Close
              </Button>
            </DialogActions>
            <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
              <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                <EntryPassPdf subtrip={subtrip} tenant={tenant} />
              </PDFViewer>
            </Box>
          </Box>
        </Dialog>

        <Dialog fullScreen open={viewDriverPayment.value}>
          <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
            <DialogActions sx={{ p: 1.5 }}>
              <Button color="primary" variant="outlined" onClick={viewDriverPayment.onFalse}>
                Close
              </Button>
            </DialogActions>
            <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
              <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                <DriverPaymentPdf subtrip={subtrip} tenant={tenant} />
              </PDFViewer>
            </Box>
          </Box>
        </Dialog>

        <Dialog fullScreen open={viewTransporterPayment.value}>
          <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
            <DialogActions sx={{ p: 1.5 }}>
              <Button color="primary" variant="outlined" onClick={viewTransporterPayment.onFalse}>
                Close
              </Button>
            </DialogActions>
            <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
              <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                <TransporterPayment subtrip={subtrip} tenant={tenant} />
              </PDFViewer>
            </Box>
          </Box>
        </Dialog>

        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} md={8}>
            <Stack spacing={3} direction={{ xs: 'column', md: 'column' }}>
              {subtrip.isEmpty ? (
                <EmptySubtripStatusStepper status={subtrip?.subtripStatus} />
              ) : (
                <SubtripStatusStepper status={subtrip?.subtripStatus} />
              )}

              {/* Insights removed as route-based analysis is deprecated */}

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
                <BasicExpenseTable selectedSubtrip={subtrip} withAdd />
              </Grid>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <ExpenseChart
                  title="Expense Details"
                  chart={{
                    series: expenseChartData || [],
                  }}
                  sx={{ flexGrow: { xs: 0, sm: 1 }, flexBasis: { xs: 'auto', sm: 0 } }}
                  noDataMessage="No expenses recorded yet"
                />
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4} gap={2}>
            <LRInfo subtrip={subtrip} />

            <SubtripTimeline events={events} />
          </Grid>

          <Grid item xs={12} md={6} lg={4} />
        </Grid>
      </DashboardContent>

      {/* Resolve Subtrip Dialogue */}
      <ResolveSubtripDialog
        showDialog={showResolveDialog}
        setShowDialog={setShowResolveDialog}
        subtripId={subtrip._id}
      />

      {/* Close Subtrip Dialogue */}
      <SubtripCloseDialog
        showDialog={showCloseDialog}
        setShowDialog={setShowCloseDialog}
        subtripId={subtrip._id}
      />

      {/* Close Empty Subtrip Dialogue */}
      <SubtripCloseEmptyDialog
        showDialog={showCloseEmptyDialog}
        setShowDialog={setShowCloseEmptyDialog}
        subtripId={subtrip._id}
      />
    </>
  );
}
