
import axios from 'axios';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
// In your BankForm component (e.g. src/components/BankForm.tsx)
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
// @mui
import { Box, Card, Grid, Stack, Typography, CircularProgress } from '@mui/material';

// routes & queries
import { paths } from 'src/routes/paths';

import { useCreateBank, useUpdateBank } from 'src/query/use-bank';

// components
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------
export const NewBankSchema = zod.object({
  ifsc: zod
    .string()
    .transform((v) => v.trim().toUpperCase())
    .refine((v) => v.length === 11, { message: 'IFSC must be 11 characters' }),
  name: zod.string().min(1, { message: 'Bank Name is required' }),
  branch: zod.string().min(1, { message: 'Branch is required' }),
  place: zod.string().min(1, { message: 'Place is required' }),
});

const ifscClient = axios.create({
  baseURL: 'https://ifsc.razorpay.com',
  // ensure no credentials or extra headers are sent
  withCredentials: false,
  headers: {},
});

export default function BankForm({ currentBank }) {
  const navigate = useNavigate();
  const createBank = useCreateBank();
  const updateBank = useUpdateBank();

  const defaultValues = useMemo(
    () => ({
      ifsc: currentBank?.ifsc || '',
      name: currentBank?.name || '',
      branch: currentBank?.branch || '',
      place: currentBank?.place || '',
    }),
    [currentBank]
  );

  const methods = useForm({
    resolver: zodResolver(NewBankSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [ifscLoading, setIfscLoading] = useState(false);
  const ifscValue = watch('ifsc');

  useEffect(() => {
    const code = ifscValue;
    if (!code || code.length !== 11) return;

    setIfscLoading(true);
    ifscClient
      .get(`/${code}`)
      .then(({ data }) => {
        setValue('name', data.BANK || '');
        setValue('branch', data.BRANCH || '');
        setValue('place', data.CENTRE || '');
        clearErrors('ifsc');
      })
      .catch((err) => {
        setError('ifsc', {
          type: 'manual',
          message:
            err.response?.status === 404
              ? 'Invalid IFSC code'
              : 'Network error, please try again',
        });
        console.error('IFSC lookup failed:', err);
      })
      .finally(() => {
        setIfscLoading(false);
      });
  }, [ifscValue, setValue, setError, clearErrors]);

  const onSubmit = async (data) => {
    try {
      if (!currentBank) {
        await createBank(data);
      } else {
        await updateBank({ id: currentBank._id, data });
      }
      reset();
      navigate(paths.dashboard.bank.list);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* IFSC Code Card */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            IFSC Lookup
          </Typography>
          <Card sx={{ p: 3, mb: 3 }}>
            <Stack spacing={2}>
              <Field.Text
                name="ifsc"
                label="IFSC"
                required
                InputProps={{
                  endAdornment: ifscLoading && (
                    <CircularProgress size={20} />
                  ),
                }}
              />
            </Stack>
          </Card>
        </Grid>

        {/* Bank Details Card */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Bank Details
          </Typography>
          <Card sx={{ p: 3, mb: 3 }}>
            <Box
              display="grid"
              rowGap={3}
              columnGap={2}
              gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
            >
              <Field.Text name="name" label="Bank Name" required />
              <Field.Text name="branch" label="Branch" required />
              <Field.Text name="place" label="Place" required />
            </Box>
          </Card>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Stack alignItems="flex-end">
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              {!currentBank ? 'Create Bank' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
