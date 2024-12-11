import { z as zod } from 'zod';
import { useMemo } from 'react';
// form
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Divider, Typography, InputAdornment } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

// redux
import { dispatch } from 'src/redux/store';
import { addTransporter, updateTransporter } from 'src/redux/slices/transporter';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

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
  pumpPhoneNo: schemaHelper.phoneNumber({
    message: {
      required_error: 'Guarantor Mobile No is required',
      invalid_error: 'Guarantor Mobile No must be exactly 10 digits',
    },
  }),
  ownerName: zod.string().min(1, { message: 'Owner Name is required' }),
  ownerPhoneNo: schemaHelper.phoneNumber({
    message: {
      required_error: 'Owner Mobile No is required',
      invalid_error: 'Owner Mobile No must be exactly 10 digits',
    },
  }),
  emailId: zod
    .string()
    .min(1, { message: 'Email ID is required' })
    .email({ message: 'Email ID must be a valid email' }),

  bankDetails: zod.object({
    bankCd: zod.string().min(1, { message: 'Bank Code is required' }),
    bankBranch: zod.string().min(1, { message: 'Bank Branch is required' }),
    ifscCode: zod.string().min(1, { message: 'IFSC Code is required' }),
    accNo: zod.string().min(1, { message: 'Account No is required' }),
  }),

  paymentMode: zod.string().min(1, { message: 'Payment Mode is required' }),
  panNo: zod
    .string()
    .min(1, { message: 'PAN No is required' })
    .regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, {
      message: 'PAN No must be in the format: five letters followed by four digits and one letter',
    }),
  gstNo: zod.string().min(1, { message: 'GST No is required' }),
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
      pumpPhoneNo: currentTransporter?.pumpPhoneNo || '',
      ownerName: currentTransporter?.ownerName || '',
      ownerPhoneNo: currentTransporter?.ownerPhoneNo || '',
      emailId: currentTransporter?.emailId || '',
      bankDetails: {
        bankCd: currentTransporter?.bankDetails?.bankCd || '',
        ifscCode: currentTransporter?.bankDetails?.ifscCode || '',
        accNo: currentTransporter?.bankDetails?.accNo || '',
        bankBranch: currentTransporter?.bankDetails?.bankBranch || '',
      },
      paymentMode: currentTransporter?.paymentMode || '',
      panNo: currentTransporter?.panNo || '',
      gstNo: currentTransporter?.gstNo || '',
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

  // Separate Render Methods

  const renderTransporterDetails = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Transporter Details
      </Typography>
      <Card sx={{ p: 3, mb: 3 }}>
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
        >
          <Field.Text name="transportName" label="Transport Name" />
          <Field.Text name="address" label="Address" />
          <Field.Text name="place" label="Place" />
          <Field.Text name="pinNo" label="Pin No" />
          <Field.Text
            name="pumpPhoneNo"
            label="Pump Phone Number"
            InputProps={{
              startAdornment: <InputAdornment position="start">+91 - </InputAdornment>,
            }}
          />
          <Field.Text name="ownerName" label="Owner Name" />
          <Field.Text
            name="ownerPhoneNo"
            label="Owner Phone Numver"
            InputProps={{
              startAdornment: <InputAdornment position="start">+91 - </InputAdornment>,
            }}
          />
          <Field.Text name="emailId" label="Email ID" />
        </Box>
      </Card>
    </>
  );

  const renderBankDetails = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Bank Details
      </Typography>{' '}
      <Card sx={{ p: 3, mb: 3 }}>
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
        >
          <Field.Text name="bankDetails.bankCd" label="Bank Code" />
          <Field.Text name="bankDetails.ifscCode" label="IFSC Code" />
          <Field.Text name="bankDetails.accNo" label="Account No" />
          <Field.Text name="bankDetails.bankBranch" label="Bank Branch" />
        </Box>
      </Card>
    </>
  );

  const renderAdditionalDetails = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Additional Details
      </Typography>{' '}
      <Card sx={{ p: 3, mb: 3 }}>
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
        >
          <Field.Text name="paymentMode" label="Payment Mode" />
          <Field.Text name="panNo" label="PAN No" />
          <Field.Text name="gstNo" label="GST No" />
          <Field.Text
            name="tdsPercentage"
            label="TDS Percentage"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Box>
      </Card>
    </>
  );

  const renderActions = () => (
    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        {!currentTransporter ? 'Create Transporter' : 'Save Changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {renderTransporterDetails()}
          {renderBankDetails()}
          {renderAdditionalDetails()}
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {renderActions()}
    </Form>
  );
}
