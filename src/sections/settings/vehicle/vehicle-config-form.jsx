import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { useUpdateTenant } from 'src/query/use-tenant';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const VehicleConfigSchema = zod.object({
  config: zod.object({
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

export default function VehicleConfigForm({ currentTenant }) {
  const updateTenant = useUpdateTenant();

  const defaultValues = useMemo(
    () => ({
      config: {
        vehicleTypes: currentTenant?.config?.vehicleTypes || [],
        vehicleCompanies: currentTenant?.config?.vehicleCompanies || [],
        vehicleModels: currentTenant?.config?.vehicleModels || [],
        engineTypes: currentTenant?.config?.engineTypes || [],
      },
    }),
    [currentTenant]
  );

  const methods = useForm({
    resolver: zodResolver(VehicleConfigSchema),
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
