import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function InfoItem({ label, value, width = 140 }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ typography: 'body2' }}>
      <Box component="span" sx={{ color: 'text.secondary', width, flexShrink: 0 }}>
        {label}
      </Box>
      <Typography>{value || '-'}</Typography>
    </Stack>
  );
}

export default InfoItem;
