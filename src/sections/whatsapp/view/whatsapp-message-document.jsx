import { Box, Card, Stack, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { getMediaProxyUrl } from 'src/query/use-whatsapp';

// ----------------------------------------------------------------------

export function WhatsAppMessageDocument({ mediaId, filename, mimeType, caption }) {
  const downloadUrl = mediaId ? getMediaProxyUrl(mediaId) : '#';

  const handleDownload = (e) => {
    e.preventDefault();
    if (downloadUrl !== '#') {
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <Box>
      <Card
        variant="outlined"
        sx={{
          p: 1.5,
          maxWidth: 320,
          bgcolor: 'background.neutral',
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
        }}
        onClick={handleDownload}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon="solar:document-bold" width={24} sx={{ color: 'text.secondary' }} />
          </Box>
          <Stack sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {filename || 'Document'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }} noWrap>
              {mimeType || 'Unknown format'}
            </Typography>
          </Stack>
        </Stack>
      </Card>
      {caption && (
        <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
          {caption}
        </Typography>
      )}
    </Box>
  );
}
