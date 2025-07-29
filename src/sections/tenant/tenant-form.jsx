import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { Card, Stack, Divider, MenuItem, CardHeader } from '@mui/material';

import { useMaterialOptions } from 'src/hooks/use-material-options';

import COLORS from 'src/theme/core/colors.json';
import { useUpdateTenant } from 'src/query/use-tenant';
import PRIMARY_COLOR from 'src/theme/with-settings/primary-color.json';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { PresetsOptions } from 'src/components/settings/drawer/presets-options';

import { STATES } from '../customer/config';
import { useSubtripExpenseTypes, useVehicleExpenseTypes } from '../expense/expense-config';

export const TenantSchema = zod
  .object({
    name: zod.string().min(1, { message: 'Name is required' }),
    slug: zod.string().min(1, { message: 'Slug is required' }),
    tagline: zod.string().optional(),
    theme: zod.string().optional(),
    address: zod.object({
      line1: zod.string().min(1, { message: 'Address is required' }),
      city: zod.string().min(1, { message: 'City is required' }),
      state: zod.string().min(1, { message: 'State is required' }),
      pincode: schemaHelper.pinCode({}),
    }),
    contactDetails: zod.object({
      email: zod.string().email({ message: 'Email must be valid' }),
      phone: schemaHelper.phoneNumber({}),
      website: zod.string().optional(),
    }),
    legalInfo: zod.object({
      panNumber: schemaHelper.panNumberOptional({}),
      gstNumber: schemaHelper.gstNumberOptional({}),
      registeredState: zod.string().optional(),
    }),
    bankDetails: zod.object({
      bankName: zod.string().optional(),
      accountNumber: schemaHelper.accountNumber({}).optional(),
      ifscCode: zod.string().optional(),
    }),
    config: zod
      .object({
        materialOptions: zod
          .array(zod.object({ label: zod.string(), value: zod.string() }))
          .optional(),
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
      })
      .optional(),
    integrations: zod
      .object({
        whatsapp: zod
          .object({
            enabled: zod.boolean().optional(),
            provider: zod
              .preprocess(
                (val) => (val === '' ? null : val),
                zod.enum(['Twilio', 'Gupshup', 'Kaleyra']).nullable()
              )
              .optional(),
          })
          .optional(),
        vehicleGPS: zod
          .object({
            enabled: zod.boolean().optional(),
            provider: zod
              .preprocess(
                (val) => (val === '' ? null : val),
                zod.enum(['Fleetx', 'LocoNav', 'BlackBuck', 'Other']).nullable()
              )
              .optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.integrations?.whatsapp?.enabled && !data.integrations.whatsapp.provider) {
      ctx.addIssue({
        path: ['integrations', 'whatsapp', 'provider'],
        code: zod.ZodIssueCode.custom,
        message: 'Provider is required when WhatsApp is enabled',
      });
    }
    if (data.integrations?.vehicleGPS?.enabled && !data.integrations.vehicleGPS.provider) {
      ctx.addIssue({
        path: ['integrations', 'vehicleGPS', 'provider'],
        code: zod.ZodIssueCode.custom,
        message: 'Provider is required when Vehicle GPS is enabled',
      });
    }
  });

export default function TenantForm({ currentTenant }) {
  const updateTenant = useUpdateTenant();
  const materialOptions = useMaterialOptions();
  const subtripExpenseTypes = useSubtripExpenseTypes();
  const vehicleExpenseTypes = useVehicleExpenseTypes();

  const defaultValues = useMemo(
    () => ({
      name: currentTenant?.name || '',
      slug: currentTenant?.slug || '',
      tagline: currentTenant?.tagline || '',
      theme: currentTenant?.theme || 'default',
      address: {
        line1: currentTenant?.address?.line1 || '',
        city: currentTenant?.address?.city || '',
        state: currentTenant?.address?.state || '',
        pincode: currentTenant?.address?.pincode || '',
      },
      contactDetails: {
        email: currentTenant?.contactDetails?.email || '',
        phone: currentTenant?.contactDetails?.phone || '',
        website: currentTenant?.contactDetails?.website || '',
      },
      legalInfo: {
        panNumber: currentTenant?.legalInfo?.panNumber || '',
        gstNumber: currentTenant?.legalInfo?.gstNumber || '',
        registeredState: currentTenant?.legalInfo?.registeredState || '',
      },
      bankDetails: {
        bankName: currentTenant?.bankDetails?.bankName || '',
        accountNumber: currentTenant?.bankDetails?.accountNumber || '',
        ifscCode: currentTenant?.bankDetails?.ifscCode || '',
      },
      config: {
        materialOptions: currentTenant?.config?.materialOptions || materialOptions,
        subtripExpenseTypes: currentTenant?.config?.subtripExpenseTypes || subtripExpenseTypes,
        vehicleExpenseTypes: currentTenant?.config?.vehicleExpenseTypes || vehicleExpenseTypes,
      },
      integrations: {
        whatsapp: {
          enabled: currentTenant?.integrations?.whatsapp?.enabled || false,
          provider: currentTenant?.integrations?.whatsapp?.provider ?? null,
        },
        vehicleGPS: {
          enabled: currentTenant?.integrations?.vehicleGPS?.enabled || false,
          provider: currentTenant?.integrations?.vehicleGPS?.provider ?? null,
        },
      },
    }),
    [currentTenant, materialOptions, subtripExpenseTypes, vehicleExpenseTypes]
  );

  const methods = useForm({ resolver: zodResolver(TenantSchema), defaultValues });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  console.log({ errors });

  const values = watch();

  const onSubmit = async (data) => {
    try {
      const sanitized = {
        ...data,
        integrations: {
          ...data.integrations,
          whatsapp: data.integrations?.whatsapp
            ? {
                ...data.integrations.whatsapp,
                provider: data.integrations.whatsapp.provider || null,
              }
            : undefined,
          vehicleGPS: data.integrations?.vehicleGPS
            ? {
                ...data.integrations.vehicleGPS,
                provider: data.integrations.vehicleGPS.provider || null,
              }
            : undefined,
        },
      };

      await updateTenant(sanitized);
    } catch (error) {
      console.error(error);
    }
  };

  const renderBasic = () => (
    <Card>
      <CardHeader title="Basic Details" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="name" label="Name" />
        <Field.Text name="slug" label="Slug" disabled />
        <Field.Text name="tagline" label="Tagline" />
      </Stack>
    </Card>
  );

  const renderAddress = () => (
    <Card>
      <CardHeader title="Address & Contact" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="address.line1" label="Address" />
        <Field.Text name="address.city" label="City" />
        <Field.Text name="address.state" label="State" />
        <Field.Text name="address.pincode" label="Pincode" />
        <Field.Text name="contactDetails.email" label="Email" />
        <Field.Text name="contactDetails.phone" label="Phone" />
        <Field.Text name="contactDetails.website" label="Website" />
      </Stack>
    </Card>
  );

  const renderTheme = () => (
    <Card>
      <CardHeader title="Theme" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <PresetsOptions
          value={values.theme}
          onClickOption={(newValue) => setValue('theme', newValue)}
          options={[
            { name: 'default', value: COLORS.primary.main },
            { name: 'cyan', value: PRIMARY_COLOR.cyan.main },
            { name: 'purple', value: PRIMARY_COLOR.purple.main },
            { name: 'blue', value: PRIMARY_COLOR.blue.main },
            { name: 'orange', value: PRIMARY_COLOR.orange.main },
            { name: 'red', value: PRIMARY_COLOR.red.main },
          ]}
        />
      </Stack>
    </Card>
  );

  const renderBank = () => (
    <Card>
      <CardHeader title="Bank & Legal" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="bankDetails.bankName" label="Bank Name" />
        <Field.Text name="bankDetails.accountNumber" label="Account Number" />
        <Field.Text name="bankDetails.ifscCode" label="IFSC" />
        <Field.Text name="legalInfo.panNumber" label="PAN Number" />
        <Field.Text name="legalInfo.gstNumber" label="GST Number" />
        <Field.Select name="legalInfo.registeredState" label="Registered State">
          <MenuItem value="">None</MenuItem>
          <Divider sx={{ borderStyle: 'dashed' }} />
          {STATES.map((state) => (
            <MenuItem key={state.value} value={state.value}>
              {state.label}
            </MenuItem>
          ))}
        </Field.Select>
      </Stack>
    </Card>
  );

  const renderConfig = () => (
    <Card>
      <CardHeader title="Configuration" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.MultiAutocompleteFreeSolo
          name="config.materialOptions"
          label="Material Options"
          options={materialOptions}
        />
        <Field.MultiAutocompleteFreeSolo
          name="config.subtripExpenseTypes"
          label="Subtrip Expense Types"
          options={subtripExpenseTypes}
        />
        <Field.MultiAutocompleteFreeSolo
          name="config.vehicleExpenseTypes"
          label="Vehicle Expense Types"
          options={vehicleExpenseTypes}
        />
      </Stack>
    </Card>
  );

  const renderIntegrations = () => (
    <Card>
      <CardHeader title="Integrations" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Field.Switch
            name="integrations.whatsapp.enabled"
            labelPlacement="start"
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <Iconify icon="prime:whatsapp" />
                WhatsApp
              </Stack>
            }
            sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
          />
          {values.integrations?.whatsapp?.enabled && (
            <Field.Select name="integrations.whatsapp.provider" label="Provider">
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Twilio">Twilio</MenuItem>
              <MenuItem value="Gupshup">Gupshup</MenuItem>
              <MenuItem value="Kaleyra">Kaleyra</MenuItem>
            </Field.Select>
          )}
        </Stack>

        <Stack spacing={1}>
          <Field.Switch
            name="integrations.vehicleGPS.enabled"
            labelPlacement="start"
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <Iconify icon="mdi:location-radius-outline" />
                Vehicle GPS
              </Stack>
            }
            sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
          />
          {values.integrations?.vehicleGPS?.enabled && (
            <Field.Select name="integrations.vehicleGPS.provider" label="Provider">
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Fleetx">Fleetx</MenuItem>
              <MenuItem value="LocoNav">LocoNav</MenuItem>
              <MenuItem value="BlackBuck">BlackBuck</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Field.Select>
          )}
        </Stack>
      </Stack>
    </Card>
  );

  const renderActions = () => (
    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        Save Changes
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderBasic()}
        {renderAddress()}
        {renderTheme()}
        {renderBank()}
        {renderConfig()}
        {renderIntegrations()}
        {renderActions()}
      </Stack>
    </Form>
  );
}
