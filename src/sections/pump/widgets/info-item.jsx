import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

export function InfoItem({ icon, label, value }) {
  if (value === undefined || value === null || value === '' || value === '-') return null;

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="space-between"
      spacing={1.5}
      sx={{ typography: 'body2', minHeight: 24 }}
    >
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ minWidth: 0, flexShrink: 0 }}>
        {icon && <Iconify icon={icon} width={16} sx={{ color: 'text.disabled', flexShrink: 0 }} />}
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
          {label}
        </Typography>
      </Stack>
      <Box sx={{ textAlign: 'right', minWidth: 0, flex: 1, ml: 1 }}>
        {typeof value === 'string' || typeof value === 'number' ? (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: '0.8125rem',
              color: 'text.primary',
              wordBreak: 'break-word',
            }}
          >
            {value}
          </Typography>
        ) : (
          value
        )}
      </Box>
    </Stack>
  );
}

export default InfoItem;

