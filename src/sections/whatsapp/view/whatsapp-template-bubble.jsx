import { Box, Typography, Divider, Stack } from '@mui/material';
import { parseWhatsAppMarkdown } from '../utils/whatsapp-formatter';
import { reconstructTemplateText, getTemplateButtons } from '../utils/template-registry';

export function WhatsAppTemplateBubble({ templateName, templateComponents, rawPayload }) {
  const bodyText = reconstructTemplateText(templateName, templateComponents);
  const buttons = getTemplateButtons(templateName, templateComponents);

  return (
    <Stack spacing={1.5}>
      <Box>
        {bodyText.split('\n').map((line, i) => (
          <Typography 
            key={i} 
            variant="body2" 
            sx={{ 
              minHeight: line.trim() === '' ? '0.75em' : 'auto',
              whiteSpace: 'pre-line' 
            }}
          >
            {parseWhatsAppMarkdown(line)}
          </Typography>
        ))}
      </Box>

      {buttons && buttons.length > 0 && (
        <>
          <Divider sx={{ my: 1, borderColor: (theme) => theme.palette.divider, opacity: 0.5 }} />
          <Stack spacing={1}>
            {buttons.map((btn, index) => (
              <Box
                key={index}
                sx={{
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
