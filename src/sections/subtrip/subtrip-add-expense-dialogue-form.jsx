import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Stack,
  Alert,
  Button,
  Dialog,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

import { fetchPumps } from 'src/redux/slices/pump';
import { addExpense } from 'src/redux/slices/subtrip';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { EXPENSE_TYPES } from '../../constant';

// Validation Schema
const validationSchema = zod
  .object({
    date: schemaHelper.date({ message: { required_error: 'Date is required!' } }),
    expenseType: zod.string({ required_error: 'Expense Type is required' }),
    amount: zod.number({ required_error: 'Amount is required' }).int('Amount must be an integer'),
    slipNo: zod.string().optional(),
    pumpCd: zod.string().optional(),
    dieselLtr: zod.number().optional(),
    remarks: zod.string().optional(),
    paidThrough: zod.string().optional(),
    authorisedBy: zod.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.expenseType === 'diesel') {
      if (!data.pumpCd) {
        ctx.addIssue({ path: ['pumpCd'], message: 'Pump Code is required for Diesel expenses' });
      }
      if (!data.dieselLtr || data.dieselLtr <= 0 || !Number.isInteger(data.dieselLtr)) {
        ctx.addIssue({ path: ['dieselLtr'], message: 'Diesel Liters must be a positive integer' });
      }
    }
  });

const defaultValues = {
  date: new Date(),
  expenseType: '',
  amount: 0,
  slipNo: '',
  pumpCd: '',
  dieselLtr: 0,
  remarks: '',
  paidThrough: '',
  authorisedBy: '',
};

// AddExpenseDialog Component
export function AddExpenseDialog({ showDialog, setShowDialog, subtripId, vehicleInfo, routeInfo }) {
  const dispatch = useDispatch();
  const methods = useForm({ resolver: zodResolver(validationSchema), defaultValues });
  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
    setValue,
  } = methods;
  const { pumps } = useSelector((state) => state.pump);

  const expenseType = watch('expenseType');
  const fixedSalary = watch('fixedSalary');
  const variableSalary = watch('variableSalary');
  const performanceSalary = watch('performanceSalary');

  const extractedData = routeInfo?.salary?.find(
    (s) => s.vehicleType.toLowerCase() === vehicleInfo.vehicleType.toLowerCase()
  );

  const extractedResult = {
    tollAmt: routeInfo?.tollAmt || 0,
    routeName: routeInfo?.routeName || '',
    fixedSalary: extractedData?.fixedSalary || 0,
    percentageSalary: extractedData?.percentageSalary || 0,
    performanceMilage: extractedData?.performanceMilage || 0,
    diesel: extractedData?.diesel || 0,
    adBlue: extractedData?.adBlue || 0,
    advanceAmt: extractedData?.advanceAmt || 0,
  };

  // Helper to reset form
  const handleReset = useCallback(() => reset(defaultValues), [reset]);

  // Fetch Pumps on Dialog Open
  useEffect(() => {
    if (showDialog) dispatch(fetchPumps());
  }, [dispatch, showDialog]);

  // Reset form when dialog is closed
  useEffect(() => {
    if (!showDialog) handleReset();
  }, [showDialog, handleReset]);

  // Dynamic salary calculation
  useEffect(() => {
    if (expenseType === 'driver-salary') {
      const totalSalary =
        (Number(fixedSalary) || 0) +
        (Number(variableSalary) || 0) +
        (Number(performanceSalary) || 0);
      setValue('amount', totalSalary, { shouldValidate: true });
    }
  }, [expenseType, fixedSalary, variableSalary, performanceSalary, setValue]);

  // Form submission
  const onSubmit = async (data) => {
    try {
      if (data.expenseType !== 'diesel') data.pumpCd = null;
      await dispatch(
        addExpense(subtripId, { ...data, vehicleId: vehicleInfo?._id, expenseCategory: 'subtrip' })
      );
      toast.success('Expense added successfully!');
      handleReset();
      setShowDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Alert Content Mapping
  const alertContent = {
    'driver-salary': [
      `The fixed salary for this trip is calculated as Rate × Weight = 1250 × 32 = 3500.`,
      `Variable Salary for this Trip is 5000.`,
    ],
    diesel: [
      `For trip ${extractedResult.routeName}, usual diesel consumption is ${extractedResult.diesel}Ltr.`,
    ],
    adblue: [
      `For trip ${extractedResult.routeName}, usual AdBlue consumption is ${extractedResult.adBlue}Ltr.`,
    ],
    toll: [
      `For trip ${extractedResult.routeName}, usual toll expenses are ${fCurrency(extractedResult.tollAmt)}.`,
    ],
  };

  return (
    <Dialog open={showDialog} onClose={() => setShowDialog(false)} fullWidth maxWidth="sm">
      <DialogTitle>Add Expense</DialogTitle>
      <DialogContent>
        {(alertContent[expenseType] || []).map((message, idx) => (
          <Alert key={idx} severity="info" variant="outlined" sx={{ my: 2 }}>
            {message}
          </Alert>
        ))}
        <Form methods={methods} onSubmit={onSubmit}>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
            rowGap={3}
            columnGap={2}
          >
            <Field.DatePicker name="date" label="Date" />
            <Field.Select name="expenseType" label="Expense Type">
              {EXPENSE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.replace(/-/g, ' ')}
                </MenuItem>
              ))}
            </Field.Select>
            {expenseType === 'diesel' && (
              <>
                <Field.Select native name="pumpCd" label="Pump">
                  <option value="" />
                  {pumps.map((pump) => (
                    <option key={pump._id} value={pump._id}>
                      {pump.pumpName}
                    </option>
                  ))}
                </Field.Select>
                <Field.Text name="dieselLtr" label="Diesel Liters" type="number" />
              </>
            )}
            {expenseType === 'driver-salary' && (
              <>
                <Field.Text name="fixedSalary" label="Fixed Salary" type="number" />
                <Field.Text name="variableSalary" label="Variable Salary" type="number" />
                <Field.Text name="performanceSalary" label="Performance Salary" type="number" />
              </>
            )}
            <Field.Text
              name="amount"
              label="Amount"
              type="number"
              disabled={expenseType === 'driver-salary'}
            />
            <Field.Text name="slipNo" label="Slip No" />
            <Field.Text name="remarks" label="Remarks" />
            <Field.Text name="paidThrough" label="Paid Through" />
            <Field.Text name="authorisedBy" label="Authorised By" />
          </Box>
        </Form>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1}>
          <Button onClick={handleReset} variant="outlined" disabled={isSubmitting}>
            Reset
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={isSubmitting}>
            Add Expense
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
