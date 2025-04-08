// form
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Button, Divider, Typography } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useCreatePump, useUpdatePump } from 'src/query/use-pump';

import { Iconify } from 'src/components/iconify';
// components
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { BankListDialog } from '../bank/bank-list-dialogue';

// ----------------------------------------------------------------------

export const NewPumpSchema = zod.object({
  pumpName: zod.string().min(1, { message: 'Pump Name is required' }),
  placeName: zod.string().min(1, { message: 'Place Name is required' }),
  ownerName: zod.string().min(1, { message: 'Owner Name is required' }),
  ownerCellNo: schemaHelper.phoneNumber({
    message: {
      required_error: 'Owner Mobile No is required',
      invalid_error: 'Owner Mobile No must be exactly 10 digits',
    },
  }),
  pumpPhoneNo: schemaHelper.phoneNumber({
    message: {
      required_error: 'Pump Mobile No is required',
      invalid_error: 'Pump Mobile No must be exactly 10 digits',
    },
  }),
  taluk: zod.string().min(1, { message: 'Taluk is required' }),
  district: zod.string().min(1, { message: 'District is required' }),
  contactPerson: zod.string().min(1, { message: 'Contact Person is required' }),
  address: zod.string().min(1, { message: 'Address is required' }),
  bankDetails: zod.object({
    name: zod.string().min(1, { message: 'Bank Name is required' }),
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

export default function PumpForm({ currentPump, bankList }) {
  const navigate = useNavigate();
  const router = useRouter();
  const bankDialogue = useBoolean();

  const createPump = useCreatePump();
  const updatePump = useUpdatePump();

  const defaultValues = useMemo(
    () => ({
      pumpName: currentPump?.pumpName || '',
      placeName: currentPump?.placeName || '',
      ownerName: currentPump?.ownerName || '',
      ownerCellNo: currentPump?.ownerCellNo || '',
      pumpPhoneNo: currentPump?.pumpPhoneNo || '',
      taluk: currentPump?.taluk || '',
      district: currentPump?.district || '',
      contactPerson: currentPump?.contactPerson || '',
      address: currentPump?.address || '',
      bankDetails: {
        name: currentPump?.bankDetails?.name || '',
        ifsc: currentPump?.bankDetails?.ifsc || '',
        place: currentPump?.bankDetails?.place || '',
        branch: currentPump?.bankDetails?.branch || '',
        accNo: currentPump?.bankDetails?.accNo || '',
      },
    }),
    [currentPump]
  );

  const methods = useForm({
    resolver: zodResolver(NewPumpSchema),
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
      if (!currentPump) {
        await createPump(data);
      } else {
        await updatePump({ id: currentPump._id, data });
      }
      reset();
      navigate(paths.dashboard.pump.list);
    } catch (error) {
      console.error(error);
    }
  };

  const renderPumpDetails = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Pump Details
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
          <Field.Text name="pumpName" label="Pump Name" required />
          <Field.Text name="placeName" label="Place Name" required />
          <Field.Text name="ownerName" label="Owner Name" required />
          <Field.Text name="ownerCellNo" label="Owner Cell No" required />
          <Field.Text name="pumpPhoneNo" label="Pump Phone No" required />
          <Field.Text name="taluk" label="Taluk" required />
          <Field.Text name="district" label="District" required />
          <Field.Text name="contactPerson" label="Contact Person" required />
          <Field.Text name="address" label="Address" required />
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

  const renderActions = () => (
    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        {!currentPump ? 'Create Pump' : 'Save Changes'}
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
          {renderPumpDetails()}
          {renderBankDetails()}
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {renderActions()}
      {renderDialogues()}
    </Form>
  );
}
