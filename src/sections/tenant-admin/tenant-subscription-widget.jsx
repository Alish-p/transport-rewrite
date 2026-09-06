import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

export function TenantSubscriptionWidget({ subscription, sx, action, onRenew, ...other }) {
  const planName = subscription?.planName || subscription?.plan || '—';
  const hasValidTill = !!subscription?.validTill;
  const validTillFormatted = hasValidTill ? fDate(subscription.validTill) : '—';
  const isActive = subscription?.isActive ?? null;

  let diffDays = null;
  let statusColor = 'default';
  let statusText = 'Active';
  let countdownText = null;

  if (hasValidTill) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(subscription.validTill);
    target.setHours(0, 0, 0, 0);

    diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      statusColor = 'error';
      statusText = 'Expired';
      countdownText = `Expired ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} ago`;
    } else if (diffDays === 0) {
      statusColor = 'warning';
      statusText = 'Expires Today';
      countdownText = 'Expires today';
    } else if (diffDays <= 7) {
      statusColor = 'warning';
      statusText = 'Expiring Soon';
      countdownText = `Expires in ${diffDays} day${diffDays === 1 ? '' : 's'}`;
    } else {
      statusColor = 'success';
      statusText = 'Active';
      countdownText = `${diffDays} days remaining`;
    }
  }

  if (isActive === false) {
    statusColor = 'error';
    statusText = 'Inactive';
    countdownText = 'Subscription inactive';
  }

  return (
    <Card sx={{ p: 2.5, display: 'flex', flexDirection: 'column', ...sx }} {...other}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Subscription</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Label color={statusColor} variant="soft">
            {statusText}
          </Label>
          {action}
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
        <Row label="Plan" value={planName} />
        <Row label="Valid Till" value={validTillFormatted} />

        {countdownText && (
          <Box
            sx={{
              mt: 1,
              p: 1.25,
              borderRadius: 1,
              bgcolor: (theme) =>
                statusColor === 'error'
                  ? theme.palette.error.lighter
                  : statusColor === 'warning'
                    ? theme.palette.warning.lighter
                    : theme.palette.success.lighter,
              color: (theme) =>
                statusColor === 'error'
                  ? theme.palette.error.darker
                  : statusColor === 'warning'
                    ? theme.palette.warning.darker
                    : theme.palette.success.darker,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              typography: 'caption',
              fontWeight: 600,
            }}
          >
            <Iconify
              icon={
                statusColor === 'error'
                  ? 'solar:danger-triangle-bold'
                  : statusColor === 'warning'
                    ? 'solar:clock-circle-bold'
                    : 'solar:check-circle-bold'
              }
              width={18}
            />
            <span>{countdownText}</span>
          </Box>
        )}
      </Stack>

      {onRenew && (
        <Button
          fullWidth
          size="small"
          variant="soft"
          color="primary"
          startIcon={<Iconify icon="solar:card-send-bold" />}
          onClick={onRenew}
          sx={{ mt: 2 }}
        >
          Record Payment / Renew
        </Button>
      )}
    </Card>
  );
}

function Row({ label, value }) {
  return (
    <Stack direction="row" spacing={1}>
      <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 100 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Stack>
  );
}

export default TenantSubscriptionWidget;
