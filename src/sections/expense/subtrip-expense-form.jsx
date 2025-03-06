import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Stack, Button, Divider, MenuItem } from '@mui/material';

// Assuming you have a pump slice
import { paths } from 'src/routes/paths';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { EXPENSE_TYPES } from '../../constant'; // Or your config file path
import ExpenseInsights from './expense-insights';
import { useDieselPriceOnDate } from '../../query/use-diesel-prices';
import { useCreateExpense, useUpdateExpense } from '../../query/use-expense';

// Validation Schema (Combine and adapt schemas from both forms)
const validationSchema = zod
  .object({
    date: schemaHelper.date({ message: { required_error: 'Date is required!' } }),
    expenseType: zod.string({ required_error: 'Expense Type is required' }),
    amount: zod.number({ required_error: 'Amount is required' }),
    slipNo: zod.string().optional(),
    pumpCd: zod
      .object({
        label: zod.string(),
        value: zod.string(),
      })
      .nullable()
      .optional(),
    dieselLtr: zod.number().optional(),
    dieselPrice: zod.number().optional(),
    remarks: zod.string().optional(),
    paidThrough: zod.string().optional(),
    authorisedBy: zod.string().optional(),
    fixedSalary: zod.number().optional(),
    variableSalary: zod.number().optional(),
    performanceSalary: zod.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.expenseType === 'diesel') {
      if (!data.pumpCd) {
        ctx.addIssue({ path: ['pumpCd'], message: 'Pump Code is required for Diesel expenses' });
      }
      if (!data.dieselLtr || data.dieselLtr <= 0) {
        ctx.addIssue({ path: ['dieselLtr'], message: 'Diesel Liters must be a positive Number' });
      }
      if (!data.dieselPrice || data.dieselPrice <= 0) {
        ctx.addIssue({ path: ['dieselPrice'], message: 'Per Litre Diesel Price must be positive' });
      }
    }

    if (data.expenseType === 'driver-salary') {
      if (data.fixedSalary == null || data.fixedSalary < 0) {
        ctx.addIssue({
          path: ['fixedSalary'],
          message: 'Fixed Salary must be a non-negative number',
        });
      }
      if (data.variableSalary == null || data.variableSalary < 0) {
        ctx.addIssue({
          path: ['variableSalary'],
          message: 'Variable Salary must be a non-negative number',
        });
      }
      if (data.performanceSalary == null || data.performanceSalary < 0) {
        ctx.addIssue({
          path: ['performanceSalary'],
          message: 'Performance Salary must be a non-negative number',
        });
      }
    }
  });

