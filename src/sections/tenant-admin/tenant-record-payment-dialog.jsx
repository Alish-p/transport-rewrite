import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const RecordPaymentSchema = zod.object({
  amount: zod
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive('Amount must be greater than 0'),
  paymentDate: schemaHelper.date({ message: { required_error: 'Payment date is required' } }),
  paymentMethod: zod.string().min(1, { message: 'Payment method is required' }),
  planName: zod.string().min(1, { message: 'Plan name is required' }),
  validTill: schemaHelper.date({ message: { required_error: 'Valid till date is required' } }),
  notes: zod.preprocess((v) => (v === '' ? undefined : v), zod.string().optional()),
  sendEmail: zod.boolean().default(true),
});

const PAYMENT_METHODS = [
  { value: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)', icon: 'solar:smartphone-bold' },
  { value: 'BankTransfer', label: 'Bank Transfer (NEFT / RTGS / IMPS)', icon: 'solar:banknote-2-bold' },
  { value: 'Card', label: 'Credit / Debit Card', icon: 'solar:card-2-bold' },
  { value: 'Cash', label: 'Cash Payment', icon: 'solar:wallet-money-bold' },
];

const PLAN_OPTIONS = [
  { value: 'Free', label: 'Free' },
  { value: 'Standard', label: 'Standard' },
  { value: 'Pro', label: 'Pro' },
  { value: 'Enterprise', label: 'Enterprise' },
];

export function TenantRecordPaymentDialog({ open, onClose, tenant, onSubmit }) {
  // Determine base date for extension (current validTill if in the future, or today)
  const defaultValidTill = useMemo(() => {
    const currentValidTill = tenant?.subscription?.validTill
      ? new Date(tenant.subscription.validTill)
      : null;
    const now = new Date();
    const base =
      currentValidTill && !Number.isNaN(currentValidTill.getTime()) && currentValidTill > now
        ? currentValidTill
        : now;
    const d = new Date(base);
    d.setMonth(d.getMonth() + 1);
    return d;
  }, [tenant?.subscription?.validTill]);

  // Merge tenant's current plan into options if custom
  const planOptions = useMemo(() => {
    const current = tenant?.subscription?.planName;
    if (current && !PLAN_OPTIONS.some((p) => p.value === current)) {
      return [{ value: current, label: current }, ...PLAN_OPTIONS];
    }
    return PLAN_OPTIONS;
  }, [tenant?.subscription?.planName]);

  const defaultValues = useMemo(
    () => ({
      amount: 0,
      paymentDate: new Date(),
      paymentMethod: 'UPI',
      planName: tenant?.subscription?.planName || 'Standard',
      validTill: defaultValidTill,
      notes: '',
      sendEmail: true,
    }),
    [tenant?.subscription?.planName, defaultValidTill]
  );

  const methods = useForm({
    resolver: zodResolver(RecordPaymentSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isValid },
  } = methods;

  const sendEmail = watch('sendEmail');
  const tenantEmail = tenant?.contactDetails?.email;

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset, defaultValues]);

  const onFormSubmit = handleSubmit(async (values) => {
    await onSubmit({
      ...values,
      tenantId: tenant._id,
    });
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.lighter',
              color: 'primary.main',
            }}
          >
            <Iconify icon="solar:card-send-bold" width={24} />
          </Box>
          <Typography variant="h6">Record Payment</Typography>
        </Stack>
      </DialogTitle>

      <Form methods={methods} onSubmit={onFormSubmit}>
        <DialogContent dividers sx={{ pt: 2, pb: 3 }}>
          <Stack spacing={3}>
            {/* Section 1: Payment Details */}
            <Box>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ display: 'block', mb: 1.5, fontWeight: 700 }}
              >
                1. Payment Details
              </Typography>

              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Field.Number
                    name="amount"
                    label="Amount Paid"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    sx={{ flex: 1 }}
                  />
                  <Field.DatePicker
                    name="paymentDate"
                    label="Payment Date"
                    sx={{ flex: 1 }}
                  />
                </Stack>

                <Field.Select name="paymentMethod" label="Payment Method">
                  {PAYMENT_METHODS.map(({ value, label, icon }) => (
                    <MenuItem key={value} value={value}>
                      <Stack direction="row" alignItems="center" spacing={1.2}>
                        <Iconify icon={icon} width={20} sx={{ color: 'text.secondary' }} />
                        <span>{label}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Text
                  name="notes"
                  label="Transaction Reference / Notes (Optional)"
                  placeholder="e.g. UTR / IMPS ref 4253678..."
                  multiline
                  minRows={2}
                />
              </Stack>
            </Box>

            <Divider />

            {/* Section 2: Plan Validity Renewal */}
            <Box>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ display: 'block', mb: 1.5, fontWeight: 700 }}
              >
                2. Plan Validity Renewal
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Field.Select name="planName" label="Plan Name" sx={{ flex: 1 }}>
                  {planOptions.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.DatePicker
                  name="validTill"
                  label="Valid Till Date"
                  sx={{ flex: 1 }}
                />
              </Stack>
            </Box>

            <Divider />

            {/* Section 3: Receipt Email Dispatch via Resend */}
            <Box>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ display: 'block', mb: 1, fontWeight: 700 }}
              >
                3. Receipt Notification
              </Typography>

              <Card variant="outlined" sx={{ p: 2, bgcolor: 'background.neutral' }}>
                <Stack spacing={1.5}>
                  <Field.Switch
                    name="sendEmail"
                    label="Send confirmation receipt email via Resend"
                  />

                  {sendEmail && (
                    <Box sx={{ pl: 4 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Receipt will be delivered to:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip
                          size="small"
                          icon={<Iconify icon="solar:letter-bold" />}
                          label={tenantEmail ? `Tenant: ${tenantEmail}` : 'Tenant: No email configured'}
                          color={tenantEmail ? 'default' : 'warning'}
                          variant="soft"
                        />
                        <Chip
                          size="small"
                          icon={<Iconify icon="solar:shield-check-bold" />}
                          label="Tranzit Official (Records)"
                          color="primary"
                          variant="soft"
                        />
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Card>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting} color="inherit">
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isValid}
            startIcon={<Iconify icon="solar:card-send-bold" />}
          >
            Record Payment
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

export default TenantRecordPaymentDialog;
