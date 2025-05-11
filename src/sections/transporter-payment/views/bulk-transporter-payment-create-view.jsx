// src/sections/transporter-payment/views/bulk-transporter-payment-create-view.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, Stack, Alert, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateRangeShortLabel } from 'src/utils/format-time';
import { calculateTransporterPaymentSummary } from 'src/utils/utils';

import { DashboardContent } from 'src/layouts/dashboard';
import { useSubtripsByTransporter } from 'src/query/use-subtrip';

import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import BulkTransporterPaymentPreview from '../bulk-transporter-payment-preview';

export function BulkTransporterPaymentCreateView() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const { data: transporterDataList, isLoading } = useSubtripsByTransporter(
    dateRange.startDate,
    dateRange.endDate
  );

  const dateRangeDialog = useBoolean();

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const handleGeneratePayments = async () => {
    // TODO: Implement bulk payment generation
    // This will be implemented when we create the bulk payment generation API
  };

  const hasAnyNegativeAmount = transporterDataList?.some((data) => {
    const { netIncome } = calculateTransporterPaymentSummary({
      associatedSubtrips: data.subtrips,
      selectedLoans: data.loans,
      transporterId: data.transporterId,
    });
    return netIncome * (1 - (data.transporterId?.tdsPercentage || 0) / 100) < 0;
  });

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create Bulk Transporter Payment"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Transporter Payment', href: paths.dashboard.transporterPayment.root },
          { name: 'Bulk Create' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ p: 3, mb: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Select Date Range</Typography>

          <DialogSelectButton
            placeholder="Select Date Range *"
            selected={
              dateRange.startDate && dateRange.endDate
                ? fDateRangeShortLabel(dateRange.startDate, dateRange.endDate)
                : 'Select Date Range'
            }
            onClick={dateRangeDialog.onTrue}
            iconName="mdi:calendar"
            disabled={isLoading}
          />

          <CustomDateRangePicker
            variant="calendar"
            open={dateRangeDialog.value}
            onClose={dateRangeDialog.onFalse}
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onChangeStartDate={(date) => setDateRange({ ...dateRange, startDate: date })}
            onChangeEndDate={(date) => setDateRange({ ...dateRange, endDate: date })}
          />
          {dateRange.startDate && dateRange.endDate && (
            <Button
              variant="contained"
              onClick={handleGeneratePayments}
              disabled={hasAnyNegativeAmount || !transporterDataList?.length}
            >
              Generate All Payments
            </Button>
          )}
        </Stack>
      </Card>

      {isLoading ? (
        <LoadingScreen />
      ) : transporterDataList?.length > 0 ? (
        <BulkTransporterPaymentPreview
          transporterDataList={transporterDataList}
          dateRange={dateRange}
        />
      ) : dateRange.startDate && dateRange.endDate ? (
        <Alert severity="info">No transporter payments found for the selected date range.</Alert>
      ) : null}
    </DashboardContent>
  );
}
