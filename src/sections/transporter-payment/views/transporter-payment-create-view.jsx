import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';

import { Stack, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { paramCase } from 'src/utils/change-case';
import { fIsAfter, getFirstDayOfCurrentMonth } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Form, schemaHelper } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import SubtripsSelectors from '../SubtripsSelectors';
import { calculateTransporterPayment } from '../../../utils/utils';
import TransporterPaymentDetails from '../transporter-payment-details';
import { addPayment } from '../../../redux/slices/transporter-payment';

export const TransporterPaymentSchema = zod
  .object({
    _id: zod.string().optional(),
    transporterId: zod.string().min(1),
    status: zod.string().optional(),
    createdDate: schemaHelper
      .date({ message: { required_error: 'Create date is required!' } })
      .optional(),
    periodStartDate: schemaHelper.date({ message: { required_error: 'From date is required!' } }),
    periodEndDate: schemaHelper.date({ message: { required_error: 'To date is required!' } }),
    completedSubtripData: zod.array(zod.string().min(1)).optional(), // all completed subtrips by a transporter
    selectedSubtrips: zod.array(zod.string().min(1)).optional(),

    totalPayment: zod
      .number({ required_error: 'Total amount is required' })
      .positive({ message: 'Total amount must be greater than zero' }),
  })
  .refine((data) => !fIsAfter(data.periodStartDate, data.periodEndDate), {
    message: 'To-date cannot be earlier than From date!',
    path: ['periodEndDate'],
  });

function calculateTotal(subtrips = []) {
  const totalAmount = subtrips.reduce((acc, trip) => acc + calculateTransporterPayment(trip), 0);

  return totalAmount;
}

export function TransporterPaymentCreateView({ transporterList }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      _id: '',
      transporterId: '',
      status: '',
      createdDate: new Date(),
      periodStartDate: getFirstDayOfCurrentMonth(),
      periodEndDate: new Date(),
      selectedSubtrips: [],
      totalPayment: 0,
      completedSubtripData: [],
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(TransporterPaymentSchema),
    defaultValues,
    mode: 'all',
  });

  const { handleSubmit, watch } = methods;

  const {
    selectedSubtrips,
    transporterId: selectedTransporterId,
    completedSubtripData,
    periodStartDate,
    periodEndDate,
    otherSalaryComponent,
  } = watch();

  const handleCreateAndSend = async () => {
    try {
      const subtripComponents = completedSubtripData
        .filter((st) => selectedSubtrips.includes(st._id))
        .map((subtripId) => ({
          subtripId,
          earnings: calculateTransporterPayment(subtripId),
        }));

      const paymentReciept = await dispatch(
        addPayment({
          transporterId: selectedTransporterId,
          selectedSubtrips,
          periodStartDate,
          periodEndDate,
          subtrips: subtripComponents,
          totalPayment: calculateTotal(subtripComponents),
        })
      );

      toast.success('Transporter Payment generated successfully!');

      // Navigate to the payroll details page using the created reciept's ID
      navigate(paths.dashboard.transporterPayment.details(paramCase(paymentReciept._id)));
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create Transporter Payment!');
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="TPR-XXX"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Transporter Payment', href: '/dashboard/transporter-payment' },
          { name: 'TPR-XXX' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={methods} onSubmit={handleSubmit(handleCreateAndSend)}>
        <SubtripsSelectors transporterList={transporterList} />
        <TransporterPaymentDetails
          selectedSubtripsData={completedSubtripData.filter((st) =>
            selectedSubtrips.includes(st._id)
          )}
          transporter={transporterList.find((tp) => tp._id === selectedTransporterId)}
        />
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button size="large" variant="contained" onClick={handleCreateAndSend}>
            Create
          </Button>
        </Stack>
      </Form>
    </DashboardContent>
  );
}
