// form
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Divider, Typography } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

// redux
import { dispatch } from 'src/redux/store';
import { addDieselPrice, updateDieselPrice } from 'src/redux/slices/diesel-price';

import { toast } from 'src/components/snackbar';
// components
import { Form, Field, schemaHelper } from 'src/components/hook-form';

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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const transformedData = {
      ...data,
      pump: data.pump.value, // Transform pump to save only the value
    };

    try {
      if (!currentDieselPrice) {
        await dispatch(addDieselPrice(transformedData));
      } else {
        await dispatch(updateDieselPrice(currentDieselPrice._id, transformedData));
      }
      reset();
      toast.success(
        !currentDieselPrice
          ? 'Diesel Price added successfully!'
          : 'Diesel Price edited successfully!'
      );
      navigate(paths.dashboard.dieselPrice.list);
    } catch (error) {
      console.error(error);
    }
  };

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
              <Field.Autocomplete
                name="pump"
                label="Pump"
                options={pumpsList?.map((p) => ({
                  label: p.pumpName,
                  value: p._id,
                }))}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />
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
    </Form>
  );
}
