import { z as zod } from 'zod';
import { useMemo } from 'react';
// form
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Button, Divider, MenuItem, CardHeader, InputAdornment } from '@mui/material';

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

export const NewTransporterSchema = zod
  .object({
    transportName: zod.string().min(1, { message: 'Transport Name is required' }),
    address: zod.string().min(1, { message: 'Address is required' }),
    state: zod.string().min(1, { message: 'State is required' }),

    pinNo: schemaHelper.pinCodeOptional({
      message: { invalid_error: 'Pin Code must be exactly 6 digits' },
    }),

    cellNo: schemaHelper.phoneNumber({
      message: {
        required_error: 'Mobile No is required',
        invalid_error: 'Mobile No must be exactly 10 digits',
      },
    }),
    ownerName: zod.string().min(1, { message: 'Owner Name is required' }),
    emailId: zod.string().email({ message: 'Email ID must be a valid email' }).or(zod.literal('')),
    paymentMode: zod.string().optional(),
    panNo: zod.string(),
    gstEnabled: zod.boolean(),
    gstNo: zod.string().optional(),
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
  })
  .superRefine((data, ctx) => {
    if (data.gstEnabled && !data.gstNo) {
      ctx.addIssue({
        path: ['gstNo'],
        code: zod.ZodIssueCode.custom,
        message: 'GST No is required when GST is enabled',
      });
    }
  });

// ----------------------------------------------------------------------

export default function TransporterForm({ currentTransporter }) {
  const navigate = useNavigate();
  const router = useRouter();
  const bankDialogue = useBoolean();

  const createTransporter = useCreateTransporter();
  const updateTransporter = useUpdateTransporter();

  const defaultValues = useMemo(
    () => ({
      transportName: currentTransporter?.transportName || '',
      address: currentTransporter?.address || '',
      state: currentTransporter?.state || '',
      pinNo: currentTransporter?.pinNo || '',
      cellNo: currentTransporter?.cellNo || '',
      ownerName: currentTransporter?.ownerName || '',
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
      gstEnabled: currentTransporter?.gstEnabled ?? false,
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
    <Card>
      <CardHeader title="Transporter Details" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="transportName" label="Transport Name" />
        <Field.Text name="address" label="Address" multiline rows={4} placeholder="123 MG Road, Bengaluru, Karnataka 560001" />
        <Field.Select name="state" label="State" >
          <MenuItem value="">None</MenuItem>
          <Divider sx={{ borderStyle: 'dashed' }} />
          {STATES.map((state) => (
            <MenuItem key={state.value} value={state.value}>
              {state.label}
            </MenuItem>
          ))}
        </Field.Select>
        <Field.Text name="pinNo" label="Pin Code (Optional) " placeholder="400001" />
        <Field.Text
          name="cellNo"
          label="Phone Number"
          InputProps={{
            startAdornment: <InputAdornment position="start">+91 - </InputAdornment>,
          }}
        />
        <Field.Text name="ownerName" label="Owner Name" />
        <Field.Text name="emailId" label="Email ID (Optional)" />
      </Stack>
    </Card>
  );

  const renderBankDetails = () => (
    <Card >
      <CardHeader title="Bank Details" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
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
          {bankDetails?.name || 'Select Bank'}
        </Button>

        <Field.Text name="bankDetails.accNo" label="Account No" />
      </Stack>
    </Card>
  );

  const renderAdditionalDetails = () => (
    <Card >
      <CardHeader title="Additional Details" sx={{ mb: 3 }} />
      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="paymentMode" label="Payment Mode (Optional)" placeholder="Cash, UPI, NEFT, Cheque" />
        <Field.Text name="panNo" label="PAN No (Optional)" placeholder="ABCDE1234F" />

        <Field.Text
          name="tdsPercentage"
          label="TDS Percentage"
          type="number"
          InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
        />
        <Field.Text
          name="podCharges"
          label="POD Charges"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">₹ / Subtrip</InputAdornment>,
          }}
        />
        <Field.Switch name="gstEnabled" label="GST Enabled" />

        {values.gstEnabled && (
          <Field.Text name="gstNo" label="GST No" helperText="Enter only if GST is enabled" placeholder="22ABCDE1234F1Z5" />
        )}
      </Stack>
    </Card>
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
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderTransporterDetails()}
        {renderBankDetails()}
        {renderAdditionalDetails()}
        {renderActions()}
      </Stack>
      {renderDialogues()}
    </Form>
  );
}