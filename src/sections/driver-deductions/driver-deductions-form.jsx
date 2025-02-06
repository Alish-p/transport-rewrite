import { z as zod } from 'zod';
// form
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Alert,
  Divider,
  MenuItem,
  Typography,
  InputAdornment,
} from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

import { fCurrency } from 'src/utils/format-number';

// redux
import { dispatch } from 'src/redux/store';

// components
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { deductionTypes, repaymentTypes } from './driver-deductions-config';
import { addDriverDeduction, updateDriverDeduction } from '../../redux/slices/driver-deductions';

// ----------------------------------------------------------------------

export const DriverDeductionsSchema = zod.object({
  driverId: zod.string().min(1),
  type: zod.enum(['advance', 'penalty']),
  amount: zod.number().min(1, { message: 'Amount is required' }),
  remarks: zod.string().optional(),
  issuedDate: schemaHelper
    .date({ message: { required_error: 'Issued date is required!' } })
    .optional(),
  repaymentType: zod.enum(['full', 'installments']),
  installments: zod.number().min(1).optional(),
});

// ----------------------------------------------------------------------

export default function DriverDeductionForm({ driverList, currentDriverDeduction }) {
  const navigate = useNavigate();

  console.log('currentDriverDeduction:', currentDriverDeduction);

  const defaultValues = useMemo(
    () => ({
      driverId: currentDriverDeduction?.driverId?._id || '',
      type: currentDriverDeduction?.type || 'advance',
      amount: currentDriverDeduction?.amount || 0,
      remarks: currentDriverDeduction?.remarks || '',
      issuedDate: currentDriverDeduction?.issuedDate || new Date(),
      repaymentType: currentDriverDeduction?.repaymentType || 'full',
      installments: currentDriverDeduction?.installments || 1,
    }),
    [currentDriverDeduction]
  );

  const methods = useForm({
    resolver: zodResolver(DriverDeductionsSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    console.log('errors:', errors);
  }, [errors]);

  // Handle form submission (create or update)
  const onSubmit = async (data) => {
    try {
      const driverDeductionsData = {
        ...data,
      };
      let newDriverDeduction = null;

      if (currentDriverDeduction) {
        newDriverDeduction = await dispatch(
          updateDriverDeduction(currentDriverDeduction._id, driverDeductionsData)
        );
        toast.success('Driver Deduction updated successfully!');
      } else {
        await dispatch(addDriverDeduction(driverDeductionsData));
        newDriverDeduction = toast.success('Driver Deduction created successfully!');
      }
      navigate(paths.dashboard.driverDeductions.details(newDriverDeduction._id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderDriverDeductionDetails = () => (
    <>
      <Typography variant="h6" sx={{ p: 3, mt: 1 }}>
        Driver Deductions Details
      </Typography>
      <Card sx={{ p: 3, mb: 3 }}>
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
          gap={3}
        >
          <Field.Select name="driverId" label="Driver">
            <MenuItem value="">None</MenuItem>
            <Divider sx={{ borderStyle: 'dashed' }} />
            {driverList.map((driver) => (
              <MenuItem key={driver._id} value={driver._id}>
                {driver.driverName}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Select name="type" label="Deduction Type">
            <MenuItem value="">None</MenuItem>
            <Divider sx={{ borderStyle: 'dashed' }} />
            {deductionTypes.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Text
            name="amount"
            label="Amount"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">₹</InputAdornment>,
            }}
          />
          <Field.Text name="remarks" label="Remarks" />

          <Field.Select name="repaymentType" label="Repayment Type">
            <MenuItem value="">None</MenuItem>
            <Divider sx={{ borderStyle: 'dashed' }} />
            {repaymentTypes.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.DatePicker name="issuedDate" label="Issue Date" />

          {watch('repaymentType') === 'installments' && (
            <Field.Text name="installments" label="Installments" type="number" />
          )}
        </Box>
      </Card>
    </>
  );

  const renderActions = () => (
    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        {currentDriverDeduction ? 'Update Driver Deduction' : 'Create Driver Deduction'}
      </LoadingButton>
    </Stack>
  );

  const renderAlerts = () => (
    <>
      {watch('repaymentType') === 'installments' &&
        watch('installments') > 0 &&
        watch('amount') > 0 && (
          <Alert severity="info" variant="outlined" sx={{ my: 2 }}>
            {`The total deduction amount is ${fCurrency(watch('amount'))}. It will be repaid in ${watch('installments')} installments of ${fCurrency(watch('amount') / watch('installments'))} each.`}
          </Alert>
        )}
    </>
  );

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {renderDriverDeductionDetails()}
        </Grid>
      </Grid>

      {renderAlerts()}
      <Divider sx={{ my: 3 }} />
      {renderActions()}
    </Form>
  );
}
