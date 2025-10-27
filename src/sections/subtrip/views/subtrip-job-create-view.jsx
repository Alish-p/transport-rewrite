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
import { getFixedExpensesByVehicleType } from 'src/utils/utils';

import { useGps } from 'src/query/use-gps';
import { useRoute } from 'src/query/use-route';
import { DashboardContent } from 'src/layouts/dashboard';
import { useTrip, useVehicleActiveTrip } from 'src/query/use-trip';
import { useCreateJob, usePaginatedSubtrips } from 'src/query/use-subtrip';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { DRIVER_ADVANCE_GIVEN_BY_OPTIONS } from 'src/sections/subtrip/constants';
import { KanbanPumpDialog } from 'src/sections/kanban/components/kanban-pump-dialog';
import { KanbanRouteDialog } from 'src/sections/kanban/components/kanban-route-dialog';
import { KanbanDriverDialog } from 'src/sections/kanban/components/kanban-driver-dialog';
import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';
import { KanbanCustomerDialog } from 'src/sections/kanban/components/kanban-customer-dialog';

import { loadingWeightUnit } from '../../vehicle/vehicle-config';

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
const toNumber = (val) => {
  if (val === null || val === undefined || val === '') return undefined;
  const n = Number(val);
  return Number.isFinite(n) ? n : undefined;
};

// Accept number-like values; coerce to number; treat empty/NaN as undefined
const numericInputSchema = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return undefined;
  const n = typeof val === 'number' ? val : Number(val);
  return Number.isFinite(n) ? n : undefined;
}, z.number().optional());

// Loading weight: 0 to 60 inclusive
const loadingWeightSchema = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return undefined;
  const n = typeof val === 'number' ? val : Number(val);
  return Number.isFinite(n) ? n : undefined;
}, z
  .number()
  .min(0, { message: 'Loading weight must be at least 0' })
  .max(60, { message: 'Loading weight must be at most 60' })
  .optional());

const consigneeOptionSchema = z
  .object({ label: z.string().optional(), value: z.string().optional() })
  .partial()
  .nullish();

const formSchema = z
  .object({
    diNumber: z.string().optional(),
    remarks: z.string().optional(),
    startDate: schemaHelper.date({
      message: {
        required_error: 'Start date is required!',
        invalid_type_error: 'Invalid Start Date!',
      },
    }),
    tripDecision: z.enum(['attach', 'new']),
    loadType: z.enum(['loaded', 'empty']),
    startKm: numericInputSchema,
    consignee: consigneeOptionSchema,
    routeCd: z.string().optional(),
    loadingPoint: z.string().optional(),
    unloadingPoint: z.string().optional(),
    loadingWeight: loadingWeightSchema,
    rate: numericInputSchema,
    invoiceNo: z.string().optional(),
    ewayBill: z.string().optional(),
    // Optional because empty subtrips won't have it
    ewayExpiryDate: schemaHelper.dateOptional({
      message: { invalid_type_error: 'Invalid Eway Expiry Date!' },
    }),
    materialType: z.string().optional(),
    quantity: numericInputSchema,
    grade: z.string().optional(),
    shipmentNo: z.string().optional(),
    orderNo: z.string().optional(),
    referenceSubtripNo: z.string().optional(),
    driverAdvance: numericInputSchema,
    driverAdvanceGivenBy: z.string().optional(),
    initialAdvanceDiesel: numericInputSchema,
    initialAdvanceDieselUnit: z.enum(['litre', 'amount']).optional(),
    pumpCd: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const dieselAdvance = toNumber(data.initialAdvanceDiesel);
    const requiresPump =
      data.driverAdvanceGivenBy === DRIVER_ADVANCE_GIVEN_BY_OPTIONS.FUEL_PUMP ||
      (dieselAdvance !== undefined && dieselAdvance > 0);

    if (requiresPump && !data.pumpCd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Pump selection is required when advance or diesel is provided by the pump',
        path: ['pumpCd'],
      });
    }
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
  driverAdvanceGivenBy: DRIVER_ADVANCE_GIVEN_BY_OPTIONS.SELF,
  initialAdvanceDiesel: '',
  initialAdvanceDieselUnit: 'litre',
  pumpCd: '',
});

