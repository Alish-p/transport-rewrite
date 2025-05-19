// src/sections/transporter-payment/views/bulk-transporter-payment-create-view.jsx
import { useState } from 'react';

import { Card, Stack, Alert, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { useSubtripsByTransporter } from 'src/query/use-subtrip';

import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import BulkTransporterPaymentPreview from '../bulk-transporter-payment-preview';

export function BulkTransporterPaymentCreateView() {
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
  });

  const { data: transporterDataList, isLoading } = useSubtripsByTransporter(
    dateRange.start,
    dateRange.end
  );

  const dateRangeDialog = useBoolean();

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
              dateRange.start && dateRange.end
                ? fDateRangeShortLabel(dateRange.start, dateRange.end)
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
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChangeStartDate={(date) => setDateRange({ ...dateRange, start: date })}
            onChangeEndDate={(date) => setDateRange({ ...dateRange, end: date })}
          />
        </Stack>
      </Card>

      {isLoading ? (
        <LoadingScreen />
      ) : transporterDataList?.length > 0 ? (
        <BulkTransporterPaymentPreview
          transporterDataList={transporterDataList}
          dateRange={dateRange}
        />
      ) : dateRange.start && dateRange.end ? (
        <Alert severity="info">No transporter payments found for the selected date range.</Alert>
      ) : null}
    </DashboardContent>
  );
}
