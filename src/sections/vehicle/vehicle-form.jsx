import { z as zod } from 'zod';
// utils
import { useDispatch } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Divider, MenuItem, Typography } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSelector } from 'src/redux/store';
import { fetchTransporters } from 'src/redux/slices/transporter';
import { addVehicle, updateVehicle } from 'src/redux/slices/vehicle';

// components
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { Label } from '../../components/label';
// assets
import { modelType, engineType, vehicleTypes, vehicleCompany } from './vehicle-config';

// ----------------------------------------------------------------------

export const NewVehicleSchema = zod
  .object({
    vehicleNo: zod
      .string()
      .regex(/^[A-Z]{2}[0-9]{2}[A-HJ-NP-Z]{1,2}[0-9]{4}$|^[0-9]{2}BH[0-9]{4}[A-HJ-NP-Z]{1,2}$/, {
        message: 'Invalid Vehicle No format',
      })
      .min(1, { message: 'Vehicle No is required' }),
    images: zod.any().nullable(),
    vehicleType: zod.string().min(1, { message: 'Vehicle Type is required' }),
    modelType: zod.string().min(1, { message: 'Model Type is required' }),
    vehicleCompany: zod.string().min(1, { message: 'Vehicle Company is required' }),
    noOfTyres: zod.number().min(1, { message: 'No Of Tyres is required and must be at least 1' }),
    chasisNo: zod.string().min(1, { message: 'Chasis No is required' }),
    engineNo: zod.string().min(1, { message: 'Engine No is required' }),
    manufacturingYear: zod
      .number()
      .min(1900, { message: 'Manufacturing Year must be at least 1900' })
      .refine((val) => val <= new Date().getFullYear(), {
        message: 'Manufacturing Year cannot be in the future',
      }),
    loadingCapacity: zod
      .number()
      .min(1, { message: 'Loading Capacity is required and must be at least 1' }),
    engineType: zod.string().min(1, { message: 'Engine Type is required' }),
    fuelTankCapacity: zod
      .number()
      .min(1, { message: 'Fuel Tank Capacity is required and must be at least 1' }),
    transporter: zod.string().optional(),
    isActive: zod.boolean().optional(),
    isOwn: zod.boolean(),
  })
  .refine((data) => data.isOwn || data.transporter, {
    message: 'Transport Company is required when the vehicle is not owned',
    path: ['transporter'],
  });

// ----------------------------------------------------------------------

export default function VehicleForm({ currentVehicle }) {
  const router = useRouter();

  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      vehicleNo: currentVehicle?.vehicleNo || '',
      images: currentVehicle?.images || null,
      vehicleType: currentVehicle?.vehicleType || '',
      modelType: currentVehicle?.modelType || '',
      vehicleCompany: currentVehicle?.vehicleCompany || '',
      noOfTyres: currentVehicle?.noOfTyres || 0,
      chasisNo: currentVehicle?.chasisNo || '',
      engineNo: currentVehicle?.engineNo || '',
      manufacturingYear: currentVehicle?.manufacturingYear || new Date().getFullYear(),
      loadingCapacity: currentVehicle?.loadingCapacity || 0,
      engineType: currentVehicle?.engineType || '',
      fuelTankCapacity: currentVehicle?.fuelTankCapacity || 0,
      isActive: currentVehicle?.isActive,
      isOwn: currentVehicle?.isOwn,
      transporter: currentVehicle?.transporter?._id || '',
    }),
    [currentVehicle]
  );

  useEffect(() => {
    dispatch(fetchTransporters());
  }, [dispatch]);

  const { transporters } = useSelector((state) => state.transporter);

  const methods = useForm({
    resolver: zodResolver(NewVehicleSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    control,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    try {
      if (!currentVehicle) {
        await dispatch(addVehicle(data));
      } else {
        await dispatch(updateVehicle(currentVehicle._id, data));
      }
      reset();
      toast.success(
        !currentVehicle ? 'Vehicle added successfully!' : 'Vehicle edited successfully!'
      );
      router.push(paths.dashboard.vehicle.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );
  const handleRemoveFile = (inputFile) => {
    const filtered = values.images && values.images?.filter((file) => file !== inputFile);
    setValue('images', filtered);
  };

  const handleRemoveAllFiles = () => {
    setValue('images', []);
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Label
              color={values.isOwn ? 'secondary' : 'warning'}
              sx={{ position: 'absolute', top: 24, right: 24 }}
            >
              {values.isOwn ? 'Own' : 'Market'}
            </Label>
            {currentVehicle && (
              <Label
                color={values.isActive ? 'success' : 'error'}
                sx={{ position: 'absolute', top: 60, right: 24 }}
              >
                {values.isActive ? 'Active' : 'Disabled'}
              </Label>
            )}
            <Box sx={{ mb: 5 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Images
                </Typography>

                <Field.Upload
                  multiple
                  thumbnail
                  name="images"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemoveFile}
                  onRemoveAll={handleRemoveAllFiles}
                  onUpload={() => console.log('ON UPLOAD')}
                />
              </Stack>
            </Box>

            {currentVehicle && (
              <Field.Switch
                name="isActive"
                labelPlacement="start"
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Vehicle is Active ?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      When disabled, this vehicle cannot be used for new trips or have expenses
                      added to vehicles.
                    </Typography>
                  </>
                }
                sx={{ mx: 0, my: 1, width: 1, justifyContent: 'space-between' }}
              />
            )}
            <Field.Switch
              name="isOwn"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Company-Owned Vehicle
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Select this option if the vehicle belongs to the company. Leave it unselected
                    for market or transporter vehicles.
                  </Typography>
                </>
              }
              sx={{ mx: 0, my: 1, width: 1, justifyContent: 'space-between' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="vehicleNo" label="Vehicle No" />
              <Field.Select name="vehicleType" label="Vehicle Type">
                <MenuItem value="">None</MenuItem>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {vehicleTypes.map(({ key, value }) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select name="modelType" label="Model Type">
                <MenuItem value="">None</MenuItem>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {modelType.map(({ key, value }) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Select name="vehicleCompany" label="Vehicle Company">
                <MenuItem value="">None</MenuItem>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {vehicleCompany.map(({ key, value }) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Text name="noOfTyres" label="No Of Tyres" type="number" />
              <Field.Text name="chasisNo" label="Chasis No" />
              <Field.Text name="engineNo" label="Engine No" />
              <Field.Text name="manufacturingYear" label="Manufacturing Year" type="number" />
              <Field.Text name="loadingCapacity" label="Loading Capacity" type="number" />
              <Field.Text name="fuelTankCapacity" label="Fuel Tank Capacity" type="number" />

              <Field.Select name="engineType" label="Engine Type">
                <MenuItem value="">None</MenuItem>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {engineType.map(({ key, value }) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Field.Select>
              {!values.isOwn && (
                <Field.Select name="transporter" label="Transport Company">
                  <MenuItem value="">None</MenuItem>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  {transporters.map((transporter) => (
                    <MenuItem key={transporter._id} value={transporter._id}>
                      {transporter.transportName}
                    </MenuItem>
                  ))}
                </Field.Select>
              )}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentVehicle ? 'Create Vehicle' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
