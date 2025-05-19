import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

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

import { useCreateCustomer, useUpdateCustomer } from 'src/query/use-customer';

// components
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { STATES } from './config';
import { BankListDialog } from '../bank/bank-list-dialogue';

export const NewCustomerSchema = zod
  .object({
    customerName: zod.string().min(1, { message: 'Customer Name is required' }),
    gstEnabled: zod.boolean(),
    GSTNo: zod.string().optional(),
    PANNo: zod.string().min(1, { message: 'PAN No is required' }),
    address: zod.string().min(1, { message: 'Address is required' }),
    place: zod.string(),
    state: zod.string().min(1, { message: 'State is required' }),
    invoiceDueInDays: zod.number().min(1, { message: 'Invoice Due In Days is required' }),
    pinCode: schemaHelper.pinCode({
      message: {
        required_error: 'Pin Code is required',
        invalid_error: 'Pin Code must be exactly 6 digits',
      },
    }),
    cellNo: schemaHelper.phoneNumber({
      message: {
        required_error: 'Mobile No is required',
        invalid_error: 'Mobile No must be exactly 10 digits',
      },
    }),
    consignees: zod.array(
      zod.object({
        name: zod.string().min(1, { message: 'Name is required' }),
        address: zod.string().min(1, { message: 'Address is required' }),
        state: zod.string().min(1, { message: 'State is required' }),
        pinCode: schemaHelper.pinCode({
          message: {
            required_error: 'Consignee Pin Code is required',
            invalid_error: 'Consignee Pin Code must be exactly 6 digits',
          },
        }),
      })
    ),
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
    transporterCode: zod.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.gstEnabled && !data.GSTNo) {
      ctx.addIssue({
        path: ['GSTNo'],
        code: zod.ZodIssueCode.custom,
        message: 'GST No is required when GST is enabled',
      });
    }
  });

// ----------------------------------------------------------------------

export default function CustomerNewForm({ currentCustomer, bankList }) {
  const navigate = useNavigate();
  const router = useRouter();
  const bankDialogue = useBoolean();

  const addCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const defaultValues = useMemo(
    () => ({
      customerName: currentCustomer?.customerName || '',
      address: currentCustomer?.address || '',
      place: currentCustomer?.place || '',
      state: currentCustomer?.state || '',
      pinCode: currentCustomer?.pinCode || '',
      cellNo: currentCustomer?.cellNo || '',
      gstEnabled: currentCustomer?.gstEnabled ?? false,
      GSTNo: currentCustomer?.GSTNo || '',
      PANNo: currentCustomer?.PANNo || '',
      invoiceDueInDays: currentCustomer?.invoiceDueInDays || 10,
      consignees: currentCustomer?.consignees || [
        { name: '', address: '', state: '', pinCode: '' },
      ],
      bankDetails: {
        name: currentCustomer?.bankDetails?.name || '',
        ifsc: currentCustomer?.bankDetails?.ifsc || '',
        place: currentCustomer?.bankDetails?.place || '',
        branch: currentCustomer?.bankDetails?.branch || '',
        accNo: currentCustomer?.bankDetails?.accNo || '',
      },
      transporterCode: currentCustomer?.transporterCode || '',
    }),
    [currentCustomer]
  );

  const methods = useForm({
    resolver: zodResolver(NewCustomerSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    reset,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  const { bankDetails } = values;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'consignees',
  });

  const onSubmit = async (data) => {
    try {
      if (!currentCustomer) {
        await addCustomer(data);
      } else {
        await updateCustomer({ id: currentCustomer._id, data });
      }
      reset();

      navigate(paths.dashboard.customer.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddConsignee = () => {
    append({ name: '', address: '', state: '', pinCode: '' });
  };

  const handleRemoveConsignee = (index) => {
    remove(index);
  };

  const renderCustomerDetails = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Customer Details
      </Typography>
      <Card sx={{ p: 3, mb: 3 }}>
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <Field.Text name="customerName" label="Customer Name" required />
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
          <Field.Text name="pinCode" label="Pin Code" required />
          <Field.Text name="cellNo" label="Cell No" required />
          <Field.Text name="PANNo" label="PAN No" required />
          <Field.Text
            name="transporterCode"
            label="Transporter Code"
            helperText="Enter the unique identifier provided by the customer for their transportation services"
          />
          <Field.Text
            name="invoiceDueInDays"
            label="Invoice Due In Days"
            required
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">Days</InputAdornment>,
            }}
          />

          <Stack direction="row" spacing={2} alignItems="center">
            <Field.Switch name="gstEnabled" label="GST Enabled" />

            {values.gstEnabled && <Field.Text name="GSTNo" label="GST No" required />}
          </Stack>
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

  const renderConsignees = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Consignees
      </Typography>
      <Card sx={{ p: 3, mb: 3 }}>
        {fields.map((field, index) => (
          <Stack key={field.id} spacing={2} sx={{ mt: 2 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(9, 1fr)',
              }}
            >
              <Box gridColumn="span 2">
                <Field.Text name={`consignees[${index}].name`} label="Consignee Name" required />
              </Box>
              <Box gridColumn="span 2">
                <Field.Text
                  name={`consignees[${index}].address`}
                  label="Consignee Address"
                  required
                />
              </Box>
              <Box gridColumn="span 2">
                <Field.Text name={`consignees[${index}].state`} label="Consignee State" required />
              </Box>
              <Box gridColumn="span 2">
                <Field.Text
                  name={`consignees[${index}].pinCode`}
                  label="Consignee Pin Code"
                  required
                />
              </Box>
              <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                <Button
                  size="small"
                  color="error"
                  startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                  onClick={() => handleRemoveConsignee(index)}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          </Stack>
        ))}

        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAddConsignee}
          sx={{ mt: 3 }}
        >
          Add Consignee
        </Button>
      </Card>
    </>
  );

  const renderActions = () => (
    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        {!currentCustomer ? 'Create Customer' : 'Save Changes'}
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
        <Grid item xs={12} md={12}>
          {renderCustomerDetails()}
          {renderBankDetails()}
          {renderConsignees()}
        </Grid>
      </Grid>

      {renderActions()}
      {renderDialogues()}
    </Form>
  );
}
