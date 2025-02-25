import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Divider, MenuItem, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { today } from 'src/utils/format-time';
import { paramCase } from 'src/utils/change-case';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useCreateSubtrip } from '../../query/use-subtrip';

const NewTripSchema = zod.object({
  tripId: zod
    .any()
    .nullable()
    .refine((val) => val !== null, {
      message: 'Trip is required',
    }),
  customerId: zod.string().min(1, { message: 'Customer ID is required' }),
  diNumber: zod.string(),
  startDate: schemaHelper.date({ message: { required_error: 'Start date is required!' } }),
});

export default function SubtripCreateForm({ currentTrip, trips, customers }) {
  const navigate = useNavigate();

  const addSubtrip = useCreateSubtrip();

  const defaultValues = useMemo(
    () => ({
      // Subtrip
      tripId: currentTrip ? { label: currentTrip, value: currentTrip } : null,
      customerId: '',
      startDate: today(),
      diNumber: '',
    }),
    [currentTrip]
  );

  const methods = useForm({
    resolver: zodResolver(NewTripSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const createdSubtrip = await addSubtrip({ ...data, tripId: data?.tripId?.value });

      reset();
      navigate(paths.dashboard.subtrip.details(paramCase(createdSubtrip._id)));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {/* Subtrip Info */}
      <Grid container spacing={3} sx={{ pt: 10 }}>
        <Grid item xs={12} md={3}>
          <Box sx={{ pt: 2, pb: 5, px: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              Subtrip Info
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 1 }}>
              Please provide the details of the subtrip.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
              <Field.Autocomplete
                sx={{ mb: 2 }}
                name="tripId"
                label="Trip"
                options={trips.map((c) => ({ label: c._id, value: c._id }))}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                disabled={currentTrip}
              />

              <Field.Select name="customerId" label="Customer">
                <MenuItem value="">None</MenuItem>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {customers.map((customer) => (
                  <MenuItem key={customer._id} value={customer._id}>
                    {customer.customerName}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text name="diNumber" label="DI/DO No" />
              <Field.DatePicker name="startDate" label="Subtrip Start Date" />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Stack alignItems="flex-end" sx={{ mt: 3, mb: 5 }}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Create Trip
        </LoadingButton>
      </Stack>
    </Form>
  );
}
