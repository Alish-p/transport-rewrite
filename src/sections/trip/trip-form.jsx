import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Alert, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { paramCase } from 'src/utils/change-case';

import { useCreateTrip, useUpdateTrip } from 'src/query/use-trip';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { KanbanDriverDialog } from '../kanban/components/kanban-driver-dialog';
import { KanbanVehicleDialog } from '../kanban/components/kanban-vehicle-dialog';

// --------------------------------------------------------------------------------------
// 1) Extend the Zod schema to include the new boolean flag “closePreviousTrips”
//    – Default to true.
//    – We don’t need a refine here, since it’s just a toggle.
// --------------------------------------------------------------------------------------
const NewTripSchema = zod.object({
  driver: zod
    .any()
    .nullable()
    .refine((val) => val !== null, { message: 'Driver is required' }),
  vehicleId: zod
    .any()
    .nullable()
    .refine((val) => val !== null, { message: 'Vehicle is required' }),
  fromDate: schemaHelper.date({ message: { required_error: 'From date is required!' } }),
  remarks: zod.string().optional(),
  closePreviousTrips: zod.boolean().default(true),
});

export default function TripForm({ currentTrip }) {
  const navigate = useNavigate();

  const createTrip = useCreateTrip();
  const updateTrip = useUpdateTrip();

  const vehicleDialog = useBoolean(false);
  const driverDialog = useBoolean(false);

  // ------------------------------------------------------------------------------------
  // 2) Build defaultValues including `closePreviousTrips: true`
  //    – If editing (`currentTrip` exists), we’ll pick up any existing value (or default to true).
  // ------------------------------------------------------------------------------------
  const defaultValues = useMemo(
    () => ({
      driver: currentTrip?.driver || currentTrip?.driverId || null,
      vehicleId: currentTrip?.vehicleId || null,
      fromDate: currentTrip?.fromDate ? new Date(currentTrip.fromDate) : new Date(),
      remarks: currentTrip?.remarks || '',
      closePreviousTrips: true,
    }),
    [currentTrip]
  );

  // Keep local copies of “selected” driver/vehicle so we can disable/enable the toggle
  const [selectedVehicle, setSelectedVehicle] = useState(currentTrip?.vehicleId || null);

  const methods = useForm({
    resolver: zodResolver(NewTripSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
    clearErrors,
  } = methods;

  // Whenever defaultValues change (e.g. when switching from “create” to “edit”),
  // reset the form to those defaultValues
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  // ------------------------------------------------------------------------------------
  // 3) When the vehicle changes, we must:
  //      • Save it into React-Hook-Form via setValue('vehicleId', vehicle._id)
  //      • Update our local `selectedVehicle` (so we can know .isOwn)
  //      • Clear any validation errors that might have been on vehicleId
  //      • AND: If this is a market vehicle (isOwn === false),
  //            force “closePreviousTrips” ⇒ true (and leave it disabled).
  // ------------------------------------------------------------------------------------
  const handleVehicleChange = (vehicle) => {
    setSelectedVehicle(vehicle);
    setValue('vehicleId', vehicle._id);
    clearErrors('vehicleId');

    // If it’s a market/transporter vehicle (isOwn === false),
    // force closePreviousTrips = true
    if (vehicle.isOwn === false) {
      setValue('closePreviousTrips', true);
    }
  };

  const handleDriverChange = (driver) => {
    setValue('driver', driver);
    clearErrors('driver');
  };

  // ------------------------------------------------------------------------------------
  // 4) onSubmit
  // ------------------------------------------------------------------------------------
  const onSubmit = async (data) => {
    try {
      if (currentTrip) {
        await updateTrip({
          id: currentTrip._id,
          data: {
            ...data,
            driverId: data.driver._id,
          },
        });
        navigate(paths.dashboard.trip.details(paramCase(currentTrip._id)));
      } else {
        const createdTrip = await createTrip({ ...data, driverId: data.driver._id });
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
                <DialogSelectButton
                  onClick={vehicleDialog.onTrue}
                  placeholder="Select Vehicle"
                  selected={selectedVehicle?.vehicleNo}
                  error={!!errors.vehicleId?.message}
                  iconName="mdi:truck"
                  disabled={!!currentTrip} // disable if in edit mode
                />
              </Box>

              {/* Driver Selection */}
              <Box>
                <DialogSelectButton
                  onClick={driverDialog.onTrue}
                  placeholder="Select Driver"
                  selected={watch('driver')?.driverName || ''}
                  error={!!errors.driver?.message}
                  iconName="mdi:account"
                />
              </Box>

              <Field.DatePicker name="fromDate" label="From Date" maxDate={dayjs()} />
              <Field.Text name="remarks" label="Remarks (Optional)" />
            </Box>

            {/* Close Previous Trips */}
            {!currentTrip && selectedVehicle && selectedVehicle.isOwn && (
              <Box sx={{ mt: 3 }}>
                <Field.Checkbox name="closePreviousTrips" label="Close Previous Trip ?" />
              </Box>
            )}
          </Card>

          {selectedVehicle && <VehicleInfoDetails vehicle={selectedVehicle} />}
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
        selectedDriver={watch('driver')}
        onDriverChange={handleDriverChange}
        allowQuickCreate={!currentTrip}
      />
    </Form>
  );
}

const VehicleInfoDetails = ({ vehicle }) => (
  <Box sx={{ mt: 3 }}>
    {/* Vehicle Information Alert */}
    <Alert severity="success" variant="outlined">
      <strong>Vehicle Information: </strong>
      This is a <strong>{vehicle?.vehicleType}</strong> vehicle with{' '}
      <strong>{vehicle?.noOfTyres}</strong> tyres.
    </Alert>

    {/* Ownership Details Alert */}
    <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
      <strong>Ownership Details: </strong>
      {vehicle?.isOwn ? (
        <span>
          This is a <strong>company-owned vehicle.</strong>
        </span>
      ) : (
        <span>
          This is a <strong>market / transporter’s vehicle</strong> managed by{' '}
          {vehicle?.transporter?.transportName ? (
            <strong>{vehicle.transporter.transportName}</strong>
          ) : (
            <em>an unknown transporter.</em>
          )}
        </span>
      )}
    </Alert>
  </Box>
);
