import { Box, Card, Link, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { fTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { getStatusIcon, parseWhatsAppMarkdown } from '../utils/whatsapp-formatter';

import { WhatsAppMessageDocument } from './whatsapp-message-document';
import { WhatsAppMessageImage } from './whatsapp-message-image';
import { WhatsAppTemplateBubble } from './whatsapp-template-bubble';

// ----------------------------------------------------------------------

export function WhatsAppMessageItem({ message, onImageClick }) {
  const { direction, messageType, content, createdAt, status } = message;
  const isOutbound = direction === 'outbound';
  const textBody = content?.text || '';

  const renderContent = () => {
    switch (messageType) {
      case 'text':
        return (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
            {parseWhatsAppMarkdown(textBody)}
          </Typography>
        );
      case 'template':
        return (
          <WhatsAppTemplateBubble
            templateName={content?.templateName}
            templateComponents={content?.templateComponents}
            rawPayload={message.rawPayload}
          />
        );
      case 'image':
        return (
          <WhatsAppMessageImage
            mediaId={content?.media?.id}
            caption={content?.media?.caption}
            onImageClick={onImageClick}
          />
        );
      case 'document':
        return (
          <WhatsAppMessageDocument
            mediaId={content?.media?.id}
            filename={content?.media?.filename}
            mimeType={content?.media?.mimeType}
            caption={content?.media?.caption}
          />
        );
      case 'location':
        return (
          <Stack spacing={1}>
            <Typography variant="body2">📍 Location Share</Typography>
            {content?.location && (
              <Link
                href={`https://maps.google.com/?q=${content.location.latitude},${content.location.longitude}`}
                target="_blank"
                variant="caption"
              >
                View on Google Maps
              </Link>
            )}
          </Stack>
        );
      case 'button':
      case 'interactive':
        return (
          <Stack spacing={1}>
            <Typography variant="body2">{textBody}</Typography>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              [Interactive Response]
            </Typography>
          </Stack>
        );
      case 'audio':
      case 'voice':
      case 'video':
        return (
          <Card variant="outlined" sx={{ p: 2, bgcolor: 'background.neutral' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify
                icon={messageType === 'video' ? 'solar:video-frame-bold' : 'solar:microphone-2-bold'}
                sx={{ color: 'text.secondary' }}
              />
              <Typography variant="body2">
                {messageType.charAt(0).toUpperCase() + messageType.slice(1)} message
              </Typography>
            </Stack>
          </Card>
        );
      default:
        return <Typography variant="body2">{textBody || 'Unsupported message type'}</Typography>;
    }
  };

  const statusIcon = getStatusIcon(status);

  return (
    <Stack direction="row" justifyContent={isOutbound ? 'flex-end' : 'flex-start'} mb={2}>
      <Box
        sx={{
          maxWidth: '75%',
          p: 1.5,
          borderRadius: isOutbound ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
          bgcolor: (theme) =>
            isOutbound
              ? theme.palette.mode === 'light'
                ? 'primary.lighter'
                : alpha(theme.palette.primary.dark, 0.45)
              : 'background.neutral',
          position: 'relative',
        }}
      >
        {renderContent()}

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={0.5}
          sx={{ mt: 0.5 }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.65rem',
              color: 'text.disabled',
              lineHeight: 1,
            }}
          >
            {fTime(createdAt)}
          </Typography>
          {isOutbound && (
            <Iconify icon={statusIcon.icon} width={14} sx={{ color: statusIcon.color }} />
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
