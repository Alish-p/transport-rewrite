// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function VehicleCard({ vehicle, onVehicleEdit }) {
  const {
    vehicleNo,
    vehicleType,
    modelType,
    vehicleCompany,
    noOfTyres,
    chasisNo,
    engineNo,
    manufacturingYear,
    loadingCapacity,
    engineType,
    fuelTankCapacity,
    fromDate,
    toDate,
    transporter,
  } = vehicle;

  const renderHeader = (
    <>
      <CardHeader
        title="Vehicle Details"
        action={
          <IconButton onClick={onVehicleEdit}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar src="/assets/truck.png" sx={{ width: 100, height: 100, mr: 2 }} />

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{vehicleNo}</Typography>

          <Box>
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {transporter?.transportName}
            </Box>
          </Box>
        </Stack>
      </Stack>
    </>
  );

  const renderInfo = (
    <>
      <CardHeader
        title="Details"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Vehicle Type
          </Box>
          {vehicleType}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Model
          </Box>
          {modelType}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Company
          </Box>
          {vehicleCompany}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            NO Of Tyres
          </Box>
          {noOfTyres}
        </Stack>

        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Chasis No
          </Box>
          {chasisNo}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Engine No
          </Box>
          <Link underline="always" color="inherit">
            {engineNo}
          </Link>
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Manufacturing Year
          </Box>
          {manufacturingYear}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Loading Capacity
          </Box>
          {loadingCapacity}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Fuel Tank Capacity
          </Box>
          {fuelTankCapacity}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Engine Type
          </Box>
          {engineType}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            From Date
          </Box>
          {fDate(fromDate)}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            To Date
          </Box>
          {fDate(toDate)}
        </Stack>
      </Stack>
    </>
  );

  return (
    <Card>
      {renderHeader}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderInfo}

      <Divider sx={{ borderStyle: 'dashed' }} />
    </Card>
  );
}
