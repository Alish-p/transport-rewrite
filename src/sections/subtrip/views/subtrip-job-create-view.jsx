import { z } from 'zod';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
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
import { useMaterialOptions } from 'src/hooks/use-material-options';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { useTrip, useVehicleActiveTrip } from 'src/query/use-trip';
import { useCreateJob, usePaginatedSubtrips } from 'src/query/use-subtrip';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { KanbanRouteDialog } from 'src/sections/kanban/components/kanban-route-dialog';
import { KanbanDriverDialog } from 'src/sections/kanban/components/kanban-driver-dialog';
import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';
import { KanbanCustomerDialog } from 'src/sections/kanban/components/kanban-customer-dialog';

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
const numericInputSchema = z.union([z.string(), z.number()]).optional();

const consigneeOptionSchema = z
  .object({ label: z.string().optional(), value: z.string().optional() })
  .partial()
  .nullish();

const formSchema = z.object({
  diNumber: z.string().optional(),
  remarks: z.string().optional(),
  startDate: z.date().nullable(),
  tripDecision: z.enum(['attach', 'new']),
  loadType: z.enum(['loaded', 'empty']),
  startKm: numericInputSchema,
  consignee: consigneeOptionSchema,
  routeCd: z.string().optional(),
  loadingPoint: z.string().optional(),
  unloadingPoint: z.string().optional(),
  loadingWeight: numericInputSchema,
  rate: numericInputSchema,
  invoiceNo: z.string().optional(),
  ewayBill: z.string().optional(),
  // Optional because empty subtrips won't have it
  ewayExpiryDate: schemaHelper.dateOptional({ message: { invalid_type_error: 'Invalid Eway Expiry Date!' } }),
  materialType: z.string().optional(),
  quantity: numericInputSchema,
  grade: z.string().optional(),
  shipmentNo: z.string().optional(),
  orderNo: z.string().optional(),
  referenceSubtripNo: z.string().optional(),
  driverAdvance: numericInputSchema,
  driverAdvanceGivenBy: z.string().optional(),
  initialAdvanceDiesel: numericInputSchema,
  pumpCd: z.string().optional(),
});

const createDefaultValues = () => ({
  diNumber: '',
  remarks: '',
  startDate: new Date(),
  tripDecision: 'attach',
  loadType: 'loaded',
  startKm: '',
  consignee: null,
  routeCd: '',
  loadingPoint: '',
  unloadingPoint: '',
  loadingWeight: '',
  rate: '',
  invoiceNo: '',
  ewayBill: '',
  ewayExpiryDate: null,
  materialType: '',
  quantity: '',
  grade: '',
  shipmentNo: '',
  orderNo: '',
  referenceSubtripNo: '',
  driverAdvance: '',
  driverAdvanceGivenBy: 'Self',
  initialAdvanceDiesel: '',
  pumpCd: '',
});

const toNumber = (val) => {
  if (val === null || val === undefined || val === '') return undefined;
  const n = Number(val);
  return Number.isFinite(n) ? n : undefined;
};

const normalizeDriverAdvanceGivenBy = (val) => {
  if (!val) return undefined;
  const v = String(val).toLowerCase();
  return v === 'self' ? 'self' : 'fuel-pump';
};

