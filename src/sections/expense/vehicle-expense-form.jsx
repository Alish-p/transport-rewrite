// ------------------------------------------------------------------------
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, MenuItem, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { dispatch } from 'src/redux/store';
import { addExpense, updateExpense } from 'src/redux/slices/expense';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { vehicleExpenseTypes as expenseTypes } from './expense-config';

export const ExpenseSchema = zod.object({
  subtripId: zod
    .any()
    .nullable()
    .refine((val) => val !== null, { message: 'Subtrip is required' }),
  vehicleId: zod
    .any()
    .nullable()
    .refine((val) => val !== null, { message: 'Vehicle ID is required' }),
  date: schemaHelper.date({ message: { required_error: 'Start date is required!' } }),
  expenseType: zod.string().min(1, { message: 'Expense Type is required' }),

  amount: zod
    .number({ required_error: 'Amount is required' })
    .min(0, { message: 'Amount must be at least 0' }),
  slipNo: zod.string().min(1, { message: 'Slip No is required' }),
  pumpCd: zod.string().nullable().optional(),
  remarks: zod.string().optional(),
  dieselLtr: zod.number().min(0).optional(),
  paidThrough: zod.string().min(1, { message: 'Paid Through is required' }),
  authorisedBy: zod.string().min(1, { message: 'Authorised By is required' }),
});
// ------------------------------------------------------------------------

export default function ExpenseForm({ currentExpense, subtrips = [], vehicles = [] }) {
  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      subtripId: currentExpense?.subtripId || null,
      vehicleId: currentExpense?.vehicleId || '',
      date: currentExpense?.date ? new Date(currentExpense?.date) : new Date(),
      expenseType: currentExpense?.expenseType || '',

      amount: currentExpense?.amount || 0,
      slipNo: currentExpense?.slipNo || '',
      pumpCd: currentExpense?.pumpCd || null,
      remarks: currentExpense?.remarks || '',
      dieselLtr: currentExpense?.dieselLtr || 0,
      paidThrough: currentExpense?.paidThrough || '',
      authorisedBy: currentExpense?.authorisedBy || '',
    }),
    [currentExpense]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ExpenseSchema),
    defaultValues,
  });

  const {
    reset,
    watch,

    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        expenseCategory: 'vehicle',
        subtripId: data?.subtripId?.value,
        vehicleId: data.vehicleId?._id,
      };
      if (!currentExpense) {
        await dispatch(addExpense(formData));
      } else {
        await dispatch(updateExpense(currentExpense._id, formData));
      }
      reset();
      toast.success(
        !currentExpense ? 'Expense added successfully!' : 'Expense edited successfully!'
      );
      navigate(paths.dashboard.expense.list);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} sx={{ pt: 5 }}>
        <Grid item xs={12} md={3}>
          <Box sx={{ pt: 2, pb: 5, px: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              Expense Details
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 1 }}>
              Please provide the details of the Expense.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
              <Field.Autocomplete
                freeSolo
                name="vehicleId"
                label="Vehicle ID"
                options={vehicles.map((v) => ({ label: v.vehicleNo, value: v._id }))}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />

              <Field.DatePicker name="date" label="Date" />
              <Field.Select name="expenseType" label="Expense Type">
                {expenseTypes.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text name="amount" label="Amount" type="number" />
              <Field.Text name="slipNo" label="Slip No" />
              {values.expenseType === 'diesel' && (
                <>
                  <Field.Text name="pumpCd" label="Pump Code" />
                  <Field.Text name="dieselLtr" label="Diesel Liters" type="number" />
                </>
              )}
              <Field.Text name="remarks" label="Remarks" />
              <Field.Text name="paidThrough" label="Paid Through" />
              <Field.Text name="authorisedBy" label="Authorised By" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentExpense ? 'Create Expense' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
