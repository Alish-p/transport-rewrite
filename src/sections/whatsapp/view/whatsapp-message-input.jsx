import { useState, useCallback } from 'react';

import { Alert, Stack, InputBase, IconButton, Typography, CircularProgress } from '@mui/material';

import { useSendWhatsAppMessage } from 'src/query/use-whatsapp';

import { Iconify } from 'src/components/iconify';

import { isReplyWindowOpen } from '../utils/whatsapp-formatter';

// ----------------------------------------------------------------------

export function WhatsAppMessageInput({ conversationId, lastInboundAt, disabled }) {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useSendWhatsAppMessage();
  const windowOpen = isReplyWindowOpen(lastInboundAt);

  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || !conversationId || isSending) return;

    setIsSending(true);
    try {
      await sendMessage({ conversationId, text: trimmed });
      setText('');
    } catch (_err) {
      // Error toast is handled by the mutation's onError callback
    } finally {
      setIsSending(false);
    }
  }, [text, conversationId, isSending, sendMessage]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  if (!windowOpen) {
    return (
      <Stack
        sx={{
          p: 2,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        <Alert severity="warning" variant="outlined" sx={{ borderRadius: 1 }}>
          <Typography variant="body2">
            Reply window expired. Send a template to re-engage this contact.
          </Typography>
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack
      direction="row"
      alignItems="flex-end"
      spacing={1}
      sx={{
        p: 2,
        borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
      }}
    >
      <InputBase
        fullWidth
        multiline
        maxRows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={disabled || isSending}
        sx={{
          p: 1.5,
          bgcolor: 'background.neutral',
          borderRadius: 1,
          typography: 'body2',
        }}
      />

      <IconButton
        color="primary"
        onClick={handleSend}
        disabled={!text.trim() || disabled || isSending}
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': { bgcolor: 'primary.dark' },
          '&.Mui-disabled': {
            bgcolor: 'action.disabledBackground',
            color: 'action.disabled',
          },
          width: 44,
          height: 44,
          flexShrink: 0,
        }}
      >
        {isSending ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <Iconify icon="ic:round-send" />
        )}
      </IconButton>
    </Stack>
  );
}