// driverAdvanceGivenBy uses enum values strictly: 'Self' | 'Fuel Pump'

// Stepper
const STEPS = [
  { label: 'Vehicle Details' },
  { label: 'Job Details' },
  { label: 'Route Details' },
  { label: 'Material Details' }, // Only for loaded jobs
  { label: 'Driver Advance' }, // Only for loaded jobs
];

export function SubtripJobCreateView() {
  // Step state
  const [activeStep, setActiveStep] = useState(0);

  // Selections state
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedPump, setSelectedPump] = useState(null);
  const [routeSuggestedAdvance, setRouteSuggestedAdvance] = useState(false);
  const [routeSuggestedDiesel, setRouteSuggestedDiesel] = useState(false);

  // Dialogs
  const vehicleDialog = useBoolean(false);
  const driverDialog = useBoolean(false);
  const customerDialog = useBoolean(false);
  const routeDialog = useBoolean(false);
  const pumpDialog = useBoolean(false);
  const materialOptions = useMaterialOptions();
  const { data: detailedRoute } = useRoute(selectedRoute?._id);

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

  const {
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
    clearErrors,
    getValues,
  } = methods;
  const watchedForm = watch();
  const {
    tripDecision,
    loadType,
    driverAdvanceGivenBy,
    initialAdvanceDiesel,
    initialAdvanceDieselUnit,
    pumpCd,
  } = watchedForm;

  const dieselAdvanceValue = toNumber(initialAdvanceDiesel);
  const requiresPumpSelection =
    driverAdvanceGivenBy === DRIVER_ADVANCE_GIVEN_BY_OPTIONS.FUEL_PUMP ||
    (dieselAdvanceValue !== undefined && dieselAdvanceValue > 0);

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
      setValue('driverAdvanceGivenBy', DRIVER_ADVANCE_GIVEN_BY_OPTIONS.SELF);
      setValue('initialAdvanceDiesel', '');
      setValue('initialAdvanceDieselUnit', 'litre');
      setValue('pumpCd', '');
      setSelectedPump(null);
      setRouteSuggestedAdvance(false);
      setRouteSuggestedDiesel(false);
    },
    [
      setSelectedVehicle,
      setSelectedCustomer,
      setSelectedDriver,
      setSelectedRoute,
      setSelectedPump,
      setValue,
      syncRouteFields,
    ]
  );

  const handleDriverChange = useCallback(
    (driver) => setSelectedDriver(driver),
    [setSelectedDriver]
  );

  const handleCustomerChange = useCallback(
    (customer) => setSelectedCustomer(customer),
    [setSelectedCustomer]
  );

  const handleRouteChange = useCallback(
    (route) => {
      setSelectedRoute(route);
      syncRouteFields(route);
      setRouteSuggestedAdvance(false);
      setRouteSuggestedDiesel(false);
      if (activeStep === 2) {
        trigger(['routeCd', 'loadingPoint', 'unloadingPoint']);
      }
    },
    [activeStep, setSelectedRoute, trigger, syncRouteFields]
  );

  const handlePumpChange = useCallback(
    (pump) => {
      setSelectedPump(pump);
      setValue('pumpCd', pump?._id || '', { shouldValidate: true });
    },
    [setSelectedPump, setValue]
  );

  // Auto-populate step 5 values from Route vehicleConfiguration when available, only once per route selection
  useEffect(() => {
    try {
      if (!detailedRoute || !selectedVehicle) return;
      const cfg = getFixedExpensesByVehicleType(detailedRoute, selectedVehicle);

      // Driver advance: populate only if not already suggested this selection
      if (!routeSuggestedAdvance) {
        const currentAdvance = toNumber(watchedForm.driverAdvance);
        if (currentAdvance === undefined && cfg?.advanceAmt != null) {
          setValue('driverAdvance', cfg.advanceAmt, { shouldValidate: true, shouldDirty: true });
          setRouteSuggestedAdvance(true);
        }
      }

      // Diesel intent: populate only if not already suggested this selection
      if (!routeSuggestedDiesel) {
        const currentDiesel = toNumber(watchedForm.initialAdvanceDiesel);
        if (currentDiesel === undefined && cfg?.diesel != null) {
          setValue('initialAdvanceDiesel', cfg.diesel, { shouldValidate: true, shouldDirty: true });
          setValue('initialAdvanceDieselUnit', 'litre', {
            shouldValidate: false,
            shouldDirty: true,
          });
          setRouteSuggestedDiesel(true);
        }
      }
    } catch (err) {
      // No matching vehicle configuration for this route; ignore
    }
  }, [
    detailedRoute,
    selectedVehicle,
    setValue,
    watchedForm.driverAdvance,
    watchedForm.initialAdvanceDiesel,
    routeSuggestedAdvance,
    routeSuggestedDiesel,
  ]);

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

  const consignees = useMemo(() => selectedCustomer?.consignees || [], [selectedCustomer]);

  // Auto-fill startKm for own vehicles using GPS when creating a new trip
  const vehicleNo = selectedVehicle?.vehicleNo;
  const { data: gpsData } = useGps(vehicleNo, { enabled: !!selectedVehicle?.isOwn && !!vehicleNo });
  useEffect(() => {
    if (!selectedVehicle?.isOwn) return;
    // If there is an active trip, only prefill when creating a new one
    if (activeTrip && tripDecision !== 'new') return;
    if (!gpsData?.totalOdometer) return;

    const current = toNumber(getValues('startKm'));
    if (current === undefined) {
      setValue('startKm', Math.round(gpsData.totalOdometer), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [gpsData, selectedVehicle, activeTrip, tripDecision, setValue, getValues]);

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

      // Require Start Km when creating a new trip (no active trip, or choosing to create new)
      const requiresStartKm = !activeTrip || (activeTrip && form.tripDecision === 'new');
      if (requiresStartKm) {
        const startKmValue = toNumber(form.startKm);
        if (startKmValue === undefined) return 'Start Km is required to create a new trip';
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
      if (
        !form.loadingWeight ||
        !form.rate ||
        !form.invoiceNo ||
        !form.materialType ||
        (form.ewayBill && !form.ewayExpiryDate)
      ) {
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

  const getAdvanceStepError = useCallback(
    (form) => {
      const materialStageError = getMaterialStepError(form);
      if (materialStageError) return materialStageError;

      const isOwnVehicle = !!selectedVehicle?.isOwn;
      const isLoaded = form.loadType === 'loaded' || !isOwnVehicle;
      if (!isLoaded) return null;

      const dieselAdvance = toNumber(form.initialAdvanceDiesel);
      const pumpRequired =
        form.driverAdvanceGivenBy === DRIVER_ADVANCE_GIVEN_BY_OPTIONS.FUEL_PUMP ||
        (dieselAdvance !== undefined && dieselAdvance > 0);

      if (pumpRequired && !form.pumpCd) {
        return 'Please select a pump for driver advance or diesel intent';
      }

      return null;
    },
    [getMaterialStepError, selectedVehicle]
  );

  // Build API payload consistently
  const buildPayload = (form) => {
    const isOwn = !!selectedVehicle?.isOwn;
    const hasActive = !!activeTrip;
    const isEmpty = isOwn ? form.loadType === 'empty' : false;
    const creatingNewTrip = isOwn && (!hasActive || (hasActive && form.tripDecision === 'new'));

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

    const tripKm = creatingNewTrip ? toNumber(form.startKm) : undefined;

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
          driverAdvanceGivenBy: form.driverAdvanceGivenBy,
          initialAdvanceDiesel: toNumber(form.initialAdvanceDiesel),
          initialAdvanceDieselUnit: form.initialAdvanceDieselUnit,
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
      const err = getAdvanceStepError(data);
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

  const canGoAdvanceStep = isLoadedJob ? !getMaterialStepError(watchedForm) : false;

  const canSubmit = isLoadedJob
    ? activeStep === 4
      ? !getAdvanceStepError(watchedForm)
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

  useEffect(() => {
    if (!isLoadedJob) {
      clearErrors('pumpCd');
      return;
    }

    if (requiresPumpSelection) {
      trigger('pumpCd');
    } else {
      clearErrors('pumpCd');
    }
  }, [isLoadedJob, requiresPumpSelection, trigger, clearErrors]);

  useEffect(() => {
    if (!pumpCd) {
      setSelectedPump(null);
    }
  }, [pumpCd, setSelectedPump]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create New Job"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Job List', href: paths.dashboard.subtrip.list },
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
                        <Alert severity="info" sx={{ display: 'flex', alignItems: 'center' }}>
                          <span>
                            Active trip found: <strong>{activeTrip.tripNo}</strong>
                          </span>
                          <Tooltip title="View recent jobs" arrow>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={handleOpenSubtripPopover}
                            >
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
                                Jobs in Trip {activeTrip.tripNo}
                              </Typography>
                              <Divider sx={{ mb: 1 }} />
                              <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
                                {(activeTripDetails?.subtrips || []).length === 0 ? (
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    No jobs found in this trip.
                                  </Typography>
                                ) : (
                                  <Stack spacing={1.5}>
                                    {(activeTripDetails?.subtrips || [])
                                      .slice()
                                      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                                      .map((st) => (
                                        <Box key={st._id}>
                                          <Typography variant="body2">
                                            <strong>LR:</strong> {st.subtripNo} •{' '}
                                            <strong>Customer:</strong>{' '}
                                            {st.customerId?.customerName || '-'}
                                          </Typography>
                                          <Typography
                                            variant="caption"
                                            sx={{ color: 'text.secondary' }}
                                          >
                                            <strong>Status:</strong>{' '}
                                            {st.subtripStatus?.replace('-', ' ') || '-'} •{' '}
                                            <strong>Route:</strong> {st.loadingPoint} →{' '}
                                            {st.unloadingPoint}
                                          </Typography>
                                          <Typography
                                            variant="caption"
                                            sx={{ color: 'text.secondary', display: 'block' }}
                                          >
                                            <strong>Dispatch:</strong>{' '}
                                            {st.startDate ? fDate(new Date(st.startDate)) : '-'} •{' '}
                                            <strong>Driver:</strong>{' '}
                                            {st.driverId?.driverName || '-'}
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
                          No active trip found. A new trip will be created and the job attached to
                          it.
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

                      {selectedVehicle?.isOwn &&
                        ((activeTrip && tripDecision === 'new') || !activeTrip) && (
                          <Field.Text
                            name="startKm"
                            label="Start Km"
                            type="number"
                            helperText="Previous trip will be closed with this starting km of current trip"
                            InputProps={{
                              endAdornment: <InputAdornment position="end">km</InputAdornment>,
                            }}
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
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(1)}
                    disabled={!canGoStep2}
                  >
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

                  {/* DI/DO moved to Step 4 as last field for loaded jobs */}

                  <Field.Text name="remarks" label="Remarks" />
                </Box>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button onClick={() => setActiveStep(0)}>Back</Button>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(2)}
                    disabled={!canGoRouteStep}
                  >
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
                      selected={
                        selectedRoute && `${selectedRoute.fromPlace} → ${selectedRoute.toPlace}`
                      }
                      iconName="mdi:map-marker-path"
                    />

                    <Field.Text
                      name="loadingPoint"
                      label="Loading Point *"
                      InputProps={{ readOnly: true }}
                    />
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
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(3)}
                        disabled={!canGoMaterialStep}
                      >
                        Continue
                      </Button>
                    ) : (
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        disabled={!canSubmit}
                      >
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
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {loadingWeightUnit[
                                (selectedVehicle?.vehicleType || '').toLowerCase()
                              ] || 'Units'}
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{ min: 0, max: 60 }}
                      />

                      <Field.Text
                        name="quantity"
                        label="Quantity"
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">Bags</InputAdornment>,
                        }}
                      />

                      <Field.Text
                        name="rate"
                        label="Rate *"
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                        }}
                      />

                      <Field.Text name="ewayBill" label="Eway Bill" />
                      <Field.DatePicker
                        name="ewayExpiryDate"
                        label="Eway Expiry Date"
                        minDate={dayjs()}
                      />
                      <Field.Text name="invoiceNo" label="Invoice No *" />
                      <Field.Text name="shipmentNo" label="Shipment No" />
                      <Field.Text name="orderNo" label="Order No" />
                      <Field.Text
                        name="referenceSubtripNo"
                        label="Reference Job No"
                        placeholder="Enter original job no (if created by another transporter)"
                      />

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

                      {/* DI/DO No as the last field in Step 4 */}
                      <Field.Text name="diNumber" label="DI/DO No" />
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button onClick={() => setActiveStep(2)}>Back</Button>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(4)}
                        disabled={!canGoAdvanceStep}
                      >
                        Continue
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <Alert severity="info">Material details are only for loaded jobs.</Alert>
                )}
              </StepContent>
            </Step>

            {/* Step 5 - Driver Advance (Loaded only) */}
            {isLoadedJob && (
              <Step>
                <StepLabel>{STEPS[4].label}</StepLabel>
                <StepContent>
                  <Stack spacing={2.5}>
                    <Box
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1.5,
                        bgcolor: 'background.default',
                      }}
                    >
                      <Box
                        display="grid"
                        gridTemplateColumns={{ xs: '1fr', sm: '2fr 1fr' }}
                        gap={1.5}
                      >
                        <Field.Text
                          name="driverAdvance"
                          label="Driver Advance (Amount)"
                          type="number"
                          placeholder="0"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                          }}
                        />
                        <Field.Select name="driverAdvanceGivenBy" label="Given By">
                          {Object.values(DRIVER_ADVANCE_GIVEN_BY_OPTIONS).map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Field.Select>
                      </Box>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {routeSuggestedAdvance && (
                          <Typography variant="caption" sx={{ color: 'success.main' }}>
                            Auto-filled from route configuration
                          </Typography>
                        )}
                      </Stack>
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1.5,
                        bgcolor: 'background.default',
                      }}
                    >
                      <Box
                        display="grid"
                        gridTemplateColumns={{ xs: '1fr', sm: '2fr 1fr' }}
                        gap={1.5}
                      >
                        <Field.InputWithUnit
                          name="initialAdvanceDiesel"
                          unitName="initialAdvanceDieselUnit"
                          label="Diesel Intent"
                          placeholder="0"
                          textFieldProps={{}}
                          unitOptions={[
                            { label: 'Litre', value: 'litre' },
                            { label: 'Amount', value: 'amount' },
                          ]}
                          defaultUnit="litre"
                        />
                        <Box>
                          <DialogSelectButton
                            onClick={pumpDialog.onTrue}
                            placeholder={`Select Pump${requiresPumpSelection ? ' *' : ''}`}
                            selected={selectedPump?.name}
                            iconName="mdi:gas-station"
                            error={Boolean(errors.pumpCd)}
                          />
                          {errors.pumpCd && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ mt: 0.75, display: 'block' }}
                            >
                              {errors.pumpCd.message}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Stack spacing={0.75} sx={{ mt: 1 }}>
                        {routeSuggestedDiesel && (
                          <Typography variant="caption" sx={{ color: 'success.main' }}>
                            Auto-filled from route configuration
                          </Typography>
                        )}
                        {initialAdvanceDieselUnit === 'litre' && (
                          <Alert variant="outlined" severity="info">
                            In case of Litre Diesel Intent, expense will not be added automatically.
                            Actuals need to be added.
                          </Alert>
                        )}
                      </Stack>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                    <Button onClick={() => setActiveStep(3)}>Back</Button>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                      disabled={!canSubmit}
                    >
                      Create Job
                    </LoadingButton>
                  </Stack>
                </StepContent>
              </Step>
            )}
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

          <KanbanPumpDialog
            open={pumpDialog.value}
            onClose={pumpDialog.onFalse}
            selectedPump={selectedPump}
            onPumpChange={handlePumpChange}
          />
        </Form>
      </Card>
    </DashboardContent>
  );
}
