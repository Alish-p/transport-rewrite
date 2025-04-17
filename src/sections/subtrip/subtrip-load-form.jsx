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
  Container,
  FormLabel,
  StepLabel,
  Typography,
  IconButton,
  StepContent,
  InputAdornment,
} from '@mui/material';

// Hooks
import { useBoolean } from 'src/hooks/use-boolean';

// Utils
import { getSalaryDetailsByVehicleType } from 'src/utils/utils';

// Queries & Mutations
import { useRoutes } from 'src/query/use-route';
import { useInQueueSubtrips, useUpdateSubtripMaterialInfo } from 'src/query/use-subtrip';

// Components
import { Iconify } from 'src/components/iconify';
import { InvoiceScanner } from 'src/components/invoice-scanner';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { DialogSelectButton } from 'src/components/dialog-select-button';

// Config & Constants
import { DRIVER_ADVANCE_GIVEN_BY_OPTIONS } from './constants';
import { loadingWeightUnit } from '../vehicle/vehicle-config';
import { KanbanPumpDialog } from '../kanban/components/kanban-pump-dialog';
import { KanbanRouteDialog } from '../kanban/components/kanban-route-dialog';
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
    ewayBill: zod.string().optional(),
    ewayExpiryDate: schemaHelper.date({
      message: { required_error: 'Eway Expiry date is required!' },
    }),
    materialType: zod.string().optional(),
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
  const redirectTo = searchParams.get('redirectTo');

  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSubtrip, setSelectedSubtrip] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedPump, setSelectedPump] = useState(null);

  // Dialog states
  const subtripDialog = useBoolean(false);
  const routeDialog = useBoolean(false);
  const pumpDialog = useBoolean(false);
  const scannerDialog = useBoolean(false);

  // Data fetching
  const { data: loadableSubtrips = [], isLoading: isLoadingLoadableSubtrips } =
    useInQueueSubtrips();

  // Get routes based on selected customer
  const customerId = selectedSubtrip?.customerId?._id;
  const { data: routes = [], isLoading: isLoadingRoutes } = useRoutes(customerId, {
    enabled: !!customerId,
  });

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
    setValue,
    trigger,
    formState: { isSubmitting, errors, isValid },
  } = methods;

  // Watch form values
  const { routeCd, driverAdvanceGivenBy, initialAdvanceDiesel } = watch();

  // Derived data
  const vehicleData = selectedSubtrip?.tripId?.vehicleId;
  const { _id: vehicleId, isOwn, vehicleType, fuelTankCapacity, trackingLink } = vehicleData || {};
  const consignees = useMemo(
    () => selectedSubtrip?.customerId?.consignees || [],
    [selectedSubtrip]
  );

  // Calculate advance amount based on route
  const { advanceAmt } = useMemo(() => {
    if (routeCd && vehicleType && routes.length > 0) {
      return (
        getSalaryDetailsByVehicleType(routes, routeCd, {
          vehicleType,
          noOfTyres: vehicleData?.noOfTyres,
        }) || {}
      );
    }
    return {};
  }, [routeCd, routes, vehicleType, vehicleData?.noOfTyres]);

  // ----------------------------------------------------------------------
  // Event Handlers
  // ----------------------------------------------------------------------

  const handleNext = async () => {
    // const isStepValid = await trigger();
    // if (isStepValid) {
    setActiveStep((prev) => prev + 1);
    // }
  };

  console.log({ errors });

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleReset = useCallback(() => {
    reset(defaultValues);
    setActiveStep(0);
    setSelectedSubtrip(null);
    setSelectedRoute(null);
    setSelectedPump(null);
  }, [reset]);

  const handleSubtripChange = useCallback(
    (subtrip) => {
      if (subtrip) {
        setSelectedSubtrip(subtrip);
        setValue('subtripId', subtrip._id, { shouldValidate: true });
        setSelectedRoute(null);
        setSelectedPump(null);
        setValue('routeCd', '', { shouldValidate: true });
        setValue('loadingPoint', '', { shouldValidate: true });
        setValue('unloadingPoint', '', { shouldValidate: true });
        setValue('pumpCd', '', { shouldValidate: true });
        setValue('consignee', null, { shouldValidate: true });

        reset(
          {
            ...defaultValues,
            subtripId: subtrip._id,
          },
          { keepErrors: false, keepDirty: false }
        );
      } else {
        handleReset();
      }
      subtripDialog.onFalse();
    },
    [setValue, reset, handleReset, subtripDialog]
  );

  const handleRouteChange = (route) => {
    if (route) {
      setSelectedRoute(route);
      setValue('routeCd', route._id, { shouldValidate: true });
      setValue('loadingPoint', route.fromPlace, { shouldValidate: true });
      setValue('unloadingPoint', route.toPlace, { shouldValidate: true });
    } else {
      setSelectedRoute(null);
      setValue('routeCd', '', { shouldValidate: true });
      setValue('loadingPoint', '', { shouldValidate: true });
      setValue('unloadingPoint', '', { shouldValidate: true });
    }
    routeDialog.onFalse();
  };

  const handlePumpChange = (pump) => {
    setSelectedPump(pump);
    setValue('pumpCd', pump?._id || '', { shouldValidate: true });
    pumpDialog.onFalse();
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        vehicleId: selectedSubtrip.tripId.vehicleId._id,
        consignee: data.consignee?.value,
      };
      delete payload.subtripId;

      await updateMaterialInfo({
        id: selectedSubtrip._id,
        data: payload,
      });

      handleReset();
      if (redirectTo) {
        navigate(redirectTo);
      }
    } catch (error) {
      console.error('Failed to update subtrip:', error);
    }
  };

  // ----------------------------------------------------------------------
  // Effects
  // ----------------------------------------------------------------------

  useEffect(() => {
    if (currentSubtripId) {
      const subtrip = loadableSubtrips.find((s) => s._id === currentSubtripId);
      if (subtrip) {
        handleSubtripChange(subtrip);
      }
    }
  }, [currentSubtripId, loadableSubtrips, handleSubtripChange]);

  useEffect(() => {
    if (
      driverAdvanceGivenBy === DRIVER_ADVANCE_GIVEN_BY_OPTIONS.FUEL_PUMP ||
      (initialAdvanceDiesel && initialAdvanceDiesel > 0)
    ) {
      trigger('pumpCd');
    }
  }, [driverAdvanceGivenBy, initialAdvanceDiesel, trigger]);

  // ----------------------------------------------------------------------
  // Step Content Rendering
  // ----------------------------------------------------------------------

  const renderSubtripSelection = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Select Subtrip to Load
      </Typography>
      <DialogSelectButton
        onClick={subtripDialog.onTrue}
        placeholder="Select Subtrip *"
        selected={selectedSubtrip?._id}
        error={!!errors.subtripId?.message && !selectedSubtrip}
        iconName="mdi:truck"
        disabled={isLoadingLoadableSubtrips}
        selectedText={
          selectedSubtrip
            ? `Subtrip: ${selectedSubtrip?.displayIdentifier || selectedSubtrip?._id}`
            : null
        }
      />
      {errors.subtripId && !selectedSubtrip && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
          {errors.subtripId.message}
        </Typography>
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
          disabled={isLoadingRoutes || !customerId}
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
              {vehicleType ? loadingWeightUnit[vehicleType] || 'Units' : 'Units'}
            </InputAdornment>
          ),
        }}
      />

      {vehicleType !== 'tanker' && (
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
      <Field.DatePicker name="ewayExpiryDate" label="Eway Expiry Date *" />

      <Box sx={{ position: 'relative' }}>
        <Field.Text name="invoiceNo" label="Invoice No *" />
        <Tooltip title="Scan Invoice">
          <IconButton
            size="small"
            onClick={scannerDialog.onTrue}
            sx={{ position: 'absolute', right: 8, top: 13, color: 'primary.main' }}
          >
            <Iconify icon="mdi:camera" />
          </IconButton>
        </Tooltip>
      </Box>

      <Field.Text name="shipmentNo" label="Shipment No" />
      <Field.Text name="orderNo" label="Order No" />

      <Field.Text name="materialType" label="Material Type" />
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
                {selectedPump ? selectedPump.pumpName : 'Select Pump'}
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

      {advanceAmt && (
        <Alert severity="info" variant="outlined" sx={{ mt: 3 }}>
          {`For this route, the usual driver advance is ${advanceAmt} ₹.`}
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
                  {index === 0 && renderSubtripSelection()}
                  {index === 1 && renderRouteDetails()}
                  {index === 2 && renderMaterialDetails()}
                  {index === 3 && renderAdvanceDetails()}

                  <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                    <Button disabled={index === 0} onClick={handleBack}>
                      Back
                    </Button>
                    {index === STEPS.length - 1 ? (
                      <LoadingButton
                        variant="contained"
                        onClick={handleSubmit(onSubmit)}
                        loading={isSubmitting}
                        disabled={!isValid || isSubmitting}
                      >
                        Load Subtrip & Save Changes
                      </LoadingButton>
                    ) : (
                      <Button variant="contained" onClick={handleNext}>
                        Continue
                      </Button>
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
        subtrips={loadableSubtrips}
        isLoading={isLoadingLoadableSubtrips}
        dialogTitle="Select Subtrip to Load"
      />

      <KanbanRouteDialog
        open={routeDialog.value}
        onClose={routeDialog.onFalse}
        selectedRoute={selectedRoute}
        onRouteChange={handleRouteChange}
        customerId={customerId}
        disabled={isLoadingRoutes}
      />

      <KanbanPumpDialog
        open={pumpDialog.value}
        onClose={pumpDialog.onFalse}
        selectedPump={selectedPump}
        onPumpChange={handlePumpChange}
      />

      <InvoiceScanner
        open={scannerDialog.value}
        onClose={scannerDialog.onFalse}
        onScanComplete={() => {}}
      />
    </Container>
  );
}
