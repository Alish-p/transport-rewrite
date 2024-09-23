import { z as zod } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Stack, Button, MenuItem } from '@mui/material';

import { fetchPumps } from 'src/redux/slices/pump';
import { addExpense } from 'src/redux/slices/subtrip';

import { toast } from 'src/components/snackbar';
// form components
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';

export const validationSchema = zod.object({
  date: zod.date({ required_error: 'Date is required' }),
  expenseType: zod.string({ required_error: 'Expense Type is required' }),
  amount: zod
    .number({ required_error: 'Amount is required' })
    .int({ message: 'Amount must be an integer' }),
  slipNo: zod.string().optional(),
  pumpCd: zod
    .string()
    .optional()
    .refine(
      (val, ctx) => {
        if (ctx.parent.expenseType === 'diesel' && !val) {
          return false;
        }
        return true;
      },
      { message: 'Pump Code is required for Diesel expenses' }
    ),
  dieselLtr: zod
    .number()
    .optional()
    .refine(
      (val, ctx) => {
        if (
          ctx.parent.expenseType === 'diesel' &&
          (val === undefined || val <= 0 || !Number.isInteger(val))
        ) {
          return false;
        }
        return true;
      },
      { message: 'Diesel Liters are required for Diesel expenses and must be a positive integer' }
    ),
  remarks: zod.string().optional(),
  paidThrough: zod.string().optional(),
  authorisedBy: zod.string().optional(),
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

export function AddExpenseDialog({ showDialog, setShowDialog, subtripId, vehicleId }) {
  const dispatch = useDispatch();

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const expenseType = watch('expenseType');

  const handleReset = () => {
    reset(defaultValues);
  };

  useEffect(() => {
    if (showDialog) {
      dispatch(fetchPumps());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDialog]);

  const { pumps } = useSelector((state) => state.pump);

  const onSubmit = async (data) => {
    try {
      if (data.expenseType !== 'diesel') {
        data.pumpCd = null;
      }
      await dispatch(addExpense(subtripId, { ...data, vehicleId }));
      toast.success('Expense added successfully!');
      handleReset();
      setShowDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!showDialog) {
      handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDialog]);

  return (
    <ConfirmDialog
      open={showDialog}
      onClose={() => setShowDialog(false)}
      title="Add Expense"
      content={
        <Box sx={{ marginTop: '6px' }}>
          <Form methods={methods} onSubmit={onSubmit}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.DatePicker name="date" label="Date" />
              <Field.Select name="expenseType" label="Expense Type">
                <MenuItem value="diesel">Diesel</MenuItem>
                <MenuItem value="adblue">Adblue</MenuItem>
                <MenuItem value="driver-salary">Driver Salary</MenuItem>
                <MenuItem value="trip-advance">Driver Advance</MenuItem>
                <MenuItem value="trip-extra-advance">Extra Advance</MenuItem>
                <MenuItem value="puncher">Tyre puncher</MenuItem>
                <MenuItem value="tyre-expense">Tyre Expense</MenuItem>
                <MenuItem value="police">Police</MenuItem>
                <MenuItem value="rto">Rto</MenuItem>
                <MenuItem value="toll">Toll</MenuItem>
                <MenuItem value="vehicle-repair">Vehicle Repair</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Field.Select>
              <Field.Text name="amount" label="Amount" type="number" />
              <Field.Text name="slipNo" label="Slip No" />
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
              <Field.Text name="remarks" label="Remarks" />
              <Field.Text name="paidThrough" label="Paid Through" />
              <Field.Text name="authorisedBy" label="Authorised By" />
            </Box>
          </Form>
        </Box>
      }
      action={
        <Stack direction="row" spacing={1}>
          <Button type="reset" onClick={handleReset} variant="outlined" loading={isSubmitting}>
            Reset
          </Button>
          <Button
            type="submit"
            variant="contained"
            loading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            Save Changes
          </Button>
        </Stack>
      }
    />
  );
}
