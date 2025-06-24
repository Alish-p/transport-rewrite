import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function VehicleAddressWidget({
  title = 'Current Address',
  address = '',
  sx,
  color = 'info',
  icon = 'mdi:map-marker',
  ...other
}) {
  const theme = useTheme();

  return (
    <Card sx={{ py: 3, pl: 3, pr: 2.5, position: 'relative', ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" sx={{ wordBreak: 'break-word', mb: 0.5 }}>
          {address || 'Address unavailable'}
        </Typography>
        <Typography noWrap variant="subtitle2" component="div" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>
      </Box>

      <Iconify
        icon={icon}
        width={36}
        height={36}
        sx={{
          top: 24,
          right: 20,
          position: 'absolute',
          background: `linear-gradient(135deg, ${theme.vars.palette[color].main} 0%, ${theme.vars.palette[color].dark} 100%)`,
          borderRadius: 1,
          p: 0.5,
          color: 'common.white',
        }}
      />

      <Box
        sx={{
          top: -44,
          width: 160,
          zIndex: -1,
          height: 160,
          right: -104,
          opacity: 0.12,
          borderRadius: 3,
          position: 'absolute',
          transform: 'rotate(40deg)',
          background: `linear-gradient(to right, ${theme.vars.palette[color].main} 0%, ${varAlpha(theme.vars.palette[color].mainChannel, 0)} 100%)`,
        }}
      />
    </Card>
  );
}
