import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Alert, Stack, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { today } from 'src/utils/format-time';
import { paramCase } from 'src/utils/change-case';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useBoolean } from '../../hooks/use-boolean';
import { useCreateTrip, useUpdateTrip } from '../../query/use-trip';
import { KanbanDriverDialog } from '../kanban/components/kanban-driver-dialog';
import { KanbanVehicleDialog } from '../kanban/components/kanban-vehicle-dialog';

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

  const createTrip = useCreateTrip();
  const updateTrip = useUpdateTrip();

  const vehicleDialog = useBoolean(false);
  const driverDialog = useBoolean(false);

  const defaultValues = useMemo(
    () => ({
      driverId: currentTrip?.driverId
        ? { label: currentTrip?.driverId?.driverName, value: currentTrip?.driverId?._id }
        : null,
      vehicleId: currentTrip?.vehicleId
        ? { label: currentTrip?.vehicleId?.vehicleNo, value: currentTrip?.vehicleId?._id }
        : null,
      fromDate: currentTrip?.fromDate ? new Date(currentTrip?.fromDate) : today(),
      remarks: currentTrip?.remarks || '',
    }),
    [currentTrip]
  );

  const [selectedVehicle, setSelectedVehicle] = useState(
    currentTrip?.vehicleId ? vehicles.find((v) => v._id === currentTrip.vehicleId._id) : null
  );
  const [selectedDriver, setSelectedDriver] = useState(
    currentTrip?.driverId ? drivers.find((d) => d._id === currentTrip.driverId._id) : null
  );

  const methods = useForm({
    resolver: zodResolver(NewTripSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleVehicleChange = (vehicle) => {
    setSelectedVehicle(vehicle);
    setValue('vehicleId', { label: vehicle.vehicleNo, value: vehicle._id });
  };

  const handleDriverChange = (driver) => {
    setSelectedDriver(driver);
    setValue('driverId', { label: driver.driverName, value: driver._id });
  };

  const onSubmit = async (data) => {
    try {
      if (currentTrip) {
        // Update Trip
        await updateTrip({
          id: currentTrip._id,
          data: {
            ...data,
            driverId: data?.driverId?.value,
            vehicleId: data?.vehicleId?.value,
          },
        });
        navigate(paths.dashboard.trip.details(paramCase(currentTrip._id)));
      } else {
        // Add New Trip
        const createdTrip = await createTrip({
          ...data,
          driverId: data?.driverId?.value,
          vehicleId: data?.vehicleId?.value,
        });
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
              {/* Vehicle Selection */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Vehicle
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={vehicleDialog.onTrue}
                  sx={{
                    height: 56,
                    justifyContent: 'flex-start',
                    typography: 'body2',
                  }}
                  startIcon={
                    <Iconify
                      icon={selectedVehicle ? 'mdi:truck' : 'mdi:truck-outline'}
                      sx={{ color: selectedVehicle ? 'primary.main' : 'text.disabled' }}
                    />
                  }
                >
                  {selectedVehicle ? selectedVehicle.vehicleNo : 'Select Vehicle'}
                </Button>
              </Box>

              {/* Driver Selection */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Driver
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={driverDialog.onTrue}
                  sx={{
                    height: 56,
                    justifyContent: 'flex-start',
                    typography: 'body2',
                  }}
                  startIcon={
                    <Iconify
                      icon={selectedDriver ? 'mdi:account' : 'mdi:account-outline'}
                      sx={{ color: selectedDriver ? 'primary.main' : 'text.disabled' }}
                    />
                  }
                >
                  {selectedDriver ? selectedDriver.driverName : 'Select Driver'}
                </Button>
              </Box>

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
      />
    </Form>
  );
}
