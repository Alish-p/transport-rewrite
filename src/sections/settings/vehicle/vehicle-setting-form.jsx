import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { useUpdateTenant } from 'src/query/use-tenant';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const VehicleSettingSchema = zod.object({
  config: zod.object({
    marketVehicles: zod.boolean().optional(),
    vehicleTypes: zod
      .array(zod.object({ label: zod.string(), value: zod.string() }))
      .optional(),
    vehicleCompanies: zod
      .array(zod.object({ label: zod.string(), value: zod.string() }))
      .optional(),
    vehicleModels: zod
      .array(zod.object({ label: zod.string(), value: zod.string() }))
      .optional(),
    engineTypes: zod
      .array(zod.object({ label: zod.string(), value: zod.string() }))
      .optional(),
  }),
});

export default function VehicleSettingForm({ currentTenant }) {
  const updateTenant = useUpdateTenant();

  const defaultValues = useMemo(
    () => ({
      config: {
        marketVehicles: currentTenant?.config?.marketVehicles ?? true,
        vehicleTypes: currentTenant?.config?.vehicleTypes || [],
        vehicleCompanies: currentTenant?.config?.vehicleCompanies || [],
        vehicleModels: currentTenant?.config?.vehicleModels || [],
        engineTypes: currentTenant?.config?.engineTypes || [],
      },
    }),
    [currentTenant]
  );

  const methods = useForm({
    resolver: zodResolver(VehicleSettingSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const sanitized = {
        ...currentTenant,
        config: {
          ...currentTenant?.config,
          ...data.config,
        },
      };
      await updateTenant(sanitized);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        <Card>
          <CardHeader
            title="System Settings"
            subheader="Enable or disable market vehicle features."
            sx={{ mb: 3 }}
          />
          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Field.Switch
              name="config.marketVehicles"
              labelPlacement="start"
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify icon="mdi:truck-fast" />
                  Manages Market & Supplier Vehicles
                  <Tooltip title="If disabled, all transporter-related functionality (advances, payments, tracking, filtering) will be hidden, streamlining the interface for operators who only manage their own vehicles.">
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Iconify icon="eva:info-outline" width={16} sx={{ color: 'text.disabled', ml: 0.5 }} />
                    </Box>
                  </Tooltip>
                </Stack>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
          </Stack>
        </Card>

        <Card>
          <CardHeader title="Vehicle Configurations" subheader="Configure custom vehicle types, companies, models, and engine types for your fleet." sx={{ mb: 3 }} />
          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Field.MultiAutocompleteFreeSolo
              name="config.vehicleTypes"
              label="Vehicle Types"
              placeholder="Add vehicle types"
              options={currentTenant?.config?.vehicleTypes || []}
            />

            <Field.MultiAutocompleteFreeSolo
              name="config.vehicleCompanies"
              label="Vehicle Companies"
              placeholder="Add vehicle companies"
              options={currentTenant?.config?.vehicleCompanies || []}
            />

            <Field.MultiAutocompleteFreeSolo
              name="config.vehicleModels"
              label="Vehicle Models"
              placeholder="Add model numbers"
              options={currentTenant?.config?.vehicleModels || []}
            />

            <Field.MultiAutocompleteFreeSolo
              name="config.engineTypes"
              label="Engine Types"
              placeholder="Add engine classes (e.g. BS-6)"
              options={currentTenant?.config?.engineTypes || []}
            />
          </Stack>
        </Card>

        <Stack alignItems="flex-end">
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
