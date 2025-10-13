// form
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Stack,
  Button,
  Divider,
  InputAdornment,
  CardHeader,
} from '@mui/material';

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

export default function DieselPriceForm({ currentDieselPrice, pump, onSuccess }) {
  const createDieselPrice = useCreateDieselPrice();
  const updateDieselPrice = useUpdateDieselPrice();
  const pumpDialog = useBoolean(false);

  const defaultValues = useMemo(
    () => ({
      pump: pump
        ? { label: pump.name, value: pump._id }
        : currentDieselPrice?.pump
          ? { label: currentDieselPrice.pump.name, value: currentDieselPrice.pump._id }
          : null,
      price: currentDieselPrice?.price || 0,
      startDate: currentDieselPrice?.startDate
        ? new Date(currentDieselPrice.startDate)
        : new Date(),
      endDate: currentDieselPrice?.endDate ? new Date(currentDieselPrice.endDate) : new Date(),
    }),
    [currentDieselPrice, pump]
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

  const handlePumpChange = (selectedPump) => {
    setValue('pump', { label: selectedPump.name, value: selectedPump._id });
  };

  const onSubmit = async (data) => {
    const transformedData = {
      ...data,
      pump: pump ? pump._id : data.pump.value,
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

  const selectedPump = watch('pump');

  const renderDetails = (
    <Card>
      <Stack spacing={3}>
        <Box
          display="grid"
          columnGap={2}
          rowGap={3}
          gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
        >
          <Box>
            {pump ? (
              <Button
                fullWidth
                variant="outlined"
                disabled
                sx={{ height: 56, justifyContent: 'flex-start', typography: 'body2' }}
                startIcon={<Iconify icon="mdi:gas-station" sx={{ color: 'primary.main' }} />}
              >
                {pump.name}
              </Button>
            ) : (
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
            )}
          </Box>

          <Field.Text
            name="price"
            label="Price"
            type="number"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="mdi:currency-inr" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Field.DatePicker name="startDate" label="Start Date" />
          <Field.DatePicker name="endDate" label="End Date" />
        </Box>
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        {!currentDieselPrice ? 'Create Diesel Price' : 'Save Changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={{ xs: 3, md: 4 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}
        {renderActions}
      </Stack>

      {!pump && (
        <KanbanPumpDialog
          open={pumpDialog.value}
          onClose={pumpDialog.onFalse}
          selectedPump={selectedPump}
          onPumpChange={handlePumpChange}
        />
      )}
    </Form>
  );
}

