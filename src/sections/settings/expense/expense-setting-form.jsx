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

const ExpenseSettingSchema = zod.object({
  config: zod.object({
    subtripExpenseTypes: zod
      .array(
        zod.object({
          label: zod.string(),
          value: zod.string(),
          icon: zod.string().optional(),
        })
      )
      .optional(),
    vehicleExpenseTypes: zod
      .array(
        zod.object({
          label: zod.string(),
          value: zod.string(),
          icon: zod.string().optional(),
        })
      )
      .optional(),
  }),
});

export default function ExpenseSettingForm({ currentTenant }) {
  const updateTenant = useUpdateTenant();

  const defaultValues = useMemo(
    () => ({
      config: {
        subtripExpenseTypes: currentTenant?.config?.subtripExpenseTypes || [],
        vehicleExpenseTypes: currentTenant?.config?.vehicleExpenseTypes || [],
      },
    }),
    [currentTenant]
  );

  const methods = useForm({
    resolver: zodResolver(ExpenseSettingSchema),
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
          <CardHeader title="Expense Configurations" subheader="Configure Job/Subtrip expense types and internal vehicle expense types." sx={{ mb: 3 }} />
          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Field.MultiAutocompleteFreeSolo
              name="config.subtripExpenseTypes"
              label="Job Expense Types"
              placeholder="Add job/subtrip expense categories"
              options={currentTenant?.config?.subtripExpenseTypes || []}
            />

            <Field.MultiAutocompleteFreeSolo
              name="config.vehicleExpenseTypes"
              label="Vehicle Expense Types"
              placeholder="Add vehicle maintenance expense categories"
              options={currentTenant?.config?.vehicleExpenseTypes || []}
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
