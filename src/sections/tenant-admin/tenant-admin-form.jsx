import { z as zod } from 'zod';
import { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { Card, Stack, Divider, CardHeader, Typography, Box, MenuItem, Button } from '@mui/material';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

import {
  useCreateTenant,
  useUpdateTenantById,
} from 'src/query/use-tenant-admin';

import COLORS from 'src/theme/core/colors.json';
import PRIMARY_COLOR from 'src/theme/with-settings/primary-color.json';
import { PresetsOptions } from 'src/components/settings/drawer/presets-options';
import TenantLogoCardAdmin from './tenant-logo-card-admin';
import { useBoolean } from 'src/hooks/use-boolean';
import { BankDetailsWidget } from 'src/components/bank/bank-details-widget';
import { STATES } from 'src/sections/customer/config';
import { Iconify } from 'src/components/iconify';

export const TenantAdminSchema = zod
  .object({
    name: zod.string().min(1, { message: 'Name is required' }),
    slug: zod.string().min(1, { message: 'Slug is required' }),
    tagline: zod.string().optional(),
    theme: zod.string().optional(),
    address: zod
      .object({
        line1: zod.string().min(1, { message: 'Address is required' }),
        city: zod.string().min(1, { message: 'City is required' }),
        state: zod.string().min(1, { message: 'State is required' }),
        pincode: schemaHelper.pinCode({}),
      })
      .optional(),
    contactDetails: zod
      .object({
        email: zod.string().email({ message: 'Email must be valid' }).optional(),
        phone: schemaHelper.phoneNumberOptional({}),
        website: zod.string().optional(),
      })
      .optional(),
    legalInfo: zod
      .object({
        panNumber: schemaHelper.panNumberOptional({}),
        gstNumber: schemaHelper.gstNumberOptional({}),
        registeredState: zod.string().optional(),
      })
      .optional(),
    integrations: zod
      .object({
        whatsapp: zod.object({ enabled: zod.boolean().optional() }).optional(),
        ewayBill: zod.object({ enabled: zod.boolean().optional() }).optional(),
        vehicleApi: zod.object({ enabled: zod.boolean().optional() }).optional(),
        challanApi: zod.object({ enabled: zod.boolean().optional() }).optional(),
        gstApi: zod.object({ enabled: zod.boolean().optional() }).optional(),
        vehicleGPS: zod
          .object({
            enabled: zod.boolean().optional(),
            provider: zod
              .preprocess((val) => (val === '' ? null : val), zod.enum(['Fleetx', 'LocoNav', 'BlackBuck', 'Other']).nullable())
              .optional(),
          })
          .optional(),
        accounting: zod
          .object({
            enabled: zod.boolean().optional(),
            provider: zod
              .preprocess((val) => (val === '' ? null : val), zod.enum(['Tally', 'Mark', 'Zoho']).nullable())
              .optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.integrations?.vehicleGPS?.enabled && !data.integrations.vehicleGPS.provider) {
      ctx.addIssue({ path: ['integrations', 'vehicleGPS', 'provider'], code: zod.ZodIssueCode.custom, message: 'Provider is required when Vehicle GPS is enabled' });
    }
    if (data.integrations?.accounting?.enabled && !data.integrations.accounting.provider) {
      ctx.addIssue({ path: ['integrations', 'accounting', 'provider'], code: zod.ZodIssueCode.custom, message: 'Provider is required when Accounting is enabled' });
    }
  });

export default function TenantAdminForm({ currentTenant, onSaved }) {
  const isEditing = Boolean(currentTenant?._id);
  const { createTenant, creatingTenant } = useCreateTenant();
  const { updateTenantById, updatingTenant } = useUpdateTenantById();

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
        name: currentTenant?.bankDetails?.name || '',
        branch: currentTenant?.bankDetails?.branch || '',
        ifsc: currentTenant?.bankDetails?.ifsc || '',
        place: currentTenant?.bankDetails?.place || '',
        accNo: currentTenant?.bankDetails?.accNo || '',
      },
      integrations: {
        whatsapp: { enabled: currentTenant?.integrations?.whatsapp?.enabled || false },
        ewayBill: { enabled: currentTenant?.integrations?.ewayBill?.enabled || false },
        vehicleApi: { enabled: currentTenant?.integrations?.vehicleApi?.enabled || false },
        challanApi: { enabled: currentTenant?.integrations?.challanApi?.enabled || false },
        gstApi: { enabled: currentTenant?.integrations?.gstApi?.enabled || false },
        vehicleGPS: {
          enabled: currentTenant?.integrations?.vehicleGPS?.enabled || false,
          provider: currentTenant?.integrations?.vehicleGPS?.provider ?? null,
        },
        accounting: {
          enabled: currentTenant?.integrations?.accounting?.enabled || false,
          provider: currentTenant?.integrations?.accounting?.provider ?? null,
        },
      },
    }),
    [currentTenant]
  );

  const methods = useForm({ resolver: zodResolver(TenantAdminSchema), defaultValues });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;
  const values = watch();
  const bankDialog = useBoolean();

  // Helper to generate slug from name (lowercase and hyphenated)
  const slugify = (str) =>
    (str || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  // Auto-generate slug from name while creating (slug is immutable after creation)
  const watchName = watch('name');
  useEffect(() => {
    if (!isEditing) {
      setValue('slug', slugify(watchName), { shouldValidate: true, shouldDirty: true });
    }
  }, [watchName, isEditing, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    // Clean nested optional objects by removing empty strings
    const clean = (obj, keys) => {
      const result = { ...obj };
      keys.forEach((k) => {
        if (result[k] === '') result[k] = undefined;
      });
      return result;
    };

    const payload = {
      name: data.name,
      tagline: data.tagline || undefined,
      theme: data.theme || undefined,
      address: data.address?.line1 ? data.address : undefined,
      contactDetails: data.contactDetails?.email || data.contactDetails?.phone || data.contactDetails?.website
        ? clean(data.contactDetails, ['email', 'phone', 'website'])
        : undefined,
      legalInfo:
        data.legalInfo?.panNumber || data.legalInfo?.gstNumber || data.legalInfo?.registeredState
          ? clean(data.legalInfo, ['panNumber', 'gstNumber', 'registeredState'])
          : undefined,
      // bank details
      bankDetails: (() => {
        const bd = { ...(data.bankDetails || {}) };
        ['name', 'branch', 'ifsc', 'place', 'accNo'].forEach((k) => {
          if (bd[k] === '') bd[k] = undefined;
        });
        const allEmpty = ['name', 'branch', 'ifsc', 'place', 'accNo'].every(
          (k) => bd[k] === undefined || bd[k] === null
        );
        return allEmpty ? undefined : bd;
      })(),
      integrations: data.integrations
        ? {
            whatsapp: data.integrations?.whatsapp?.enabled ? { enabled: true } : { enabled: false },
            ewayBill: data.integrations?.ewayBill?.enabled ? { enabled: true } : { enabled: false },
            vehicleApi: data.integrations?.vehicleApi?.enabled ? { enabled: true } : { enabled: false },
            challanApi: data.integrations?.challanApi?.enabled ? { enabled: true } : { enabled: false },
            gstApi: data.integrations?.gstApi?.enabled ? { enabled: true } : { enabled: false },
            vehicleGPS: data.integrations?.vehicleGPS
              ? {
                  enabled: !!data.integrations.vehicleGPS.enabled,
                  provider: data.integrations.vehicleGPS.provider || null,
                }
              : undefined,
            accounting: data.integrations?.accounting
              ? {
                  enabled: !!data.integrations.accounting.enabled,
                  provider: data.integrations.accounting.provider || null,
                }
              : undefined,
          }
        : undefined,
    };

    // Slug is immutable. Only include during creation.
    if (!isEditing) {
      payload.slug = data.slug;
    }

    if (currentTenant?._id) {
      const updated = await updateTenantById({ id: currentTenant._id, data: payload });
      if (onSaved) onSaved(updated);
    } else {
      const created = await createTenant(payload);
      if (onSaved) onSaved(created);
    }
  });

  const pending = isSubmitting || creatingTenant || updatingTenant;

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {/* Branding */}
        {currentTenant?._id && (
          <TenantLogoCardAdmin tenant={currentTenant} onUpdated={onSaved} />
        )}

        {/* Basic details */}
        <Card>
          <CardHeader title={currentTenant?._id ? 'Edit Tenant' : 'Create Tenant'} sx={{ mb: 3 }} />
          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Field.Text name="name" label="Company name" />
            <Field.Text
              name="slug"
              label="Slug"
              disabled
              helperText={isEditing ? 'Slug is locked after creation' : 'Auto-generated from name; locked after creation'}
            />
            <Field.Text name="tagline" label="Tagline" />
          </Stack>
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader title="Theme" sx={{ mb: 3 }} />
          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            <PresetsOptions
              value={methods.watch('theme')}
              onClickOption={(newValue) => methods.setValue('theme', newValue)}
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

        {/* Address & Contact */}
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

        {/* Integrations (switches) */}
        <Card>
          <CardHeader title="Integrations" sx={{ mb: 3 }} />
          <Divider />
          <Stack spacing={2} sx={{ p: 3 }}>
            <Field.Switch name="integrations.whatsapp.enabled" label="WhatsApp" />
            <Field.Switch name="integrations.ewayBill.enabled" label="E-way Bill" />
            <Field.Switch name="integrations.vehicleApi.enabled" label="Vehicle API" />
            <Field.Switch name="integrations.challanApi.enabled" label="Challan API" />
            <Field.Switch name="integrations.gstApi.enabled" label="GST API" />
            <Divider flexItem sx={{ my: 1.5 }} />
            <Field.Switch name="integrations.vehicleGPS.enabled" label="Vehicle GPS" />
            <Field.Select
              name="integrations.vehicleGPS.provider"
              label="GPS Provider"
              disabled={!methods.watch('integrations.vehicleGPS.enabled')}
              select
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Fleetx">Fleetx</MenuItem>
              <MenuItem value="LocoNav">LocoNav</MenuItem>
              <MenuItem value="BlackBuck">BlackBuck</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Field.Select>
            <Divider flexItem sx={{ my: 1.5 }} />
            <Field.Switch name="integrations.accounting.enabled" label="Accounting" />
            <Field.Select
              name="integrations.accounting.provider"
              label="Accounting Provider"
              disabled={!methods.watch('integrations.accounting.enabled')}
              select
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Tally">Tally</MenuItem>
              <MenuItem value="Mark">Mark</MenuItem>
              <MenuItem value="Zoho">Zoho</MenuItem>
            </Field.Select>
          </Stack>
        </Card>

        {/* Bank & Legal (parity with tenant-scoped form) */}
        <Card>
          <CardHeader title="Bank & Legal" sx={{ mb: 3 }} />
          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            {(() => {
              const bd = values?.bankDetails || {};
              const summary = bd?.name
                ? `${bd.name}${bd.branch ? ` • ${bd.branch}` : ''}${bd.place ? ` • ${bd.place}` : ''}${bd.accNo ? ` • A/C ${bd.accNo}` : ''}`
                : 'Add bank details';
              const hasError = Boolean(errors?.bankDetails);
              return (
                <>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={bankDialog.onTrue}
                    startIcon={<Iconify icon={bd?.name ? 'mdi:bank' : 'mdi:bank-outline'} />}
                    sx={{
                      height: 56,
                      justifyContent: 'flex-start',
                      typography: 'body2',
                      borderColor: hasError ? 'error.main' : 'text.disabled',
                      color: hasError ? 'error.main' : 'text.primary',
                    }}
                  >
                    {summary}
                  </Button>

                  <BankDetailsWidget
                    variant="dialog"
                    title="Bank Details"
                    open={bankDialog.value}
                    onClose={bankDialog.onFalse}
                    fieldNames={{
                      ifsc: 'bankDetails.ifsc',
                      name: 'bankDetails.name',
                      branch: 'bankDetails.branch',
                      place: 'bankDetails.place',
                      accNo: 'bankDetails.accNo',
                    }}
                  />
                </>
              );
            })()}

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

        <Stack direction="row" justifyContent="flex-end">
          <LoadingButton type="submit" variant="contained" loading={pending}>
            {currentTenant?._id ? 'Save Changes' : 'Create Tenant'}
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
