import { Box, Stack, Divider, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { parseWhatsAppMarkdown } from '../utils/whatsapp-formatter';
import { getTemplateFooter, getTemplateButtons, reconstructTemplateText } from '../utils/template-registry';

export function WhatsAppTemplateBubble({ templateName, templateComponents }) {
  const bodyText = reconstructTemplateText(templateName, templateComponents);
  const buttons = getTemplateButtons(templateName, templateComponents);
  const footer = getTemplateFooter(templateName);

  return (
    <Stack spacing={1.5}>
      <Box>
        {bodyText.split('\n').map((line, i) => (
          <Typography
            key={i}
            variant="body2"
            sx={{
              minHeight: line.trim() === '' ? '0.75em' : 'auto',
              whiteSpace: 'pre-line',
            }}
          >
            {parseWhatsAppMarkdown(line)}
          </Typography>
        ))}

        {footer && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: 'text.secondary',
              opacity: 0.7,
              fontSize: 11,
              mt: 1,
            }}
          >
            {footer}
          </Typography>
        )}
      </Box>

      {buttons && buttons.length > 0 && (
        <>
          <Divider sx={{ my: 1, borderColor: (theme) => theme.palette.divider, opacity: 0.5 }} />
          <Stack spacing={1}>
            {buttons.map((btn, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.75,
                  textAlign: 'center',
                  py: 1,
                  px: 2,
                  bgcolor: (theme) => theme.palette.action.hover,
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.action.selected,
                  },
                }}
              >
                {btn.text === 'Copy code' ? (
                  <Iconify icon="solar:copy-bold" width={16} sx={{ color: 'primary.main' }} />
                ) : (
                  <Iconify icon="solar:arrow-right-up-linear" width={16} sx={{ color: 'primary.main' }} />
                )}
                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600, fontSize: 13 }}>
                  {btn.text}
                </Typography>
              </Box>
            ))}
          </Stack>
        </>
      )}
    </Stack>
  );
}
