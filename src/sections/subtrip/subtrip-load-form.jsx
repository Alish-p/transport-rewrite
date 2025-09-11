import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Step,
  Alert,
  Button,
  Tooltip,
  Stepper,
  Divider,
  MenuItem,
  Container,
  FormLabel,
  StepLabel,
  Typography,
  IconButton,
  StepContent,
  LinearProgress,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';

// Hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useMaterialOptions } from 'src/hooks/use-material-options';

// Utils
import { getFixedExpensesByVehicleType } from 'src/utils/utils';

import { useGps } from 'src/query/use-gps';
// Queries & Mutations
import { useRoute } from 'src/query/use-route';
import { useSubtrip, useUpdateSubtripMaterialInfo } from 'src/query/use-subtrip';

// Components
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { DialogSelectButton } from 'src/components/dialog-select-button';

// Config & Constants
import { loadingWeightUnit } from '../vehicle/vehicle-config';
import { KanbanPumpDialog } from '../kanban/components/kanban-pump-dialog';
import { KanbanRouteDialog } from '../kanban/components/kanban-route-dialog';
import { SUBTRIP_STATUS, DRIVER_ADVANCE_GIVEN_BY_OPTIONS } from './constants';
import { KanbanSubtripDialog } from '../kanban/components/kanban-subtrip-dialog';

// ----------------------------------------------------------------------
// Form Steps
// ----------------------------------------------------------------------

const STEPS = [
  { label: 'Select Subtrip', icon: 'mdi:truck' },
  { label: 'Route Details', icon: 'mdi:map-marker-path' },
  { label: 'Material Details', icon: 'mdi:package-variant-closed' },
  { label: 'Driver Advance', icon: 'mdi:cash-multiple' },
];

// Fields to validate per step
const STEP_FIELDS = [
  ['subtripId'], // Step 0
  ['consignee', 'routeCd', 'loadingPoint', 'unloadingPoint'], // Step 1
  ['loadingWeight', 'rate', 'invoiceNo', 'ewayExpiryDate', 'materialType'], // Step 2
  ['driverAdvance', 'driverAdvanceGivenBy', 'initialAdvanceDiesel', 'pumpCd'], // Step 3
];

// ----------------------------------------------------------------------
// Form Validation Schema
// ----------------------------------------------------------------------

const LoadSubtripSchema = zod
  .object({
    subtripId: zod.string().min(1, { message: 'Subtrip selection is required' }),
    consignee: zod
      .any()
      .nullable()
      .refine((val) => val !== null, { message: 'Consignee is required' }),
    loadingWeight: zod.number({ required_error: 'Loading Weight is required' }).positive(),
    startKm: zod.number().optional(),
    rate: zod.number().positive(),
    invoiceNo: zod.string().min(1, { message: 'Invoice No is required' }),
    shipmentNo: zod.string().optional(),
    orderNo: zod.string().optional(),
    referenceSubtripNo: zod.string().optional(),
    ewayBill: zod.string().optional(),
    ewayExpiryDate: schemaHelper.date({
      message: { required_error: 'Eway Expiry date is required!' },
    }),
    materialType: zod.string().min(1, { message: 'Material Type is required' }),
    quantity: zod.number().optional(),
    grade: zod.string().optional(),
    tds: zod.number().optional(),
    driverAdvance: zod.number().optional(),
    driverAdvanceGivenBy: zod.string().optional(),
    initialAdvanceDiesel: zod.number().optional(),
    pumpCd: zod.string().optional(),
    routeCd: zod.string().min(1, { message: 'Route Code is required' }),
    loadingPoint: zod.string().min(1, { message: 'Loading Point is required' }),
    unloadingPoint: zod.string().min(1, { message: 'Unloading Point is required' }),
  })
  .superRefine((data, ctx) => {
    if (
      (data.driverAdvanceGivenBy === DRIVER_ADVANCE_GIVEN_BY_OPTIONS.FUEL_PUMP ||
        (data.initialAdvanceDiesel && data.initialAdvanceDiesel > 0)) &&
      !data.pumpCd
    ) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message:
          'Pump selection is required when driver advance is given by pump or diesel advance is provided',
        path: ['pumpCd'],
      });
    }
  });

