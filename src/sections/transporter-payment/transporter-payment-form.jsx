/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  Card,
  Grid,
  Alert,
  Button,
  Divider,
  MenuItem,
  Typography,
  FormHelperText,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { useFetchSubtripsForTransporterBilling } from 'src/query/use-subtrip';

import { Field } from 'src/components/hook-form';
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

/** Transporter Dropdown */
const TransporterDropdown = ({ transportersList }) => (
  <Field.Select name="transporterId" label="Transporter">
    <MenuItem value="">None</MenuItem>
    <Divider sx={{ borderStyle: 'dashed' }} />
    {transportersList.map((transporter) => (
      <MenuItem key={transporter._id} value={transporter._id}>
        {transporter.transportName}
      </MenuItem>
    ))}
  </Field.Select>
);

/** Subtrips MultiSelect */
const SubtripsMultiSelect = ({ filteredSubtrips }) =>
  filteredSubtrips &&
  filteredSubtrips.length > 0 && (
    <Field.MultiSelect
      checkbox
      name="associatedSubtrips"
      label="Subtrips"
      options={filteredSubtrips.map((subtrip) => ({
        label: subtrip._id,
        value: subtrip._id,
      }))}
      sx={{ width: '100%' }}
    />
  );

const RenderRepaymentComponent = ({ loans }) => (
  <Grid container spacing={1} sx={{ m: 1, p: 1 }} key="index">
    <Field.MultiCheckbox
      column
      name="selectedLoans"
      label="Loans"
      options={loans?.map((loan) => ({
        label: `Total Amount: ₹${loan?.totalAmount} | Installment Amount: ${loan?.installmentAmount} | Remarks: ${loan?.remarks}`,
        value: loan._id,
      }))}
    />
  </Grid>
);

/** Main Component */
export default function TransporterPaymentForm({ transportersList, loans }) {
  const { control, setValue, getValues, watch, reset } = useFormContext();

  const billingPeriod = getValues('billingPeriod');
  const subtripIds = getValues('subtripIds');
  const transporterId = getValues('transporterId');

  // Dialogs for selecting
  const transporterDialog = useBoolean();
  const subtripsDialog = useBoolean();
  const dateRangeDialog = useBoolean();

  const selectedTransporter = transportersList?.find((t) => t._id === transporterId);

  // Watch for changes in transporter and billing period
  const watchedTransporterId = watch('transporterId');
  const watchedBillingPeriod = watch('billingPeriod');
  const watchedSubtripIds = watch('subtripIds');
  const isDirty =
    watchedTransporterId ||
    watchedBillingPeriod?.start ||
    watchedBillingPeriod?.end ||
    watchedSubtripIds?.length > 0;

  // Fetch subtrips when transporter and dates are selected
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
    if (watchedTransporterId && watchedBillingPeriod?.start && watchedBillingPeriod?.end) {
      fetchSubtrips();
      // Reset selected subtrips when transporter or date changes
      setValue('subtripIds', [], { shouldValidate: true });
    }
  }, [
    watchedTransporterId,
    watchedBillingPeriod?.start,
    watchedBillingPeriod?.end,
    fetchSubtrips,
    setValue,
  ]);

  const handleReset = () => {
    reset({
      transporterId: '',
      billingPeriod: {
        start: null,
        end: null,
      },
      subtripIds: [],
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
              billingPeriod.start && billingPeriod.end
                ? fDateRangeShortLabel(billingPeriod.start, billingPeriod.end)
                : 'Select Date Range'
            }
            onClick={dateRangeDialog.onTrue}
            error={!!control._formState?.errors?.billingPeriod}
            iconName="mdi:calendar"
            disabled={isLoadingSubtrips}
          />
          <CustomDateRangePicker
            open={dateRangeDialog.value}
            onClose={dateRangeDialog.onFalse}
            startDate={billingPeriod.start}
            endDate={billingPeriod.end}
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

      {/* Loan Selector */}
      {loans && loans.length > 0 && transporterId && (
        <Grid sx={{ my: 2 }}>
          <Typography sx={{ p: 1, mb: 1 }} variant="h6" color="green">
            These are some pending loans of the transporter. Select the loans to repay.
          </Typography>

          <RenderRepaymentComponent loans={loans} />
          <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
        </Grid>
      )}
    </Card>
  );
}
