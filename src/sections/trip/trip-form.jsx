import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Alert, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { today } from 'src/utils/format-time';
import { paramCase } from 'src/utils/change-case';
import { fVehicleNo } from 'src/utils/format-number';

import { addTrip, updateTrip } from 'src/redux/slices/trip';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

const NewTripSchema = zod.object({
  driverId: zod
    .any()
    .nullable()
    .refine((val) => val !== null, { message: 'Driver is required' }),
  vehicleId: zod
    .any()
    .nullable()
    .refine((val) => val !== null, { message: 'Vehicle is required' }),
  fromDate: schemaHelper.date({ message: { required_error: 'From date is required!' } }),
  remarks: zod.string().optional(),
});

export default function TripForm({ currentTrip, drivers, vehicles }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      driverId: currentTrip?.driverId
        ? { label: currentTrip?.driverId?.driverName, value: currentTrip?.driverId?._id }
        : null,
      vehicleId: currentTrip?.vehicleId
        ? { label: currentTrip?.vehicleId?.vehicleNo, value: currentTrip?.vehicleId?._id }
        : null,
      fromDate: currentTrip?.fromDate ? new Date(currentTrip?.fromDate) : today(),
      remarks: currentTrip?.remarks || 'Remarks',
    }),
    [currentTrip]
  );

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const methods = useForm({
    resolver: zodResolver(NewTripSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const watchedVehicle = watch('vehicleId');

  useEffect(() => {
    if (watchedVehicle) {
      const vehicle = vehicles.find((v) => v._id === watchedVehicle.value);
      setSelectedVehicle(vehicle || null);
    } else {
      setSelectedVehicle(null);
    }
  }, [watchedVehicle, vehicles]);

  const onSubmit = async (data) => {
    try {
      if (currentTrip) {
        // Update Trip
        await dispatch(
          updateTrip(currentTrip._id, {
            ...data,
            driverId: data?.driverId?.value,
            vehicleId: data?.vehicleId?.value,
          })
        );
        toast.success('Trip updated successfully!');
        navigate(paths.dashboard.trip.details(paramCase(currentTrip._id)));
      } else {
        // Add New Trip
        const createdTrip = await dispatch(
          addTrip({ ...data, driverId: data?.driverId?.value, vehicleId: data?.vehicleId?.value })
        );
        toast.success('Trip created successfully!');
        navigate(paths.dashboard.trip.details(paramCase(createdTrip._id)));
      }
      reset();
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.', { variant: 'error' });
    }
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} sx={{ pt: 10 }}>
        <Grid item xs={12} md={3}>
          <Box sx={{ pt: 2, pb: 5, px: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              Vehicle & Driver
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 1 }}>
              Please Select the Vehicle and the Driver for the trip.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
              <Field.Autocomplete
                name="vehicleId"
                label="Vehicle"
                options={vehicles.map((v) => ({
                  label: `${fVehicleNo(v.vehicleNo)}`,
                  value: v._id,
                }))}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />
              <Field.Autocomplete
                freeSolo
                name="driverId"
                label="Driver"
                options={drivers.map((d) => ({ label: d.driverName, value: d._id }))}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />

              <Field.DatePicker name="fromDate" label="From Date" />
              <Field.Text name="remarks" label="Remarks" />
            </Box>
          </Card>

          {selectedVehicle && (
            <Box sx={{ mt: 3 }}>
              {/* Vehicle Information Alert */}
              <Alert severity="success" variant="outlined">
                <strong>Vehicle Information: </strong>
                This is a <strong>{selectedVehicle?.vehicleType}</strong> vehicle with{' '}
                <strong>{selectedVehicle?.noOfTyres}</strong> tyres.
              </Alert>

              {/* Ownership Details Alert */}
              <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
                <strong>Ownership Details: </strong>

                {selectedVehicle?.isOwn ? (
                  <span>
                    This is a <strong>company-owned vehicle.</strong>
                  </span>
                ) : (
                  <span>
                    This is a <strong>market / transporter&apos;s vehicle</strong> managed by{' '}
                    {selectedVehicle?.transporter?.transportName ? (
                      <strong>{selectedVehicle.transporter.transportName}</strong>
                    ) : (
                      <em>an unknown transporter.</em>
                    )}
                  </span>
                )}
              </Alert>
            </Box>
          )}
        </Grid>
      </Grid>

      <Stack alignItems="flex-end" sx={{ mt: 3, mb: 5 }}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {!currentTrip ? 'Create Trip' : 'Save Changes'}
        </LoadingButton>
      </Stack>
    </Form>
  );
}
