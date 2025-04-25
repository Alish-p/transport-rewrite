import * as z from 'zod';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { paths } from 'src/routes/paths';

import { useCreateInvoice } from 'src/query/use-invoice';

import InvoiceForm from './invoice-form';
import InvoicePreview from './invoice-preview';
import { schemaHelper } from '../../components/hook-form';

// Define the invoice schema
const InvoiceSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  billingPeriod: z.object({
    start: schemaHelper.date({
      required_error: 'Start date is required',
    }),
    end: schemaHelper.date({
      required_error: 'End date is required',
    }),
  }),
  subtripIds: z.array(z.string()).min(1, 'At least one subtrip must be selected'),
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
    formState: { isValid },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const createdInvoice = await createInvoice(data);
      navigate(paths.dashboard.invoice.details(createdInvoice._id));
    } catch (error) {
      console.error('Failed to create invoice', error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InvoiceForm customerList={customerList} />
        <InvoicePreview customerList={customerList} />
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
          <LoadingButton type="submit" size="large" variant="contained" disabled={!isValid}>
            Create Invoice
          </LoadingButton>
        </Stack>
      </form>
    </FormProvider>
  );
}
