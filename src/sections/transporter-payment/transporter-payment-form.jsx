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
    }
  }, [transporterId, billingPeriod?.start, billingPeriod?.end, fetchSubtrips]);

  // When subtrips load, auto select them if transporter/date changed
  useEffect(() => {
    if (availableSubtrips.length) {
      setValue(
        'associatedSubtrips',
        availableSubtrips.map((st) => st._id),
        { shouldValidate: true }
      );
    } else if (transporterId || billingPeriod?.start || billingPeriod?.end) {
      setValue('associatedSubtrips', [], { shouldValidate: true });
    }
  }, [availableSubtrips, transporterId, billingPeriod?.start, billingPeriod?.end, setValue]);

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
                  iconName="mingcute:add-line"
                  iconNameSelected="mdi:truck"
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
