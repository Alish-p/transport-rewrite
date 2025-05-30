// @mui

import Box from '@mui/material/Box';
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
    routeCd = {},
    customerId = {},
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

  const routeName = routeCd?.routeName || '-';
  const customerName = customerId?.customerName || '-';

  const renderCustomer = (
    <>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:information-outline" width={24} />
            <Typography variant="h6">Subtrip Info</Typography>
          </Stack>
        }
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack direction="row" sx={{ p: 3 }}>
        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2', width: '100%' }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
            <Iconify icon="mdi:account" width={20} />
            <Typography variant="subtitle2">{customerName}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
            <Iconify icon="mdi:flag" width={20} />
            <Typography>
              Status:{' '}
              <Box
                component="span"
                sx={{
                  color: 'primary.main',
                  fontWeight: 'bold',
                }}
              >
                {subtripStatus}
              </Box>
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:identifier" width={20} />
            <Typography>
              Trip No:{' '}
              <Box component="span" sx={{ color: 'text.secondary' }}>
                {_id}
              </Box>
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </>
  );

  const renderRoute = (
    <>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:routes" width={24} />
            <Typography variant="h6">Route</Typography>
          </Stack>
        }
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:road-variant" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Route
          </Box>
          <Typography>{routeName}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:map-marker" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Loading Point
          </Box>
          <Typography>{loadingPoint}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:map-marker-check" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Unloading Point
          </Box>
          <Typography>{unloadingPoint}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:speedometer" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Start KM
          </Box>
          <Typography>{startKm}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:speedometer-medium" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            End KM
          </Box>
          <Typography>{endKm}</Typography>
        </Stack>
      </Stack>
    </>
  );

  const renderMaterial = (
    <>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:package-variant" width={24} />
            <Typography variant="h6">Material</Typography>
          </Stack>
        }
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:cube" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Material
          </Box>
          <Typography>{materialType}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:star" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Grade
          </Box>
          <Typography>{grade}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:scale" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Quantity
          </Box>
          <Typography>{quantity}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:currency-inr" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Rate
          </Box>
          <Typography>
            {rate}
            {rate !== '-' && <span>&nbsp;₹</span>}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:percent" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            TDS
          </Box>
          <Typography>
            {tds}
            {tds !== '-' && <span>&nbsp;%</span>}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:truck-delivery" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Shipment
          </Box>
          <Typography>{shipmentNo}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:file-document" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Invoice
          </Box>
          <Typography>{invoiceNo}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:barcode" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Eway-Bill
          </Box>
          <Typography>{ewayBill}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:calendar" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Eway-Bill Expiry
          </Box>
          <Typography>{fDate(ewayExpiryDate)}</Typography>
        </Stack>
      </Stack>
    </>
  );

  const renderWeight = (
    <>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:weight" width={24} />
            <Typography variant="h6">Weight</Typography>
          </Stack>
        }
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:weight-kilogram" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Loading Weight
          </Box>
          <Typography>{loadingWeight}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:weight-kilogram" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Unloading Weight
          </Box>
          <Typography>{unloadingWeight}</Typography>
        </Stack>
      </Stack>
    </>
  );

  return (
    <Card sx={{ boxShadow: 2 }}>
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
