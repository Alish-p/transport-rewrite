import { z as zod } from 'zod';
import { useMemo } from 'react';
// form
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Divider,
  MenuItem,
  Typography,
  InputAdornment,
} from '@mui/material';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useCreateTransporter, useUpdateTransporter } from 'src/query/use-transporter';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { STATES } from '../customer/config';
import { BankListDialog } from '../bank/bank-list-dialogue';

// ----------------------------------------------------------------------

export const NewTransporterSchema = zod.object({
  transportName: zod.string().min(1, { message: 'Transport Name is required' }),
  address: zod.string().min(1, { message: 'Address is required' }),
  place: zod.string(),
  state: zod.string().min(1, { message: 'State is required' }),
  pinNo: zod.string().min(1, { message: 'Pin No is required' }),
  cellNo: schemaHelper.phoneNumber({
    message: {
      required_error: 'Mobile No is required',
      invalid_error: 'Mobile No must be exactly 10 digits',
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
  paymentMode: zod.string().min(1, { message: 'Payment Mode is required' }),
  panNo: zod.string(),
  gstNo: zod.string(),
  tdsPercentage: zod.number().min(0, { message: 'TDS Percentage is required' }),
  podCharges: zod.number().min(0, { message: 'POD Charges is required' }),

  bankDetails: zod.object({
    name: zod.string().min(1, { message: 'Bank name is required' }),
    branch: zod.string().min(1, { message: 'Branch is required' }),
    ifsc: zod.string().min(1, { message: 'IFSC is required' }),
    place: zod.string().min(1, { message: 'Place is required' }),
    accNo: schemaHelper.accountNumber({
      message: {
        required_error: 'Account number is required',
        invalid_error: 'Account number must be between 9 and 18 digits',
      },
    }),
  }),
});

// ----------------------------------------------------------------------

export default function TransporterForm({ currentTransporter, bankList }) {
  const navigate = useNavigate();
  const router = useRouter();
  const bankDialogue = useBoolean();

  const createTransporter = useCreateTransporter();
  const updateTransporter = useUpdateTransporter();

  const defaultValues = useMemo(
    () => ({
      transportName: currentTransporter?.transportName || '',
      address: currentTransporter?.address || '',
      place: currentTransporter?.place || '',
      state: currentTransporter?.state || '',
      pinNo: currentTransporter?.pinNo || '',
      cellNo: currentTransporter?.cellNo || '',
      ownerName: currentTransporter?.ownerName || '',
      ownerPhoneNo: currentTransporter?.ownerPhoneNo || '',
      emailId: currentTransporter?.emailId || '',
      bankDetails: {
        name: currentTransporter?.bankDetails?.name || '',
        ifsc: currentTransporter?.bankDetails?.ifsc || '',
        place: currentTransporter?.bankDetails?.place || '',
        branch: currentTransporter?.bankDetails?.branch || '',
        accNo: currentTransporter?.bankDetails?.accNo || '',
      },
      paymentMode: currentTransporter?.paymentMode || '',
      panNo: currentTransporter?.panNo || '',
      gstNo: currentTransporter?.gstNo || '',
      transportType: currentTransporter?.transportType || '',
      agreementNo: currentTransporter?.agreementNo || '',
      tdsPercentage: currentTransporter?.tdsPercentage || 0,
      podCharges: currentTransporter?.podCharges || 0,
    }),
    [currentTransporter]
  );

  const methods = useForm({
    resolver: zodResolver(NewTransporterSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  const { bankDetails } = values;

  console.log({ errors });

  const onSubmit = async (data) => {
    try {
      if (!currentTransporter) {
        await createTransporter(data);
      } else {
        await updateTransporter({ id: currentTransporter._id, data });
      }
      reset();
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
          <Field.Text name="transportName" label="Transport Name" required />
          <Field.Text name="address" label="Address" required />
          <Field.Text name="place" label="Place" />
          <Field.Select name="state" label="State" required>
            <MenuItem value="">None</MenuItem>
            <Divider sx={{ borderStyle: 'dashed' }} />
            {STATES.map((state) => (
              <MenuItem key={state.value} value={state.value}>
                {state.label}
              </MenuItem>
            ))}
          </Field.Select>
          <Field.Text name="pinNo" label="Pin No" required />
          <Field.Text
            name="cellNo"
            label="Phone Number"
            required
            InputProps={{
              startAdornment: <InputAdornment position="start">+91 - </InputAdornment>,
            }}
          />
          <Field.Text name="ownerName" label="Owner Name" required />
          <Field.Text
            name="ownerPhoneNo"
            label="Owner Phone Number"
            required
            InputProps={{
              startAdornment: <InputAdornment position="start">+91 - </InputAdornment>,
            }}
          />
          <Field.Text name="emailId" label="Email ID" required />
        </Box>
      </Card>
    </>
  );

  const renderBankDetails = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Bank Details
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
          <Button
            fullWidth
            variant="outlined"
            onClick={bankDialogue.onTrue}
            sx={{
              height: 56,
              justifyContent: 'flex-start',
              typography: 'body2',
              borderColor: errors.bankDetails?.branch?.message ? 'error.main' : 'text.disabled',
            }}
            startIcon={
              <Iconify
                icon={bankDetails?.name ? 'mdi:bank' : 'mdi:bank-outline'}
                sx={{ color: bankDetails?.name ? 'primary.main' : 'text.disabled' }}
              />
            }
          >
            {bankDetails?.name || 'Select Bank *'}
          </Button>

          <Field.Text name="bankDetails.accNo" label="Account No" required />
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
          <Field.Text name="paymentMode" label="Payment Mode" required />
          <Field.Text name="panNo" label="PAN No" />
          <Field.Text name="gstNo" label="GST No" />
          <Field.Text
            name="tdsPercentage"
            label="TDS Percentage"
            required
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
          <Field.Text
            name="podCharges"
            label="POD Charges"
            required
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">₹ / Subtrip</InputAdornment>,
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

  const renderDialogues = () => (
    <BankListDialog
      title="Banks"
      open={bankDialogue.value}
      onClose={bankDialogue.onFalse}
      selected={(selectedIfsc) => bankDetails?.ifsc === selectedIfsc}
      onSelect={(bank) => {
        setValue('bankDetails.branch', bank?.branch);
        setValue('bankDetails.ifsc', bank?.ifsc);
        setValue('bankDetails.place', bank?.place);
        setValue('bankDetails.name', bank?.name);
      }}
      list={bankList}
      action={
        <Button
          size="small"
          startIcon={<Iconify icon="mingcute:add-line" />}
          sx={{ alignSelf: 'flex-end' }}
          onClick={() => {
            router.push(paths.dashboard.bank.new);
          }}
        >
          New
        </Button>
      }
    />
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
      {renderDialogues()}
    </Form>
  );
}
