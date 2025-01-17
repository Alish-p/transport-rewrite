import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useEffect, useCallback } from 'react';

import {
  Box,
  Stack,
  Alert,
  Dialog,
  Button,
  Divider,
  MenuItem,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListSubheader,
} from '@mui/material';

import { getSalaryDetailsByVehicleType } from 'src/utils/utils';

import { fetchPumps } from 'src/redux/slices/pump';
import { addMaterialInfo } from 'src/redux/slices/subtrip';
import { fetchCustomerSpecificRoutes } from 'src/redux/slices/route';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

const validationSchema = zod.object({
  consignee: zod
    .any()
    .nullable()
    .refine((val) => val !== null, { message: 'Consignee is required' }),
  loadingWeight: zod.number({ required_error: 'Loading Weight is required' }).positive().int(),
  startKm: zod.number().positive().int(),
  rate: zod.number().positive().int(),
  invoiceNo: zod.string().optional(),
  shipmentNo: zod.string().optional(),
  orderNo: zod.string().optional(),
  ewayBill: zod.string().optional(),
  ewayExpiryDate: schemaHelper.date({
    message: { required_error: 'Eway Expiry date is required!' },
  }),
  materialType: zod.string().optional(),
  quantity: zod.number().positive().int(),
  grade: zod.string().optional(),
  tds: zod.number().int().optional(),
  driverAdvance: zod.number().int().optional(),
  dieselLtr: zod.any(),
  pumpCd: zod.string().optional(),
  routeCd: zod.string().min(1, { message: 'Route Code is required' }),
  loadingPoint: zod.string().min(1, { message: 'Loading Point is required' }),
  unloadingPoint: zod.string().min(1, { message: 'Unloading Point is required' }),
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
  dieselLtr: 'Full',
  pumpCd: '',
  routeCd: '',
  loadingPoint: '',
  unloadingPoint: '',
};

export function SubtripMaterialInfoDialog({ showDialog, setShowDialog, subtrip }) {
  const { tripId, customerId, _id } = subtrip;
  const dispatch = useDispatch();
  const methods = useForm({ resolver: zodResolver(validationSchema), defaultValues });

  const { customerSpecificRoutes: routes } = useSelector((state) => state.route);
  const { pumps } = useSelector((state) => state.pump);

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const vehicleId = tripId?.vehicleId?._id;
  const consignees = customerId?.consignees || [];
  const { routeCd } = watch();

  const { advanceAmt, toPlace, fromPlace } = useMemo(
    () =>
      routeCd
        ? getSalaryDetailsByVehicleType(routes, routeCd, tripId?.vehicleId?.vehicleType) || {}
        : {},
    [routeCd, routes, tripId?.vehicleId?.vehicleType]
  );

  const handleReset = useCallback(() => reset(defaultValues), [reset]);

  const onSubmit = async (data) => {
    try {
      await dispatch(
        addMaterialInfo(_id, { ...data, vehicleId, consignee: data?.consignee?.value })
      );
      toast.success('Material details added successfully!');
      handleReset();
      setShowDialog(false);
    } catch (error) {
      console.error(error);
      toast.error('Error adding material details.');
    }
  };

  useEffect(() => {
    if (showDialog) {
      dispatch(fetchPumps());
      dispatch(fetchCustomerSpecificRoutes(customerId?._id));
    } else {
      handleReset();
    }
  }, [dispatch, showDialog, handleReset, customerId]);

  // Update loading and unloading points when route changes
  useEffect(() => {
    if (routeCd) {
      const selectedRoute = routes.find((route) => route._id === routeCd);
      if (selectedRoute) {
        setValue('loadingPoint', selectedRoute.fromPlace || '');
        setValue('unloadingPoint', selectedRoute.toPlace || '');
      }
    }
  }, [routeCd, routes, setValue]);

  const renderRouteDetails = () => (
    <Stack spacing={1}>
      <Typography variant="body1">Route Details</Typography>
      <Typography sx={{ mb: 2, color: 'text.disabled' }} variant="caption">
        Please Enter Route Related Details
      </Typography>

      <Box
        columnGap={2}
        rowGap={3}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
      >
        <Field.Select name="routeCd" label="Route">
          <MenuItem value="">None</MenuItem>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <ListSubheader
            sx={{
              fontSize: '0.7rem',
              lineHeight: 1,
              color: 'primary.main',
              textAlign: 'start',
              padding: '3px',
              my: 1,
            }}
          >
            Customer Specific Routes
          </ListSubheader>
          {routes
            .filter((route) => route.isCustomerSpecific)
            .map(({ _id: routeId, routeName }) => (
              <MenuItem key={routeId} value={routeId}>
                {routeName}
              </MenuItem>
            ))}
          <Divider sx={{ borderStyle: 'dashed' }} />

          <ListSubheader
            sx={{
              fontSize: '0.7rem',
              lineHeight: 1,
              color: 'primary.main',
              textAlign: 'start',
              padding: '3px',
              my: 1,
            }}
          >
            Generic Routes
          </ListSubheader>
          {routes
            .filter((route) => !route.isCustomerSpecific)
            .map(({ _id: routeId, routeName }) => (
              <MenuItem key={routeId} value={routeId}>
                {routeName}
              </MenuItem>
            ))}
        </Field.Select>
        <Field.Text name="loadingPoint" label="Loading Point" disabled />
        <Field.Text name="unloadingPoint" label="Unloading Point" disabled />
      </Box>
    </Stack>
  );

  const renderMaterialDetails = () => (
    <Stack spacing={1}>
      <Typography variant="body1">Consignment Details</Typography>
      <Typography sx={{ mb: 2, color: 'text.disabled' }} variant="caption">
        Please Enter Consignment Related Details.
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
        gap={3}
      >
        <Field.Autocomplete
          freeSolo
          name="consignee"
          label="Consignee"
          options={consignees.map(({ name }) => ({ label: name, value: name }))}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
        />
        <Field.Text name="loadingWeight" label="Loading Weight" type="number" />
        <Field.Text name="startKm" label="Start Km" type="number" />
        <Field.Text name="rate" label="Rate" type="number" />
        <Field.Text name="invoiceNo" label="Invoice No" />
        <Field.Text name="shipmentNo" label="Shipment No" />
        <Field.Text name="orderNo" label="Order No" />
        <Field.Text name="ewayBill" label="Eway Bill" />
        <Field.DatePicker name="ewayExpiryDate" label="Eway Expiry Date" />
        <Field.Text name="materialType" label="Material Type" />
        <Field.Text name="quantity" label="Quantity" type="number" />
        <Field.Text name="grade" label="Grade" />
      </Box>
    </Stack>
  );

  const renderAdvanceDetails = () => (
    <Stack spacing={1}>
      <Typography variant="body1">Driver Advanced Details</Typography>
      <Typography sx={{ mb: 2, color: 'text.disabled' }} variant="caption">
        Please Enter Advance amount and Petrol Amount
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
        gap={3}
      >
        <Field.Select name="pumpCd" label="Pump">
          <MenuItem value="">None</MenuItem>
          <Divider sx={{ borderStyle: 'dashed' }} />
          {pumps.map(({ _id: pumpId, pumpName }) => (
            <MenuItem key={pumpId} value={pumpId}>
              {pumpName}
            </MenuItem>
          ))}
        </Field.Select>
        <Field.Text name="driverAdvance" label="Driver Advance" type="number" />
        <Field.Text name="dieselLtr" label="Diesel" />
      </Box>
    </Stack>
  );

  const renderAlerts = () => (
    <>
      {advanceAmt && (
        <Alert severity="info" variant="outlined" sx={{ my: 2 }}>
          {`For this route, the usual driver advance is "${advanceAmt} ₹".`}
        </Alert>
      )}
      <Alert severity="success" variant="outlined" sx={{ my: 2 }}>
        {`Please select "Full Diesel" for a full tank or specify the quantity in liters.`}
      </Alert>
    </>
  );

  const renderActions = () => (
    <Stack direction="row" spacing={2}>
      <Button onClick={handleReset} variant="outlined" disabled={isSubmitting}>
        Reset
      </Button>
      <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={isSubmitting}>
        Save Changes
      </Button>
    </Stack>
  );

  return (
    <Dialog
      open={showDialog}
      onClose={() => setShowDialog(false)}
      fullWidth
      maxWidth={false}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <DialogTitle>Material / Route </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Form methods={methods} onSubmit={onSubmit}>
            {renderRouteDetails()}

            <Divider sx={{ my: 3 }} />

            {renderMaterialDetails()}

            <Divider sx={{ my: 3 }} />

            {renderAdvanceDetails()}
            {renderAlerts()}
          </Form>
        </Box>
      </DialogContent>
      <DialogActions>{renderActions()}</DialogActions>
    </Dialog>
  );
}
