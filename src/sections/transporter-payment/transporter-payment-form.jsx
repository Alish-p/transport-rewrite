/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Card, Grid, Alert, Button, FormHelperText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { useFetchSubtripsForTransporterBilling } from 'src/query/use-subtrip';

import { Iconify } from 'src/components/iconify';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker/custom-date-range-picker';

import { KanbanTransporterDialog } from '../kanban/components/kanban-transporter-dialog';
import KanbanSubtripMultiSelectDialog from '../kanban/components/kanban-subtrip-multi-select-dialog';

/** Reusable Field Wrapper */
const FieldWrapper = ({ children, error, md = 3 }) => (
  <Grid item xs={12} md={md}>
    {children}
    {error && <FormHelperText error>{error}</FormHelperText>}
  </Grid>
);

/** Main Component */
export default function TransporterPaymentForm({ transporterList }) {
  const { control, setValue, watch, reset } = useFormContext();

  // Watch values for reactive logic
  const transporterId = watch('transporterId');
  const billingPeriod = watch('billingPeriod');
  const associatedSubtrips = watch('associatedSubtrips');

  const isDirty =
    transporterId || billingPeriod?.start || billingPeriod?.end || associatedSubtrips?.length > 0;

  const selectedTransporter = transporterList?.find((t) => t._id === transporterId);

  // Dialog states
  const transporterDialog = useBoolean();
  const subtripsDialog = useBoolean();
  const dateRangeDialog = useBoolean();

  // Fetch subtrips
  const {
    data: availableSubtrips = [],
    refetch: fetchSubtrips,
    isLoading: isLoadingSubtrips,
    error: subtripsError,
  } = useFetchSubtripsForTransporterBilling(
    transporterId,
    billingPeriod?.start,
    billingPeriod?.end
  );

  // Auto-fetch subtrips when transporter or billing period changes
  useEffect(() => {
    if (transporterId && billingPeriod?.start && billingPeriod?.end) {
      fetchSubtrips();
      setValue('associatedSubtrips', [], { shouldValidate: true });
    }
  }, [transporterId, billingPeriod?.start, billingPeriod?.end, fetchSubtrips, setValue]);

  const handleReset = () => {
    reset({
      transporterId: '',
      billingPeriod: { start: null, end: null },
      associatedSubtrips: [],
    });
  };

  return (
    <Card sx={{ p: 3, mb: 3 }}>
      {subtripsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading subtrips: {subtripsError.message}
        </Alert>
      )}
      <Grid container spacing={2}>
        {/* Transporter Selector */}
        <FieldWrapper error={!!control._formState?.errors?.transporterId}>
          <Controller
            name="transporterId"
            control={control}
            render={({ field }) => (
              <>
                <DialogSelectButton
                  placeholder="Select Transporter *"
                  selected={selectedTransporter?.transportName}
                  onClick={transporterDialog.onTrue}
                  error={!!field.error}
                  iconName="mdi:truck"
                  disabled={isLoadingSubtrips}
                />
                <KanbanTransporterDialog
                  open={transporterDialog.value}
                  onClose={transporterDialog.onFalse}
                  onTransporterChange={(transporter) => {
                    setValue('transporterId', transporter._id, { shouldValidate: true });
                  }}
                  selectedTransporter={selectedTransporter}
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
              billingPeriod?.start && billingPeriod?.end
                ? fDateRangeShortLabel(billingPeriod.start, billingPeriod.end)
                : 'Select Date Range'
            }
            onClick={dateRangeDialog.onTrue}
            error={!!control._formState?.errors?.billingPeriod}
            iconName="mdi:calendar"
            disabled={isLoadingSubtrips}
          />
          <CustomDateRangePicker
            variant="calendar"
            open={dateRangeDialog.value}
            onClose={dateRangeDialog.onFalse}
            startDate={billingPeriod?.start}
            endDate={billingPeriod?.end}
            onChangeStartDate={(date) =>
              setValue('billingPeriod.start', date, { shouldValidate: true })
            }
            onChangeEndDate={(date) =>
              setValue('billingPeriod.end', date, { shouldValidate: true })
            }
            error={!!control._formState?.errors?.billingPeriod}
          />
        </FieldWrapper>

        {/* Subtrip Selector */}
        <FieldWrapper md={6} error={!!control._formState?.errors?.associatedSubtrips}>
          <Controller
            name="associatedSubtrips"
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
                  disabled={availableSubtrips.length === 0 || isLoadingSubtrips}
                  startIcon={
                    <Iconify
                      icon={field.value.length > 0 ? 'mdi:check' : 'mdi:check-outline'}
                      sx={{ color: field.value.length > 0 ? 'primary.main' : 'text.disabled' }}
                    />
                  }
                >
                  {field.value.length > 0
                    ? `${field.value.length} subtrips selected`
                    : availableSubtrips.length > 0
                      ? 'Select Subtrips'
                      : 'No subtrips available'}
                </Button>

                <KanbanSubtripMultiSelectDialog
                  open={subtripsDialog.value}
                  onClose={subtripsDialog.onFalse}
                  subtrips={availableSubtrips}
                  selectedSubtrips={field.value}
                  onChange={(selected) => field.onChange(selected)}
                  title="Select Subtrips for Payment"
                />
              </>
            )}
          />
        </FieldWrapper>

        {/* Reset Button */}
        {isDirty && (
          <FieldWrapper md={1}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              sx={{ height: 56, justifyContent: 'flex-start', typography: 'body2' }}
              onClick={handleReset}
              startIcon={<Iconify icon="mdi:refresh" />}
            >
              Reset
            </Button>
          </FieldWrapper>
        )}
      </Grid>
    </Card>
  );
}
