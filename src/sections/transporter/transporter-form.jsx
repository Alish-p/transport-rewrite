import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useMemo } from 'react';
import { toast } from 'src/components/snackbar';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';

import { Box, Card, Grid, InputAdornment, Stack, Typography } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// components

import { Form, Field } from 'src/components/hook-form';
// redux
import { dispatch } from 'src/redux/store';
import { addTransporter, updateTransporter } from 'src/redux/slices/transporter';
import { transportType } from './TransporterTableConfig';

// ----------------------------------------------------------------------

export const NewTransporterSchema = zod.object({
  transportName: zod.string().min(1, { message: 'Transport Name is required' }),
  address: zod.string().min(1, { message: 'Address is required' }),
  place: zod.string().min(1, { message: 'Place is required' }),
  pinNo: zod
    .string()
    .min(6, { message: 'Pin No must be exactly 6 digits' })
    .max(6, { message: 'Pin No must be exactly 6 digits' })
    .regex(/^[0-9]{6}$/, { message: 'Pin No must be a number' }),
  cellNo: zod
    .string()
    .min(10, { message: 'Cell No must be exactly 10 digits' })
    .max(10, { message: 'Cell No must be exactly 10 digits' })
    .regex(/^[0-9]{10}$/, { message: 'Cell No must be a number' }),
  bankCd: zod.string().min(1, { message: 'Bank Code is required' }),
  ifscCode: zod.string().min(1, { message: 'IFSC Code is required' }),
  accNo: zod.string().min(1, { message: 'Account No is required' }),
  paymentMode: zod.string().min(1, { message: 'Payment Mode is required' }),
  panNo: zod
    .string()
    .min(1, { message: 'PAN No is required' })
    .regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, {
      message: 'PAN No must be in the format: five letters followed by four digits and one letter',
    }),
  ownerName: zod.string().min(1, { message: 'Owner Name is required' }),
  gstNo: zod.string().min(1, { message: 'GST No is required' }),
  bankBranch: zod.string().min(1, { message: 'Bank Branch is required' }),
  emailId: zod
    .string()
    .min(1, { message: 'Email ID is required' })
    .email({ message: 'Email ID must be a valid email' }),
  phoneNo: zod
    .string()
    .min(10, { message: 'Phone No must be exactly 10 digits' })
    .max(10, { message: 'Phone No must be exactly 10 digits' })
    .regex(/^[0-9]{10}$/, { message: 'Phone No must be a number' }),
  transportType: zod.string().min(1, { message: 'Transport Type is required' }),
  agreementNo: zod.string().min(1, { message: 'Agreement No is required' }),
  tdsPercentage: zod
    .number()
    .min(0, { message: 'TDS Percentage must be at least 0' })
    .max(100, { message: 'TDS Percentage must be at most 100' })
    .refine((value) => value !== null, { message: 'TDS Percentage is required' }),
});

// ----------------------------------------------------------------------

export default function TransporterForm({ currentTransporter }) {
  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      transportName: currentTransporter?.transportName || '',
      address: currentTransporter?.address || '',
      place: currentTransporter?.place || '',
      pinNo: currentTransporter?.pinNo || '',
      cellNo: currentTransporter?.cellNo || '',
      bankCd: currentTransporter?.bankCd || '',
      ifscCode: currentTransporter?.ifscCode || '',
      accNo: currentTransporter?.accNo || '',
      paymentMode: currentTransporter?.paymentMode || '',
      panNo: currentTransporter?.panNo || '',
      ownerName: currentTransporter?.ownerName || '',
      gstNo: currentTransporter?.gstNo || '',
      bankBranch: currentTransporter?.bankBranch || '',
      emailId: currentTransporter?.emailId || '',
      phoneNo: currentTransporter?.phoneNo || '',
      transportType: currentTransporter?.transportType || '',
      agreementNo: currentTransporter?.agreementNo || '',
      tdsPercentage: currentTransporter?.tdsPercentage || 0,
    }),

    [currentTransporter]
  );

  const methods = useForm({
    resolver: zodResolver(NewTransporterSchema),
    defaultValues,
  });

  const {
    reset,

    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      if (!currentTransporter) {
        await dispatch(addTransporter(data));
      } else {
        await dispatch(updateTransporter(currentTransporter._id, data));
      }
      reset();
      toast.success(
        !currentTransporter ? 'Transporter added successfully!' : 'Transporter edited successfully!'
      );
      navigate(paths.dashboard.transporter.list);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="transportName" label="Transport Name" />
              <Field.Text name="address" label="Address" />
              <Field.Text name="place" label="Place" />
              <Field.Text name="pinNo" label="Pin No" />
              <Field.Text name="cellNo" label="Cell No" />
              <Field.Text name="bankCd" label="Bank Code" />
              <Field.Text name="ifscCode" label="IFSC Code" />
              <Field.Text name="accNo" label="Account No" />
              <Field.Text name="paymentMode" label="Payment Mode" />
              <Field.Text name="panNo" label="PAN No" />
              <Field.Text name="ownerName" label="Owner Name" />
              <Field.Text name="gstNo" label="GST No" />
              <Field.Text name="bankBranch" label="Bank Branch" />
              <Field.Text name="emailId" label="Email ID" />
              <Field.Text
                name="phoneNo"
                label="Phone No"
                InputProps={{
                  startAdornment: <InputAdornment position="start">+91 - </InputAdornment>,
                }}
              />
              <Field.Select native name="transportType" label="Transport Type">
                <option value="" />
                {transportType.map(({ key, value }) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Field.Select>
              <Field.Text name="agreementNo" label="Agreement No" />
              <Field.Text
                name="tdsPercentage"
                label="TDS Percentage"
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentTransporter ? 'Create Transporter' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
