import { z as zod } from 'zod';
// form
import { useForm } from 'react-hook-form';
// utils
import { useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSelector } from 'src/redux/store';
import { fetchTransporters } from 'src/redux/slices/transporter';
import { addVehicle, updateVehicle } from 'src/redux/slices/vehicle';

// components
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// assets
import { modelType, engineType, vehicleTypes, vehicleCompany } from './vehicle-config';

// ----------------------------------------------------------------------

export const NewVehicleSchema = zod.object({
  vehicleNo: zod.string().min(1, { message: 'Vehicle No is required' }),
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
  fromDate: schemaHelper.date({ message: { required_error: 'From Date is required!' } }),
  toDate: schemaHelper.date({ message: { required_error: 'To Date is required!' } }),
  transporter: zod.string().min(1, { message: 'Transport Company is required' }),
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
      fromDate: currentVehicle?.fromDate ? new Date(currentVehicle?.fromDate) : new Date(),
      toDate: currentVehicle?.toDate
        ? new Date(currentVehicle?.toDate)
        : new Date().setFullYear(new Date().getFullYear() + 1),
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
  });

  const {
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
              <Field.Select native name="vehicleType" label="Vehicle Type">
                <option value="" />
                {vehicleTypes.map(({ key, value }) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Field.Select>
              <Field.Select native name="modelType" label="Model Type">
                <option value="" />
                {modelType.map(({ key, value }) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Field.Select>
              <Field.Select native name="vehicleCompany" label="Vehicle Company">
                <option value="" />
                {vehicleCompany.map(({ key, value }) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Field.Select>
              <Field.Text name="noOfTyres" label="No Of Tyres" type="number" />
              <Field.Text name="chasisNo" label="Chasis No" />
              <Field.Text name="engineNo" label="Engine No" />
              <Field.Text name="manufacturingYear" label="Manufacturing Year" type="number" />
              <Field.Text name="loadingCapacity" label="Loading Capacity" type="number" />
              <Field.Text name="fuelTankCapacity" label="Fuel Tank Capacity" type="number" />

              <Field.Select native name="engineType" label="Engine Type">
                <option value="" />
                {engineType.map(({ key, value }) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Field.Select>
              <Field.Select native name="transporter" label="Transport Company">
                <option value="" />
                {transporters.map((transporter) => (
                  <option key={transporter._id} value={transporter._id}>
                    {transporter.transportName}
                  </option>
                ))}
              </Field.Select>
              <Field.DatePicker name="fromDate" label="From Date" />
              <Field.DatePicker name="toDate" label="To Date" />
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
