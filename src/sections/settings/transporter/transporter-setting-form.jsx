import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { useUpdateTenant } from 'src/query/use-tenant';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const TransporterSettingSchema = zod.object({
  config: zod.object({
    defaultTdsPercentage: zod.number().min(0).max(100),
    defaultPodCharges: zod.number().min(0),
  }),
});

export default function TransporterSettingForm({ currentTenant }) {
  const updateTenant = useUpdateTenant();

  const defaultValues = useMemo(
    () => ({
      config: {
        defaultTdsPercentage: currentTenant?.config?.defaultTdsPercentage ?? 2,
        defaultPodCharges: currentTenant?.config?.defaultPodCharges ?? 0,
      },
    }),
    [currentTenant]
  );

  const methods = useForm({
    resolver: zodResolver(TransporterSettingSchema),
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
            title="Transporter Configurations"
            subheader="Configure transporter compliance checklist, allowed settlement routes, and rate defaults."
            sx={{ mb: 3 }}
          />
          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Field.Text
                  name="config.defaultTdsPercentage"
                  label="Default TDS Percentage (%)"
                  type="number"
                  onChange={(event) =>
                    methods.setValue('config.defaultTdsPercentage', Number(event.target.value))
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field.Text
                  name="config.defaultPodCharges"
                  label="Default POD Charges"
                  type="number"
                  onChange={(event) =>
                    methods.setValue('config.defaultPodCharges', Number(event.target.value))
                  }
                />
              </Grid>
            </Grid>
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
