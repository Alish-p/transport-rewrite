import { Controller, useFormContext } from 'react-hook-form';

import { Card, Grid, Button, FormHelperText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { useClosedTripsByCustomerAndDate } from 'src/query/use-subtrip';

import { Iconify } from 'src/components/iconify';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker/custom-date-range-picker';

import { KanbanCustomerDialog } from '../kanban/components/kanban-customer-dialog';
import KanbanSubtripMultiSelectDialog from '../kanban/components/kanban-subtrip-multi-select-dialog';

function FieldWrapper({ children, error, md = 3 }) {
  return (
    <Grid item xs={12} md={md}>
      {children}
      {error && <FormHelperText error>{error}</FormHelperText>}
    </Grid>
  );
}

export default function InvoiceForm({ customerList }) {
  const { control, setValue, getValues, watch } = useFormContext();

  const billingPeriod = getValues('billingPeriod');
  const subtripIds = getValues('subtripIds');
  const customerId = getValues('customerId');

  // Dialogs for selecting
  const customerDialog = useBoolean();
  const subtripsDialog = useBoolean();
  const dateRangeDialog = useBoolean();

  const selectedCustomer = customerList.find((c) => c._id === customerId);

  // Fetch subtrips when customer and dates are selected
  const { data: availableSubtrips = [], refetch: fetchSubtrips } = useClosedTripsByCustomerAndDate(
    customerId,
    billingPeriod?.start,
    billingPeriod?.end
  );

  const handleFetchSubtrips = () => {
    if (!customerId || !billingPeriod?.start || !billingPeriod?.end) {
      return;
    }
    fetchSubtrips();
  };

  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2}>
        {/* Customer Selector */}
        <FieldWrapper error={!!control._formState?.errors?.customerId}>
          <Controller
            name="customerId"
            control={control}
            render={({ field }) => (
              <>
                <DialogSelectButton
                  placeholder="Select Customer *"
                  selected={selectedCustomer?.customerName}
                  onClick={customerDialog.onTrue}
                  error={!!field.error}
                  iconName="mdi:office-building"
                />
                <KanbanCustomerDialog
                  open={customerDialog.value}
                  onClose={customerDialog.onFalse}
                  onCustomerChange={(customer) => {
                    setValue('customerId', customer._id, { shouldValidate: true });
                  }}
                  selectedCustomer={selectedCustomer}
                />
              </>
            )}
          />
        </FieldWrapper>

        {/* Billing Period Selector */}
        <FieldWrapper md={2} error={!!control._formState?.errors?.billingPeriod}>
          <DialogSelectButton
            placeholder="Select Date Range *"
            selected={
              billingPeriod.start && billingPeriod.end
                ? fDateRangeShortLabel(billingPeriod.start, billingPeriod.end)
                : 'Select Date Range'
            }
            onClick={dateRangeDialog.onTrue}
            error={!!control._formState?.errors?.billingPeriod}
            iconName="mdi:calendar"
          />
          <CustomDateRangePicker
            open={dateRangeDialog.value}
            onClose={dateRangeDialog.onFalse}
            startDate={billingPeriod.start}
            endDate={billingPeriod.end}
            onChangeStartDate={(date) => setValue('billingPeriod.start', date)}
            onChangeEndDate={(date) => setValue('billingPeriod.end', date)}
            error={!!control._formState?.errors?.billingPeriod}
          />
        </FieldWrapper>

        {/* Fetch Subtrips Button */}
        <FieldWrapper md={1}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ height: 56, justifyContent: 'flex-start', typography: 'body2' }}
            onClick={handleFetchSubtrips}
            disabled={!customerId || !billingPeriod?.start || !billingPeriod?.end}
            startIcon={<Iconify icon="mdi:pointer" />}
          >
            Fetch Subtrips
          </Button>
        </FieldWrapper>

        {/* Subtrip Selector */}
        <FieldWrapper md={6} error={!!control._formState?.errors?.subtripIds}>
          <Controller
            name="subtripIds"
            control={control}
            render={({ field }) => (
              <>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    height: 56,
                    justifyContent: 'flex-start',
                    typography: 'body2',
                  }}
                  onClick={subtripsDialog.onTrue}
                  disabled={availableSubtrips.length === 0}
                  startIcon={
                    <Iconify
                      icon={field.value.length > 0 ? 'mdi:check' : 'mdi:check-outline'}
                      sx={{ color: field.value.length > 0 ? 'primary.main' : 'text.disabled' }}
                    />
                  }
                >
                  {field.value.length > 0
                    ? `${field.value.length} subtrips selected`
                    : 'Select Subtrips'}
                </Button>

                <KanbanSubtripMultiSelectDialog
                  open={subtripsDialog.value}
                  onClose={subtripsDialog.onFalse}
                  subtrips={availableSubtrips}
                  selectedSubtrips={field.value}
                  onChange={(selected) => field.onChange(selected)}
                  title="Select Subtrips for Invoice"
                />
              </>
            )}
          />
        </FieldWrapper>
      </Grid>
    </Card>
  );
}
