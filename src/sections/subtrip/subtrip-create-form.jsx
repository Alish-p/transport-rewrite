import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { today } from 'src/utils/format-time';
import { paramCase } from 'src/utils/change-case';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { Label } from '../../components/label';
import { SUBTRIP_STATUS_COLORS } from './constants';
import { useBoolean } from '../../hooks/use-boolean';
import { useCreateSubtrip } from '../../query/use-subtrip';
import { KanbanTripDialog } from '../kanban/components/kanban-trip-dialog';
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
  const tripDialog = useBoolean(false);

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

  const handleTripChange = (trip) => {
    setValue('tripId', {
      label: `${trip.vehicleId?.vehicleNo} - ${trip.driverId?.driverName}`,
      value: trip._id,
    });
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
  const selectedTrip = trips.find((t) => t._id === methods.watch('tripId')?.value);

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
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Trip
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={tripDialog.onTrue}
                  disabled={currentTrip}
                  sx={{
                    height: 56,
                    justifyContent: 'flex-start',
                    typography: 'body2',
                  }}
                  startIcon={
                    <Iconify
                      icon={selectedTrip ? 'mdi:truck-fast' : 'mdi:truck-fast-outline'}
                      sx={{ color: selectedTrip ? 'primary.main' : 'text.disabled' }}
                    />
                  }
                >
                  {selectedTrip
                    ? `${selectedTrip.vehicleId?.vehicleNo} - ${selectedTrip.driverId?.driverName}`
                    : 'Select Trip'}
                </Button>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Customer
                </Typography>
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

              <Field.Text
                name="diNumber"
                label="DI/DO No"
                helperText="Please Enter DI/DO Number to Generate Entry Pass"
              />
              <Field.DatePicker name="startDate" label="Subtrip Start Date" />
            </Box>
          </Card>

          {selectedTrip && selectedTrip.subtrips && selectedTrip.subtrips.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Trip Details
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                This trip has {selectedTrip.subtrips.length} subtrip
                {selectedTrip.subtrips.length > 1 ? 's' : ''}. Below are the details of each
                subtrip:
              </Typography>
              <Stack spacing={2}>
                {selectedTrip.subtrips.map((subtrip) => (
                  <Card key={subtrip._id} sx={{ p: 2 }}>
                    <Accordion>
                      <AccordionSummary expandIcon={<Iconify icon="mdi:chevron-down" />}>
                        <Stack
                          direction="row"
                          alignItems="space-between"
                          justifyContent="space-between"
                          sx={{ width: '100%' }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Iconify icon="mdi:truck-fast" sx={{ color: 'primary.main' }} />
                            <Typography variant="subtitle1">Subtrip #{subtrip._id} </Typography>
                          </Stack>
                          <Label
                            variant="soft"
                            color={SUBTRIP_STATUS_COLORS[subtrip.subtripStatus]}
                            size="small"
                          >
                            {subtrip.subtripStatus.replace('-', ' ')}
                          </Label>
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Iconify icon="mdi:map-marker-path" sx={{ color: 'text.secondary' }} />
                            <Typography variant="body2">
                              <Box component="span" sx={{ color: 'text.secondary', mr: 1 }}>
                                Route:
                              </Box>
                              {subtrip.loadingPoint} → {subtrip.unloadingPoint}
                            </Typography>
                          </Stack>

                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Iconify icon="mdi:account" sx={{ color: 'text.secondary' }} />
                            <Typography variant="body2">
                              <Box component="span" sx={{ color: 'text.secondary', mr: 1 }}>
                                Consignee:
                              </Box>
                              {subtrip.consignee}
                            </Typography>
                          </Stack>

                          {subtrip.materialType && (
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Iconify
                                icon="mdi:package-variant"
                                sx={{ color: 'text.secondary' }}
                              />
                              <Typography variant="body2">
                                <Box component="span" sx={{ color: 'text.secondary', mr: 1 }}>
                                  Material:
                                </Box>
                                {subtrip.materialType}
                                {subtrip.quantity && ` (${subtrip.quantity} bags)`}
                              </Typography>
                            </Stack>
                          )}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  </Card>
                ))}
              </Stack>
            </Box>
          )}
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

      <KanbanTripDialog
        open={tripDialog.value}
        onClose={tripDialog.onFalse}
        selectedTrip={selectedTrip}
        onTripChange={handleTripChange}
        trips={trips}
      />
    </Form>
  );
}
