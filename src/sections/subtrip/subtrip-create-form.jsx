import { z as zod } from 'zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Tab,
  Card,
  Grid,
  Tabs,
  Stack,
  Button,
  Accordion,
  Typography,
  InputAdornment,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { today } from 'src/utils/format-time';
import { paramCase } from 'src/utils/change-case';

import { useCreateSubtrip, useCreateEmptySubtrip } from 'src/query/use-subtrip';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { SUBTRIP_STATUS_COLORS } from './constants';
import { KanbanTripDialog } from '../kanban/components/kanban-trip-dialog';
import { KanbanRouteDialog } from '../kanban/components/kanban-route-dialog';
import { KanbanCustomerDialog } from '../kanban/components/kanban-customer-dialog';

const NewTripSchema = zod
  .object({
    tripId: zod
      .any()
      .nullable()
      .refine((val) => val !== null, {
        message: 'Trip is required',
      }),
    customerId: zod.any().nullable(),
    diNumber: zod.string(),
    startDate: schemaHelper.date({ message: { required_error: 'Start date is required!' } }),
    isEmpty: zod.boolean().default(false),
    routeCd: zod.string().optional(),
    loadingPoint: zod.string().optional(),
    unloadingPoint: zod.string().optional(),
    startKm: zod.number().optional(),
  })
  .refine(
    (data) => {
      if (data.isEmpty) {
        // For empty trips, routeCd is required
        return !!data.routeCd;
      }
      // For loaded trips, customerId is required
      return !!data.customerId;
    },
    {
      message: 'Route is required for empty trips',
      path: ['routeCd'],
    }
  )
  .refine(
    (data) => {
      if (!data.isEmpty) {
        // For loaded trips, customerId is required
        return !!data.customerId;
      }
      return true;
    },
    {
      message: 'Customer is required for loaded trips',
      path: ['customerId'],
    }
  );

export default function SubtripCreateForm({ currentTrip, trips, customers, onSuccess }) {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('loaded');
  const [selectedRoute, setSelectedRoute] = useState(null);

  const addSubtrip = useCreateSubtrip();
  const addEmptySubtrip = useCreateEmptySubtrip();
  const customerDialog = useBoolean(false);
  const tripDialog = useBoolean(false);
  const routeDialog = useBoolean(false);

  const defaultValues = useMemo(
    () => ({
      tripId: currentTrip ? { label: currentTrip, value: currentTrip } : null,
      customerId: null,
      startDate: today(),
      diNumber: '',
      isEmpty: false,
      routeCd: '',
      loadingPoint: '',
      unloadingPoint: '',
      startKm: 0,
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
    formState: { isSubmitting, errors },
  } = methods;

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setValue('isEmpty', newValue === 'empty');
  };

  const handleCustomerChange = (customer) => {
    setValue('customerId', { label: customer.customerName, value: customer._id });
  };

  const handleTripChange = (trip) => {
    setValue('tripId', {
      label: `${trip.vehicleId?.vehicleNo} - ${trip.driverId?.driverName}`,
      value: trip._id,
    });
  };

  const handleRouteChange = (route) => {
    setSelectedRoute(route);
    setValue('routeCd', route._id);
    setValue('loadingPoint', route.fromPlace);
    setValue('unloadingPoint', route.toPlace);
  };

  const onSubmit = async (data) => {
    try {
      // based on current tab submit data should be different
      const submitData =
        currentTab === 'loaded'
          ? {
              tripId: data?.tripId?.value,
              customerId: data?.customerId?.value,
              startDate: data?.startDate,
              diNumber: data?.diNumber,
              isEmpty: false,
            }
          : {
              tripId: data?.tripId?.value,
              routeCd: data?.routeCd,
              loadingPoint: data?.loadingPoint,
              unloadingPoint: data?.unloadingPoint,
              startKm: data?.startKm,
              startDate: data?.startDate,
              isEmpty: true,
            };

      const createdSubtrip =
        currentTab === 'empty' ? await addEmptySubtrip(submitData) : await addSubtrip(submitData);

      reset();

      // If onSuccess callback is provided, call it instead of navigating
      if (onSuccess) {
        onSuccess(createdSubtrip);
      } else {
        navigate(paths.dashboard.subtrip.details(paramCase(createdSubtrip._id)));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const selectedCustomer = customers.find((c) => c._id === methods.watch('customerId')?.value);
  const selectedTrip = trips.find((t) => t._id === methods.watch('tripId')?.value);

  console.log({ errors, values: methods.watch() });

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
            <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab
                value="loaded"
                label="Loaded Trip"
                icon={<Iconify icon="mdi:truck-fast" />}
                iconPosition="start"
              />
              <Tab
                value="empty"
                label="Empty Trip"
                icon={<Iconify icon="mdi:truck-fast-outline" />}
                iconPosition="start"
              />
            </Tabs>

            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
              <Box>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={tripDialog.onTrue}
                  disabled={currentTrip}
                  sx={{
                    height: 56,
                    justifyContent: 'flex-start',
                    typography: 'body2',
                    borderColor: errors.tripId?.message ? 'error.main' : 'text.disabled',
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
                    : 'Select Trip *'}
                </Button>
              </Box>

              {currentTab === 'loaded' && (
                <Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={customerDialog.onTrue}
                    sx={{
                      height: 56,
                      justifyContent: 'flex-start',
                      typography: 'body2',
                      borderColor: errors.customerId?.message ? 'error.main' : 'text.disabled',
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
                    {selectedCustomer ? selectedCustomer.customerName : 'Select Customer *'}
                  </Button>
                </Box>
              )}

              {currentTab === 'empty' ? (
                <>
                  <Box>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={routeDialog.onTrue}
                      sx={{
                        height: 56,
                        justifyContent: 'flex-start',
                        typography: 'body2',
                        borderColor: errors.routeCd?.message ? 'error.main' : 'text.disabled',
                      }}
                      startIcon={
                        <Iconify
                          icon="mdi:map-marker-path"
                          sx={{ color: selectedRoute ? 'primary.main' : 'text.disabled' }}
                        />
                      }
                    >
                      {selectedRoute
                        ? `${selectedRoute.fromPlace} → ${selectedRoute.toPlace}`
                        : 'Select Route *'}
                    </Button>
                  </Box>

                  <Field.Text
                    name="startKm"
                    label="Start Kilometer"
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">km</InputAdornment>,
                    }}
                    helperText="Please Enter the reading of the odometer at the start of the trip"
                    required
                  />
                  <Field.DatePicker name="startDate" label="Subtrip Start Date *" />
                </>
              ) : (
                <>
                  <Field.Text
                    name="diNumber"
                    label="DI/DO No"
                    helperText="Please Enter DI/DO Number to Generate Entry Pass"
                  />
                  <Field.DatePicker name="startDate" label="Subtrip Start Date *" />
                </>
              )}
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
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Label variant="soft" color="info" size="small">
                              {subtrip.isEmpty ? 'Empty' : 'Loaded'}
                            </Label>
                            <Label
                              variant="soft"
                              color={SUBTRIP_STATUS_COLORS[subtrip.subtripStatus]}
                              size="small"
                            >
                              {subtrip.subtripStatus.replace('-', ' ')}
                            </Label>
                          </Stack>
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
          <Stack alignItems="flex-end" sx={{ mt: 3, mb: 5 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Create Subtrip
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>

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

      <KanbanRouteDialog
        open={routeDialog.value}
        onClose={routeDialog.onFalse}
        onRouteChange={handleRouteChange}
        customerId={selectedCustomer?._id}
      />
    </Form>
  );
}
