import { z as zod } from 'zod';
import { useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';
import ToggleButton from '@mui/material/ToggleButton';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useGetFieldConfig, useUpsertFieldConfig } from 'src/query/use-field-config';

import { Form, Field } from 'src/components/hook-form';

import { FREIGHT_MODELS } from 'src/auth/field-config/field-config-defaults';

// ----------------------------------------------------------------------

const FIELDS_KEYS = [
  { key: 'invoiceNo', defaultLabel: 'Invoice No' },
  { key: 'ewayBill', defaultLabel: 'Eway Bill' },
  { key: 'ewayExpiryDate', defaultLabel: 'Eway Expiry Date' },
  { key: 'shipmentNo', defaultLabel: 'Shipment No' },
  { key: 'orderNo', defaultLabel: 'Order No' },
  { key: 'referenceSubtripNo', defaultLabel: 'Reference Job No' },
  { key: 'diNumber', defaultLabel: 'DI/DO No' },
  { key: 'consignee', defaultLabel: 'Consignee' },
  { key: 'loadingPoint', defaultLabel: 'Loading Point' },
  { key: 'unloadingPoint', defaultLabel: 'Unloading Point' },
  { key: 'materialType', defaultLabel: 'Material Type' },
  { key: 'grade', defaultLabel: 'Grade' },
  { key: 'quantity', defaultLabel: 'Quantity' },
  { key: 'remarks', defaultLabel: 'Remarks' },
];

const SubtripGlobalSettingSchema = zod.object({
  freightConfig: zod.object({
    allowedModels: zod.array(zod.string()).min(1, 'At least one freight model must be allowed'),
    defaultModel: zod.string().min(1, 'Default freight model is required'),
  }).superRefine((data, ctx) => {
    if (data.allowedModels && !data.allowedModels.includes(data.defaultModel)) {
      ctx.addIssue({
        path: ['defaultModel'],
        code: zod.ZodIssueCode.custom,
        message: 'Default model must be one of the allowed models',
      });
    }
  }),
  fields: zod.record(
    zod.string(),
    zod.object({
      label: zod.string().min(1, 'Field label is required'),
      visibility: zod.enum(['required', 'optional', 'hidden']),
    })
  ),
});

export default function SubtripGlobalSettingForm() {
  const { data, isLoading } = useGetFieldConfig('subtrip');
  const { upsertConfig, isUpdating } = useUpsertFieldConfig();

  const defaultValues = useMemo(() => {
    const fieldsInit = {};
    FIELDS_KEYS.forEach(({ key, defaultLabel }) => {
      const fieldData = data?.fields?.[key] || {};
      fieldsInit[key] = {
        label: fieldData.label || defaultLabel,
        visibility: fieldData.visibility || 'optional',
      };
    });

    return {
      freightConfig: {
        allowedModels: data?.freightConfig?.allowedModels || ['per_ton'],
        defaultModel: data?.freightConfig?.defaultModel || 'per_ton',
      },
      fields: fieldsInit,
    };
  }, [data]);

  const methods = useForm({
    resolver: zodResolver(SubtripGlobalSettingSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    watch,
    reset,
  } = methods;

  useEffect(() => {
    if (data) {
      reset(defaultValues);
    }
  }, [data, defaultValues, reset]);

  const watchedAllowedModels = watch('freightConfig.allowedModels');

  // Filter default model options to only allowed models
  const defaultModelOptions = useMemo(
    () => FREIGHT_MODELS.filter((model) => (watchedAllowedModels || []).includes(model.value)),
    [watchedAllowedModels]
  );

  const onSubmit = async (formData) => {
    await upsertConfig({
      entity: 'subtrip',
      fields: formData.fields,
      freightConfig: formData.freightConfig,
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        {/* Freight Configuration */}
        <Card sx={{ p: 3 }}>
          <CardHeader
            title="Freight Model Configuration"
            subheader="Select allowed freight models for subtrips and the default model to pre-select."
            sx={{ px: 0, pt: 0, mb: 3 }}
          />
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Field.MultiSelect
                name="freightConfig.allowedModels"
                label="Allowed Freight Models"
                placeholder="Select allowed models"
                checkbox
                chip
                options={FREIGHT_MODELS}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select
                name="freightConfig.defaultModel"
                label="Default Freight Model"
                fullWidth
              >
                {defaultModelOptions.map((model) => (
                  <MenuItem key={model.value} value={model.value}>
                    {model.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Card>

        {/* Field Configuration */}
        <Card>
          <CardHeader
            title="Field Customizations"
            subheader="Set standard display labels and choose the visibility state for each field in forms."
            sx={{ p: 3 }}
          />
          <Divider />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Field Name</TableCell>
                  <TableCell sx={{ minWidth: 240 }}>Custom Label</TableCell>
                  <TableCell align="right">Visibility</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {FIELDS_KEYS.map(({ key, defaultLabel }) => (
                  <TableRow key={key} hover>
                    <TableCell>
                      <Typography variant="subtitle2">{defaultLabel}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {key}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Field.Text
                        name={`fields.${key}.label`}
                        size="small"
                        placeholder={defaultLabel}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Controller
                        name={`fields.${key}.visibility`}
                        control={control}
                        render={({ field }) => (
                          <ToggleButtonGroup
                            value={field.value}
                            exclusive
                            onChange={(event, newValue) => {
                              if (newValue) {
                                field.onChange(newValue);
                              }
                            }}
                            size="small"
                            color="primary"
                          >
                            <ToggleButton value="required" sx={{ px: 1.5, py: 0.5, fontSize: '0.75rem' }}>
                              Required
                            </ToggleButton>
                            <ToggleButton value="optional" sx={{ px: 1.5, py: 0.5, fontSize: '0.75rem' }}>
                              Optional
                            </ToggleButton>
                            <ToggleButton value="hidden" sx={{ px: 1.5, py: 0.5, fontSize: '0.75rem' }}>
                              Hidden
                            </ToggleButton>
                          </ToggleButtonGroup>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider />
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              loading={isUpdating}
              size="large"
            >
              Save Settings
            </LoadingButton>
          </Box>
        </Card>
      </Stack>
    </Form>
  );
}
