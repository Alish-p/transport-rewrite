// ------------------------------------------------------------
import { toast } from 'sonner';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Divider,
  MenuItem,
  Typography,
  ListSubheader,
} from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

import { paths } from '../../routes/paths';
import { today } from '../../utils/format-time';
import { paramCase } from '../../utils/change-case';
import { useUpdateSubtrip } from '../../query/use-subtrip';
import { loadedSchema, inQueueSchema, receivedSchema, SUBTRIP_STATUS } from './constants';

// ------------------------------------------------------------

export default function SubtripEditForm({ currentSubtrip, routesList, customersList }) {
  const navigate = useNavigate();

  const updateSubtrip = useUpdateSubtrip();

  const defaultValues = useMemo(
    () => ({
      // Inqueue
      customerId: currentSubtrip?.customerId?._id || '',
      startDate: currentSubtrip?.startDate || today(),
      diNumber: currentSubtrip?.diNumber || '',

      // Loaded
      consignee: currentSubtrip?.consignee || null,
      loadingWeight: currentSubtrip?.loadingWeight || 0,
      startKm: currentSubtrip?.startKm || 0,
      rate: currentSubtrip?.rate || 0,
      invoiceNo: currentSubtrip?.invoiceNo || '',
      shipmentNo: currentSubtrip?.shipmentNo || '',
      orderNo: currentSubtrip?.orderNo || '',
      ewayBill: currentSubtrip?.ewayBill || '',
      ewayExpiryDate: currentSubtrip?.ewayExpiryDate || null,
      materialType: currentSubtrip?.materialType || '',
      quantity: currentSubtrip?.quantity || 0,
      grade: currentSubtrip?.grade || '',
      tds: currentSubtrip?.tripId?.vehicleId?.transporter?.tdsPercentage || 0,
      driverAdvance:
        currentSubtrip?.expenses?.find((exp) => exp.expenseType === 'trip-advance')?.amount || 0,
      dieselLtr: currentSubtrip?.initialAdvanceDiesel || '',
      pumpCd: currentSubtrip?.expenses?.find((exp) => exp.pumpCd)?.pumpCd?._id || '',
      routeCd: currentSubtrip?.routeCd?._id || '',
      loadingPoint: currentSubtrip?.loadingPoint || '',
      unloadingPoint: currentSubtrip?.tripId?.remarks || '',

      // Receive
      remarks: currentSubtrip?.remarks || '',
      unloadingWeight: currentSubtrip?.unloadingWeight || 0,
      deductedWeight: currentSubtrip?.deductedWeight || 0,
      deductedAmount: currentSubtrip?.deductedAmount || 0,
      endKm: currentSubtrip?.endKm || 0,
      totalKm: currentSubtrip?.totalKm || 0,
      endDate: currentSubtrip?.endDate || today(),
      hasError: currentSubtrip?.hasError || false,
    }),
    [currentSubtrip]
  );

  // Choose the validation schema based on the subtripStatus
  const validationSchema = useMemo(() => {
    switch (currentSubtrip?.subtripStatus) {
      case SUBTRIP_STATUS.LOADED:
        return loadedSchema;
      case SUBTRIP_STATUS.RECEIVED:
        return receivedSchema;
      case SUBTRIP_STATUS.IN_QUEUE:
      default:
        return inQueueSchema;
    }
  }, [currentSubtrip?.subtripStatus]);

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const updatedSubtrip = await updateSubtrip({ id: currentSubtrip?._id, data });
      console.log({ updatedSubtrip });
      reset();
      toast.success('Subtrip edited successfully!');
      navigate(paths.dashboard.subtrip.details(paramCase(currentSubtrip._id)));
    } catch (error) {
      console.error(error);
    }
  };

  const renderInqueueFields = () => (
    <Grid container spacing={3} sx={{ pt: 10 }}>
      <Grid item xs={12} md={3}>
        <Box sx={{ pt: 2, pb: 5, px: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            In-queue Info
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 1 }}>
            Status in-queue edit fields are here
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
            <Field.Select name="customerId" label="Customer">
              <MenuItem value="">None</MenuItem>
              <Divider sx={{ borderStyle: 'dashed' }} />
              {customersList.map((customer) => (
                <MenuItem key={customer._id} value={customer._id}>
                  {customer.customerName}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text name="diNumber" label="DI/DO No" />
            <Field.DatePicker name="startDate" label="Subtrip Start Date" />

            {/* <Field.Select name="routeCd" label="Route">
              <MenuItem value="">None</MenuItem>
              <Divider sx={{ borderStyle: 'dashed' }} />
              {routesList.map((route) => (
                <MenuItem key={route._id} value={route._id}>
                  {route.routeName}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select native name="customerId" label="Customer">
              <MenuItem value="">None</MenuItem>
              <Divider sx={{ borderStyle: 'dashed' }} />
              {customersList.map((customer) => (
                <MenuItem key={customer._id} value={customer._id}>
                  {customer.customerName}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text name="loadingPoint" label="Loading Point" />
            <Field.Text name="unloadingPoint" label="Unloading Point" />
            <Field.Text name="startKm" label="Start Km" />
            <Field.Text name="rate" label="Rate" />
            <Field.DatePicker name="subtripStartDate" label="Start Date" />

            <Field.Text name="tds" label="TDS" /> */}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );

  const renderLoadedFields = () => (
    <Grid container spacing={3} sx={{ pt: 10 }}>
      <Grid item xs={12} md={3}>
        <Box sx={{ pt: 2, pb: 5, px: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Loaded Info
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 1 }}>
            Status loaded edit fields are here
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
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
              {routesList
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
              {routesList
                .filter((route) => !route.isCustomerSpecific)
                .map(({ _id: routeId, routeName }) => (
                  <MenuItem key={routeId} value={routeId}>
                    {routeName}
                  </MenuItem>
                ))}
            </Field.Select>

            <Field.Text name="loadingPoint" label="Loading Point" />
            <Field.Text name="unloadingPoint" label="Unloading Point" />

            <Field.Autocomplete
              freeSolo
              name="consignee"
              label="Consignee"
              options={currentSubtrip?.customerId?.consignees.map(({ name }) => ({
                label: name,
                value: name,
              }))}
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
        </Card>
      </Grid>
    </Grid>
  );

  const renderRecievedFields = () => (
    <Grid container spacing={3} sx={{ pt: 10 }}>
      <Grid item xs={12} md={3}>
        <Box sx={{ pt: 2, pb: 5, px: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Recieve Subtrip Info
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 1 }}>
            Please provide the details of the Recieve info.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
            <Field.Text name="unloadingWeight" label="Unloading Wt." type="number" />
            <Field.Text
              name="deductedWeight"
              label="Deducted Weight"
              type="number"
              placeholder="0"
            />

            <Field.Text name="endKm" label="End Km" type="number" />

            <Field.Text name="deductedAmount" label="Deducted Amount" type="number" />
            <Field.DatePicker name="endDate" label="End Date" />

            <Field.Text name="remarks" label="Remarks" type="text" />
          </Box>
        </Card>
      </Grid>
    </Grid>
  );

  const subtripStatus = currentSubtrip?.subtripStatus;

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {subtripStatus === SUBTRIP_STATUS.IN_QUEUE && renderInqueueFields()}

      {subtripStatus === SUBTRIP_STATUS.LOADED && (
        <>
          {renderInqueueFields()}
          {renderLoadedFields()}
        </>
      )}
      {subtripStatus === SUBTRIP_STATUS.RECEIVED && (
        <>
          {renderInqueueFields()}
          {renderLoadedFields()}
          {renderRecievedFields()}
        </>
      )}

      <Stack alignItems="flex-end" sx={{ mt: 3, mb: 5 }}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Save Changes
        </LoadingButton>
      </Stack>
    </Form>
  );
}
