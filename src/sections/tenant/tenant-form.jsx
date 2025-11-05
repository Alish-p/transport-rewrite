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
          })
          .optional(),
        ewayBill: zod
          .object({
            enabled: zod.boolean().optional(),
          })
          .optional(),
        vehicleApi: zod
          .object({
            enabled: zod.boolean().optional(),
          })
          .optional(),
        gstApi: zod
          .object({
            enabled: zod.boolean().optional(),
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
        accounting: zod
          .object({
            enabled: zod.boolean().optional(),
            provider: zod
              .preprocess(
                (val) => (val === '' ? null : val),
                zod.enum(['Tally', 'Mark', 'Zoho']).nullable()
              )
              .optional(),
            config: zod
              .object({
                invoiceLedgerNames: zod
                  .object({
                    enabled: zod.boolean().optional(),
                    cgst: zod.string().optional(),
                    igst: zod.string().optional(),
                    sgst: zod.string().optional(),
                    transport_pay: zod.string().optional(),
                    shortage: zod.string().optional(),
                  })
                  .optional(),
                transporterLedgerNames: zod
                  .object({
                    enabled: zod.boolean().optional(),
                    cgst: zod.string().optional(),
                    igst: zod.string().optional(),
                    sgst: zod.string().optional(),
                    tds: zod.string().optional(),
                    diesel: zod.string().optional(),
                    trip_advance: zod.string().optional(),
                    shortage: zod.string().optional(),
                  })
                  .optional(),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.integrations?.vehicleGPS?.enabled && !data.integrations.vehicleGPS.provider) {
      ctx.addIssue({
        path: ['integrations', 'vehicleGPS', 'provider'],
        code: zod.ZodIssueCode.custom,
        message: 'Provider is required when Vehicle GPS is enabled',
      });
    }
    if (data.integrations?.accounting?.enabled && !data.integrations.accounting.provider) {
      ctx.addIssue({
        path: ['integrations', 'accounting', 'provider'],
        code: zod.ZodIssueCode.custom,
        message: 'Provider is required when Accounting is enabled',
      });
    }

    // If invoice ledger group is enabled, all its ledger names are mandatory
    const invoice = data.integrations?.accounting?.config?.invoiceLedgerNames;
    if (invoice?.enabled) {
      const invRequired = ['cgst', 'igst', 'sgst', 'transport_pay', 'shortage'];
      invRequired.forEach((key) => {
        const val = invoice?.[key];
        if (typeof val !== 'string' || val.trim() === '') {
          ctx.addIssue({
            path: ['integrations', 'accounting', 'config', 'invoiceLedgerNames', key],
            code: zod.ZodIssueCode.custom,
            message: 'This field is required when Invoice Ledgers are enabled',
          });
        }
      });
    }

    // If transporter ledger group is enabled, all its ledger names are mandatory
    const transporter = data.integrations?.accounting?.config?.transporterLedgerNames;
    if (transporter?.enabled) {
      const trRequired = ['cgst', 'igst', 'sgst', 'tds', 'diesel', 'trip_advance', 'shortage'];
      trRequired.forEach((key) => {
        const val = transporter?.[key];
        if (typeof val !== 'string' || val.trim() === '') {
          ctx.addIssue({
            path: ['integrations', 'accounting', 'config', 'transporterLedgerNames', key],
            code: zod.ZodIssueCode.custom,
            message: 'This field is required when Transport Payment Ledgers are enabled',
          });
        }
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
        },
        ewayBill: {
          enabled: currentTenant?.integrations?.ewayBill?.enabled || false,
        },
        vehicleApi: {
          enabled: currentTenant?.integrations?.vehicleApi?.enabled || false,
        },
        gstApi: {
          enabled: currentTenant?.integrations?.gstApi?.enabled || false,
        },
        vehicleGPS: {
          enabled: currentTenant?.integrations?.vehicleGPS?.enabled || false,
          provider: currentTenant?.integrations?.vehicleGPS?.provider ?? null,
        },
        accounting: {
          enabled: currentTenant?.integrations?.accounting?.enabled || false,
          provider: currentTenant?.integrations?.accounting?.provider ?? null,
          config: {
            invoiceLedgerNames: {
              enabled:
                currentTenant?.integrations?.accounting?.config?.invoiceLedgerNames?.enabled ??
                false,
              cgst: currentTenant?.integrations?.accounting?.config?.invoiceLedgerNames?.cgst || '',
              igst: currentTenant?.integrations?.accounting?.config?.invoiceLedgerNames?.igst || '',
              sgst: currentTenant?.integrations?.accounting?.config?.invoiceLedgerNames?.sgst || '',
              transport_pay:
                currentTenant?.integrations?.accounting?.config?.invoiceLedgerNames
                  ?.transport_pay || '',
              shortage:
                currentTenant?.integrations?.accounting?.config?.invoiceLedgerNames?.shortage || '',
            },
            transporterLedgerNames: {
              enabled:
                currentTenant?.integrations?.accounting?.config?.transporterLedgerNames?.enabled ??
                false,
              cgst:
                currentTenant?.integrations?.accounting?.config?.transporterLedgerNames?.cgst || '',
              igst:
                currentTenant?.integrations?.accounting?.config?.transporterLedgerNames?.igst || '',
              sgst:
                currentTenant?.integrations?.accounting?.config?.transporterLedgerNames?.sgst || '',
              tds:
                currentTenant?.integrations?.accounting?.config?.transporterLedgerNames?.tds || '',
              diesel:
                currentTenant?.integrations?.accounting?.config?.transporterLedgerNames?.diesel ||
                '',
              trip_advance:
                currentTenant?.integrations?.accounting?.config?.transporterLedgerNames
                  ?.trip_advance || '',
              shortage:
                currentTenant?.integrations?.accounting?.config?.transporterLedgerNames?.shortage ||
                '',
            },
          },
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
            }
            : undefined,
          ewayBill: data.integrations?.ewayBill
            ? {
              ...data.integrations.ewayBill,
            }
            : undefined,
          vehicleApi: data.integrations?.vehicleApi
            ? {
              ...data.integrations.vehicleApi,
            }
            : undefined,
          gstApi: data.integrations?.gstApi
            ? {
              ...data.integrations.gstApi,
            }
            : undefined,
          vehicleGPS: data.integrations?.vehicleGPS
            ? {
              ...data.integrations.vehicleGPS,
              provider: data.integrations.vehicleGPS.provider || null,
            }
            : undefined,
          accounting: data.integrations?.accounting
            ? (() => {
              const acc = data.integrations.accounting;
              const inv = acc?.config?.invoiceLedgerNames || {};
              const tr = acc?.config?.transporterLedgerNames || {};
              const invEnabled = !!inv.enabled;
              const trEnabled = !!tr.enabled;

              const pickNames = (obj) =>
                Object.fromEntries(
                  Object.entries(obj).filter(
                    ([k, v]) => k !== 'enabled' && typeof v === 'string' && v.trim() !== ''
                  )
                );

              const cleaned = {
                invoiceLedgerNames: invEnabled
                  ? { enabled: true, ...pickNames(inv) }
                  : { enabled: false },
                transporterLedgerNames: trEnabled
                  ? { enabled: true, ...pickNames(tr) }
                  : { enabled: false },
              };
              return {
                enabled: !!acc.enabled,
                provider: acc.provider || null,
                config: cleaned,
              };
            })()
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
          label="Job Expense Types"
          options={subtripExpenseTypes.map((t) => ({ ...t, value: t.label }))}
        />
        <Field.MultiAutocompleteFreeSolo
          name="config.vehicleExpenseTypes"
          label="Vehicle Expense Types"
          options={vehicleExpenseTypes.map((t) => ({ ...t, value: t.label }))}
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
        </Stack>

        <Stack spacing={1}>
          <Field.Switch
            name="integrations.ewayBill.enabled"
            labelPlacement="start"
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <Iconify icon="mdi:file-document-outline" />
                eWay Bill
              </Stack>
            }
            sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
          />
        </Stack>

        <Stack spacing={1}>
          <Field.Switch
            name="integrations.vehicleApi.enabled"
            labelPlacement="start"
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <Iconify icon="mdi:car-search-outline" />
                Vehicle API
              </Stack>
            }
            sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
          />
        </Stack>

        <Stack spacing={1}>
          <Field.Switch
            name="integrations.gstApi.enabled"
            labelPlacement="start"
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <Iconify icon="mdi:account-search-outline" />
                GST API
              </Stack>
            }
            sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
          />
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

        <Stack spacing={1}>
          <Field.Switch
            name="integrations.accounting.enabled"
            labelPlacement="start"
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <Iconify icon="mdi:calculator-variant" />
                Accounting
              </Stack>
            }
            sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
          />
          {values.integrations?.accounting?.enabled && (
            <Stack spacing={2}>
              <Field.Select name="integrations.accounting.provider" label="Provider">
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Tally">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify icon="mdi:alpha-t-circle-outline" width={20} />
                    Tally
                  </Stack>
                </MenuItem>
                <MenuItem value="Mark">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify icon="mdi:alpha-m-circle-outline" width={20} />
                    Mark
                  </Stack>
                </MenuItem>
                <MenuItem value="Zoho">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify icon="simple-icons:zoho" width={20} />
                    Zoho
                  </Stack>
                </MenuItem>
              </Field.Select>

              <Field.Switch
                name="integrations.accounting.config.invoiceLedgerNames.enabled"
                labelPlacement="start"
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    Invoice Ledgers
                  </Stack>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />

              {values.integrations?.accounting?.config?.invoiceLedgerNames?.enabled && (
                <Stack spacing={1}>
                  <Field.Text
                    name="integrations.accounting.config.invoiceLedgerNames.cgst"
                    label="CGST Ledger Name"
                    placeholder="e.g. CGST @9% Output, cgst9, cgst-9%"
                  />
                  <Field.Text
                    name="integrations.accounting.config.invoiceLedgerNames.igst"
                    label="IGST Ledger Name"
                    placeholder="e.g. IGST @18% Output"
                  />
                  <Field.Text
                    name="integrations.accounting.config.invoiceLedgerNames.sgst"
                    label="SGST Ledger Name"
                    placeholder="e.g. SGST @9% Output"
                  />
                  <Field.Text
                    name="integrations.accounting.config.invoiceLedgerNames.transport_pay"
                    label="Transport Pay Ledger Name"
                  />
                  <Field.Text
                    name="integrations.accounting.config.invoiceLedgerNames.shortage"
                    label="Shortage Ledger Name"
                  />
                </Stack>
              )}

              <Field.Switch
                name="integrations.accounting.config.transporterLedgerNames.enabled"
                labelPlacement="start"
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    Transport Payment Ledgers
                  </Stack>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />

              {values.integrations?.accounting?.config?.transporterLedgerNames?.enabled && (
                <Stack spacing={1}>
                  <Field.Text
                    name="integrations.accounting.config.transporterLedgerNames.cgst"
                    label="CGST Ledger Name"
                  />
                  <Field.Text
                    name="integrations.accounting.config.transporterLedgerNames.igst"
                    label="IGST Ledger Name"
                  />
                  <Field.Text
                    name="integrations.accounting.config.transporterLedgerNames.sgst"
                    label="SGST Ledger Name"
                  />
                  <Field.Text
                    name="integrations.accounting.config.transporterLedgerNames.tds"
                    label="TDS Ledger Name"
                  />
                  <Field.Text
                    name="integrations.accounting.config.transporterLedgerNames.diesel"
                    label="Diesel Ledger Name"
                  />
                  <Field.Text
                    name="integrations.accounting.config.transporterLedgerNames.trip_advance"
                    label="Trip Advance Ledger Name"
                  />
                  <Field.Text
                    name="integrations.accounting.config.transporterLedgerNames.shortage"
                    label="Shortage Ledger Name"
                  />
                </Stack>
              )}
            </Stack>
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
