import { z as zod } from 'zod';
// form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Divider,
  MenuItem,
  Typography,
  InputAdornment,
} from '@mui/material';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useCreateVehicle, useUpdateVehicle } from 'src/query/use-vehicle';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
// components
import { Form, Field } from 'src/components/hook-form';

import { KanbanTransporterDialog } from '../kanban/components/kanban-transporter-dialog';
// assets
import {
  modelType,
  engineType,
  vehicleTypes,
  vehicleCompany,
  vehicleTypeIcon,
} from './vehicle-config';

// ----------------------------------------------------------------------

export const NewVehicleSchema = zod
  .object({
    vehicleNo: zod
      .string()
      .min(1, { message: 'Vehicle No is required' })
      .regex(/^[A-Z]{2}[0-9]{2}[A-Z]{0,2}[0-9]{4}$/, {
        message: 'Invalid Vehicle No format. Example: KA01AB0001, KA01A0001, or KA010001',
      }),
    vehicleType: zod.string().min(1, { message: 'Vehicle Type is required' }),
    modelType: zod.string().min(1, { message: 'Model Type is required' }),
    vehicleCompany: zod.string().min(1, { message: 'Vehicle Company is required' }),
    noOfTyres: zod
      .number()
      .min(3, { message: 'No Of Tyres must be at least 3' })
      .max(30, { message: 'No Of Tyres cannot exceed 30' }),
    chasisNo: zod.string().optional(),
    engineNo: zod.string().optional(),
    manufacturingYear: zod.number().min(1900, { message: 'Manufacturing Year is required' }),
    loadingCapacity: zod.number().min(1, { message: 'Loading Capacity is required' }),
    engineType: zod.string().min(1, { message: 'Engine Type is required' }),
    fuelTankCapacity: zod.number().min(1, { message: 'Fuel Tank Capacity is required' }),
    isActive: zod.boolean().default(true),
    isOwn: zod.boolean().default(true),
    transporter: zod.string().optional(),
    trackingLink: zod.string().optional(),
  })
  .refine((data) => data.isOwn || data.transporter, {
    message: 'Transport Company is required when the vehicle is not owned',
    path: ['transporter'],
  });

// ----------------------------------------------------------------------

export default function VehicleForm({ currentVehicle }) {
  const router = useRouter();
  const [selectedTransporter, setSelectedTransporter] = useState(
    currentVehicle?.transporter || null
  );
  const transporterDialog = useBoolean(false);

  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();

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
      isActive: currentVehicle?.isActive ?? true,
      isOwn: currentVehicle?.isOwn ?? false,
      transporter: currentVehicle?.transporter?._id || '',
      trackingLink: currentVehicle?.trackingLink || '',
    }),
    [currentVehicle]
  );

  const methods = useForm({
    resolver: zodResolver(NewVehicleSchema),
    defaultValues,
    mode: 'all',
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
      let newVehicle;
      if (!currentVehicle) {
        newVehicle = await createVehicle(data);
      } else {
        newVehicle = await updateVehicle({ id: currentVehicle._id, data });
      }
      reset();
      router.push(paths.dashboard.vehicle.details(newVehicle._id));
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

  const handleTransporterChange = (transporter) => {
    setSelectedTransporter(transporter);
    setValue('transporter', transporter._id);
  };

  // Clear transporter when the vehicle is marked as company owned
  useEffect(() => {
    if (values.isOwn) {
      setSelectedTransporter(null);
      setValue('transporter', '', { shouldValidate: true });
    }
  }, [values.isOwn, setValue]);

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
                    <Iconify icon={vehicleTypeIcon[key]} sx={{ mr: 1 }} />
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
              <Field.Text name="chasisNo" label="Chasis No (Optional)" />
              <Field.Text name="engineNo" label="Engine No (Optional)" />
              <Field.Text name="manufacturingYear" label="Manufacturing Year" type="number" />
              <Field.Text
                name="loadingCapacity"
                label="Loading Capacity"
                type="number"
                InputProps={{ endAdornment: <InputAdornment position="end">Ton</InputAdornment> }}
              />
              <Field.Text
                name="fuelTankCapacity"
                label="Fuel Tank Capacity"
                type="number"
                InputProps={{ endAdornment: <InputAdornment position="end">Ltr</InputAdornment> }}
              />
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
                <Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={transporterDialog.onTrue}
                    sx={{
                      height: 56,
                      justifyContent: 'flex-start',
                      typography: 'body2',
                    }}
                    startIcon={
                      <Iconify
                        icon={selectedTransporter ? 'mdi:truck' : 'mdi:truck-outline'}
                        sx={{ color: selectedTransporter ? 'primary.main' : 'text.disabled' }}
                      />
                    }
                  >
                    {selectedTransporter
                      ? selectedTransporter.transportName
                      : `Select Transport Company${values.isOwn ? ' (Optional)' : ''}`}
                  </Button>
                </Box>
              )}
              <Field.Text name="trackingLink" label="Tracking Link (Optional)" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentVehicle ? 'Create Vehicle' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <KanbanTransporterDialog
        open={transporterDialog.value}
        onClose={transporterDialog.onFalse}
        selectedTransporter={selectedTransporter}
        onTransporterChange={handleTransporterChange}
      />
    </Form>
  );
}
