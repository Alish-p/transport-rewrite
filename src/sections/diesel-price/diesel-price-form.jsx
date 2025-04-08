// form
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Button, Divider, Typography } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
// components
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { KanbanPumpDialog } from '../kanban/components/kanban-pump-dialog';
import { useCreateDieselPrice, useUpdateDieselPrice } from '../../query/use-diesel-prices';

// ----------------------------------------------------------------------

export const DieselPriceSchema = zod.object({
  pump: zod.object({
    label: zod.string(),
    value: zod.string(),
  }),
  price: zod.number().min(0, { message: 'Price is required' }),
  startDate: schemaHelper.date({ message: { required_error: 'Start Date is required' } }),
  endDate: schemaHelper.date({ message: { required_error: 'End Date is required' } }),
});

// ----------------------------------------------------------------------

export default function DieselPriceForm({ currentDieselPrice, pumpsList }) {
  const navigate = useNavigate();
  const createDieselPrice = useCreateDieselPrice();
  const updateDieselPrice = useUpdateDieselPrice();
  const pumpDialog = useBoolean(false);

  const defaultValues = useMemo(
    () => ({
      pump: currentDieselPrice?.pump
        ? { label: currentDieselPrice.pump.pumpName, value: currentDieselPrice.pump._id }
        : null,
      price: currentDieselPrice?.price || 0,
      startDate: currentDieselPrice?.startDate
        ? new Date(currentDieselPrice.startDate)
        : new Date(),
      endDate: currentDieselPrice?.endDate ? new Date(currentDieselPrice.endDate) : new Date(),
    }),
    [currentDieselPrice]
  );

  const methods = useForm({
    resolver: zodResolver(DieselPriceSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    reset,
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  const handlePumpChange = (pump) => {
    setValue('pump', { label: pump.pumpName, value: pump._id });
  };

  const onSubmit = async (data) => {
    const transformedData = {
      ...data,
      pump: data.pump.value, // Transform pump to save only the value
    };

    try {
      let newDieselPrice;
      if (!currentDieselPrice) {
        newDieselPrice = await createDieselPrice(transformedData);
      } else {
        newDieselPrice = await updateDieselPrice({
          id: currentDieselPrice._id,
          data: transformedData,
        });
      }

      if (newDieselPrice) {
        navigate(paths.dashboard.diesel.list);
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const selectedPump = watch('pump');

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Diesel Price Details
          </Typography>
          <Card sx={{ p: 3, mb: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Box>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={pumpDialog.onTrue}
                  sx={{
                    height: 56,
                    justifyContent: 'flex-start',
                    typography: 'body2',
                    borderColor: errors.pump?.message ? 'error.main' : 'text.disabled',
                  }}
                  startIcon={
                    <Iconify
                      icon={selectedPump?.label ? 'mdi:gas-station' : 'mdi:gas-station-outline'}
                      sx={{ color: selectedPump?.label ? 'primary.main' : 'text.disabled' }}
                    />
                  }
                >
                  {selectedPump?.label ? selectedPump.label : 'Select Pump *'}
                </Button>
              </Box>
              <Field.Text name="price" label="Price" type="number" />
              <Field.DatePicker name="startDate" label="Start Date" />
              <Field.DatePicker name="endDate" label="End Date" />
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Stack alignItems="flex-end" sx={{ mt: 3 }}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {!currentDieselPrice ? 'Create Diesel Price' : 'Save Changes'}
        </LoadingButton>
      </Stack>

      <KanbanPumpDialog
        open={pumpDialog.value}
        onClose={pumpDialog.onFalse}
        selectedPump={selectedPump}
        onPumpChange={handlePumpChange}
      />
    </Form>
  );
}
