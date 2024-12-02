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
import { addPayrollReceipt } from 'src/redux/slices/driver-payroll';

import { toast } from 'src/components/snackbar';
import { Form, schemaHelper } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import SubtripsSelectors from '../SubtripsSelectors';
import DriverSalaryDetails from '../driver-salary-details';
import { calculateDriverSalary } from '../../../utils/utils';
import ExtraSalaryComponent from '../extra-salary-component';

export const DriverSalarySchema = zod
  .object({
    _id: zod.string().optional(),
    driverId: zod.string().min(1),
    status: zod.string().optional(),
    createdDate: schemaHelper
      .date({ message: { required_error: 'Create date is required!' } })
      .optional(),
    periodStartDate: schemaHelper.date({ message: { required_error: 'From date is required!' } }),
    periodEndDate: schemaHelper.date({ message: { required_error: 'To date is required!' } }),
    completedSubtripData: zod.array(zod.string().min(1)).optional(), // all completed subtrips by a driver
    selectedSubtrips: zod.array(zod.string().min(1)).optional(),

    totalSalary: zod
      .number({ required_error: 'Total amount is required' })
      .positive({ message: 'Total amount must be greater than zero' }),

    otherSalaryComponent: zod.array(
      zod.object({
        paymentType: zod.string().min(1, { message: 'Payment Type is required' }),
        amount: zod.number().min(1, { message: 'Amount is required' }),
        remarks: zod.string().min(1, { message: 'Invalid Remarks' }),
      })
    ),
  })
  .refine((data) => !fIsAfter(data.periodStartDate, data.periodEndDate), {
    message: 'To-date cannot be earlier than From date!',
    path: ['periodEndDate'],
  });

function calculateTotal(subtrips = [], otherSalary = []) {
  const tripSalary = subtrips.reduce((acc, trip) => acc + calculateDriverSalary(trip), 0);
  const extraSalary = otherSalary.reduce((acc, i) => acc + i.amount, 0);

  return tripSalary + extraSalary;
}

export function DriverPayrollCreateView({ driverList }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      _id: '',
      driverId: '',
      status: '',
      createdDate: new Date(),
      periodStartDate: getFirstDayOfCurrentMonth(),
      periodEndDate: new Date(),
      selectedSubtrips: [],
      totalSalary: 0,
      completedSubtripData: [],
      otherSalaryComponent: [],
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(DriverSalarySchema),
    defaultValues,
    mode: 'all',
  });

  const { handleSubmit, watch } = methods;

  const {
    selectedSubtrips,
    driverId: selectedDriverID,
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
          earnings: calculateDriverSalary(subtripId),
        }));

      const payrollReciept = await dispatch(
        addPayrollReceipt({
          driverId: selectedDriverID,
          selectedSubtrips,
          periodStartDate,
          periodEndDate,
          otherSalaryComponent,
          subtripComponents,
          // totalSalary: calculateTotal(subtripComponents, otherSalaryComponent),
        })
      );

      toast.success('Invoice generated successfully!');

      // Navigate to the payroll details page using the created reciept's ID
      navigate(paths.dashboard.driverPayroll.details(paramCase(payrollReciept._id)));
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create invoice!');
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="PAY-XXX"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Payroll', href: '/dashboard/driver-payroll' },
          { name: 'PAY-XXX' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={methods} onSubmit={handleSubmit(handleCreateAndSend)}>
        <SubtripsSelectors driversList={driverList} />
        <ExtraSalaryComponent />
        <DriverSalaryDetails
          selectedSubtripsData={completedSubtripData.filter((st) =>
            selectedSubtrips.includes(st._id)
          )}
          otherSalaryComponent={otherSalaryComponent}
          driver={driverList.find((driver) => driver._id === selectedDriverID)}
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
