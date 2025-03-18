import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { today } from 'src/utils/format-time';
import { paramCase } from 'src/utils/change-case';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useBoolean } from '../../hooks/use-boolean';
import { useCreateSubtrip } from '../../query/use-subtrip';
import { KanbanCustomerDialog } from '../kanban/components/kanban-customer-dialog';

const NewTripSchema = zod.object({
  tripId: zod
    .any()
    .nullable()
    .refine((val) => val !== null, {
      message: 'Trip is required',
    }),
  customerId: zod
    .any()
    .nullable()
    .refine((val) => val !== null, { message: 'Customer is required' }),
  diNumber: zod.string(),
  startDate: schemaHelper.date({ message: { required_error: 'Start date is required!' } }),
});

export default function SubtripCreateForm({ currentTrip, trips, customers }) {
  const navigate = useNavigate();

  const addSubtrip = useCreateSubtrip();
  const customerDialog = useBoolean(false);

  const defaultValues = useMemo(
    () => ({
      // Subtrip
      tripId: currentTrip ? { label: currentTrip, value: currentTrip } : null,
      customerId: null,
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
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleCustomerChange = (customer) => {
    setValue('customerId', { label: customer.customerName, value: customer._id });
  };

  const onSubmit = async (data) => {
    try {
      const createdSubtrip = await addSubtrip({
        ...data,
        tripId: data?.tripId?.value,
        customerId: data?.customerId?.value,
      });

      reset();
      navigate(paths.dashboard.subtrip.details(paramCase(createdSubtrip._id)));
    } catch (error) {
      console.error(error);
    }
  };

  const selectedCustomer = customers.find((c) => c._id === methods.watch('customerId')?.value);

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

              <Box>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={customerDialog.onTrue}
                  sx={{
                    height: 56,
                    justifyContent: 'flex-start',
                    typography: 'body2',
                  }}
                  startIcon={
                    <Iconify
                      icon={
                        selectedCustomer ? 'mdi:office-building' : 'mdi:office-building-outline'
                      }
                      sx={{ color: selectedCustomer ? 'primary.main' : 'text.disabled' }}
                    />
                  }
                >
                  {selectedCustomer ? selectedCustomer.customerName : 'Select Customer'}
                </Button>
              </Box>

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

      <KanbanCustomerDialog
        open={customerDialog.value}
        onClose={customerDialog.onFalse}
        selectedCustomer={selectedCustomer}
        onCustomerChange={handleCustomerChange}
      />
    </Form>
  );
}
