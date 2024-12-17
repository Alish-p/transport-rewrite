import { toast } from 'sonner';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Button, Divider, Typography, IconButton } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

// redux
import { dispatch } from 'src/redux/store';
import { addCustomer, updateCustomer } from 'src/redux/slices/customer';

// components
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useRouter } from '../../routes/hooks';
import { useBoolean } from '../../hooks/use-boolean';
import { validateBankSelection } from '../bank/BankConfig';
import { BankListDialog } from '../bank/bank-list-dialogue';

export const NewCustomerSchema = zod.object({
  customerName: zod.string().min(1, { message: 'Customer Name is required' }),
  address: zod.string().min(1, { message: 'Address is required' }),
  place: zod.string().min(1, { message: 'Place is required' }),
  state: zod.string().min(1, { message: 'State is required' }),
  pinCode: zod
    .string()
    .min(6, { message: 'Pin Code must be exactly 6 digits' })
    .max(6, { message: 'Pin Code must be exactly 6 digits' })
    .regex(/^[0-9]{6}$/, { message: 'Pin Code must be a number' }),
  cellNo: schemaHelper.phoneNumber({
    message: {
      required_error: 'Guarantor Mobile No is required',
      invalid_error: 'Guarantor Mobile No must be exactly 10 digits',
    },
  }),
  GSTNo: zod.string().min(1, { message: 'GST No is required' }),
  PANNo: zod
    .string()
    .min(1, { message: 'PAN No is required' })
    .regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, {
      message: 'PAN No must be in the format: five letters followed by four digits and one letter',
    }),
  consignees: zod.array(
    zod.object({
      name: zod.string().min(1, { message: 'Name is required' }),
      address: zod.string().min(1, { message: 'Address is required' }),
      state: zod.string().min(1, { message: 'State is required' }),
      pinCode: zod
        .string()
        .min(6, { message: 'Pin Code must be exactly 6 digits' })
        .max(6, { message: 'Pin Code must be exactly 6 digits' })
        .regex(/^[0-9]{6}$/, { message: 'Pin Code must be a number' }),
    })
  ),
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
});

// ----------------------------------------------------------------------

export default function CustomerNewForm({ currentCustomer, bankList }) {
  const navigate = useNavigate();
  const router = useRouter();
  const bankDialogue = useBoolean();

  const defaultValues = useMemo(
    () => ({
      customerName: currentCustomer?.customerName || '',
      address: currentCustomer?.address || '',
      place: currentCustomer?.place || '',
      state: currentCustomer?.state || '',
      pinCode: currentCustomer?.pinCode || '',
      cellNo: currentCustomer?.cellNo || 0,
      GSTNo: currentCustomer?.GSTNo || '',
      PANNo: currentCustomer?.PANNo || '',
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
    }),
    [currentCustomer]
  );

  const methods = useForm({
    resolver: zodResolver(NewCustomerSchema),
    defaultValues,
    mode: 'onBlur',
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
        await dispatch(addCustomer(data));
      } else {
        await dispatch(updateCustomer(currentCustomer._id, data));
      }
      reset();
      toast.success(
        !currentCustomer ? 'Customer added successfully!' : 'Customer edited successfully!'
      );
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

  // Separate render methods

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
          <Field.Text name="customerName" label="Customer Name" />
          <Field.Text name="address" label="Address" />
          <Field.Text name="place" label="Place" />
          <Field.Text name="state" label="State" />
          <Field.Text name="pinCode" label="Pin Code" />
          <Field.Text name="cellNo" label="Cell No" />
          <Field.Text name="GSTNo" label="GST No" />
          <Field.Text name="PANNo" label="PAN No" />
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
                <Field.Text name={`consignees[${index}].name`} label="Consignee Name" />
              </Box>
              <Box gridColumn="span 2">
                <Field.Text name={`consignees[${index}].address`} label="Consignee Address" />
              </Box>
              <Box gridColumn="span 2">
                <Field.Text name={`consignees[${index}].state`} label="Consignee State" />
              </Box>
              <Box gridColumn="span 2">
                <Field.Text name={`consignees[${index}].pinCode`} label="Consignee Pin Code" />
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