function ExpenseCoreForm({ currentExpense, currentSubtrip, pumps }) {
  const navigate = useNavigate();

  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();

  const defaultValues = useMemo(
    () => ({
      subtripId: currentSubtrip
        ? { label: currentSubtrip?.subtripId, value: currentSubtrip?.subtripId }
        : null,
      date: currentExpense?.date ? new Date(currentExpense?.date) : new Date(),
      expenseType: currentExpense?.expenseType || '',
      amount: currentExpense?.amount || 0,
      slipNo: currentExpense?.slipNo || '',
      pumpCd: currentExpense?.pumpCd
        ? { label: currentExpense?.pumpCd?.pumpName, value: currentExpense?.pumpCd?._id }
        : null,
      remarks: currentExpense?.remarks || '',
      dieselLtr: currentExpense?.dieselLtr || 0,
      dieselPrice: currentExpense?.dieselPrice || 0,
      paidThrough: currentExpense?.paidThrough || '',
      authorisedBy: currentExpense?.authorisedBy || '',
      fixedSalary: currentExpense?.fixedSalary || 0,
      variableSalary: currentExpense?.variableSalary || 0,
      performanceSalary: currentExpense?.performanceSalary || 0,
    }),
    [currentExpense, currentSubtrip]
  );

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const {
    expenseType,
    fixedSalary,
    variableSalary,
    performanceSalary,
    dieselLtr,
    dieselPrice,
    pumpCd,
    date,
  } = watch();

  const { data: dieselPriceOnDate } = useDieselPriceOnDate({ pump: pumpCd?.value, date });

  // Dynamic Calculations (as in AddExpenseDialog)
  useEffect(() => {
    if (expenseType === 'driver-salary') {
      const totalSalary =
        (Number(fixedSalary) || 0) +
        (Number(variableSalary) || 0) +
        (Number(performanceSalary) || 0);
      setValue('amount', totalSalary, { shouldValidate: true });
    }

    if (expenseType === 'diesel') {
      const totalAmount = (Number(dieselLtr) || 0) * (Number(dieselPrice) || 0);
      setValue('amount', totalAmount, { shouldValidate: true });
    }
  }, [
    expenseType,
    fixedSalary,
    variableSalary,
    performanceSalary,
    dieselLtr,
    dieselPrice,
    setValue,
  ]);

  useEffect(() => {
    if (dieselPriceOnDate) {
      setValue('dieselPrice', dieselPriceOnDate.price);
    } else {
      setValue('dieselPrice', 0);
    }
  }, [setValue, dieselPriceOnDate]);

  // Handlers for submit and cancel
  const onSubmit = async (data) => {
    const transformedData = {
      ...data,
      expenseCategory: 'subtrip',
      pumpCd: data.pumpCd?.value || null,
      subtripId: currentExpense ? currentExpense.subtripId : currentSubtrip?._id,
      vehicleId: currentExpense ? currentExpense.vehicleId : currentSubtrip?.tripId?.vehicleId?._id,
    };

    let newExpense;

    if (!currentExpense) {
      newExpense = await createExpense(transformedData);
    } else {
      newExpense = await updateExpense({ id: currentExpense._id, data: transformedData });
    }
    navigate(paths.dashboard.expense.details(newExpense._id));
  };

  return (
    <>
      <ExpenseInsights subtrip={currentSubtrip} expenseType={expenseType} />

      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
          rowGap={3}
          columnGap={2}
        >
          <Field.DatePicker name="date" label="Date" />

          <Field.Select name="expenseType" label="Expense Type">
            <MenuItem value="">None</MenuItem>
            <Divider sx={{ borderStyle: 'dashed' }} />
            {EXPENSE_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type.replace(/-/g, ' ')}
              </MenuItem>
            ))}
          </Field.Select>

          {expenseType === 'diesel' && (
            <>
              <Field.Autocomplete
                name="pumpCd"
                label="Pump"
                options={pumps.map((p) => ({
                  label: `${p.pumpName}`,
                  value: p._id,
                }))}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />
              <Field.Text name="dieselLtr" label="Diesel Liters" type="number" />
              <Field.Text name="dieselPrice" label="Per Litre Diesel Price" type="number" />
            </>
          )}

          {expenseType === 'driver-salary' && (
            <>
              <Field.Text name="fixedSalary" label="Fixed Salary" type="number" placeholder="0" />
              <Field.Text
                name="variableSalary"
                label="Variable Salary"
                type="number"
                placeholder="0"
              />
              <Field.Text
                name="performanceSalary"
                label="Performance Salary"
                type="number"
                placeholder="0"
              />
            </>
          )}

          <Field.Text
            name="amount"
            label="Amount"
            type="number"
            disabled={expenseType === 'driver-salary' || expenseType === 'diesel'}
          />
          <Field.Text name="slipNo" label="Slip No" />
          <Field.Text name="remarks" label="Remarks" />
          <Field.Text name="paidThrough" label="Paid Through" />
          <Field.Text name="authorisedBy" label="Authorised By" />
        </Box>
        <Stack sx={{ mt: 2 }} direction="row" spacing={2}>
          <Button color="inherit" variant="outlined" onClick={reset}>
            Reset
          </Button>

          <Button type="submit" variant="contained">
            Add Expense
          </Button>
        </Stack>
      </Form>
    </>
  );
}

export default ExpenseCoreForm;
