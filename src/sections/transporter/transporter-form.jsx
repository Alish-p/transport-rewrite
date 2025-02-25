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
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useRouter } from '../../routes/hooks';
import { Iconify } from '../../components/iconify';
import { useBoolean } from '../../hooks/use-boolean';
import { validateBankSelection } from '../bank/BankConfig';
import { BankListDialog } from '../bank/bank-list-dialogue';
import { useCreateTransporter, useUpdateTransporter } from '../../query/use-transporter';

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
  cellNo: schemaHelper.phoneNumber({
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
    name: zod.string().min(1, { message: 'Name is required' }),
    branch: zod.string().min(1, { message: 'Bank Detail is required' }),
    ifsc: zod.string().min(1, { message: 'IFSC Code is required' }),
    place: zod.string().min(1, { message: 'Place is required' }),
    accNo: zod
      .string()
      .min(1, { message: 'Account No is required' })
      .regex(/^[0-9]{9,18}$/, { message: 'Account No must be between 9 and 18 digits' }),
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
          <Field.Text name="transportName" label="Transport Name" />
          <Field.Text name="address" label="Address" />
          <Field.Text name="place" label="Place" />
          <Field.Text name="pinNo" label="Pin No" />
          <Field.Text
            name="cellNo"
            label="Phone Number"
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
      </Typography>
      <Card sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={1} my={1}>
          <Grid item xs={12} sm={6}>
            <Stack sx={{ width: 1 }}>
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  mb: 1,
                  border: '1px solid grey',
                  borderRadius: '10px',
                  cursor: 'pointer',

                  borderColor: errors.bankDetails?.branch?.message ? 'error.main' : 'text.disabled',
                }}
                p={1}
                onClick={bankDialogue.onTrue}
              >
                <Typography variant="subtitle2" sx={{ color: 'text.disabled', flexGrow: 1 }}>
                  Bank Details
                </Typography>
                <IconButton>
                  <Iconify icon="solar:pen-bold" />
                </IconButton>
              </Stack>

              <Typography typography="caption" sx={{ color: 'error.main', px: 1 }}>
                {errors.bankDetails?.branch?.message}
              </Typography>

              <Stack direction="row" alignItems="center" sx={{ my: 1 }}>
                <Field.Text name="bankDetails.accNo" label="Account No" />
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1}>
            <Divider orientation="vertical" />
          </Grid>

          <Grid item xs={12} sm={4}>
            {validateBankSelection(bankDetails) && (
              <Stack spacing={1} alignItems="center" mb={1}>
                <Typography variant="subtitle2" color="primary.main">
                  {bankDetails?.name}
                </Typography>
                <Typography variant="body2">{`${bankDetails?.branch} , ${bankDetails?.place} `}</Typography>
                <Typography variant="body2">{bankDetails?.ifsc}</Typography>
                <Typography variant="body2" color="GrayText">
                  {bankDetails?.accNo}
                </Typography>
              </Stack>
            )}
          </Grid>
        </Grid>
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
