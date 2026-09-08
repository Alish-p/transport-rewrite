import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTransporterVehicles } from 'src/query/use-vehicle';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const VEHICLE_TYPE_ICONS = {
  body: 'mdi:truck',
  trailer: 'mdi:truck-trailer',
  bulker: 'mdi:truck-cargo-container',
  localbulker: 'mdi:truck-fast',
  tanker: 'mdi:tanker-truck',
  canter: 'streamline-cyber:delivery-truck-5',
};

function getVehicleIcon(type) {
  if (!type) return 'mdi:truck';
  const key = type.toLowerCase().replace(/[\s-_]/g, '');
  return VEHICLE_TYPE_ICONS[key] || 'mdi:truck';
}

// ----------------------------------------------------------------------

export function TransporterVehiclesWidget({
  transporterId,
  title = 'Vehicles',
  sx,
  ...other
}) {
  const { data: vehicles = [], isLoading } = useTransporterVehicles(transporterId);
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? vehicles : vehicles.slice(0, 5);

  return (
    <Card sx={{ height: 1, display: 'flex', flexDirection: 'column', ...sx }} {...other}>
      <CardHeader
        title={title}
        subheader={`Vehicles owned by the transporter (${vehicles?.length || 0})`}
        avatar={<Iconify icon="solar:bus-bold" color="primary.main" width={24} />}
        action={
          !isLoading && vehicles.length > 0 ? (
            <Label variant="soft" color="primary" sx={{ typography: 'subtitle2', px: 1 }}>
              {vehicles.length}
            </Label>
          ) : null
        }
        sx={{
          p: 2.5,
          '& .MuiCardHeader-avatar': { mr: 1 },
          '& .MuiCardHeader-title': { fontWeight: 'fontWeightBold' },
          '& .MuiCardHeader-subheader': { typography: 'caption', color: 'text.secondary', mt: 0.25 },
        }}
      />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {isLoading ? (
          <VehicleSkeleton />
        ) : !vehicles.length ? (
          <EmptyVehicles />
        ) : (
          <Scrollbar sx={{ maxHeight: 380 }}>
            <Stack spacing={1.5} sx={{ p: 2.5, pt: 0 }}>
              {displayed.map((vehicle) => (
                <VehicleItem key={vehicle._id} vehicle={vehicle} />
              ))}
            </Stack>
          </Scrollbar>
        )}
      </Box>

      {vehicles.length > 5 && (
        <>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Box sx={{ p: 1.5, px: 2.5, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size="small"
              color="inherit"
              onClick={() => setShowAll((prev) => !prev)}
              endIcon={
                <Iconify
                  icon={showAll ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-forward-fill'}
                  width={16}
                />
              }
              sx={{ typography: 'caption', fontWeight: 600 }}
            >
              {showAll ? 'View less' : `View all (${vehicles.length})`}
            </Button>
          </Box>
        </>
      )}
    </Card>
  );
}

// ----------------------------------------------------------------------

function VehicleItem({ vehicle }) {
  const { _id, vehicleNo, vehicleType, modelType, loadingCapacity } = vehicle || {};

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
        border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
        transition: (theme) =>
          theme.transitions.create(['background-color', 'border-color'], {
            duration: theme.transitions.duration.shorter,
          }),
        '&:hover': {
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
          borderColor: (theme) => alpha(theme.palette.primary.main, 0.24),
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
        <Avatar
          variant="rounded"
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.25,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            color: 'primary.main',
            border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
            flexShrink: 0,
          }}
        >
          <Iconify icon={getVehicleIcon(vehicleType)} width={22} />
        </Avatar>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Link
            component={RouterLink}
            href={paths.dashboard.vehicle.details(_id)}
            color="inherit"
            underline="hover"
            sx={{
              typography: 'subtitle2',
              fontWeight: 600,
              letterSpacing: 0.5,
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              '&:hover': { color: 'primary.main' },
            }}
          >
            {vehicleNo}
          </Link>

          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{ mt: 0.5 }}
            flexWrap="wrap"
          >
            {vehicleType && (
              <Label
                variant="soft"
                color="default"
                size="small"
                sx={{
                  textTransform: 'capitalize',
                  typography: 'caption',
                  fontWeight: 600,
                  height: 20,
                  px: 0.75,
                }}
              >
                {vehicleType}
              </Label>
            )}

            {modelType && (
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {modelType}
              </Typography>
            )}

            {loadingCapacity && !modelType && (
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {loadingCapacity} Ton
              </Typography>
            )}
          </Stack>
        </Box>
      </Box>

      <Tooltip title="View details">
        <IconButton
          component={RouterLink}
          href={paths.dashboard.vehicle.details(_id)}
          size="small"
          sx={{
            color: 'text.secondary',
            flexShrink: 0,
            '&:hover': {
              color: 'primary.main',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <Iconify icon="solar:arrow-right-up-linear" width={18} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

// ----------------------------------------------------------------------

function VehicleSkeleton() {
  return (
    <Stack spacing={1.5} sx={{ p: 2.5, pt: 0 }}>
      {[1, 2, 3].map((key) => (
        <Box
          key={key}
          sx={{
            p: 1.5,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          <Skeleton
            variant="rounded"
            width={40}
            height={40}
            sx={{ borderRadius: 1.25, flexShrink: 0 }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={16} sx={{ mt: 0.5 }} />
          </Box>
          <Skeleton variant="circular" width={28} height={28} sx={{ flexShrink: 0 }} />
        </Box>
      ))}
    </Stack>
  );
}

// ----------------------------------------------------------------------

function EmptyVehicles() {
  return (
    <Box
      sx={{
        py: 4,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Iconify
        icon="solar:bus-bold-duotone"
        width={44}
        sx={{ color: 'text.disabled', mb: 1, opacity: 0.6 }}
      />
      <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.25 }}>
        No vehicles linked
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
        No vehicles assigned to this transporter
      </Typography>
    </Box>
  );
}

export default TransporterVehiclesWidget;
