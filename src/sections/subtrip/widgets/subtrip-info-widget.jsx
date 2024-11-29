// @mui

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LRInfoCard({ subtrip }) {
  const {
    routeCd: { routeName },
    customerId: { customerName },
    ewayBill,
    ewayExpiryDate,
    loadingPoint,
    unloadingPoint,
    materialType,
    quantity,
    grade,
    tripId: { _id },
    startDate,
    endDate,
    rate = '-',
    subtripStatus = '-',
    loadingWeight = '-',
    unloadingWeight = '-',
    startKm = '-',
    endKm = '-',
    tds = '-',
    invoiceNo = '-',
    orderNo = '-',
    shipmentNo = '-',
  } = subtrip;

  const renderCustomer = (
    <>
      <CardHeader
        title="Subtrip Info"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack direction="row" sx={{ p: 3 }}>
        {/* <Avatar src={avatar} sx={{ width: 48, height: 48, mr: 2 }} /> */}

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{customerName}</Typography>

          <Box>
            Status:{' '}
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {subtripStatus}
            </Box>
          </Box>
          <Box>
            Trip No :{' '}
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {_id}
            </Box>
          </Box>
        </Stack>
      </Stack>
    </>
  );

  const renderRoute = (
    <>
      <CardHeader title="Route" />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Route
          </Box>
          {routeName}
        </Stack>

        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Loading Point
          </Box>
          {loadingPoint}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Unloading Point
          </Box>
          <Link underline="always" color="inherit">
            {unloadingPoint}
          </Link>
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Start KM
          </Box>
          {startKm}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            End KM
          </Box>
          {endKm}
        </Stack>
      </Stack>
    </>
  );

  const renderMaterial = (
    <>
      <CardHeader title="Material" />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Material
          </Box>
          {materialType}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Grade
          </Box>
          {grade}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Quantity
          </Box>
          {quantity}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Rate
          </Box>
          {rate}
          {rate && <span>&nbsp; ₹ </span>}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            TDS
          </Box>
          {tds}
          {tds && <span> &nbsp;% </span>}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Shipment
          </Box>
          {shipmentNo}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Invoice
          </Box>
          {invoiceNo}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Eway-Bill
          </Box>
          {ewayBill}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Eway-Bill Expiry
          </Box>
          {fDate(ewayExpiryDate)}
        </Stack>
      </Stack>
    </>
  );

  const renderWeight = (
    <>
      <CardHeader title="Weight" />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Loading Weight
          </Box>
          {loadingWeight}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 200, flexShrink: 0 }}>
            Unloading Weight
          </Box>
          {unloadingWeight}
        </Stack>
      </Stack>
    </>
  );

  return (
    <Card>
      {renderCustomer}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderRoute}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderMaterial}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderWeight}
    </Card>
  );
}
