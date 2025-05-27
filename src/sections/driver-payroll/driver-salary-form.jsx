import React, { useState, useEffect } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import {
  Box,
  Card,
  Grid,
  Alert,
  Button,
  Typography,
  IconButton,
  FormHelperText,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTripsCompletedByDriverAndDate } from 'src/query/use-subtrip';

import { Iconify } from 'src/components/iconify';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker/custom-date-range-picker';

import { RHFTextField } from '../../components/hook-form';
import { KanbanDriverDialog } from '../kanban/components/kanban-driver-dialog';
import KanbanSubtripMultiSelectDialog from '../kanban/components/kanban-subtrip-multi-select-dialog';

const FieldWrapper = ({ children, error, md = 3 }) => (
  <Grid item xs={12} md={md}>
    {children}
    {error && <FormHelperText error>{error}</FormHelperText>}
  </Grid>
);

export default function DriverSalaryForm({ driverList }) {
  const { control, watch, setValue, reset } = useFormContext();
  const driverId = watch('driverId');
  const billingPeriod = watch('billingPeriod');
  const associatedSubtrips = watch('associatedSubtrips');

  // Dialog states
  const driverDialog = useBoolean();
  const subtripsDialog = useBoolean();
  const dateDialog = useBoolean();

  // Fetch subtrips
  const {
    data: availableSubtrips = [],
    refetch,
    isLoading: loadingSubtrips,
    error: subtripsError,
  } = useTripsCompletedByDriverAndDate(driverId, billingPeriod?.start, billingPeriod?.end);

  useEffect(() => {
    if (driverId && billingPeriod?.start && billingPeriod?.end) {
      refetch();
      setValue('associatedSubtrips', [], { shouldValidate: true });
    }
  }, [driverId, billingPeriod?.start, billingPeriod?.end, refetch, setValue]);

  const handleReset = () => {
    reset({
      driverId: '',
      billingPeriod: { start: null, end: null },
      associatedSubtrips: [],
      additionalPayments: [],
      additionalDeductions: [],
    });
  };

  // keep temp inputs in local state
  const [tempPayment, setTempPayment] = useState({ label: '', amount: '' });
  const [tempDeduction, setTempDeduction] = useState({ label: '', amount: '' });

  const {
    fields: paymentFields,
    append: appendPayment,
    remove: removePayment,
  } = useFieldArray({ name: 'additionalPayments', control });

  const {
    fields: deductionFields,
    append: appendDeduction,
    remove: removeDeduction,
  } = useFieldArray({ name: 'additionalDeductions', control });

  return (
    <Card sx={{ p: 3, mb: 3 }}>
      {subtripsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading subtrips: {subtripsError.message}
        </Alert>
      )}
      <Grid container spacing={2}>
        {/* Driver Selector */}
        <FieldWrapper error={!!control._formState.errors?.driverId}>
          <Controller
            name="driverId"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <DialogSelectButton
                  placeholder="Select Driver *"
                  selected={driverList.find((d) => d._id === field.value)?.driverName}
                  onClick={driverDialog.onTrue}
                  error={!!fieldState.error}
                  iconName="mdi:person"
                  disabled={loadingSubtrips}
                />
                <KanbanDriverDialog
                  open={driverDialog.value}
                  onClose={driverDialog.onFalse}
                  selectedDriver={driverList.find((d) => d._id === field.value)}
                  onDriverChange={(drv) => setValue('driverId', drv._id, { shouldValidate: true })}
                />
              </>
            )}
          />
        </FieldWrapper>

        {/* Billing Period Selector */}
        <FieldWrapper md={2} error={!!control._formState.errors?.billingPeriod}>
          <DialogSelectButton
            placeholder="Select Date Range *"
            selected={
              billingPeriod?.start && billingPeriod?.end
                ? `${new Date(billingPeriod.start).toLocaleDateString()} - ${new Date(billingPeriod.end).toLocaleDateString()}`
                : 'Select Date Range'
            }
            onClick={dateDialog.onTrue}
            error={!!control._formState.errors?.billingPeriod}
            disabled={loadingSubtrips}
            iconName="mdi:calendar"
          />
          <CustomDateRangePicker
            open={dateDialog.value}
            onClose={dateDialog.onFalse}
            startDate={billingPeriod?.start}
            endDate={billingPeriod?.end}
            onChangeStartDate={(date) =>
              setValue('billingPeriod.start', date, { shouldValidate: true })
            }
            onChangeEndDate={(date) =>
              setValue('billingPeriod.end', date, { shouldValidate: true })
            }
          />
        </FieldWrapper>

        {/* Subtrip Selector */}
        <FieldWrapper md={6} error={!!control._formState.errors?.associatedSubtrips}>
          <Controller
            name="associatedSubtrips"
            control={control}
            render={({ field }) => (
              <>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ height: 56, justifyContent: 'flex-start', typography: 'body2' }}
                  onClick={subtripsDialog.onTrue}
                  disabled={availableSubtrips.length === 0 || loadingSubtrips}
                  startIcon={
                    <Iconify
                      icon={field.value.length > 0 ? 'mdi:check' : 'mdi:check-outline'}
                      sx={{ color: field.value.length > 0 ? 'primary.main' : 'text.disabled' }}
                    />
                  }
                >
                  {field.value.length > 0
                    ? `${field.value.length} subtrip(s) selected`
                    : availableSubtrips.length > 0
                      ? 'Select Subtrips'
                      : 'No subtrips available'}
                </Button>
                <KanbanSubtripMultiSelectDialog
                  open={subtripsDialog.value}
                  onClose={subtripsDialog.onFalse}
                  subtrips={availableSubtrips}
                  selectedSubtrips={field.value}
                  onChange={field.onChange}
                  title="Select Subtrips for Salary"
                />
              </>
            )}
          />
        </FieldWrapper>

        {/* Reset Button */}
        {(driverId ||
          billingPeriod.start ||
          billingPeriod.end ||
          associatedSubtrips.length > 0) && (
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

        {/* --- Additional Payments Section --- */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={6}>
            <Box mt={4}>
              <Typography variant="h6">Additional Payments</Typography>

              <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
                <Grid item xs={5}>
                  <RHFTextField
                    name="__tempPayment_label"
                    label="Label"
                    value={tempPayment.label}
                    onChange={(e) => setTempPayment((p) => ({ ...p, label: e.target.value }))}
                    placeholder="e.g. Fuel bonus"
                  />
                </Grid>
                <Grid item xs={5}>
                  <RHFTextField
                    name="__tempPayment_amount"
                    label="Amount"
                    type="number"
                    value={tempPayment.amount}
                    onChange={(e) => setTempPayment((p) => ({ ...p, amount: e.target.value }))}
                    placeholder="0"
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Iconify icon="mdi:plus-circle-outline" />}
                    disabled={!tempPayment.label || !tempPayment.amount}
                    onClick={() => {
                      appendPayment({
                        label: tempPayment.label,
                        amount: Number(tempPayment.amount),
                      });
                      setTempPayment({ label: '', amount: '' });
                    }}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>

              {paymentFields.map((item, index) => (
                <Grid container spacing={2} alignItems="center" key={item.id} sx={{ mt: 1 }}>
                  <Grid item xs={5}>
                    <RHFTextField name={`additionalPayments.${index}.label`} label="Label" />
                  </Grid>
                  <Grid item xs={5}>
                    <RHFTextField
                      name={`additionalPayments.${index}.amount`}
                      label="Amount"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton color="error" onClick={() => removePayment(index)} size="large">
                      <Iconify icon="mdi:trash-can-outline" />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Grid>
          <Grid item xs={6}>
            {/* --- Additional Deductions (mirror the above block) --- */}
            <Box mt={4}>
              <Typography variant="h6">Additional Deductions</Typography>

              <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
                <Grid item xs={5}>
                  <RHFTextField
                    name="__tempDeduction_label"
                    label="Label"
                    value={tempDeduction.label}
                    onChange={(e) => setTempDeduction((p) => ({ ...p, label: e.target.value }))}
                    placeholder="e.g. Penalty"
                  />
                </Grid>
                <Grid item xs={5}>
                  <RHFTextField
                    name="__tempDeduction_amount"
                    label="Amount"
                    type="number"
                    value={tempDeduction.amount}
                    onChange={(e) => setTempDeduction((p) => ({ ...p, amount: e.target.value }))}
                    placeholder="0"
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Iconify icon="mdi:plus-circle-outline" />}
                    disabled={!tempDeduction.label || !tempDeduction.amount}
                    onClick={() => {
                      appendDeduction({
                        label: tempDeduction.label,
                        amount: Number(tempDeduction.amount),
                      });
                      setTempDeduction({ label: '', amount: '' });
                    }}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>

              {deductionFields.map((item, index) => (
                <Grid container spacing={2} alignItems="center" key={item.id} sx={{ mt: 1 }}>
                  <Grid item xs={5}>
                    <RHFTextField name={`additionalDeductions.${index}.label`} label="Label" />
                  </Grid>
                  <Grid item xs={5}>
                    <RHFTextField
                      name={`additionalDeductions.${index}.amount`}
                      label="Amount"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton color="error" onClick={() => removeDeduction(index)} size="large">
                      <Iconify icon="mdi:trash-can-outline" />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}
