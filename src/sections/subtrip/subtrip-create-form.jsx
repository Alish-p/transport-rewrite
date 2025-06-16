import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
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
  Accordion,
  Typography,
  InputAdornment,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { paramCase } from 'src/utils/change-case';

import { useTrip } from 'src/query/use-trip';
import { useCreateSubtrip, useCreateEmptySubtrip } from 'src/query/use-subtrip';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { DialogSelectButton } from 'src/components/dialog-select-button';

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

export default function SubtripCreateForm({ currentTrip, trips, onSuccess }) {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('loaded');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState(currentTrip || null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const addSubtrip = useCreateSubtrip();
  const addEmptySubtrip = useCreateEmptySubtrip();
  const customerDialog = useBoolean(false);
  const tripDialog = useBoolean(false);
  const routeDialog = useBoolean(false);

  // Fetch trip details including subtrips when a trip is selected
  const { data: selectedTripDetails, isLoading: isLoadingTripDetails } = useTrip(selectedTripId);

  const defaultValues = useMemo(
    () => ({
      tripId: currentTrip || null,
      customerId: null,
      startDate: new Date(),
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

    if (newValue === 'empty') {
      // Switching to “empty” tab → clear loaded‐trip fields
      setValue('customerId', null);
      setValue('diNumber', '');
      setSelectedCustomer(null);
    } else {
      // Switching to “loaded” tab → clear empty‐trip fields
      setValue('routeCd', '');
      setValue('loadingPoint', '');
      setValue('unloadingPoint', '');
      setValue('startKm', 0);
    }
  };

  const handleCustomerChange = (customer) => {
    setSelectedCustomer(customer);
    setValue('customerId', { label: customer.customerName, value: customer._id });
  };

  const handleTripChange = (trip) => {
    const tripId = trip._id;
    setSelectedTripId(tripId);
    setValue('tripId', tripId);
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
              tripId: data?.tripId,
              customerId: data?.customerId?.value,
              startDate: data?.startDate,
              diNumber: data?.diNumber,
              isEmpty: false,
            }
          : {
              tripId: data?.tripId,
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
                <DialogSelectButton
                  onClick={tripDialog.onTrue}
                  disabled={currentTrip}
                  placeholder="Select Trip *"
                  selected={
                    selectedTripDetails &&
                    `${selectedTripDetails.vehicleId?.vehicleNo} - ${selectedTripDetails.driverId?.driverName}`
                  }
                  error={!!errors.tripId?.message}
                  iconName="mdi:truck-fast"
                />
              </Box>

              {currentTab === 'loaded' && (
                <Box>
                  <DialogSelectButton
                    onClick={customerDialog.onTrue}
                    placeholder="Select Customer *"
                    selected={selectedCustomer?.customerName}
                    error={!!errors.customerId?.message}
                    iconName="mdi:office-building"
                  />
                </Box>
              )}

              {currentTab === 'empty' ? (
                <>
                  <Box>
                    <DialogSelectButton
                      onClick={routeDialog.onTrue}
                      placeholder="Select Route *"
                      selected={
                        selectedRoute && `${selectedRoute.fromPlace} → ${selectedRoute.toPlace}`
                      }
                      error={!!errors.routeCd?.message}
                      iconName="mdi:map-marker-path"
                    />
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

          <Stack alignItems="flex-end" sx={{ mt: 3, mb: 5 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Create Subtrip
            </LoadingButton>
          </Stack>

          {selectedTripDetails &&
            selectedTripDetails.subtrips &&
            selectedTripDetails.subtrips.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                  Trip Details
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                  This trip has {selectedTripDetails.subtrips.length} subtrip
                  {selectedTripDetails.subtrips.length > 1 ? 's' : ''}. Below are the details of
                  each subtrip:
                </Typography>
                <Stack spacing={2}>
                  {selectedTripDetails.subtrips.map((subtrip) => (
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
                              {subtrip.isEmpty && (
                                <Label variant="soft" color="info" size="small">
                                  Empty
                                </Label>
                              )}
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
                              <Iconify
                                icon="mdi:map-marker-path"
                                sx={{ color: 'text.secondary' }}
                              />
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
