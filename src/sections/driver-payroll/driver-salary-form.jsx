import React, { useState, useEffect } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import {
  Box,
  Card,
  Grid,
  Alert,
  Button,
  Accordion,
  IconButton,
  Typography,
  FormHelperText,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTripsCompletedByDriverAndDate } from 'src/query/use-subtrip';

import { Iconify } from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker/custom-date-range-picker';

import { KanbanDriverDialog } from '../kanban/components/kanban-driver-dialog';
import KanbanSubtripMultiSelectDialog from '../kanban/components/kanban-subtrip-multi-select-dialog';

// 🧑‍✈️ Wrapper to handle grid + error display
const FieldWrapper = ({ children, error, md = 3 }) => (
  <Grid item xs={12} md={md}>
    {children}
    {error && <FormHelperText error>{error.message || error}</FormHelperText>}
  </Grid>
);

export default function DriverSalaryForm({ driverList }) {
  const { control, watch, setValue, reset } = useFormContext();

  const driverId = watch('driverId');
  const billingPeriod = watch('billingPeriod');
  const associatedSubtrips = watch('associatedSubtrips');

  // 🔔 Dialog toggles
  const driverDialog = useBoolean();
  const subtripsDialog = useBoolean();
  const dateDialog = useBoolean();

  // 🚚 Fetch available subtrips for driver & date range
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

  // 🔄 Reset entire form
  const handleReset = () => {
    reset({
      driverId: '',
      billingPeriod: { start: null, end: null },
      associatedSubtrips: [],
      additionalPayments: [],
      additionalDeductions: [],
    });
  };

  // ➕ Temporary inputs before append
  const [tempPayment, setTempPayment] = useState({ label: '', amount: '' });
  const [tempDeduction, setTempDeduction] = useState({ label: '', amount: '' });

  // 🔧 RHF field arrays
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
    <Box sx={{ mb: 3 }}>
      {/* 🚨 Error loading subtrips */}
      {subtripsError && (
        <Alert sx={{ mb: 2 }} severity="error">
          Error: {subtripsError.message}
        </Alert>
      )}

      <Card variant="elevation" sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          {/* 🧑‍✈️ Driver Selector */}
          <FieldWrapper error={control._formState.errors?.driverId}>
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
                    onDriverChange={(drv) =>
                      setValue('driverId', drv._id, { shouldValidate: true })
                    }
                  />
                </>
              )}
            />
          </FieldWrapper>

          {/* 📅 Billing Period */}
          <FieldWrapper md={2} error={control._formState.errors?.billingPeriod}>
            <DialogSelectButton
              placeholder="Select Date Range *"
              selected={
                billingPeriod?.start && billingPeriod?.end
                  ? `${new Date(billingPeriod.start).toLocaleDateString()} - ${new Date(
                      billingPeriod.end
                    ).toLocaleDateString()}`
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

          {/* 🛣 Subtrip Selector */}
          <FieldWrapper md={6} error={control._formState.errors?.associatedSubtrips}>
            <Controller
              name="associatedSubtrips"
              control={control}
              render={({ field }) => (
                <>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ height: 56, justifyContent: 'flex-start' }}
                    onClick={subtripsDialog.onTrue}
                    disabled={!availableSubtrips.length || loadingSubtrips}
                    startIcon={
                      <Iconify icon={field.value.length ? 'mdi:check' : 'mdi:check-outline'} />
                    }
                  >
                    {field.value.length
                      ? `${field.value.length} selected`
                      : availableSubtrips.length
                        ? 'Select Subtrips'
                        : 'No subtrips'}
                  </Button>
                  <KanbanSubtripMultiSelectDialog
                    open={subtripsDialog.value}
                    onClose={subtripsDialog.onFalse}
                    subtrips={availableSubtrips}
                    selectedSubtrips={field.value}
                    onChange={field.onChange}
                    title="Choose Subtrips"
                  />
                </>
              )}
            />
          </FieldWrapper>

          {/* 🔄 Reset Button */}
          {(driverId ||
            billingPeriod.start ||
            billingPeriod.end ||
            associatedSubtrips.length > 0) && (
            <FieldWrapper md={1}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<Iconify icon="mdi:refresh" />}
                onClick={handleReset}
              >
                Reset
              </Button>
            </FieldWrapper>
          )}
        </Grid>
      </Card>

      {/* 💰 Additional Payments Section */}
      <Accordion>
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
          <Iconify icon="mdi:cash-plus" color="success.main" sx={{ mr: 2 }} fontSize="large" />
          <Typography variant="subtitle1">Additional Payments</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} alignItems="center">
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
                  appendPayment({ label: tempPayment.label, amount: Number(tempPayment.amount) });
                  setTempPayment({ label: '', amount: '' });
                }}
              >
                Add
              </Button>
            </Grid>

            {/* List existing payments */}
            {paymentFields.map((field, idx) => (
              <Grid container item spacing={2} alignItems="center" key={field.id} sx={{ mt: 1 }}>
                <Grid item xs={5}>
                  <RHFTextField name={`additionalPayments.${idx}.label`} label="Label" />
                </Grid>
                <Grid item xs={5}>
                  <RHFTextField
                    name={`additionalPayments.${idx}.amount`}
                    label="Amount"
                    type="number"
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton color="error" onClick={() => removePayment(idx)}>
                    <Iconify icon="mdi:trash-can-outline" />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 📉 Additional Deductions Section */}
      <Accordion>
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
          <Iconify icon="mdi:cash-minus" color="error.main" sx={{ mr: 2 }} fontSize="large" />
          <Typography variant="subtitle1">Additional Deductions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={5}>
              <RHFTextField
                name="__tempDeduction_label"
                label="Label"
                value={tempDeduction.label}
                onChange={(e) => setTempDeduction((d) => ({ ...d, label: e.target.value }))}
                placeholder="e.g. Penalty"
              />
            </Grid>
            <Grid item xs={5}>
              <RHFTextField
                name="__tempDeduction_amount"
                label="Amount"
                type="number"
                value={tempDeduction.amount}
                onChange={(e) => setTempDeduction((d) => ({ ...d, amount: e.target.value }))}
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

            {/* List existing deductions */}
            {deductionFields.map((field, idx) => (
              <Grid container item spacing={2} alignItems="center" key={field.id} sx={{ mt: 1 }}>
                <Grid item xs={5}>
                  <RHFTextField name={`additionalDeductions.${idx}.label`} label="Label" />
                </Grid>
                <Grid item xs={5}>
                  <RHFTextField
                    name={`additionalDeductions.${idx}.amount`}
                    label="Amount"
                    type="number"
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton color="error" onClick={() => removeDeduction(idx)}>
                    <Iconify icon="mdi:trash-can-outline" />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
