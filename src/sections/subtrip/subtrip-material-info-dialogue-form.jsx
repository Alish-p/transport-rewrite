import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import {
  Box,
  Tab,
  Tabs,
  Alert,
  Dialog,
  Button,
  Tooltip,
  FormLabel,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { getSalaryDetailsByVehicleType } from 'src/utils/utils';

import { usePumps } from 'src/query/use-pump';
import { useRoutes } from 'src/query/use-route';
import { useUpdateSubtripMaterialInfo } from 'src/query/use-subtrip';

import { Iconify } from 'src/components/iconify';
import { InvoiceScanner } from 'src/components/invoice-scanner';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { DRIVER_ADVANCE_GIVEN_BY_OPTIONS } from './constants';
import { KanbanPumpDialog } from '../kanban/components/kanban-pump-dialog';
import { KanbanRouteDialog } from '../kanban/components/kanban-route-dialog';

// ----------------------------------------------------------------------
// TabPanel Component
// ----------------------------------------------------------------------

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

// ----------------------------------------------------------------------
// Form Validation Schema and Default Values
// ----------------------------------------------------------------------

const validationSchema = zod
  .object({
    consignee: zod
      .any()
      .nullable()
      .refine((val) => val !== null, { message: 'Consignee is required' }),
    loadingWeight: zod.number({ required_error: 'Loading Weight is required' }).positive(),
    startKm: zod.number(),
    rate: zod.number().positive(),
    invoiceNo: zod.string().optional(),
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
    // Make pumpCd required if driverAdvanceGivenBy is "Fuel Pump" or initialAdvanceDiesel > 0
    if (
      (data.driverAdvanceGivenBy === DRIVER_ADVANCE_GIVEN_BY_OPTIONS.FUEL_PUMP ||
        data.initialAdvanceDiesel > 0) &&
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

export function SubtripMaterialInfoDialog({ showDialog, setShowDialog, subtrip }) {
  // State management
  const [tabValue, setTabValue] = useState(0);
  const [dieselEntryType, setDieselEntryType] = useState('custom');

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedPump, setSelectedPump] = useState(null);

  const routeDialog = useBoolean(false);
  const pumpDialog = useBoolean(false);
  const scannerDialog = useBoolean(false);

  // Extract data from props
  const { tripId, customerId, _id } = subtrip;
  const vehicleId = tripId?.vehicleId?._id;
  const consignees = customerId?.consignees || [];
  const fuelTankCapacity = tripId?.vehicleId?.fuelTankCapacity || 0;

  // API hooks
  const updateMaterialInfo = useUpdateSubtripMaterialInfo();
  const { data: pumps } = usePumps(showDialog);
  const { data: routes } = useRoutes(customerId?._id, true);

  // Form setup
  const methods = useForm({ resolver: zodResolver(validationSchema), defaultValues });
  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  // Watch form values
  const { routeCd } = watch();

  // Calculate advance amount based on route
  const { advanceAmt } = useMemo(
    () =>
      routeCd
        ? getSalaryDetailsByVehicleType(routes, routeCd, {
            vehicleType: tripId?.vehicleId?.vehicleType,
            noOfTyres: tripId?.vehicleId?.noOfTyres,
          }) || {}
        : {},
    [routeCd, routes, tripId?.vehicleId?.vehicleType, tripId?.vehicleId?.noOfTyres]
  );

  // ----------------------------------------------------------------------
  // Event Handlers
  // ----------------------------------------------------------------------

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const handleReset = useCallback(() => {
    reset(defaultValues);
    setTabValue(0);
    setSelectedRoute(null);
    setSelectedPump(null);
  }, [reset]);

  const handleRouteChange = (route) => {
    setSelectedRoute(route);
    setValue('routeCd', route._id);
    setValue('loadingPoint', route.fromPlace);
    setValue('unloadingPoint', route.toPlace);
  };

  const handlePumpChange = (pump) => {
    setSelectedPump(pump);
    setValue('pumpCd', pump._id);
  };

  const handleScanComplete = (invoiceData) => {
    // Populate form fields with scanned data
    if (invoiceData.invoiceNo) setValue('invoiceNo', invoiceData.invoiceNo);
    if (invoiceData.orderNo) setValue('orderNo', invoiceData.orderNo);
    if (invoiceData.shipmentNo) setValue('shipmentNo', invoiceData.shipmentNo);
    if (invoiceData.consignee) {
      // Find matching consignee from the list
      const matchingConsignee = consignees.find((c) =>
        c.name.toLowerCase().includes(invoiceData.consignee.toLowerCase())
      );
      if (matchingConsignee) {
        setValue('consignee', { label: matchingConsignee.name, value: matchingConsignee.name });
      }
    }
    if (invoiceData.loadingWeight) setValue('loadingWeight', invoiceData.loadingWeight);
    if (invoiceData.rate) setValue('rate', invoiceData.rate);
  };

  const onSubmit = async (data) => {
    try {
      await updateMaterialInfo({
        id: _id,
        data: {
          ...data,
          vehicleId,
          consignee: data?.consignee?.value,
          initialAdvanceDiesel:
            data.dieselType === 'full' ? fuelTankCapacity : data.initialAdvanceDiesel,
        },
      });
      handleReset();
      setShowDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  // ----------------------------------------------------------------------
  // Effects
  // ----------------------------------------------------------------------

  // Update initialAdvanceDiesel when dieselType changes
  useEffect(() => {
    if (dieselEntryType === 'full') {
      setValue('initialAdvanceDiesel', fuelTankCapacity || 500);
    } else {
      setValue('initialAdvanceDiesel', 0);
    }
  }, [dieselEntryType, fuelTankCapacity, setValue]);

  // ----------------------------------------------------------------------
  // UI Rendering Functions
  // ----------------------------------------------------------------------

  const renderRouteDetails = () => (
    <Box
      columnGap={2}
      rowGap={3}
      display="grid"
      gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
    >
      <Field.AutocompleteFreeSolo
        name="consignee"
        label="Consignee"
        options={consignees.map(({ name }) => ({ label: name, value: name }))}
        required
      />

      <Box>
        <Button
          fullWidth
          variant="outlined"
          onClick={routeDialog.onTrue}
          sx={{
            height: 56,
            justifyContent: 'flex-start',
            typography: 'body2',
          }}
          startIcon={
            <Iconify
              icon="mdi:map-marker-path"
              sx={{ color: selectedRoute ? 'primary.main' : 'text.disabled' }}
            />
          }
        >
          {selectedRoute ? `${selectedRoute.fromPlace} → ${selectedRoute.toPlace}` : 'Select Route'}
        </Button>
      </Box>
      <Field.Text name="loadingPoint" label="Loading Point" />
      <Field.Text name="unloadingPoint" label="Unloading Point" helperText="Consignee's Address" />
    </Box>
  );

  const renderMaterialDetails = () => (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
      gap={3}
    >
      <Field.Text
        name="loadingWeight"
        label="Loading Weight"
        type="number"
        required
        InputProps={{
          endAdornment: <InputAdornment position="end">Ton</InputAdornment>,
        }}
      />
      <Field.Text
        name="startKm"
        label="Start Km"
        type="number"
        required
        InputProps={{
          endAdornment: <InputAdornment position="end">KM</InputAdornment>,
        }}
      />
      <Field.Text
        name="rate"
        label="Rate"
        type="number"
        required
        InputProps={{
          endAdornment: <InputAdornment position="end">₹</InputAdornment>,
        }}
      />
      <Field.Text name="ewayBill" label="Eway Bill" />
      <Field.DatePicker name="ewayExpiryDate" label="Eway Expiry Date" required />

      {/* Consignment No details */}
      <Box sx={{ position: 'relative' }}>
        <Field.Text name="invoiceNo" label="Invoice No" />
        <Tooltip title="Scan Invoice">
          <IconButton
            size="small"
            onClick={scannerDialog.onTrue}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'primary.main',
            }}
          >
            <Iconify icon="mdi:camera" />
          </IconButton>
        </Tooltip>
      </Box>
      <Field.Text name="shipmentNo" label="Shipment No" />
      <Field.Text name="orderNo" label="Order No" />

      {/* Material Details */}
      <Field.Text name="materialType" label="Material Type" />
      <Field.Text name="grade" label="Grade" />
      <Field.Text
        name="quantity"
        label="Quantity"
        type="number"
        InputProps={{
          endAdornment: <InputAdornment position="end">Bags</InputAdornment>,
        }}
      />
    </Box>
  );

  const renderAdvanceDetails = () => (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Driver Advance Card */}
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Iconify icon="mdi:cash-multiple" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              DRIVER ADVANCE
            </Typography>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            gap={3}
          >
            <Field.Text
              name="driverAdvance"
              label="Amount (INR)"
              type="number"
              InputProps={{ endAdornment: <InputAdornment position="end">₹</InputAdornment> }}
            />

            <Box>
              <FormLabel component="legend">Given By:</FormLabel>
              <Field.RadioGroup
                row
                name="driverAdvanceGivenBy"
                options={Object.values(DRIVER_ADVANCE_GIVEN_BY_OPTIONS).map((option) => ({
                  label: option,
                  value: option,
                }))}
              />
            </Box>
          </Box>
        </Box>

        {/* Diesel Intent Card */}
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Iconify icon="mdi:gas-station" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              DIESEL INTENT
            </Typography>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            gap={3}
          >
            <Field.Text
              name="initialAdvanceDiesel"
              label="Diesel (in Liters)"
              type="number"
              InputProps={{ endAdornment: <InputAdornment position="end">Ltr</InputAdornment> }}
            />

            <Box>
              <Button
                fullWidth
                variant="outlined"
                onClick={pumpDialog.onTrue}
                sx={{
                  height: 56,
                  justifyContent: 'flex-start',
                  typography: 'body2',
                  borderColor: errors.pumpCd?.message ? 'error.main' : 'text.disabled',
                }}
                startIcon={
                  <Iconify
                    icon={selectedPump ? 'mdi:gas-station' : 'mdi:gas-station-outline'}
                    sx={{ color: selectedPump ? 'primary.main' : 'text.disabled' }}
                  />
                }
              >
                {selectedPump ? selectedPump.pumpName : 'Select Pump *'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {advanceAmt && (
        <Alert severity="info" variant="outlined" sx={{ mt: 3 }}>
          {`For this route, the usual driver advance is "${advanceAmt} ₹".`}
        </Alert>
      )}

      {/* <Alert severity="info" variant="outlined" sx={{ mt: 3 }}>
        This Diesel Quantity will be used to generate the Diesel Intent Only. Please Add the Diesel
        Expense after the vehicle is refueled.
      </Alert> */}
    </>
  );

  // ----------------------------------------------------------------------
  // Main Render
  // ----------------------------------------------------------------------

  return (
    <Dialog
      open={showDialog}
      onClose={() => setShowDialog(false)}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { maxWidth: 900 } }}
    >
      <DialogTitle>Material / Route Information</DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Form methods={methods} onSubmit={onSubmit}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Route" icon={<Iconify icon="mdi:map-marker-path" />} />
              <Tab label="Consignment" icon={<Iconify icon="mdi:package-variant-closed" />} />
              <Tab label="Driver Advance" icon={<Iconify icon="mdi:cash-multiple" />} />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              {renderRouteDetails()}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {renderMaterialDetails()}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              {renderAdvanceDetails()}
            </TabPanel>
          </Form>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleReset} variant="outlined" disabled={isSubmitting}>
          Reset
        </Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={isSubmitting}>
          Save Changes
        </Button>
      </DialogActions>

      <KanbanRouteDialog
        open={routeDialog.value}
        onClose={routeDialog.onFalse}
        selectedRoute={selectedRoute}
        onRouteChange={handleRouteChange}
        customerId={customerId?._id}
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
        onScanComplete={handleScanComplete}
      />
    </Dialog>
  );
}
