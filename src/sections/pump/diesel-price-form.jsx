// form
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Stack, InputAdornment } from '@mui/material';

import { Iconify } from 'src/components/iconify';
// components
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useCreateDieselPrice, useUpdateDieselPrice } from '../../query/use-diesel-prices';

// ----------------------------------------------------------------------

export const DieselPriceSchema = zod
  .object({
    price: zod.number().min(0, { message: 'Price is required' }),
    startDate: schemaHelper.date({ message: { required_error: 'Start Date is required' } }),
    endDate: schemaHelper.date({ message: { required_error: 'End Date is required' } }),
  })
  .refine((val) => !val.startDate || !val.endDate || val.endDate >= val.startDate, {
    message: 'End Date cannot be before Start Date',
    path: ['endDate'],
  });

// ----------------------------------------------------------------------

export default function DieselPriceForm({ currentDieselPrice, pump, onSuccess }) {
  const createDieselPrice = useCreateDieselPrice();
  const updateDieselPrice = useUpdateDieselPrice();

  const defaultValues = useMemo(
    () => ({
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
      pump: pump?._id,
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
        reset();
        if (onSuccess) onSuccess(newDieselPrice);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ mt: 2 }}>
        <Field.Text
          name="price"
          label="Price per Liter"
          type="number"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="mdi:currency-inr" />
                </InputAdornment>
              ),
              inputProps: { step: '0.01', min: 0 },
            },
          }}
        />

        <Box display="grid" gap={2} gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}>
          <Field.DatePicker name="startDate" label="Start Date" />
          <Field.DatePicker name="endDate" label="End Date" />
        </Box>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          disabled={!pump}
          fullWidth
        >
          {currentDieselPrice ? 'Save Changes' : 'Create Price'}
        </LoadingButton>
      </Stack>
    </Form>
  );
}
