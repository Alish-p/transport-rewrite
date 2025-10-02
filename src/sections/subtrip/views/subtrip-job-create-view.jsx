import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';

import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Card,
  Step,
  Chip,
  Stack,
  Alert,
  Button,
  Avatar,
  Tooltip,
  MenuItem,
  StepLabel,
  Typography,
  StepContent,
  Stepper as MuiStepper,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { useTrip, useCloseTrip, useCreateTrip, useVehicleActiveTrip } from 'src/query/use-trip';
import { useCreateSubtrip, usePaginatedSubtrips, useCreateEmptySubtrip } from 'src/query/use-subtrip';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { KanbanRouteDialog } from 'src/sections/kanban/components/kanban-route-dialog';
import { KanbanDriverDialog } from 'src/sections/kanban/components/kanban-driver-dialog';
import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';
import { KanbanCustomerDialog } from 'src/sections/kanban/components/kanban-customer-dialog';

// Two-step vertical stepper
const STEPS = [
  { label: 'Vehicle Details' },
  { label: 'Job Details' },
];

export function SubtripJobCreateView() {
  // Step state
  const [activeStep, setActiveStep] = useState(0);

  // Selections state
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Dialogs
  const vehicleDialog = useBoolean(false);
  const driverDialog = useBoolean(false);
  const customerDialog = useBoolean(false);
  const routeDialog = useBoolean(false);

  // Queries & mutations
  const { data: activeTrip, isFetching: fetchingActiveTrip } = useVehicleActiveTrip(
    selectedVehicle?._id,
    { enabled: !!selectedVehicle?._id && !!selectedVehicle?.isOwn }
  );
  const { data: activeTripDetails } = useTrip(activeTrip?._id);
  const createTrip = useCreateTrip();
  const closeTrip = useCloseTrip();
  const createSubtrip = useCreateSubtrip();
  const createEmptySubtrip = useCreateEmptySubtrip();

  // Form state for job details + step selections
  const methods = useForm({
    defaultValues: {
      diNumber: '',
      remarks: '',
      startDate: new Date(),
      tripDecision: 'attach',
      loadType: 'loaded',
    },
    mode: 'onChange',
  });

  const { watch, handleSubmit, formState, setValue } = methods;
  const startDate = watch('startDate');
  const tripDecision = watch('tripDecision');
  const loadType = watch('loadType');

  // Selection handlers
  const handleVehicleChange = (vehicle) => {
    setSelectedVehicle(vehicle);
    // Reset downstream selections when vehicle changes
    setValue('tripDecision', 'attach');
    setValue('loadType', 'loaded');
    setSelectedCustomer(null);
    setSelectedDriver(null);
    setSelectedRoute(null);
  };
  const handleDriverChange = (driver) => setSelectedDriver(driver);
  const handleCustomerChange = (customer) => setSelectedCustomer(customer);
  const handleRouteChange = (route) => setSelectedRoute(route);

  // Popover for active trip subtrips
  const [subtripAnchorEl, setSubtripAnchorEl] = useState(null);
  const openSubtripPopover = Boolean(subtripAnchorEl);
  const handleOpenSubtripPopover = (event) => setSubtripAnchorEl(event.currentTarget);
  const handleCloseSubtripPopover = () => setSubtripAnchorEl(null);

  // Recent drivers by selected vehicle (last few subtrips)
  const { data: recentSubtripsData } = usePaginatedSubtrips(
    selectedVehicle?._id
      ? {
        page: 1,
        rowsPerPage: 10,
        vehicleId: selectedVehicle._id,
      }
      : null,
    { enabled: !!selectedVehicle?._id }
  );

  const recentDrivers = (recentSubtripsData?.results || [])
    .filter((st) => st?.driverId?._id)
    .reduce((acc, st) => {
      const d = st.driverId;
      if (!acc.find((x) => x._id === d._id)) acc.push(d);
      return acc;
    }, [])
    .slice(0, 5);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!selectedVehicle) {
        toast.error('Please select a vehicle');
        return;
      }

      // Validate job details
      const isLoaded = loadType === 'loaded' || !selectedVehicle.isOwn; // market => loaded only
      if (!selectedDriver) {
        toast.error('Please select a driver');
        return;
      }
      if (!data.startDate) {
        toast.error('Please select a start date');
        return;
      }
      if (isLoaded && !selectedCustomer) {
        toast.error('Please select a customer');
        return;
      }
      if (!isLoaded && !selectedRoute) {
        toast.error('Please select a route');
        return;
      }

      // Determine trip context
      let tripId = null;
      if (selectedVehicle.isOwn) {
        if (activeTrip && tripDecision === 'attach') {
          tripId = activeTrip._id;
        } else {
          // If active exists and user chose new, close previous first
          if (activeTrip && tripDecision === 'new') {
            await closeTrip(activeTrip._id);
          }
          const createdTrip = await createTrip({
            vehicleId: selectedVehicle._id,
            driverId: selectedDriver._id,
            fromDate: data.startDate,
            remarks: data.remarks || undefined,
            closePreviousTrips: false,
          });
          tripId = createdTrip._id;
        }
      } else {
        // Market vehicle: independent job (we still back it with a trip internally)
        const createdTrip = await createTrip({
          vehicleId: selectedVehicle._id,
          driverId: selectedDriver._id,
          fromDate: data.startDate,
          remarks: data.remarks || undefined,
          closePreviousTrips: true,
        });
        tripId = createdTrip._id;
      }

      // Create subtrip/job
      let createdSubtrip = null;
      if (!selectedVehicle.isOwn || loadType === 'loaded') {
        createdSubtrip = await createSubtrip({
          tripId,
          customerId: selectedCustomer._id,
          diNumber: data.diNumber || '',
          startDate: data.startDate,
          isEmpty: false,
          remarks: data.remarks || undefined,
        });
      } else {
        createdSubtrip = await createEmptySubtrip({
          tripId,
          routeCd: selectedRoute._id,
          loadingPoint: selectedRoute.fromPlace,
          unloadingPoint: selectedRoute.toPlace,
          startKm: 0,
          startDate: data.startDate,
          isEmpty: true,
          remarks: data.remarks || undefined,
        });
      }

      toast.success('Job created successfully');
      window.location.assign(paths.dashboard.subtrip.details(createdSubtrip._id));
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Failed to create job');
    }
  });

  // Step gating & submit availability
  const canGoStep2 = useMemo(() => {
    if (!selectedVehicle) return false;
    if (selectedVehicle?.isOwn) {
      if (fetchingActiveTrip) return false;
      if (activeTrip && !(tripDecision === 'attach' || tripDecision === 'new')) return false;
      if (!(loadType === 'loaded' || loadType === 'empty')) return false;
    }
    return true;
  }, [selectedVehicle, fetchingActiveTrip, activeTrip, tripDecision, loadType]);

  const canSubmit = useMemo(() => {
    if (!selectedVehicle) return false;
    if (!selectedDriver) return false;
    if (!startDate) return false;
    const isLoaded = loadType === 'loaded' || !selectedVehicle?.isOwn;
    if (selectedVehicle?.isOwn) {
      if (fetchingActiveTrip) return false;
      if (activeTrip && !(tripDecision === 'attach' || tripDecision === 'new')) return false;
      if (!(loadType === 'loaded' || loadType === 'empty')) return false;
    }
    if (isLoaded) {
      if (!selectedCustomer) return false;
    } else if (!selectedRoute) return false;
    return true;
  }, [selectedVehicle, selectedDriver, startDate, loadType, fetchingActiveTrip, activeTrip, tripDecision, selectedCustomer, selectedRoute]);

  // Clear irrelevant fields on load type change
  useEffect(() => {
    if (!selectedVehicle?.isOwn) return;
    if (loadType === 'loaded') setSelectedRoute(null);
    if (loadType === 'empty') setSelectedCustomer(null);
  }, [loadType, selectedVehicle]);

  // UI helpers

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create New Job"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Subtrip List', href: paths.dashboard.subtrip.list },
          { name: 'Create Job' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ p: 5, width: 1, mx: 'auto', maxWidth: 720 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <MuiStepper activeStep={activeStep} orientation="vertical">
            {/* Step 1 */}
            <Step>
              <StepLabel>{STEPS[0].label}</StepLabel>
              <StepContent>
                <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" rowGap={2}>
                  <DialogSelectButton
                    onClick={vehicleDialog.onTrue}
                    placeholder="Select Vehicle *"
                    selected={
                      selectedVehicle
                        ? `${selectedVehicle.vehicleNo} • ${selectedVehicle.isOwn ? 'Own' : 'Market'}`
                        : undefined
                    }
                    iconName="mdi:truck"
                  />

                  {selectedVehicle?.isOwn && (
                    <>
                      {fetchingActiveTrip && <Typography>Checking active trip…</Typography>}
                      {!fetchingActiveTrip && activeTrip && (
                        <Alert severity="info" sx={{ display: 'flex', alignItems: 'center', }}>
                          <span>
                            Active trip found: <strong>{activeTrip.tripNo}</strong>
                          </span>
                          <Tooltip title="View recent subtrips" arrow>
                            <IconButton size="small" color="primary" onClick={handleOpenSubtripPopover}>
                              <Iconify icon="mdi:format-list-bulleted" width={18} />
                            </IconButton>
                          </Tooltip>
                          <Popover
                            open={openSubtripPopover}
                            anchorEl={subtripAnchorEl}
                            onClose={handleCloseSubtripPopover}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            PaperProps={{ sx: { width: 420, maxWidth: '90vw' } }}
                          >
                            <Box sx={{ p: 2 }}>
                              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Subtrips in Trip {activeTrip.tripNo}
                              </Typography>
                              <Divider sx={{ mb: 1 }} />
                              <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
                                {(activeTripDetails?.subtrips || []).length === 0 ? (
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    No subtrips found in this trip.
                                  </Typography>
                                ) : (
                                  <Stack spacing={1.5}>
                                    {(activeTripDetails?.subtrips || [])
                                      .slice()
                                      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                                      .map((st) => (
                                        <Box key={st._id}>
                                          <Typography variant="body2">
                                            <strong>LR:</strong> {st.subtripNo} • <strong>Customer:</strong> {st.customerId?.customerName || '-'}
                                          </Typography>
                                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            <strong>Status:</strong> {st.subtripStatus?.replace('-', ' ') || '-'} • <strong>Route:</strong> {st.loadingPoint} → {st.unloadingPoint}
                                          </Typography>
                                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                            <strong>Dispatch:</strong> {st.startDate ? fDate(new Date(st.startDate)) : '-'} • <strong>Driver:</strong> {st.driverId?.driverName || '-'}
                                          </Typography>
                                        </Box>
                                      ))}
                                  </Stack>
                                )}
                              </Box>
                            </Box>
                          </Popover>
                        </Alert>
                      )}
                      {!fetchingActiveTrip && !activeTrip && (
                        <Alert severity="success" variant="outlined">
                          No active trip found. A new trip will be created and the job attached to it.
                        </Alert>
                      )}

                      {activeTrip && (
                        <Field.Select name="tripDecision" label="Trip Handling" sx={{ mt: 1 }}>
                          <MenuItem value="attach">
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Iconify icon="mingcute:link-line" width={18} />
                              <span>Attach to Active Trip</span>
                            </Stack>
                          </MenuItem>
                          <MenuItem value="new">
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Iconify icon="mdi:refresh" width={18} />
                              <span>Create New & Close Previous</span>
                            </Stack>
                          </MenuItem>
                        </Field.Select>
                      )}

                      <Field.Select name="loadType" label="Load Type" sx={{ mt: 1 }}>
                        <MenuItem value="loaded">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Iconify icon="mdi:truck-fast" width={18} />
                            <span>Loaded</span>
                          </Stack>
                        </MenuItem>
                        <MenuItem value="empty">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Iconify icon="mdi:truck-fast-outline" width={18} />
                            <span>Empty</span>
                          </Stack>
                        </MenuItem>
                      </Field.Select>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Loaded requires Customer and DI/DO number. Empty requires Route.
                      </Typography>
                    </>
                  )}

                  {selectedVehicle && !selectedVehicle.isOwn && (
                    <Alert severity="info" variant="outlined">
                      Market vehicle selected. This will create an independent loaded job.
                    </Alert>
                  )}
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" onClick={() => setActiveStep(1)} disabled={!canGoStep2}>
                    Continue
                  </Button>
                </Box>
              </StepContent>
            </Step>

            {/* Step 2 */}
            <Step>
              <StepLabel>{STEPS[1].label}</StepLabel>
              <StepContent>
                <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" rowGap={2}>
                  <DialogSelectButton
                    onClick={driverDialog.onTrue}
                    placeholder="Select Driver *"
                    selected={selectedDriver?.driverName}
                    iconName="mdi:account"
                  />

                  {selectedVehicle?._id && recentDrivers.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Recent drivers for {selectedVehicle.vehicleNo}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {recentDrivers.map((d) => {
                          const isSelected = selectedDriver?._id === d._id;
                          return (
                            <Tooltip key={d._id} title={d.driverCellNo || ''} arrow>
                              <Chip
                                clickable
                                color={isSelected ? 'primary' : 'default'}
                                variant={isSelected ? 'filled' : 'outlined'}
                                onClick={() => handleDriverChange(d)}
                                avatar={<Avatar>{(d.driverName || '?').charAt(0)}</Avatar>}
                                label={d.driverName}
                                sx={{ mb: 1 }}
                              />
                            </Tooltip>
                          );
                        })}
                      </Stack>
                    </Box>
                  )}

                  {(!selectedVehicle?.isOwn || loadType === 'loaded') ? (
                    <DialogSelectButton
                      onClick={customerDialog.onTrue}
                      placeholder="Select Customer *"
                      selected={selectedCustomer?.customerName}
                      iconName="mdi:office-building"
                    />
                  ) : (
                    <DialogSelectButton
                      onClick={routeDialog.onTrue}
                      placeholder="Select Route *"
                      selected={selectedRoute && `${selectedRoute.fromPlace} → ${selectedRoute.toPlace}`}
                      iconName="mdi:map-marker-path"
                    />
                  )}

                  <Field.DatePicker name="startDate" label="Start Date *" maxDate={dayjs()} />

                  {(!selectedVehicle?.isOwn || loadType === 'loaded') && (
                    <Field.Text name="diNumber" label="DI/DO No" />
                  )}

                  <Field.Text name="remarks" label="Remarks" />
                </Box>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button onClick={() => setActiveStep(0)}>Back</Button>
                  <LoadingButton type="submit" variant="contained" loading={formState.isSubmitting} disabled={!canSubmit}>
                    Create Job
                  </LoadingButton>
                </Stack>
              </StepContent>
            </Step>
          </MuiStepper>

          {/* Dialogs */}
          <KanbanVehicleDialog
            open={vehicleDialog.value}
            onClose={vehicleDialog.onFalse}
            selectedVehicle={selectedVehicle}
            onVehicleChange={handleVehicleChange}
          />

          <KanbanDriverDialog
            open={driverDialog.value}
            onClose={driverDialog.onFalse}
            selectedDriver={selectedDriver}
            onDriverChange={handleDriverChange}
            allowQuickCreate
          />

          <KanbanCustomerDialog
            open={customerDialog.value}
            onClose={customerDialog.onFalse}
            selectedCustomer={selectedCustomer}
            onCustomerChange={handleCustomerChange}
          />

          <KanbanRouteDialog
            open={routeDialog.value}
            onClose={routeDialog.onFalse}
            onRouteChange={handleRouteChange}
            mode="generic"
          />
        </Form>
      </Card>
    </DashboardContent>
  );
}