const defaultValues = {
  subtripId: '',
  consignee: null,
  loadingWeight: 0,
  startKm: 0,
  rate: 0,
  invoiceNo: '',
  shipmentNo: '',
  orderNo: '',
  referenceSubtripNo: '',
  ewayBill: '',
  ewayExpiryDate: null,
  materialType: '',
  quantity: 0,
  grade: '',
  tds: 0,
  driverAdvance: 0,
  driverAdvanceGivenBy: DRIVER_ADVANCE_GIVEN_BY_OPTIONS.SELF,
  initialAdvanceDiesel: 0,
  pumpCd: '',
  routeCd: '',
  loadingPoint: '',
  unloadingPoint: '',
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export function SubtripLoadForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSubtripId = searchParams.get('currentSubtrip');
  const materialOptions = useMaterialOptions();

  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSubtripId, setSelectedSubtripId] = useState(null);
  const [selectedSubtrip, setSelectedSubtrip] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedPump, setSelectedPump] = useState(null);

  const [expenseMessage, setExpenseMessage] = useState(null);
  const [expenseError, setExpenseError] = useState(null);

  // Dialog states
  const subtripDialog = useBoolean(false);
  const routeDialog = useBoolean(false);
  const pumpDialog = useBoolean(false);

  // Data fetching

  // Fetch FULL details of the selected subtrip ID
  const {
    data: detailedSubtrip,
    isLoading: isLoadingSubtripDetails,
    error: subtripDetailError,
  } = useSubtrip(selectedSubtripId);

  // fetch full details of the selected route ID
  const { data: detailedRoute } = useRoute(selectedRoute?._id);

  // Extract customerId from selected subtrip
  const customerId = selectedSubtrip?.customerId?._id;

  // Mutation hook
  const updateMaterialInfo = useUpdateSubtripMaterialInfo();

  // Form setup
  const methods = useForm({
    resolver: zodResolver(LoadSubtripSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    trigger,
    formState: { isSubmitting, errors, isValid },
  } = methods;

  // Watch form values
  const { driverAdvanceGivenBy, initialAdvanceDiesel } = watch();

  // Derived data
  const vehicleData = selectedSubtrip?.vehicleId;
  const { isOwn, vehicleType, trackingLink } = vehicleData || {};

  const { data: gpsData } = useGps(vehicleData?.vehicleNo, { enabled: vehicleData?.isOwn });

  const consignees = useMemo(
    () => selectedSubtrip?.customerId?.consignees || [],
    [selectedSubtrip]
  );

  // ----------------------------------------------------------------------
  // Event Handlers
  // ----------------------------------------------------------------------

  const handleNext = async () => {
    const fieldsToValidate = STEP_FIELDS[activeStep];
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleReset = useCallback(() => {
    reset(defaultValues);
    setActiveStep(0);
    setSelectedSubtripId(null);
    setSelectedSubtrip(null);
    setSelectedRoute(null);
    setSelectedPump(null);
  }, [reset]);

  // --- Subtrip Selection Change ---
  const handleSubtripChange = useCallback(
    (summarySubtrip) => {
      subtripDialog.onFalse();
      const newId = summarySubtrip?._id;

      if (newId && newId !== selectedSubtripId) {
        console.log('New Subtrip ID Selected:', newId);
        setSelectedSubtripId(newId);
        setSelectedSubtrip(null);
        setSelectedRoute(null);
        setSelectedPump(null);
        reset({ ...defaultValues, subtripId: newId }, { keepErrors: false, keepDirty: false });
        setActiveStep(0);
        setTimeout(() => trigger('subtripId'), 0);
      } else if (!newId) {
        handleReset();
      }
    },
    [selectedSubtripId, reset, handleReset, subtripDialog, trigger]
  );

  const handleRouteChange = useCallback(
    (route) => {
      setSelectedRoute(route);
      setValue('routeCd', route._id, { shouldValidate: true });
      setValue('loadingPoint', route.fromPlace, { shouldValidate: true });
      setValue('unloadingPoint', route.toPlace, { shouldValidate: true });

      routeDialog.onFalse();
    },
    [routeDialog, setValue]
  );

  const handlePumpChange = (pump) => {
    setSelectedPump(pump);
    setValue('pumpCd', pump?._id || '', { shouldValidate: true });
    pumpDialog.onFalse();
  };

  const onSubmit = async (data) => {
    if (!selectedSubtrip) {
      console.error('Submit attempted before subtrip details were loaded.');
      return;
    }

    try {
      const payload = {
        ...data,
        vehicleId: selectedSubtrip.vehicleId._id,
        consignee: data.consignee?.value,
      };
      delete payload.subtripId;

      await updateMaterialInfo({
        id: selectedSubtrip._id,
        data: payload,
      });

      handleReset();
      navigate(paths.dashboard.subtrip.details(selectedSubtrip._id));
    } catch (error) {
      console.error('Failed to update subtrip:', error);
    }
  };

  // ----------------------------------------------------------------------
  // Effects
  // ----------------------------------------------------------------------

  useEffect(() => {
    if (currentSubtripId && !selectedSubtripId) {
      setSelectedSubtripId(currentSubtripId);
    }
  }, [currentSubtripId, selectedSubtripId]);

  useEffect(() => {
    if (detailedSubtrip && detailedSubtrip._id === selectedSubtripId) {
      console.log('Detailed Subtrip Data Received:', detailedSubtrip);
      setSelectedSubtrip(detailedSubtrip);

      reset(
        {
          ...defaultValues,
          subtripId: detailedSubtrip._id,
          invoiceNo: detailedSubtrip.invoiceNo || '',
          startKm: detailedSubtrip.startKm || 0,
          ewayExpiryDate: detailedSubtrip.ewayExpiryDate
            ? new Date(detailedSubtrip.ewayExpiryDate)
            : null,
          consignee: detailedSubtrip.consigneeName
            ? { label: detailedSubtrip.consigneeName, value: detailedSubtrip.consigneeName }
            : null,
        },
        { keepErrors: false, keepDirty: true }
      );

      setTimeout(() => trigger(STEP_FIELDS[0]), 100);
    } else if (subtripDetailError) {
      console.error('Error fetching subtrip details:', subtripDetailError);
      alert(`Error loading subtrip details: ${subtripDetailError.message || 'Unknown error'}`);
      handleReset();
    }
  }, [
    detailedSubtrip,
    selectedSubtripId,
    reset,
    setValue,
    trigger,
    handleReset,
    subtripDetailError,
  ]);

  useEffect(() => {
    if (
      driverAdvanceGivenBy === DRIVER_ADVANCE_GIVEN_BY_OPTIONS.FUEL_PUMP ||
      (initialAdvanceDiesel && initialAdvanceDiesel > 0)
    ) {
      trigger('pumpCd');
    }
  }, [driverAdvanceGivenBy, initialAdvanceDiesel, trigger]);

  useEffect(() => {
    if (gpsData?.totalOdometer) {
      const current = getValues('startKm');
      if (!current) {
        setValue('startKm', Math.round(gpsData.totalOdometer));
      }
    }
  }, [gpsData, setValue, getValues]);

  useEffect(() => {
    if (isOwn && detailedRoute && vehicleData) {
      try {
        const expenses = getFixedExpensesByVehicleType(detailedRoute, vehicleData);
        setExpenseError(null);
        setExpenseMessage(
          `Fixed expenses are available for ${vehicleData.vehicleType} [${vehicleData.noOfTyres} tyres]. ` +
          `These expenses will be applied automatically: Advance ₹${expenses.advanceAmt}, Toll ₹${expenses.tollAmt}, Fixed Salary ₹${expenses.fixedSalary}.`
        );
      } catch (error) {
        setExpenseMessage(null);
        setExpenseError(
          `This route has no fixed expenses configured for vehicle type "${vehicleData.vehicleType}" with ${vehicleData.noOfTyres} tyres. 
        Please ask the route admin/manager to add fixed expenses for this vehicle configuration.`
        );
      }
    } else {
      setExpenseMessage(null);
      setExpenseError(null);
    }
  }, [detailedRoute, vehicleData, isOwn]);

  // ----------------------------------------------------------------------
  // Step Content Rendering
  // ----------------------------------------------------------------------

  const renderSubtripSelection = () => (
    <Card sx={{ p: 3, position: 'relative' }}>
      {isLoadingSubtripDetails && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 2 }}>
          <LinearProgress color="info" />
        </Box>
      )}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Select Subtrip to Load
      </Typography>
      <DialogSelectButton
        onClick={subtripDialog.onTrue}
        placeholder="Select Subtrip *"
        selected={selectedSubtripId}
        error={!!errors.subtripId}
        iconName="mdi:truck"
        disabled={isLoadingSubtripDetails || !!currentSubtripId}
        selectedText={
          selectedSubtrip
            ? `Subtrip: ${selectedSubtrip?.displayIdentifier || selectedSubtrip?._id}`
            : selectedSubtripId
              ? 'Loading Details...'
              : null
        }
      />
      {errors.subtripId && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
          {errors.subtripId.message}
        </Typography>
      )}
      {subtripDetailError && !isLoadingSubtripDetails && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load subtrip details. Please try selecting again.
        </Alert>
      )}
    </Card>
  );

  const renderRouteDetails = () => (
    <Box
      columnGap={2}
      rowGap={3}
      display="grid"
      gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
    >
      <Field.AutocompleteFreeSolo
        name="consignee"
        label="Consignee *"
        options={consignees.map(({ name }) => ({ label: name, value: name }))}
      />

      <Box>
        <Button
          fullWidth
          variant="outlined"
          color={errors.routeCd ? 'error' : 'inherit'}
          onClick={routeDialog.onTrue}
          sx={{ height: 56, justifyContent: 'flex-start', typography: 'body2' }}
          startIcon={
            <Iconify
              icon="mdi:map-marker-path"
              sx={{ color: selectedRoute ? 'primary.main' : 'text.disabled' }}
            />
          }
          disabled={!customerId}
        >
          {selectedRoute
            ? `${selectedRoute.fromPlace} → ${selectedRoute.toPlace}`
            : 'Select Route *'}
        </Button>
        {errors.routeCd && (
          <Typography variant="caption" color="error" sx={{ mx: 1.5 }}>
            {errors.routeCd.message}
          </Typography>
        )}
      </Box>

      <Field.Text name="loadingPoint" label="Loading Point *" InputProps={{ readOnly: true }} />
      <Field.Text
        name="unloadingPoint"
        label="Unloading Point *"
        InputProps={{ readOnly: true }}
        helperText="Consignee's Address"
      />
    </Box>
  );

  const renderMaterialDetails = () => (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
      gap={3}
    >
      <Field.Text
        name="loadingWeight"
        label="Loading Weight *"
        type="number"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {vehicleType ? loadingWeightUnit[vehicleType] : 'Units'}
            </InputAdornment>
          ),
        }}
      />

      {vehicleType !== 'tanker' && vehicleType !== 'bulker' && (
        <Field.Text
          name="quantity"
          label="Quantity"
          type="number"
          InputProps={{ endAdornment: <InputAdornment position="end">Bags</InputAdornment> }}
        />
      )}

      {isOwn && (
        <Box sx={{ position: 'relative' }}>
          <Field.Text
            name="startKm"
            label="Start Km"
            type="number"
            InputProps={{ endAdornment: <InputAdornment position="end">KM</InputAdornment> }}
          />
          {trackingLink && (
            <Tooltip title="Track Vehicle">
              <IconButton
                size="small"
                onClick={() => {
                  window.open(trackingLink, '_blank');
                }}
                sx={{
                  position: 'absolute',
                  right: { xs: 8, sm: 35 },
                  top: 10,
                  color: 'primary.main',
                }}
              >
                <Iconify icon="mdi:map-marker" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}

      <Field.Text
        name="rate"
        label="Rate *"
        type="number"
        InputProps={{ endAdornment: <InputAdornment position="end">₹</InputAdornment> }}
      />

      <Field.Text name="ewayBill" label="Eway Bill" />
      <Field.DatePicker name="ewayExpiryDate" label="Eway Expiry Date *" minDate={dayjs()} />

      <Box sx={{ position: 'relative' }}>
        <Field.Text name="invoiceNo" label="Invoice No *" />
      </Box>

      <Field.Text name="shipmentNo" label="Shipment No" />
      <Field.Text name="orderNo" label="Order No" />
      <Field.Text name="referenceSubtripNo" label="Reference Subtrip No" placeholder='Enter original subtrip no (if created by another transporter)' />

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
  );

  const renderAdvanceDetails = () => (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2, boxShadow: 1 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Iconify icon="mdi:cash-multiple" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              DRIVER ADVANCE
            </Typography>
          </Box>
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
            <Field.Text
              name="driverAdvance"
              label="Amount"
              type="number"
              placeholder="0"
              InputProps={{ endAdornment: <InputAdornment position="end">₹</InputAdornment> }}
            />
            <Box>
              <FormLabel component="legend" sx={{ mb: 0.5 }}>
                Given By:
              </FormLabel>
              <Field.RadioGroup
                row
                name="driverAdvanceGivenBy"
                options={Object.values(DRIVER_ADVANCE_GIVEN_BY_OPTIONS).map((opt) => ({
                  label: opt,
                  value: opt,
                }))}
              />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2, boxShadow: 1 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Iconify icon="mdi:gas-station" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              DIESEL INTENT
            </Typography>
          </Box>
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
            <Field.Text
              name="initialAdvanceDiesel"
              label="Diesel"
              type="number"
              placeholder="0"
              InputProps={{ endAdornment: <InputAdornment position="end">Ltr</InputAdornment> }}
            />
            <Box>
              <Button
                fullWidth
                variant="outlined"
                color={errors.pumpCd ? 'error' : 'inherit'}
                onClick={pumpDialog.onTrue}
                sx={{ height: 56, justifyContent: 'flex-start', typography: 'body2' }}
                startIcon={
                  <Iconify
                    icon={selectedPump ? 'mdi:gas-station' : 'mdi:gas-station-outline'}
                    sx={{ color: selectedPump ? 'primary.main' : 'text.disabled' }}
                  />
                }
              >
                {selectedPump ? selectedPump.name : 'Select Pump'}
                {(driverAdvanceGivenBy === DRIVER_ADVANCE_GIVEN_BY_OPTIONS.FUEL_PUMP ||
                  (initialAdvanceDiesel && initialAdvanceDiesel > 0)) &&
                  ' *'}
              </Button>
              {errors.pumpCd && (
                <Typography variant="caption" color="error" sx={{ mx: 1.5 }}>
                  {errors.pumpCd.message}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {expenseMessage && (
        <Alert severity="info" variant="outlined" sx={{ mt: 3 }}>
          {expenseMessage}
        </Alert>
      )}

      {expenseError && (
        <Alert severity="error" variant="outlined" sx={{ mt: 3 }}>
          {expenseError}
        </Alert>
      )}
    </>
  );

  // ----------------------------------------------------------------------
  // Main Render
  // ----------------------------------------------------------------------

  return (
    <Container maxWidth="lg">
      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {STEPS.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Iconify
                        icon={step.icon}
                        width={16}
                        sx={{
                          color:
                            activeStep === index
                              ? 'primary.main'
                              : activeStep > index
                                ? 'success.main'
                                : 'text.disabled',
                        }}
                      />
                    </Box>
                  )}
                >
                  {step.label}
                </StepLabel>
                <StepContent TransitionProps={{ unmountOnExit: false }}>
                  {index > 0 && isLoadingSubtripDetails && <LinearProgress sx={{ mb: 2 }} />}

                  {index === 0 && renderSubtripSelection()}
                  {index === 1 && renderRouteDetails()}
                  {index === 2 && renderMaterialDetails()}
                  {index === 3 && renderAdvanceDetails()}

                  <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                    <Button
                      disabled={index === 0 || isSubmitting || isLoadingSubtripDetails}
                      onClick={handleBack}
                    >
                      Back
                    </Button>

                    {index < STEPS.length - 1 && (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={isLoadingSubtripDetails || (index === 0 && !selectedSubtripId)}
                      >
                        Continue
                      </Button>
                    )}

                    {index === STEPS.length - 1 && (
                      <LoadingButton
                        variant="contained"
                        type="submit"
                        loading={isSubmitting}
                        disabled={isLoadingSubtripDetails || !isValid || isSubmitting}
                      >
                        Load Subtrip & Save Changes
                      </LoadingButton>
                    )}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Card>
      </Form>

      <KanbanSubtripDialog
        open={subtripDialog.value}
        onClose={subtripDialog.onFalse}
        selectedSubtrip={selectedSubtrip}
        onSubtripChange={handleSubtripChange}
        statusList={[SUBTRIP_STATUS.IN_QUEUE]}
      />

      <KanbanRouteDialog
        open={routeDialog.value}
        onClose={routeDialog.onFalse}
        selectedRoute={selectedRoute}
        onRouteChange={handleRouteChange}
        mode="genericAndCustomer"
        customerId={customerId}
      />

      <KanbanPumpDialog
        open={pumpDialog.value}
        onClose={pumpDialog.onFalse}
        selectedPump={selectedPump}
        onPumpChange={handlePumpChange}
      />
    </Container>
  );
}
