import { Stack, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export function WhatsAppEmptyConversation() {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        height: '100%',
        width: '100%',
        bgcolor: 'background.default',
        px: 3,
        textAlign: 'center',
      }}
    >
      <Iconify icon="solar:chat-round-dots-bold-duotone" width={120} sx={{ color: 'text.disabled', mb: 3 }} />
      <Typography variant="h5" gutterBottom>
        Select a conversation
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 300 }}>
        Choose a conversation from the sidebar to start viewing messages.
      </Typography>
    </Stack>
  );
}