// Stepper
const STEPS = [
  { label: 'Vehicle Details' },
  { label: 'Job Details' },
  { label: 'Route Details' },
  { label: 'Material Details' }, // Only for loaded jobs
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
  const materialOptions = useMaterialOptions();

  // Queries & mutations
  const { data: activeTrip, isFetching: fetchingActiveTrip } = useVehicleActiveTrip(
    selectedVehicle?._id,
    { enabled: !!selectedVehicle?._id && !!selectedVehicle?.isOwn }
  );
  const { data: activeTripDetails } = useTrip(activeTrip?._id);
  const createJob = useCreateJob();

  // Form state for job details + step selections
  const defaultFormValues = useMemo(createDefaultValues, []);

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
    mode: 'onChange',
  });

  const { watch, handleSubmit, formState: { errors, isSubmitting }, setValue, trigger } = methods;
  const watchedForm = watch();
  const { tripDecision, loadType } = watchedForm;

  // Selection handlers
  const syncRouteFields = useCallback(
    (route) => {
      setValue('routeCd', route?._id || '', { shouldValidate: true });
      setValue('loadingPoint', route?.fromPlace || '', { shouldValidate: true });
      setValue('unloadingPoint', route?.toPlace || '', { shouldValidate: true });
    },
    [setValue]
  );

  const handleVehicleChange = useCallback(
    (vehicle) => {
      setSelectedVehicle(vehicle);
      // Reset downstream selections when vehicle changes
      setValue('tripDecision', 'attach');
      setValue('loadType', 'loaded');
      setValue('startKm', '');
      setValue('consignee', null);
      setSelectedCustomer(null);
      setSelectedDriver(null);
      setSelectedRoute(null);
      // reset material fields
      syncRouteFields(null);
      setValue('loadingWeight', '');
      setValue('rate', '');
      setValue('invoiceNo', '');
      setValue('ewayBill', '');
      setValue('ewayExpiryDate', null);
      setValue('materialType', '');
      setValue('quantity', '');
      setValue('grade', '');
      setValue('shipmentNo', '');
      setValue('orderNo', '');
      setValue('referenceSubtripNo', '');
      setValue('driverAdvance', '');
      setValue('driverAdvanceGivenBy', 'Self');
      setValue('initialAdvanceDiesel', '');
      setValue('pumpCd', '');
    },
    [setSelectedVehicle, setSelectedCustomer, setSelectedDriver, setSelectedRoute, setValue, syncRouteFields]
  );

  const handleDriverChange = useCallback((driver) => setSelectedDriver(driver), [setSelectedDriver]);

  const handleCustomerChange = useCallback((customer) => setSelectedCustomer(customer), [setSelectedCustomer]);

  const handleRouteChange = useCallback(
    (route) => {
      setSelectedRoute(route);
      syncRouteFields(route);
      if (activeStep === 2) {
        trigger(['routeCd', 'loadingPoint', 'unloadingPoint']);
      }
    },
    [activeStep, setSelectedRoute, trigger, syncRouteFields]
  );


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

  const consignees = useMemo(
    () => selectedCustomer?.consignees || [],
    [selectedCustomer]
  );

  const getVehicleStepError = useCallback(
    (form) => {
      if (!selectedVehicle) return 'Please select a vehicle';

      if (!selectedVehicle?.isOwn) return null;

      if (fetchingActiveTrip) return 'Validating active trip. Please wait…';

      if (activeTrip && !(form.tripDecision === 'attach' || form.tripDecision === 'new')) {
        return 'Trip decision must be attach or new';
      }

      if (!(form.loadType === 'loaded' || form.loadType === 'empty')) {
        return 'Select load type (Loaded/Empty)';
      }

      if (activeTrip && form.tripDecision === 'new') {
        const startKmValue = toNumber(form.startKm);
        if (startKmValue === undefined) return 'Start Km is required to close previous trip';
        if (startKmValue < 0) return 'Start Km cannot be negative';
      }

      return null;
    },
    [selectedVehicle, fetchingActiveTrip, activeTrip]
  );

  const getJobStepError = useCallback(
    (form) => {
      const vehicleStageError = getVehicleStepError(form);
      if (vehicleStageError) return vehicleStageError;

      if (!selectedDriver) return 'Please select a driver';
      if (!form.startDate) return 'Please select a start date';

      const isOwnVehicle = !!selectedVehicle?.isOwn;
      const isLoaded = form.loadType === 'loaded' || !isOwnVehicle;

      if (isLoaded && !selectedCustomer) return 'Please select a customer';

      return null;
    },
    [getVehicleStepError, selectedDriver, selectedVehicle, selectedCustomer]
  );

  const getRouteStepError = useCallback(
    (form) => {
      const jobStageError = getJobStepError(form);
      if (jobStageError) return jobStageError;

      const isOwnVehicle = !!selectedVehicle?.isOwn;
      const isLoaded = form.loadType === 'loaded' || !isOwnVehicle;

      if (isLoaded) {
        const hasConsignee = !!(form.consignee && (form.consignee.value || form.consignee.label));
        if (!selectedCustomer) return 'Please select a customer';
        if (!hasConsignee) return 'Please select a consignee';
        if (!selectedRoute) return 'Please select a route';
        if (!form.routeCd || !form.loadingPoint || !form.unloadingPoint) {
          return 'Please select route for material';
        }
      } else if (!selectedRoute) {
        return 'Please select a route';
      }

      return null;
    },
    [getJobStepError, selectedVehicle, selectedCustomer, selectedRoute]
  );

  const getMaterialStepError = useCallback(
    (form) => {
      const routeStageError = getRouteStepError(form);
      if (routeStageError) return routeStageError;

      const isOwnVehicle = !!selectedVehicle?.isOwn;
      const isLoaded = form.loadType === 'loaded' || !isOwnVehicle;
      if (!isLoaded) return null;

      // Eway Expiry Date should be optional; require only if Eway Bill is present
      if (!form.loadingWeight || !form.rate || !form.invoiceNo || !form.materialType || (form.ewayBill && !form.ewayExpiryDate)) {
        return 'Please fill required material fields';
      }

      const eway = form.ewayExpiryDate ? new Date(form.ewayExpiryDate) : null;
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (!eway || eway < startOfToday) {
        return 'Eway Expiry Date must be today or later';
      }

      return null;
    },
    [getRouteStepError, selectedVehicle]
  );

  // Build API payload consistently
  const buildPayload = (form) => {
    const isOwn = !!selectedVehicle?.isOwn;
    const hasActive = !!activeTrip;
    const isEmpty = isOwn ? form.loadType === 'empty' : false;
    const closingPreviousTrip = isOwn && hasActive && form.tripDecision === 'new';

    const base = {
      vehicleId: selectedVehicle._id,
      driverId: selectedDriver._id,
      isEmpty,
      tripDecision: isOwn ? (hasActive ? form.tripDecision : 'new') : undefined,
      tripId: isOwn && hasActive && form.tripDecision === 'attach' ? activeTrip._id : undefined,
      fromDate: form.startDate,
      startDate: form.startDate,
      remarks: form.remarks || undefined,
      diNumber: form.diNumber || undefined,
    };

    const tripKm = closingPreviousTrip ? toNumber(form.startKm) : undefined;

    const emptyRoute = isEmpty
      ? {
        routeCd: selectedRoute?._id,
        loadingPoint: selectedRoute?.fromPlace,
        unloadingPoint: selectedRoute?.toPlace,
      }
      : {};

    const loadedFields = !isEmpty
      ? {
        customerId: selectedCustomer?._id,
        consignee: form.consignee?.value || form.consignee?.label,
        routeCd: form.routeCd,
        loadingPoint: form.loadingPoint,
        unloadingPoint: form.unloadingPoint,
        loadingWeight: toNumber(form.loadingWeight),
        rate: toNumber(form.rate),
        invoiceNo: form.invoiceNo,
        shipmentNo: form.shipmentNo || undefined,
        orderNo: form.orderNo || undefined,
        referenceSubtripNo: form.referenceSubtripNo || undefined,
        ewayBill: form.ewayBill || undefined,
        ewayExpiryDate: form.ewayExpiryDate,
        materialType: form.materialType,
        quantity: toNumber(form.quantity),
        grade: form.grade || undefined,
        driverAdvance: toNumber(form.driverAdvance),
        driverAdvanceGivenBy: normalizeDriverAdvanceGivenBy(form.driverAdvanceGivenBy),
        initialAdvanceDiesel: toNumber(form.initialAdvanceDiesel),
        pumpCd: form.pumpCd || undefined,
      }
      : {};

    return {
      ...base,
      ...(tripKm !== undefined ? { startKm: tripKm } : {}),
      ...emptyRoute,
      ...loadedFields,
    };
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const err = getMaterialStepError(data);
      if (err) {
        toast.error(err);
        return;
      }

      const payload = buildPayload(data);

      const createdSubtrip = await createJob(payload);

      toast.success('Job created successfully');
      window.location.assign(paths.dashboard.subtrip.details(createdSubtrip._id));
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Failed to create job');
    }
  });

  // Step gating & submit availability
  const canGoStep2 = !getVehicleStepError(watchedForm);

  const isLoadedJob = useMemo(
    () => (selectedVehicle ? loadType === 'loaded' || !selectedVehicle?.isOwn : false),
    [selectedVehicle, loadType]
  );

  const canGoRouteStep = !getJobStepError(watchedForm);

  const canGoMaterialStep = isLoadedJob ? !getRouteStepError(watchedForm) : false;

  const canSubmit = isLoadedJob
    ? activeStep === 3
      ? !getMaterialStepError(watchedForm)
      : false
    : activeStep === 2
      ? !getRouteStepError(watchedForm)
      : false;

  // Clear irrelevant fields on load type change
  useEffect(() => {
    if (!selectedVehicle?.isOwn) return;
    // When toggling to empty, customer not needed
    if (loadType === 'empty') {
      setSelectedCustomer(null);
      setValue('consignee', null);
    }
    // Keep route selection as it can be used in either case now
  }, [loadType, selectedVehicle, setSelectedCustomer, setValue]);

  // Prepopulate driver from active trip when attaching to it
  useEffect(() => {
    if (!selectedVehicle?.isOwn) return;
    if (tripDecision !== 'attach') return;
    if (activeTrip?.driverId) {
      setSelectedDriver(activeTrip.driverId);
    }
  }, [tripDecision, activeTrip, selectedVehicle, setSelectedDriver]);

  // UI helpers

  console.log({ errors })

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

                      {selectedVehicle?.isOwn && activeTrip && tripDecision === 'new' && (
                        <Field.Text
                          name="startKm"
                          label="Start Km"
                          type="number"
                          helperText="Previous trip will be closed with this starting km of current trip"
                          InputProps={{ endAdornment: <InputAdornment position="end">km</InputAdornment> }}
                          inputProps={{ min: 0 }}
                          sx={{ mt: 1 }}
                        />
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

                  {isLoadedJob && (
                    <DialogSelectButton
                      onClick={customerDialog.onTrue}
                      placeholder="Select Customer *"
                      selected={selectedCustomer?.customerName}
                      iconName="mdi:office-building"
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
                  <Button variant="contained" onClick={() => setActiveStep(2)} disabled={!canGoRouteStep}>
                    Continue
                  </Button>
                </Stack>
              </StepContent>
            </Step>

            {/* Step 3 - Route Details */}
            <Step>
              <StepLabel>{STEPS[2].label}</StepLabel>
              <StepContent>
                <>
                  <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
                    {isLoadedJob && (
                      <Field.AutocompleteFreeSolo
                        name="consignee"
                        label="Consignee *"
                        options={consignees.map(({ name }) => ({ label: name, value: name }))}
                        disabled={!selectedCustomer}
                      />
                    )}
                    <DialogSelectButton
                      onClick={routeDialog.onTrue}
                      placeholder="Select Route *"
                      selected={selectedRoute && `${selectedRoute.fromPlace} → ${selectedRoute.toPlace}`}
                      iconName="mdi:map-marker-path"
                    />

                    <Field.Text name="loadingPoint" label="Loading Point *" InputProps={{ readOnly: true }} />
                    <Field.Text
                      name="unloadingPoint"
                      label="Unloading Point *"
                      InputProps={{ readOnly: true }}
                      helperText={isLoadedJob ? "Consignee's Address" : undefined}
                    />
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button onClick={() => setActiveStep(1)}>Back</Button>
                    {isLoadedJob ? (
                      <Button variant="contained" onClick={() => setActiveStep(3)} disabled={!canGoMaterialStep}>
                        Continue
                      </Button>
                    ) : (
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={!canSubmit}>
                        Create Job
                      </LoadingButton>
                    )}
                  </Stack>
                </>
              </StepContent>
            </Step>

            {/* Step 4 - Material Details (Loaded only) */}
            <Step>
              <StepLabel>{STEPS[3].label}</StepLabel>
              <StepContent>
                {isLoadedJob ? (
                  <>
                    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
                      <Field.Text
                        name="loadingWeight"
                        label="Loading Weight *"
                        type="number"
                        InputProps={{ endAdornment: <InputAdornment position="end">Units</InputAdornment> }}
                      />

                      <Field.Text
                        name="quantity"
                        label="Quantity"
                        type="number"
                        InputProps={{ endAdornment: <InputAdornment position="end">Bags</InputAdornment> }}
                      />

                      <Field.Text
                        name="rate"
                        label="Rate *"
                        type="number"
                        InputProps={{ endAdornment: <InputAdornment position="end">₹</InputAdornment> }}
                      />

                      <Field.Text name="ewayBill" label="Eway Bill" />
                      <Field.DatePicker name="ewayExpiryDate" label="Eway Expiry Date" minDate={dayjs()} />
                      <Field.Text name="invoiceNo" label="Invoice No *" />
                      <Field.Text name="shipmentNo" label="Shipment No" />
                      <Field.Text name="orderNo" label="Order No" />
                      <Field.Text name="referenceSubtripNo" label="Reference Subtrip No" placeholder="Enter original subtrip no (if created by another transporter)" />

                      <Field.Select name="materialType" label="Material Type *">
                        <MenuItem value="">None</MenuItem>
                        <Divider sx={{ borderStyle: 'dashed' }} />
                        {materialOptions.map(({ label, value }) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Field.Select>
                      <Field.Text name="grade" label="Grade" />
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button onClick={() => setActiveStep(2)}>Back</Button>
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={!canSubmit}>
                        Create Job
                      </LoadingButton>
                    </Stack>
                  </>
                ) : (
                  <Alert severity="info">Material details are only for loaded jobs.</Alert>
                )}
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
            mode={isLoadedJob ? 'genericAndCustomer' : 'generic'}
            customerId={isLoadedJob ? selectedCustomer?._id : undefined}
          />
        </Form>
      </Card>
    </DashboardContent>
  );
}
