import * as z from 'zod';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import { Stack, Alert } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useCreateTransporterPayment } from 'src/query/use-transporter-payment';

import { schemaHelper } from 'src/components/hook-form';

import TransporterPaymentForm from './transporter-payment-form';
import TransporterPaymentPreview from './transporter-payment-preview';

// Define the transporter payment schema
const TransporterPaymentSchema = z.object({
  transporterId: z.string().min(1, 'Transporter is required'),
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
  associatedSubtrips: z
    .array(z.string())
    .min(1, 'At least one subtrip must be selected')
    .max(100, 'Maximum 100 subtrips can be selected at once'),
});

// Parent Component
export default function TransporterPaymentFormAndPreview({ transporterList }) {
  const navigate = useNavigate();
  const createTransporterPayment = useCreateTransporterPayment();

  const methods = useForm({
    resolver: zodResolver(TransporterPaymentSchema),
    defaultValues: {
      transporterId: '',
      billingPeriod: {
        start: dayjs().startOf('month'),
        end: dayjs(),
      },
      associatedSubtrips: [],
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
        !data.transporterId ||
        !data.billingPeriod?.start ||
        !data.billingPeriod?.end ||
        !data.associatedSubtrips?.length
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

      const selectedTransporter = transporterList?.find((t) => t._id === data.transporterId);

      const createdPayment = await createTransporterPayment({
        ...data,
        additionalCharges: [
          {
            label: 'POD Charges',
            amount: data.associatedSubtrips.length * selectedTransporter.podCharges,
          },
        ],
      });
      navigate(paths.dashboard.transporterPayment.details(createdPayment._id));
    } catch (error) {
      console.error('Failed to create transporter payment', error);
      setError('root', {
        type: 'manual',
        message: error.message || 'Failed to create transporter payment. Please try again.',
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
        <TransporterPaymentForm transporterList={transporterList} />
        <TransporterPaymentPreview transporterList={transporterList} />
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
          <LoadingButton
            type="submit"
            size="large"
            variant="contained"
            disabled={!isValid}
            loading={isSubmitting}
          >
            Create Payment
          </LoadingButton>
        </Stack>
      </form>
    </FormProvider>
  );
}
