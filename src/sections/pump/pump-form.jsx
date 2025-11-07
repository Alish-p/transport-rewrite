// form
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Button, Divider, CardHeader } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useCreatePump, useUpdatePump } from 'src/query/use-pump';

import { Iconify } from 'src/components/iconify';
// components
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { BankDetailsWidget } from 'src/components/bank/bank-details-widget';

// ----------------------------------------------------------------------

export const NewPumpSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required' }),
  phone: schemaHelper.phoneNumber({
    message: {
      required_error: 'Phone is required',
      invalid_error: 'Phone must be exactly 10 digits',
    },
  }),
  address: zod.string().min(1, { message: 'Address is required' }),
  ownerName: zod.string().min(1, { message: 'Owner Name is required' }),
  bankAccount: zod.object({
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

export default function PumpForm({ currentPump }) {
  const navigate = useNavigate();
  const bankDialog = useBoolean();

  const createPump = useCreatePump();
  const updatePump = useUpdatePump();

  const defaultValues = useMemo(
    () => ({
      name: currentPump?.name || '',
      phone: currentPump?.phone || '',
      address: currentPump?.address || '',
      ownerName: currentPump?.ownerName || '',
      bankAccount: {
        name: currentPump?.bankAccount?.name || '',
        ifsc: currentPump?.bankAccount?.ifsc || '',
        place: currentPump?.bankAccount?.place || '',
        branch: currentPump?.bankAccount?.branch || '',
        accNo: currentPump?.bankAccount?.accNo || '',
      },
    }),
    [currentPump]
  );

  const methods = useForm({
    resolver: zodResolver(NewPumpSchema),
    defaultValues,
    mode: 'all',
  });

  const { reset, watch, handleSubmit, formState: { isSubmitting, errors } } = methods;

  const values = watch();

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

  const renderPumpDetails = (
    <Card>
      <CardHeader title="Pump Details" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="name" label="Pump Name" />
        <Field.Text name="ownerName" label="Owner Name" />
        <Field.Text name="phone" label="Phone" />
        <Field.Text name="address" label="Address" multiline rows={4} />
      </Stack>
    </Card>
  );

  const renderbankAccount = (
    <Card>
      <CardHeader title="Bank Details" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        {(() => {
          const bd = values?.bankAccount || {};
          const summary = bd?.name
            ? `${bd.name}${bd.branch ? ` • ${bd.branch}` : ''}${bd.place ? ` • ${bd.place}` : ''}${bd.accNo ? ` • A/C ${bd.accNo}` : ''}`
            : 'Add bank details';
          const hasError = Boolean(errors?.bankAccount);
          return (
            <>
              <Button
                fullWidth
                variant="outlined"
                onClick={bankDialog.onTrue}
                startIcon={<Iconify icon={bd?.name ? 'mdi:bank' : 'mdi:bank-outline'} />}
                sx={{
                  height: 56,
                  justifyContent: 'flex-start',
                  typography: 'body2',
                  borderColor: hasError ? 'error.main' : 'text.disabled',
                  color: hasError ? 'error.main' : 'text.primary',
                }}
              >
                {summary}
              </Button>

              <BankDetailsWidget
                variant="dialog"
                title="Bank Details"
                open={bankDialog.value}
                onClose={bankDialog.onFalse}
                compact={false}
                fieldNames={{
                  ifsc: 'bankAccount.ifsc',
                  name: 'bankAccount.name',
                  branch: 'bankAccount.branch',
                  place: 'bankAccount.place',
                  accNo: 'bankAccount.accNo',
                }}
              />
            </>
          );
        })()}
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        {!currentPump ? 'Create Pump' : 'Save Changes'}
      </LoadingButton>
    </Stack>
  );

  // Bank selection dialog removed; no extra dialogues to render

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderPumpDetails}
        {renderbankAccount}
        {renderActions}
      </Stack>
      {/* Bank selection dialog removed in favor of inline bank details widget */}
    </Form>
  );
}
