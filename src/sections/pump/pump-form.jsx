// form
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Button, Divider, Typography, IconButton } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

// components
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useRouter } from '../../routes/hooks';
import { Iconify } from '../../components/iconify';
import { useBoolean } from '../../hooks/use-boolean';
import { validateBankSelection } from '../bank/BankConfig';
import { BankListDialog } from '../bank/bank-list-dialogue';
import { useCreatePump, useUpdatePump } from '../../query/use-pump';

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
          <Field.Text name="pumpName" label="Pump Name" />
          <Field.Text name="placeName" label="Place Name" />
          <Field.Text name="ownerName" label="Owner Name" />
          <Field.Text name="ownerCellNo" label="Owner Cell No" />
          <Field.Text name="pumpPhoneNo" label="Pump Phone No" />
          <Field.Text name="taluk" label="Taluk" />
          <Field.Text name="district" label="District" />
          <Field.Text name="contactPerson" label="Contact Person" />
          <Field.Text name="address" label="Address" />
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
