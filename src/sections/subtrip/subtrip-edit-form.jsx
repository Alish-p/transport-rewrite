// ------------------------------------------------------------
import { z as zod } from 'zod';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { paramCase } from 'src/utils/change-case';

import { useSelector } from 'src/redux/store';
import { addTrip } from 'src/redux/slices/trip';
import { fetchRoutes } from 'src/redux/slices/route';
import { fetchCustomers } from 'src/redux/slices/customer';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

const NewTripSchema = zod.object({
  routeCd: zod.string().min(1, { message: 'Route Code is required' }),
  customerId: zod.string().min(1, { message: 'Customer ID is required' }),
  loadingPoint: zod.string().min(1, { message: 'Loading Point is required' }),
  unloadingPoint: zod.string().min(1, { message: 'Unloading Point is required' }),
  loadingWeight: zod.number({ required_error: 'Loading Weight is required' }),
  unloadingWeight: zod.number({ required_error: 'Unloading Weight is required' }),
  startKm: zod.number({ required_error: 'Start Km is required' }),
  endKm: zod.number({ required_error: 'End Km is required' }),
  rate: zod.number({ required_error: 'Rate is required' }),
  subtripStartDate: schemaHelper.date({ message: { required_error: 'Start Date is required!' } }),
  subtripEndDate: schemaHelper.date({ message: { required_error: 'End Date is required!' } }),
  invoiceNo: zod.string().min(1, { message: 'Invoice No is required' }),
  shipmentNo: zod.string().min(1, { message: 'Shipment No is required' }),
  orderNo: zod.string().min(1, { message: 'Order No is required' }),
  ewayBill: zod.string().min(1, { message: 'E-way Bill is required' }),
  ewayExpiryDate: schemaHelper.date({
    message: { required_error: 'Eway Expiry Date is required!' },
  }),
  materialType: zod.string().min(1, { message: 'Material Type is required' }),
  quantity: zod.number({ required_error: 'Quantity is required' }),
  grade: zod.string().min(1, { message: 'Grade is required' }),
  dieselLtr: zod.number({ required_error: 'Diesel Ltr is required' }),
  detentionTime: zod.number({ required_error: 'Detention Time is required' }),
  tds: zod.number({ required_error: 'TDS is required' }),
  deductedWeight: zod.number({ required_error: 'Deducted Weight is required' }),
});

// ------------------------------------------------------------

export default function TripForm({ currentTrip }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      // Subtrip
      routeCd: currentTrip?.routeCd || '',
      customerId: currentTrip?.customerId || '',
      loadingPoint: currentTrip?.loadingPoint || '',
      unloadingPoint: currentTrip?.unloadingPoint || '',
      loadingWeight: currentTrip?.loadingWeight || 0,
      unloadingWeight: currentTrip?.unloadingWeight || 0,
      startKm: currentTrip?.startKm || 0,
      endKm: currentTrip?.endKm || 0,
      rate: currentTrip?.rate || 0,
      subtripStartDate: currentTrip?.subtripStartDate
        ? new Date(currentTrip?.subtripStartDate)
        : new Date(),
      subtripEndDate: currentTrip?.subtripEndDate
        ? new Date(currentTrip?.subtripEndDate)
        : new Date(),
      invoiceNo: currentTrip?.invoiceNo || '',
      shipmentNo: currentTrip?.shipmentNo || '',
      orderNo: currentTrip?.orderNo || '',
      ewayBill: currentTrip?.ewayBill || '',
      ewayExpiryDate: currentTrip?.ewayExpiryDate
        ? new Date(currentTrip?.ewayExpiryDate)
        : new Date(),
      materialType: currentTrip?.materialType || '',
      quantity: currentTrip?.quantity || 0,
      grade: currentTrip?.grade || '',
      dieselLtr: currentTrip?.dieselLtr || 0,
      detentionTime: currentTrip?.detentionTime || 0,
      tds: currentTrip?.tds || 0,
      deductedWeight: currentTrip?.deductedWeight || 0,
    }),
    [currentTrip]
  );

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchRoutes());
  }, [dispatch]);

  const { routes } = useSelector((state) => state.route);
  const { customers } = useSelector((state) => state.customer);

  const methods = useForm({
    resolver: zodResolver(NewTripSchema),
    defaultValues,
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
      const createdTrip = await dispatch(addTrip(data));
      console.log({ createdTrip });
      reset();
      toast.success('Trip edited successfully!');
      navigate(paths.dashboard.trip.detail(paramCase(createdTrip._id)));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {/* Vehicle & Driver Details */}

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
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
              <Field.Select native name="routeCd" label="Route">
                <option value="" />
                {routes.map((route) => (
                  <option key={route._id} value={route._id}>
                    {route.routeName}
                  </option>
                ))}
              </Field.Select>

              <Field.Select native name="customerId" label="Customer">
                <option value="" />
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.customerName}
                  </option>
                ))}
              </Field.Select>

              <Field.Text name="loadingPoint" label="Loading Point" />
              <Field.Text name="unloadingPoint" label="Unloading Point" />
              <Field.Text name="startKm" label="Start Km" />
              <Field.Text name="rate" label="Rate" />
              <Field.DatePicker name="subtripStartDate" label="Start Date" />

              <Field.Text name="tds" label="TDS" />
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ pt: 10 }}>
        <Grid item xs={12} md={3}>
          <Box sx={{ pt: 2, pb: 5, px: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              Shipment Info
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 1 }}>
              Please provide the details of the subtrip.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
              <Field.Text name="invoiceNo" label="Invoice No" />
              <Field.Text name="shipmentNo" label="Shipment No" />
              <Field.Text name="orderNo" label="Order No" />
              <Field.Text name="ewayBill" label="E-way Bill" />
              <Field.DatePicker name="ewayExpiryDate" label="E-way Expiry Date" />
              <Field.Text name="materialType" label="Material Type" />
              <Field.Text name="quantity" label="Quantity" />
              <Field.Text name="grade" label="Grade" />
              <Field.Text name="loadingWeight" label="Loading Weight" />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ pt: 10 }}>
        <Grid item xs={12} md={3}>
          <Box sx={{ pt: 2, pb: 5, px: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              Closing Subtrip Info
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 1 }}>
              Please provide the details of the closing info.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
              <Field.DatePicker name="subtripEndDate" label="End Date" />
              <Field.Text name="endKm" label="End Km" />
              <Field.Text name="detentionTime" label="Detention Time" />
              <Field.Text name="unloadingWeight" label="Unloading Weight" />
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Stack alignItems="flex-end" sx={{ mt: 3, mb: 5 }}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Save Changes
        </LoadingButton>
      </Stack>
    </Form>
  );
}
