import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';

import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { paths } from 'src/routes/paths';

import { fIsAfter, getFirstDayOfCurrentMonth } from 'src/utils/format-time';

import { usePendingLoans } from 'src/query/use-loan';
import { useClosedSubtripsByTransporterAndDate } from 'src/query/use-subtrip';
import { useCreateTransporterPayment } from 'src/query/use-transporter-payment';

import { Form, schemaHelper } from 'src/components/hook-form';

import TransporterPaymentForm from './transporter-payment-form';
import TransporterPaymentPreview from './transport-payment-preview';

// TransporterPayment Schema (Make sure this matches database schema)
export const TransporterPaymentSchema = zod
  .object({
    _id: zod.string().optional(),
    transporterId: zod.string().min(1),
    status: zod.string().optional(),
    createdDate: schemaHelper
      .date({ message: { required_error: 'Create date is required!' } })
      .optional(),
    dueDate: schemaHelper.date({ message: { required_error: 'Due date is required!' } }).optional(),
    fromDate: schemaHelper.date({ message: { required_error: 'From date is required!' } }),
    toDate: schemaHelper.date({ message: { required_error: 'To date is required!' } }),
    associatedSubtrips: zod.array(zod.string().min(1)).optional(),
    selectedLoans: zod.array(zod.string().min(1)).optional(),
  })
  .refine((data) => !fIsAfter(data.fromDate, data.toDate), {
    message: 'To-date cannot be earlier than From date!',
    path: ['toDate'],
  });

// Form values and api to create will have ids only
// draft transporterPayment object and api call to fetch will have ids and values

export default function TransporterPaymentFormAndPreview({ transporterList }) {
  const navigate = useNavigate();
  const createTransporterPayment = useCreateTransporterPayment();

  const defaultValues = useMemo(
    () => ({
      _id: '',
      transporterId: '',
      status: '',
      createdDate: new Date(),
      fromDate: getFirstDayOfCurrentMonth(),
      toDate: new Date(),
      dueDate: new Date(),
      associatedSubtrips: [],
      selectedLoans: [],
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(TransporterPaymentSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const {
    associatedSubtrips,
    transporterId: selectedTransporterID,
    createdDate,
    dueDate,
    selectedLoans,
    fromDate,
    toDate,
  } = watch();

  const { data: allSubTripsByTransporter, refetch } = useClosedSubtripsByTransporterAndDate(
    selectedTransporterID,
    fromDate,
    toDate
  );

  // This callback will be passed to the child button
  const handleFetchSubtrips = () => {
    if (selectedTransporterID && fromDate && toDate) {
      refetch();
    }
  };

  const { data: pendingLoans } = usePendingLoans({
    borrowerType: 'Transporter',
    borrowerId: selectedTransporterID,
  });

  // Construct the draftTransporterPayment object for the preview
  const draftTransporterPayment = useMemo(() => {
    const selectedTransporter = transporterList.find(
      (transporter) => transporter._id === selectedTransporterID
    );
    return {
      // Match your database schema names:
      associatedSubtrips: allSubTripsByTransporter?.filter((st) =>
        associatedSubtrips.includes(st._id)
      ),
      selectedLoans: pendingLoans?.filter((loan) => selectedLoans.includes(loan._id)),
      transporterId: selectedTransporter || {},
      status: 'draft',
      createdDate: createdDate || new Date(),
      dueDate: dueDate || null,
    };
  }, [
    transporterList,
    allSubTripsByTransporter,
    pendingLoans,
    createdDate,
    dueDate,
    selectedTransporterID,
    associatedSubtrips,
    selectedLoans,
  ]);

  // Handle form submission (create or update)
  const onSubmit = async () => {
    try {
      const createdTransporterPayment = await createTransporterPayment(draftTransporterPayment);
      navigate(paths.dashboard.transporterPayment.details(createdTransporterPayment._id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <TransporterPaymentForm
        transportersList={transporterList}
        loans={pendingLoans}
        filteredSubtrips={allSubTripsByTransporter}
        onFetchSubtrips={handleFetchSubtrips}
      />

      <TransporterPaymentPreview transporterPayment={draftTransporterPayment} />

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton type="submit" size="large" variant="contained" loading={isSubmitting}>
          Create Payment
        </LoadingButton>
      </Stack>
    </Form>
  );
}
