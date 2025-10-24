import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Card, Stack, Button, Divider, MenuItem, InputAdornment } from '@mui/material';

// Assuming you have a pump slice

import { LoadingButton } from '@mui/lab';

import { useBoolean } from 'src/hooks/use-boolean';

import { useSubtrip } from 'src/query/use-subtrip';
import { useCreateExpense } from 'src/query/use-expense';
import { useDieselPriceOnDate } from 'src/query/use-diesel-prices';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import ExpenseInsights from './expense-insights';
import { SUBTRIP_STATUS } from '../subtrip/constants';
import { SubtripExpenseSchema } from './expense-schemas';
import { KanbanPumpDialog } from '../kanban/components/kanban-pump-dialog';
import { BasicExpenseTable } from '../subtrip/widgets/basic-expense-table';
import { KanbanSubtripDialog } from '../kanban/components/kanban-subtrip-dialog';
import { usePaymentMethods, SUBTRIP_EXPENSE_TYPES, useSubtripExpenseTypes } from './expense-config';

function ExpenseCoreForm({ currentSubtrip }) {
  const [selectedPump, setSelectedPump] = useState(null);

  const [selectedSubtripId, setSelectedSubtripId] = useState(() => currentSubtrip || null);

  const pumpDialog = useBoolean(false);
  const subtripDialog = useBoolean(false);
  const confirm = useBoolean(false);

  const subtripExpenseTypes = useSubtripExpenseTypes();
  const paymentMethods = usePaymentMethods();

  const createExpense = useCreateExpense();

  const { data: subtripData } = useSubtrip(selectedSubtripId);

  const defaultValues = useMemo(
    () => ({
      subtripId: currentSubtrip || null,
      date: new Date(),
      expenseType: '',
      amount: 0,
      pumpCd: '',
      remarks: '',
      dieselLtr: 0,
      dieselPrice: 0,
      paidThrough: '',
      fixedSalary: 0,
      variableSalary: 0,
      performanceSalary: 0,
    }),
    [currentSubtrip]
  );

  const methods = useForm({
    resolver: zodResolver(SubtripExpenseSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
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

  const { data: dieselPriceOnDate } = useDieselPriceOnDate({ pump: pumpCd, date });

  const showPumpSelection = useMemo(
    () =>
      [
        SUBTRIP_EXPENSE_TYPES.DIESEL,
        SUBTRIP_EXPENSE_TYPES.ADBLUE,
        SUBTRIP_EXPENSE_TYPES.DRIVER_ADVANCE,
      ].includes(expenseType),
    [expenseType]
  );

  // updating amount based on expense type (driver salary and diesel)
  useEffect(() => {
    if (expenseType === SUBTRIP_EXPENSE_TYPES.DRIVER_SALARY) {
      const totalSalary =
        (Number(fixedSalary) || 0) +
        (Number(variableSalary) || 0) +
        (Number(performanceSalary) || 0);
      setValue('amount', totalSalary, { shouldValidate: true });
    }

    if (expenseType === SUBTRIP_EXPENSE_TYPES.DIESEL) {
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

  // update diesel price based on pump and date
  useEffect(() => {
    if (dieselPriceOnDate) {
      setValue('dieselPrice', dieselPriceOnDate.price);
    } else {
      setValue('dieselPrice', 0);
    }
  }, [setValue, dieselPriceOnDate]);

  const handlePumpChange = (pump) => {
    setSelectedPump(pump);
    setValue('pumpCd', pump._id);
  };

  const handleSubtripChange = (subtrip) => {
    setSelectedSubtripId(subtrip?._id);
    setValue('subtripId', subtrip?._id);
  };

  // Handlers for submit and cancel
  const onSubmit = async (data) => {
    const transformedData = {
      ...data,
      expenseCategory: 'subtrip',
      subtripId: selectedSubtripId,
      vehicleId: subtripData?.vehicleId?._id,
    };

    await createExpense(transformedData);

    // Reset form values when not using dialog
    reset(defaultValues);
    setSelectedPump(null);
    setSelectedSubtripId(null);
  };

  console.log({ errors, values: watch() });

  return (
    <>
      <ExpenseInsights subtrip={subtripData} expenseType={expenseType} />

      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3, mb: 5 }}>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
            rowGap={3}
            columnGap={2}
            sx={{ mt: 1 }}
          >
            {/* Subtrip Selection Button */}
            <Box>
              <DialogSelectButton
                onClick={subtripDialog.onTrue}
                placeholder="Select Subtrip"
                selected={subtripData?.subtripNo}
                error={!!errors.subtripId?.message}
                iconName="mdi:truck-fast"
              />
            </Box>

            <Field.DatePicker name="date" label="Date" maxDate={dayjs()} />

            <Field.Select name="expenseType" label="Expense Type">
              <MenuItem value="">None</MenuItem>
              <Divider sx={{ borderStyle: 'dashed' }} />
              {subtripExpenseTypes.map((type) => (
                <MenuItem key={type.label} value={type.label}>
                  <Iconify icon={type.icon} sx={{ mr: 1 }} />
                  {type.label}
                </MenuItem>
              ))}
            </Field.Select>

            {showPumpSelection && (
              <Box>
                <DialogSelectButton
                  onClick={pumpDialog.onTrue}
                  placeholder="Select Pump (Optional)"
                  selected={selectedPump?.name}
                  error={!!errors.pumpCd?.message}
                  iconName="mdi:gas-station"
                />
              </Box>
            )}

            {expenseType === SUBTRIP_EXPENSE_TYPES.DIESEL && (
              <>
                <Field.Text
                  name="dieselLtr"
                  label="Diesel Liters"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Ltr</InputAdornment>,
                  }}
                />
                <Field.Text
                  name="dieselPrice"
                  label="Per Litre Diesel Price"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                  }}
                />
              </>
            )}

            {expenseType === SUBTRIP_EXPENSE_TYPES.DRIVER_SALARY && (
              <>
                <Field.Text
                  name="fixedSalary"
                  label="Fixed Salary (Optional)"
                  type="number"
                  placeholder="0"
                />
                <Field.Text
                  name="variableSalary"
                  label="Variable Salary (Optional)"
                  type="number"
                  placeholder="0"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                  }}
                />
                <Field.Text
                  name="performanceSalary"
                  label="Performance Salary (Optional)"
                  type="number"
                  placeholder="0"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                  }}
                />
              </>
            )}

            <Field.Text
              name="amount"
              label="Amount"
              type="number"
              disabled={
                expenseType === SUBTRIP_EXPENSE_TYPES.DRIVER_SALARY ||
                expenseType === SUBTRIP_EXPENSE_TYPES.DIESEL
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">₹</InputAdornment>,
              }}
            />
            <Field.Text name="remarks" label="Remarks (Optional)" />
            <Field.Select name="paidThrough" label="Paid Through (Optional)">
              <MenuItem value="">None</MenuItem>
              <Divider sx={{ borderStyle: 'dashed' }} />
              {paymentMethods.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Field.Select>
          </Box>
        </Card>
        <Stack sx={{ mt: 2 }} direction="row" justifyContent="flex-end" spacing={2}>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => {
              reset(defaultValues);
              setSelectedPump(null);
              setSelectedSubtripId(null);
            }}
          >
            Reset
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
          >
            Add Expense
          </LoadingButton>
        </Stack>
      </Form>

      <Divider sx={{ my: 3 }} />

      {subtripData && subtripData.expenses.length > 0 && (
        <BasicExpenseTable selectedSubtrip={subtripData} withDelete />
      )}

      <KanbanPumpDialog
        open={pumpDialog.value}
        onClose={pumpDialog.onFalse}
        selectedPump={selectedPump}
        onPumpChange={handlePumpChange}
      />

      <KanbanSubtripDialog
        open={subtripDialog.value}
        onClose={subtripDialog.onFalse}
        selectedSubtrip={subtripData}
        onSubtripChange={handleSubtripChange}
        statusList={[SUBTRIP_STATUS.IN_QUEUE, SUBTRIP_STATUS.LOADED, SUBTRIP_STATUS.RECEIVED]}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

export default ExpenseCoreForm;
