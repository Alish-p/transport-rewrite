import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTransporterVehicles } from 'src/query/use-vehicle';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

export function TransporterVehiclesWidget({ transporterId, title = 'Vehicles' }) {
  const { data: vehicles = [] } = useTransporterVehicles(transporterId);

  return (
    <Card>
      <CardHeader
        title={title}
        action={
          <Button
            size="small"
            color="inherit"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
            component={RouterLink}
            href={paths.dashboard.vehicle.list}
          >
            View all
          </Button>
        }
      />

      <Scrollbar sx={{ minHeight: 364 }}>
        <Box
          sx={{
            p: 3,
            gap: 3,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 360,
          }}
        >
          {vehicles.length ? (
            vehicles.map((vehicle) => <Item key={vehicle._id} vehicle={vehicle} />)
          ) : (
            <Box sx={{ typography: 'body2', color: 'text.secondary' }}>No vehicles</Box>
          )}
        </Box>
      </Scrollbar>
    </Card>
  );
}

function Item({ vehicle, sx, ...other }) {
  return (
    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', ...sx }} {...other}>
      <Avatar>
        <Iconify icon="mdi-light:truck" />
      </Avatar>

      <ListItemText primary={vehicle.vehicleNo} secondary={vehicle.vehicleType} />

      <Tooltip title="View details">
        <IconButton>
          <Iconify icon="solar:eye-bold" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default TransporterVehiclesWidget;
