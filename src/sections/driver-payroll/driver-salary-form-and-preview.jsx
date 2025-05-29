import * as z from 'zod';
import React from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import { Stack, Alert } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { useCreateDriverPayroll } from 'src/query/use-driver-payroll';

import { schemaHelper } from 'src/components/hook-form';

import DriverSalaryForm from './driver-salary-form';
import DriverSalaryPreview from './driver-salary-preview';

// Zod schema for driver salary form
const DriverSalarySchema = z.object({
  driverId: z.string().min(1, 'Driver is required'),
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
  associatedSubtrips: z.array(z.string()).min(1, 'At least one subtrip must be selected'),
  additionalPayments: z
    .array(
      z.object({
        label: z.string().min(1, 'Label required'),
        amount: z.number().min(0, 'Amount must be ≥ 0'),
      })
    )
    .optional(),
  additionalDeductions: z
    .array(
      z.object({
        label: z.string().min(1, 'Label required'),
        amount: z.number().min(0, 'Amount must be ≥ 0'),
      })
    )
    .optional(),
});

export default function DriverSalaryFormAndPreview({ driverList }) {
  const navigate = useNavigate();
  const createDriverSalary = useCreateDriverPayroll();

  const methods = useForm({
    resolver: zodResolver(DriverSalarySchema),
    defaultValues: {
      driverId: '',
      billingPeriod: {
        start: dayjs().startOf('month'),
        end: dayjs(),
      },
      associatedSubtrips: [],
      additionalPayments: [],
      additionalDeductions: [],
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
      const saved = await createDriverSalary(data);
      navigate(paths.dashboard.driverSalary.details(saved._id));
    } catch (err) {
      setError('root', { type: 'manual', message: err.message || 'Failed to create salary.' });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {errors.root && (
          <Alert severity="error" sx={{ my: 2 }}>
            {errors.root.message}
          </Alert>
        )}
        <DriverSalaryForm driverList={driverList} />
        <DriverSalaryPreview driverList={driverList} />
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
          <LoadingButton
            type="submit"
            variant="contained"
            disabled={!isValid}
            loading={isSubmitting}
          >
            Create Salary
          </LoadingButton>
        </Stack>
      </form>
    </FormProvider>
  );
}
