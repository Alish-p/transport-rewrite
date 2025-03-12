import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';

import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { paths } from 'src/routes/paths';

import { fIsAfter, getFirstDayOfCurrentMonth } from 'src/utils/format-time';

import { Form, schemaHelper } from 'src/components/hook-form';

import DriverSalaryForm from './driver-salary-form';
import { usePendingLoans } from '../../query/use-loan';
import DriverSalaryPreview from './driver-salary-preview';
import { useCreateDriverPayroll } from '../../query/use-driver-payroll';
import { useTripsCompletedByDriverAndDate } from '../../query/use-subtrip';

// should match with db schema
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
    subtripComponents: zod.array(zod.string().min(1)).optional(),
    selectedLoans: zod.array(zod.string().min(1)).optional(),
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

export default function DriverSalaryFormAndPreview({ driverList }) {
  const navigate = useNavigate();
  const addDriverPayroll = useCreateDriverPayroll();

  const defaultValues = useMemo(
    () => ({
      _id: '',
      driverId: '',
      status: '',
      createdDate: new Date(),
      periodStartDate: getFirstDayOfCurrentMonth(),
      periodEndDate: new Date(),
      subtripComponents: [],
      otherSalaryComponent: [],
      selectedLoans: [],
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(DriverSalarySchema),
    defaultValues,
    mode: 'all',
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const {
    subtripComponents,
    driverId: selectedDriverID,
    createdDate,
    otherSalaryComponent,
    periodStartDate,
    periodEndDate,
    selectedLoans,
  } = watch();

  const { data: allSubTripsByDriver, refetch } = useTripsCompletedByDriverAndDate(
    selectedDriverID,
    periodStartDate,
    periodEndDate
  );

  // This callback will be passed to the child button
  const handleFetchSubtrips = () => {
    if (selectedDriverID && periodStartDate && periodEndDate) {
      refetch();
    }
  };

  const { data: pendingLoans } = usePendingLoans({
    borrowerType: 'Driver',
    borrowerId: selectedDriverID,
  });

  // Construct the draftDriverSalary object for the preview
  const draftDriverSalary = useMemo(() => {
    const selectedDriver = driverList.find((driver) => driver._id === selectedDriverID);
    return {
      // Match database schema names:
      subtripComponents: allSubTripsByDriver?.filter((st) => subtripComponents.includes(st._id)),
      selectedLoans: pendingLoans?.filter((loan) => selectedLoans.includes(loan._id)),
      otherSalaryComponent,
      driverId: selectedDriver || {},
      status: 'pending',
      createdDate: createdDate || new Date(),
      periodStartDate,
      periodEndDate,
    };
  }, [
    driverList,
    allSubTripsByDriver,
    pendingLoans,
    otherSalaryComponent,
    createdDate,
    periodStartDate,
    periodEndDate,
    selectedDriverID,
    subtripComponents,
    selectedLoans,
  ]);

  // Handle form submission (create)
  const onSubmit = async (data) => {
    try {
      const createdDriverSalaryslip = await addDriverPayroll(draftDriverSalary);
      navigate(paths.dashboard.driverSalary.details(createdDriverSalaryslip._id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <DriverSalaryForm
        driversList={driverList}
        loans={pendingLoans}
        filteredSubtrips={allSubTripsByDriver}
        onFetchSubtrips={handleFetchSubtrips}
      />
      <DriverSalaryPreview driverSalary={draftDriverSalary} />

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton type="submit" size="large" variant="contained" loading={isSubmitting}>
          Create Payslip
        </LoadingButton>
      </Stack>
    </Form>
  );
}
