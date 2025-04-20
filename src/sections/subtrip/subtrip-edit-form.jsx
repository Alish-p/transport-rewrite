import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Button,
  Divider,
  Tooltip,
  FormLabel,
  Typography,
  InputAdornment,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useUpdateSubtrip } from 'src/query/use-subtrip';

import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { paths } from '../../routes/paths';
import { paramCase } from '../../utils/change-case';
import { useSearchParams } from '../../routes/hooks';
import { loadingWeightUnit } from '../vehicle/vehicle-config';
import { KanbanPumpDialog } from '../kanban/components/kanban-pump-dialog';
import { KanbanRouteDialog } from '../kanban/components/kanban-route-dialog';
import { SUBTRIP_STATUS, DRIVER_ADVANCE_GIVEN_BY_OPTIONS } from './constants';
import { KanbanCustomerDialog } from '../kanban/components/kanban-customer-dialog';

// Base schema for common fields
const baseSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  diNumber: z.string().max(50, 'DI/DO No is too long'),
  startDate: schemaHelper.date(),
});

// Schema for In-queue status
const inQueueSchema = baseSchema;

// Schema for Loaded status (extends in-queue)
const loadedSchema = inQueueSchema.extend({
  consignee: z.string().max(100),
  routeCd: z.string(),
  loadingPoint: z.string().max(100),
  unloadingPoint: z.string().max(100),
  loadingWeight: z.number().nonnegative('Loading weight must be positive'),
  quantity: z.number().nonnegative('Quantity must be positive').optional(),
  startKm: z.number().nonnegative('Start Km must be positive').optional(),
  rate: z.number().min(0, 'Rate must be at least 0'),
  ewayBill: z.string().max(100).optional(),
  ewayExpiryDate: z.string(),
  invoiceNo: z.string().max(100),
  shipmentNo: z.string().max(100).optional(),
  orderNo: z.string().max(100).optional(),
  materialType: z.string().max(100).optional(),
  grade: z.string().max(100).optional(),
  driverAdvance: z.number().min(0, 'Advance must be non-negative').optional(),
  driverAdvanceGivenBy: z.enum(['Self', 'Fuel Pump']),
  initialAdvanceDiesel: z.number().min(0, 'Diesel value must be non-negative').optional(),
  intentFuelPump: z.string().optional(),
});

// Schema for Received status (extends loaded)
const receivedSchema = loadedSchema.extend({
  unloadingWeight: z.number().nonnegative('Unloading weight must be positive'),
  endKm: z.number().nonnegative('End Km must be positive').optional(),
  endDate: z.string(),
  hasShortage: z.boolean().optional(),
  shortageWeight: z.number().nonnegative('Shortage weight must be non-negative').optional(),
  shortageAmount: z.number().nonnegative('Shortage amount must be non-negative').optional(),
  hasError: z.boolean().optional(),
  errorRemarks: z.string().max(500).optional(),
  remarks: z.string().max(500).optional(),
  commissionRate: z.number().min(0, 'Commission rate must be non-negative').optional(),
});

// Get the appropriate schema based on status
const getSchemaForStatus = (status) => {
  switch (status) {
    case SUBTRIP_STATUS.IN_QUEUE:
      return inQueueSchema;
    case SUBTRIP_STATUS.LOADED:
      return loadedSchema;
    case SUBTRIP_STATUS.RECEIVED:
      return receivedSchema;
    default:
      return baseSchema;
  }
};

// ----------------------------------------------------------------------

