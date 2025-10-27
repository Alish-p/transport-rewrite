import { z as zod } from 'zod';
// form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect } from 'react';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, MenuItem, InputAdornment, CardHeader, Button, Collapse } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useCreateVehicle, useUpdateVehicle } from 'src/query/use-vehicle';

import { Iconify } from 'src/components/iconify';
// components
import { Form, Field } from 'src/components/hook-form';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { KanbanTransporterDialog } from '../kanban/components/kanban-transporter-dialog';
// assets
import { engineType, vehicleTypes, vehicleCompany, vehicleTypeIcon } from './vehicle-config';

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
    modelType: zod.string().optional(),
    vehicleCompany: zod.string().optional(),
    noOfTyres: zod
      .number()
      .min(3, { message: 'No Of Tyres must be at least 3' })
      .max(30, { message: 'No Of Tyres cannot exceed 30' }),
    chasisNo: zod.string().optional(),
    engineNo: zod.string().optional(),
    manufacturingYear: zod.number().optional(),
    loadingCapacity: zod.number().optional(),
    engineType: zod.string().optional(),
    fuelTankCapacity: zod.number().optional(),
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
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  // Auto-format vehicle number for UX: uppercase and trim spaces/hyphens
  useEffect(() => {
    const v = values.vehicleNo || '';
    const formatted = v.replace(/\s|-/g, '').toUpperCase();
    if (formatted !== v) {
      setValue('vehicleNo', formatted, { shouldValidate: true });
    }
  }, [values.vehicleNo, setValue]);

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

  // Section: Basic details (required-first)
  const renderBasicDetails = (
    <Card>
      <CardHeader title="Basic Details" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="vehicleNo" label="Vehicle No" placeholder="e.g. KA01AB0001" />
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
        <Field.Text
          name="noOfTyres"
          label="No Of Tyres"
          type="number"
        />
        <Stack direction="row" spacing={2} alignItems="center" >
          <Field.Switch
            name="isOwn"
            labelPlacement="start"
            label="Market Vehicle ?"
            slotProps={{
              switch: {
                checked: !values.isOwn,
                onChange: (_e, checked) => setValue('isOwn', !checked, { shouldValidate: true }),
              },
            }}
          />

          {!values.isOwn && (
            <DialogSelectButton
              onClick={transporterDialog.onTrue}
              placeholder="Select Transport Company"
              selected={selectedTransporter?.transportName}
              error={!!errors.transporter?.message}
              iconName="mdi:truck"
            />
          )}
        </Stack>
      </Stack>
    </Card>
  );

  // Section: Additional details (optional) with collapse to reduce clutter
  const optionalOpen = useBoolean(false);
  const renderAdditional = (
    <Card>
      <CardHeader
        title="Additional Details"
        sx={{ mb: 3 }}
      />
      <Divider />
      <Collapse in={optionalOpen.value} timeout="auto">
        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Text name="modelType" label="Model Type (Optional)" placeholder="e.g. 4923,3713..." />
          <Field.Select name="vehicleCompany" label="Vehicle Company (Optional)">
            <MenuItem value="">None</MenuItem>
            <Divider sx={{ borderStyle: 'dashed' }} />
            {vehicleCompany.map(({ key, value }) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </Field.Select>
          <Field.Text name="chasisNo" label="Chasis No (Optional)" placeholder="e.g. MAT12345678901234" />
          <Field.Text name="engineNo" label="Engine No (Optional)" placeholder="e.g. 4D56UJE12345" />
          <Field.Text
            name="manufacturingYear"
            label="Manufacturing Year (Optional)"
            type="number"
            placeholder="e.g. 2021"
          />
          <Field.Select name="engineType" label="Engine Type (Optional)">
            <MenuItem value="">None</MenuItem>
            <Divider sx={{ borderStyle: 'dashed' }} />
            {engineType.map(({ key, value }) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </Field.Select>
          <Field.Text
            name="loadingCapacity"
            label="Loading Capacity (Optional)"
            type="number"
            placeholder="30 Ton"
            InputProps={{ endAdornment: <InputAdornment position="end">Ton</InputAdornment> }}
          />
          <Field.Text
            name="fuelTankCapacity"
            label="Fuel Tank Capacity (Optional)"
            type="number"
            placeholder="e.g. 200 Ltr"
            InputProps={{ endAdornment: <InputAdornment position="end">Ltr</InputAdornment> }}
          />
          <Field.Text name="trackingLink" label="Tracking Link (Optional)" placeholder="Paste GPS tracking URL" />
        </Stack>
      </Collapse>
    </Card>
  );

  const renderActions = (
    <Stack alignItems="flex-end">
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        {!currentVehicle ? 'Create Vehicle' : 'Save Changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={{ xs: 2, }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderBasicDetails}

        <Button
          size="small"
          variant='text'
          color='primary'
          onClick={optionalOpen.onToggle}
          sx={{ alignSelf: 'flex-start' }}
          startIcon={
            <Iconify icon={optionalOpen.value ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
          }
          aria-expanded={optionalOpen.value}
        >
          {optionalOpen.value ? 'Hide Additional Fields' : 'Show Additional Fields'}
        </Button>

        {optionalOpen.value && renderAdditional}
        {renderActions}
      </Stack>

      <KanbanTransporterDialog
        open={transporterDialog.value}
        onClose={transporterDialog.onFalse}
        selectedTransporter={selectedTransporter}
        onTransporterChange={handleTransporterChange}
      />
    </Form>
  );
}
