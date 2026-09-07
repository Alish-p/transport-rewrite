import { Stack, Avatar, Divider, IconButton, Typography } from '@mui/material';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { formatPhoneDisplay } from '../utils/whatsapp-formatter';

// ----------------------------------------------------------------------

export function WhatsAppHeader({ conversation, onToggleDetails, detailsOpen }) {
  if (!conversation) return <Divider />;

  const { displayName, contactPhone, tenant, senderEntity } = conversation;
  const contactName = displayName || senderEntity?.entityName;
  const entityType = senderEntity?.entityType;

  const entityColors = {
    Customer: 'info',
    Driver: 'warning',
    Transporter: 'success',
  };
  const color = entityColors[entityType] || 'default';

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2, height: 72 }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1, minWidth: 0 }}>
          <Avatar
            sx={{
              bgcolor: (theme) => theme.palette[color === 'default' ? 'grey' : color].main,
              color: (theme) => theme.palette[color === 'default' ? 'grey' : color].contrastText,
            }}
          >
            {contactName ? contactName.charAt(0).toUpperCase() : '?'}
          </Avatar>

          <Stack sx={{ minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" noWrap>
                {contactName || formatPhoneDisplay(contactPhone)}
              </Typography>
              {entityType && entityType !== 'Unknown' && (
                <Label color={color} sx={{ textTransform: 'capitalize' }}>
                  {entityType}
                </Label>
              )}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {formatPhoneDisplay(contactPhone)}
              </Typography>
              {tenant?.companyName && (
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  ({tenant.companyName})
                </Typography>
              )}
            </Stack>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={() => window.open(`https://wa.me/${contactPhone.replace(/\D/g, '')}`)}
            color="primary"
          >
            <Iconify icon="ic:baseline-whatsapp" />
          </IconButton>
          <IconButton
            onClick={onToggleDetails}
            color={detailsOpen ? 'primary' : 'default'}
          >
            <Iconify icon="eva:info-outline" />
          </IconButton>
        </Stack>
      </Stack>
      <Divider />
    </>
  );
}
