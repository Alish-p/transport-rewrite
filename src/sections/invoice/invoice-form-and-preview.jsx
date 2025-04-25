import * as z from 'zod';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import { Stack, Alert } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useCreateInvoice } from 'src/query/use-invoice';

import InvoiceForm from './invoice-form';
import InvoicePreview from './invoice-preview';
import { schemaHelper } from '../../components/hook-form';

// Define the invoice schema with enhanced validation
const InvoiceSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  billingPeriod: z
    .object({
      start: schemaHelper.date({
        required_error: 'Start date is required',
      }),
      end: schemaHelper.date({
        required_error: 'End date is required',
      }),
    })
    .refine(
      (data) => {
        if (!data.start || !data.end) return true;
        return (
          dayjs(data.end).isAfter(dayjs(data.start)) || dayjs(data.end).isSame(dayjs(data.start))
        );
      },
      {
        message: 'End date must be after or equal to start date',
        path: ['end'],
      }
    ),
  subtripIds: z
    .array(z.string())
    .min(1, 'At least one subtrip must be selected')
    .max(100, 'Maximum 100 subtrips can be selected at once'),
});

// Parent Component
export default function InvoiceFormAndPreview({ customerList }) {
  const navigate = useNavigate();
  const createInvoice = useCreateInvoice();

  const methods = useForm({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: {
      customerId: '',
      billingPeriod: {
        start: dayjs().startOf('month'),
        end: dayjs(),
      },
      subtripIds: [],
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
    setError,
  } = methods;

  const onSubmit = async (data) => {
    try {
      // Additional security checks
      if (
        !data.customerId ||
        !data.billingPeriod?.start ||
        !data.billingPeriod?.end ||
        !data.subtripIds?.length
      ) {
        setError('root', {
          type: 'manual',
          message: 'Please complete all required fields',
        });
        return;
      }

      // Validate date range
      if (dayjs(data.billingPeriod.end).isBefore(dayjs(data.billingPeriod.start))) {
        setError('billingPeriod.end', {
          type: 'manual',
          message: 'End date must be after start date',
        });
        return;
      }

      const createdInvoice = await createInvoice(data);
      navigate(paths.dashboard.invoice.details(createdInvoice._id));
    } catch (error) {
      console.error('Failed to create invoice', error);
      setError('root', {
        type: 'manual',
        message: error.message || 'Failed to create invoice. Please try again.',
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {errors.root && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.root.message}
          </Alert>
        )}
        <InvoiceForm customerList={customerList} />
        <InvoicePreview customerList={customerList} />
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
          <LoadingButton
            type="submit"
            size="large"
            variant="contained"
            disabled={!isValid}
            loading={isSubmitting}
          >
            Create Invoice
          </LoadingButton>
        </Stack>
      </form>
    </FormProvider>
  );
}