export default function SubtripEditForm({ currentSubtrip }) {
  const navigate = useNavigate();
  const updateSubtrip = useUpdateSubtrip();

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const customerDialog = useBoolean();
  const pumpDialog = useBoolean();
  const routeDialog = useBoolean();

  const [selectedPump, setSelectedPump] = useState(currentSubtrip?.intentFuelPump);
  const [selectedRoute, setSelectedRoute] = useState(currentSubtrip?.routeCd);
  const [selectedCustomer, setSelectedCustomer] = useState(currentSubtrip?.customerId);

  const defaultValues = useMemo(
    () => ({
      ...currentSubtrip,
      customerId: currentSubtrip?.customerId?._id,
      intentFuelPump: currentSubtrip?.intentFuelPump?._id,
      routeCd: currentSubtrip?.routeCd?._id,
    }),
    [currentSubtrip]
  );

  const methods = useForm({
    defaultValues,
    mode: 'all',
    resolver: (values) => {
      const schema = getSchemaForStatus(currentSubtrip.subtripStatus);
      try {
        schema.parse(values);
        return { values, errors: {} };
      } catch (error) {
        return { values, errors: error.formErrors.fieldErrors };
      }
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, dirtyFields },
  } = methods;

  const values = watch();

  const { vehicleType, isOwn } = currentSubtrip?.tripId?.vehicleId || {};

  const handleCustomerChange = (customer) => {
    setSelectedCustomer(customer);
    setValue('customerId', customer._id, { shouldDirty: true });
  };

  const handlePumpChange = (pump) => {
    setSelectedPump(pump);
    setValue('intentFuelPump', pump._id, { shouldDirty: true });
  };

  const handleRouteChange = (route) => {
    setSelectedRoute(route);
    setValue('routeCd', route._id, { shouldDirty: true });
  };

  const onSubmit = async (data) => {
    try {
      // only send the data that has changed
      const changedFields = Object.keys(dirtyFields).reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {});

      await updateSubtrip({
        id: currentSubtrip._id,
        data: {
          ...changedFields,
        },
      });

      if (redirect) {
        navigate(`${redirect}?currentSubtrip=${currentSubtrip._id}`);
      } else {
        navigate(paths.dashboard.subtrip.details(paramCase(currentSubtrip._id)));
      }
    } catch (error) {
      toast.error('Failed to update subtrip!');
      console.error(error);
    }
  };

  // Render fields based on status
  const renderFields = () => {
    const status = currentSubtrip.subtripStatus;

    return (
      <>
        {/* Creation fields - always visible */}
        <Typography variant="h6" sx={{ my: 2 }}>
          Create Subtrip Details
        </Typography>
        <Card sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
              <Tooltip title="Customer Edit is not allowed.">
                <DialogSelectButton
                  variant="outlined"
                  placeholder="Select Customer"
                  selected={selectedCustomer?.customerName}
                  onClick={customerDialog.onTrue}
                  iconName="mdi:office-building"
                  sx={{ mb: 2 }}
                  disabled
                />
              </Tooltip>
              <Field.Text name="diNumber" label="DI/DO No" />
              <Field.DatePicker name="startDate" label="Subtrip Start Date" />
            </Box>
          </Box>
        </Card>

        {/* Loaded fields - visible for loaded and received status */}
        {[SUBTRIP_STATUS.LOADED, SUBTRIP_STATUS.RECEIVED].includes(status) && (
          <>
            <Typography variant="h6" sx={{ my: 2 }}>
              Loaded Subtrip Details
            </Typography>
            <Card sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                {/* Route and Logistics Details */}
                <Typography variant="h6" sx={{ mb: 3 }} color="primary">
                  Route Details
                </Typography>
                <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                  <Field.Text name="consignee" label="Consignee" />
                  <DialogSelectButton
                    variant="outlined"
                    placeholder="Select Route"
                    selected={selectedRoute?.routeName}
                    onClick={routeDialog.onTrue}
                    iconName="mdi:map-marker-path"
                    sx={{ mb: 2 }}
                    disabled
                  />
                  <Field.Text name="loadingPoint" label="Loading Point" />
                  <Field.Text
                    name="unloadingPoint"
                    label="Unloading Point"
                    helperText="Consignee's address"
                  />
                </Box>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" sx={{ mb: 3 }} color="primary">
                  Weight Details
                </Typography>
                <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
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
                      InputProps={{
                        endAdornment: <InputAdornment position="end">Bags</InputAdornment>,
                      }}
                    />
                  )}

                  {isOwn && (
                    <Field.Text
                      name="startKm"
                      label="Start Km"
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">KM</InputAdornment>,
                      }}
                    />
                  )}

                  <Field.Text
                    name="rate"
                    label="Rate *"
                    type="number"
                    InputProps={{ endAdornment: <InputAdornment position="end">₹</InputAdornment> }}
                  />

                  <Field.Text name="ewayBill" label="Eway Bill" />
                  <Field.DatePicker name="ewayExpiryDate" label="Eway Expiry Date *" />

                  <Field.Text name="invoiceNo" label="Invoice No *" />
                  <Field.Text name="shipmentNo" label="Shipment No" />
                  <Field.Text name="orderNo" label="Order No" />

                  <Field.Text name="materialType" label="Material Type" />
                  <Field.Text name="grade" label="Grade" />
                </Box>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" sx={{ mb: 3 }} color="primary">
                  Trip Advance
                </Typography>
                <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
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

                  <Field.Text
                    name="initialAdvanceDiesel"
                    label="Diesel"
                    type="number"
                    placeholder="0"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">Ltr</InputAdornment>,
                    }}
                  />

                  <DialogSelectButton
                    variant="outlined"
                    placeholder="Select Pump"
                    selected={selectedPump?.pumpName}
                    onClick={pumpDialog.onTrue}
                    iconName="mdi:gas-station"
                  />
                </Box>
              </Box>
            </Card>
          </>
        )}

        {/* Received fields - only visible for received status */}
        {status === SUBTRIP_STATUS.RECEIVED && (
          <>
            <Typography variant="h6" sx={{ my: 2 }}>
              Received Subtrip Details
            </Typography>
            <Card sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                  <Field.Text
                    name="unloadingWeight"
                    label="Unloading Weight"
                    type="number"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <>{loadingWeightUnit[vehicleType]}</>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {isOwn && (
                    <Field.Text
                      name="endKm"
                      label="End Km"
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">KM</InputAdornment>,
                      }}
                    />
                  )}
                  {!isOwn && (
                    <Field.Text
                      name="commissionRate"
                      label="Transporter Commission Rate"
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                      }}
                    />
                  )}
                  <Field.DatePicker name="endDate" label="LR Receive Date *" />
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Issue Indicators */}
                <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                  <Field.Switch name="hasShortage" label="Has Shortage?" />
                  <Field.Switch name="hasError" label="Has Error?" />

                  {values.hasShortage && (
                    <>
                      <Field.Text
                        name="shortageWeight"
                        label="Shortage Weight"
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                        }}
                      />
                      <Field.Text
                        name="shortageAmount"
                        label="Shortage Amount"
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                        }}
                      />
                    </>
                  )}

                  {values.hasError && (
                    <Field.Text name="errorRemarks" label="Error Remarks" multiline rows={3} />
                  )}
                </Box>
              </Box>
            </Card>
          </>
        )}
      </>
    );
  };
  console.log({ errors: methods.formState.errors });

  return (
    <>
      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} sx={{ pt: 10 }}>
          <Grid item xs={12} md={3}>
            <Box sx={{ pt: 2, pb: 5, px: 3 }}>
              <Typography variant="h6">Edit Subtrip</Typography>
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                Edit subtrip details.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={8} sx={{ my: 2 }}>
            {renderFields()}

            <Box sx={{ pt: 2, pb: 5, px: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                disabled={isSubmitting || !dirtyFields || Object.keys(dirtyFields).length === 0}
                onClick={() => methods.reset()}
              >
                Reset
              </Button>
              <LoadingButton
                variant="contained"
                type="submit"
                color="primary"
                loading={isSubmitting}
                disabled={Object.keys(dirtyFields).length === 0}
              >
                Save
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Form>

      {/* Dialogs */}
      <KanbanCustomerDialog
        open={customerDialog.value}
        onClose={customerDialog.onFalse}
        selectedCustomer={selectedCustomer}
        onCustomerChange={handleCustomerChange}
      />

      <KanbanRouteDialog
        open={routeDialog.value}
        onClose={routeDialog.onFalse}
        selectedRoute={selectedRoute}
        onRouteChange={handleRouteChange}
      />

      <KanbanPumpDialog
        open={pumpDialog.value}
        onClose={pumpDialog.onFalse}
        selectedPump={selectedPump}
        onPumpChange={handlePumpChange}
      />
    </>
  );
}
