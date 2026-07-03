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
    vehicle: zod
      .object({
        marketVehicles: zod.boolean().optional(),
        types: zod.array(zod.object({ label: zod.string(), value: zod.string() })).optional(),
        companies: zod.array(zod.object({ label: zod.string(), value: zod.string() })).optional(),
        models: zod.array(zod.object({ label: zod.string(), value: zod.string() })).optional(),
        engineTypes: zod.array(zod.object({ label: zod.string(), value: zod.string() })).optional(),
      })
      .optional(),
  }),
});

export default function VehicleSettingForm({ currentTenant }) {
  const updateTenant = useUpdateTenant();

  const defaultValues = useMemo(
    () => ({
      config: {
        vehicle: {
          marketVehicles: currentTenant?.config?.vehicle?.marketVehicles ?? true,
          types: currentTenant?.config?.vehicle?.types || [],
          companies: currentTenant?.config?.vehicle?.companies || [],
          models: currentTenant?.config?.vehicle?.models || [],
          engineTypes: currentTenant?.config?.vehicle?.engineTypes || [],
        },
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
              name="config.vehicle.marketVehicles"
              labelPlacement="start"
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify icon="mdi:truck-fast" />
                  Manages Market & Supplier Vehicles
                  <Tooltip title="If disabled, all transporter-related functionality (advances, payments, tracking, filtering) will be hidden, streamlining the interface for operators who only manage their own vehicles.">
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Iconify
                        icon="eva:info-outline"
                        width={16}
                        sx={{ color: 'text.disabled', ml: 0.5 }}
                      />
                    </Box>
                  </Tooltip>
                </Stack>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
          </Stack>
        </Card>

        <Card>
          <CardHeader
            title="Vehicle Configurations"
            subheader="Configure custom vehicle types, companies, models, and engine types for your fleet."
            sx={{ mb: 3 }}
          />
          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Field.MultiAutocompleteFreeSolo
              name="config.vehicle.types"
              label="Vehicle Types"
              placeholder="Add vehicle types"
              options={currentTenant?.config?.vehicle?.types || []}
            />

            <Field.MultiAutocompleteFreeSolo
              name="config.vehicle.companies"
              label="Vehicle Companies"
              placeholder="Add vehicle companies"
              options={currentTenant?.config?.vehicle?.companies || []}
            />

            <Field.MultiAutocompleteFreeSolo
              name="config.vehicle.models"
              label="Vehicle Models"
              placeholder="Add model numbers"
              options={currentTenant?.config?.vehicle?.models || []}
            />

            <Field.MultiAutocompleteFreeSolo
              name="config.vehicle.engineTypes"
              label="Engine Types"
              placeholder="Add engine classes (e.g. BS-6)"
              options={currentTenant?.config?.vehicle?.engineTypes || []}
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
