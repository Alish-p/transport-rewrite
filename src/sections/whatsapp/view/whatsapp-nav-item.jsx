import { Stack, Avatar, Typography, ListItemButton } from '@mui/material';

import { fToNow } from 'src/utils/format-time';

import { Label } from 'src/components/label';

import { formatPhoneDisplay, formatMessageSnippet } from '../utils/whatsapp-formatter';

// ----------------------------------------------------------------------

export function WhatsAppNavItem({ conversation, selected, onSelect, collapsed }) {
  const {
    displayName,
    contactPhone,
    tenant,
    senderEntity,
    lastMessage,
    unreadCount,
  } = conversation;

  const contactName = displayName || senderEntity?.entityName;
  const entityType = senderEntity?.entityType;

  const entityColors = {
    Customer: 'info',
    Driver: 'warning',
    Transporter: 'success',
  };
  const color = entityColors[entityType] || 'default';

  return (
    <ListItemButton
      onClick={onSelect}
      selected={selected}
      sx={{
        px: 2,
        py: 1.5,
        ...(collapsed && {
          justifyContent: 'center',
          px: 1,
        }),
      }}
    >
      <Avatar
        sx={{
          bgcolor: (theme) => theme.palette[color === 'default' ? 'grey' : color].main,
          color: (theme) => theme.palette[color === 'default' ? 'grey' : color].contrastText,
          width: 48,
          height: 48,
          mr: collapsed ? 0 : 2,
        }}
      >
        {contactName ? contactName.charAt(0).toUpperCase() : '?'}
      </Avatar>

      {!collapsed && (
        <Stack sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.5}>
            <Typography variant="subtitle2" noWrap sx={{ flex: 1, pr: 1 }}>
              {contactName || formatPhoneDisplay(contactPhone)}
            </Typography>
            {lastMessage && (
              <Typography variant="caption" sx={{ color: 'text.disabled', flexShrink: 0 }}>
                {fToNow(lastMessage.timestamp)}
              </Typography>
            )}
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary', pr: 1 }} noWrap>
              {lastMessage ? formatMessageSnippet(lastMessage) : ''}
            </Typography>

            {unreadCount > 0 && (
              <Label color="error" sx={{ flexShrink: 0 }}>
                {unreadCount}
              </Label>
            )}
          </Stack>

          {tenant?.companyName && (
            <Typography variant="caption" sx={{ color: 'text.disabled' }} noWrap>
              {tenant.companyName}
            </Typography>
          )}
        </Stack>
      )}
    </ListItemButton>
  );
}
