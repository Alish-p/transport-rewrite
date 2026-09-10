import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LRInfoCard({ subtrip, sx, ...other }) {
  const {
    subtripNo,
    customerId = {},
    ewayBill,
    ewayExpiryDate,
    loadingPoint,
    unloadingPoint,
    materialType,
    quantity,
    grade,
    tripId = {},
    vehicleId,
    driverId,
    startDate,
    endDate,
    loadingWeight,
    unloadingWeight,
    shortageWeight,
    shortageAmount,
    invoiceNo,
    orderNo,
    shipmentNo,
    diNumber,
    consignee,
    referenceSubtripNo,
    vehicleAssignment,
    freightDetails,
    commissionDetails,
  } = subtrip || {};

  const rate = freightDetails?.rate;
  const commissionRate = commissionDetails?.commissionRate;

  const customerName = customerId?.customerName;
  const customerId_ = customerId?._id;
  const tripNo = tripId?.tripNo;
  const tripId_ = tripId?._id;
  const vehicleNo = vehicleId?.vehicleNo;
  const vehicleId_ = vehicleId?._id;
  const driverName = driverId?.driverName;
  const driverId_ = driverId?._id;

  return (
    <Card sx={{ ...sx }} {...other}>
      <CardHeader
        title="Job Details"
        avatar={<Iconify icon="solar:document-text-bold" color="primary.main" width={24} />}
        action={
          subtripNo ? (
            <Label variant="soft" color="primary" sx={{ typography: 'subtitle2' }}>
              #{subtripNo}
            </Label>
          ) : null
        }
        sx={{
          p: 2.5,
          pb: 1.5,
          '& .MuiCardHeader-avatar': { mr: 1 },
          '& .MuiCardHeader-title': { fontWeight: 'fontWeightBold' },
        }}
      />

      {/* 1. Trip & Entity Section */}
      <SectionHeader icon="solar:user-id-bold" title="Trip & Entity" />
      <Stack spacing={1} sx={{ px: 2.5, pb: 2 }}>
        <InfoRow
          icon="mdi:account"
          label="Customer"
          value={
            customerId_ ? (
              <Link
                component={RouterLink}
                href={paths.dashboard.customer.details(customerId_)}
                variant="body2"
                color="primary"
                underline="hover"
                sx={{ fontWeight: 600, fontSize: '0.8125rem' }}
              >
                {customerName}
              </Link>
            ) : (
              customerName
            )
          }
        />

        {consignee ? <InfoRow icon="mdi:account-tie" label="Consignee" value={consignee} /> : null}

        <InfoRow
          icon="mdi:truck-outline"
          label="Vehicle"
          value={
            vehicleId_ ? (
              <Link
                component={RouterLink}
                href={paths.dashboard.vehicle.details(vehicleId_)}
                color="primary"
                underline="hover"
                sx={{ fontWeight: 600, fontSize: '0.8125rem' }}
              >
                {vehicleNo}
              </Link>
            ) : (
              vehicleNo
            )
          }
        />

        <InfoRow
          icon="healthicons:truck-driver"
          label="Driver"
          value={
            driverId_ ? (
              <Link
                component={RouterLink}
                href={paths.dashboard.driver.details(driverId_)}
                color="primary"
                underline="hover"
                sx={{ fontWeight: 600, fontSize: '0.8125rem' }}
              >
                {driverName}
              </Link>
            ) : (
              driverName
            )
          }
        />

        {tripNo ? (
          <InfoRow
            icon="mdi:routes"
            label="Trip No"
            value={
              tripId_ ? (
                <Link
                  component={RouterLink}
                  href={paths.dashboard.trip.details(tripId_)}
                  color="primary"
                  underline="hover"
                  sx={{ fontWeight: 600, fontSize: '0.8125rem' }}
                >
                  #{tripNo}
                </Link>
              ) : (
                `#${tripNo}`
              )
            }
          />
        ) : null}

        {vehicleAssignment ? (
          <InfoRow
            icon="mdi:truck-check-outline"
            label="Assignment"
            value={vehicleAssignment === 'schedule' ? 'Schedule Vehicle' : 'Adhoc Vehicle'}
          />
        ) : null}

        {startDate ? (
          <InfoRow icon="mdi:calendar-start" label="Start Date" value={fDateTime(startDate)} />
        ) : null}

        {endDate ? <InfoRow icon="mdi:calendar-end" label="End Date" value={fDateTime(endDate)} /> : null}
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {/* 2. Route Section */}
      <SectionHeader icon="solar:map-point-bold" title="Route" />
      <Stack spacing={1} sx={{ px: 2.5, pb: 2 }}>
        <InfoRow icon="mdi:map-marker" label="Loading Point" value={loadingPoint} />
        <InfoRow icon="mdi:map-marker-check" label="Unloading Point" value={unloadingPoint} />
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {/* 3. Material & Freight Section */}
      <SectionHeader icon="solar:box-bold" title="Material & Freight" />
      <Stack spacing={1} sx={{ px: 2.5, pb: 2 }}>
        <InfoRow icon="mdi:cube" label="Material" value={materialType} />
        {grade ? <InfoRow icon="mdi:star" label="Grade" value={grade} /> : null}
        {quantity ? <InfoRow icon="mdi:scale" label="Quantity" value={quantity} /> : null}
        {rate ? <InfoRow icon="mdi:currency-inr" label="Freight Rate" value={fCurrency(rate)} /> : null}
        {commissionRate ? (
          <InfoRow
            icon="mdi:cash-check"
            label="Commission Rate"
            value={fCurrency(commissionRate)}
          />
        ) : null}
      </Stack>

      {/* 4. Documents & References Section */}
      {Boolean(invoiceNo || orderNo || shipmentNo || diNumber || ewayBill || referenceSubtripNo) && (
        <>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <SectionHeader icon="solar:file-check-bold" title="Documents & References" />
          <Stack spacing={1} sx={{ px: 2.5, pb: 2 }}>
            {referenceSubtripNo ? (
              <InfoRow icon="mdi:link-variant" label="Reference Job" value={referenceSubtripNo} />
            ) : null}
            {shipmentNo ? (
              <InfoRow icon="mdi:truck-delivery" label="Shipment No" value={shipmentNo} />
            ) : null}
            {invoiceNo ? (
              <InfoRow icon="mdi:file-document-outline" label="Invoice No" value={invoiceNo} />
            ) : null}
            {orderNo ? <InfoRow icon="mdi:numeric" label="Order No" value={orderNo} /> : null}
            {diNumber ? <InfoRow icon="mdi:ticket" label="DI No" value={diNumber} /> : null}
            {ewayBill ? <InfoRow icon="mdi:barcode" label="E-Way Bill" value={ewayBill} /> : null}
            {ewayExpiryDate ? (
              <InfoRow
                icon="mdi:calendar"
                label="E-Way Expiry"
                value={fDateTime(ewayExpiryDate)}
              />
            ) : null}
          </Stack>
        </>
      )}

      {/* 5. Weight & Shortage Section */}
      {Boolean(loadingWeight || unloadingWeight || shortageWeight || shortageAmount) && (
        <>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <SectionHeader icon="solar:scale-bold" title="Weight & Shortage" />
          <Stack spacing={1} sx={{ px: 2.5, pb: 2 }}>
            {loadingWeight ? (
              <InfoRow icon="mdi:weight-kilogram" label="Loading Wt" value={loadingWeight} />
            ) : null}
            {unloadingWeight ? (
              <InfoRow icon="mdi:weight-kilogram" label="Unloading Wt" value={unloadingWeight} />
            ) : null}
            {shortageWeight ? (
              <InfoRow
                icon="mdi:scale-unbalanced"
                label="Shortage Wt"
                value={shortageWeight}
              />
            ) : null}
            {shortageAmount ? (
              <InfoRow
                icon="mdi:currency-inr"
                label="Shortage Amt"
                value={
                  typeof shortageAmount === 'number'
                    ? fCurrency(shortageAmount)
                    : shortageAmount
                }
              />
            ) : null}
          </Stack>
        </>
      )}
    </Card>
  );
}

// ----------------------------------------------------------------------

function SectionHeader({ icon, title }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2.5, pt: 1.5, pb: 1 }}>
      <Iconify icon={icon} width={16} sx={{ color: 'primary.main' }} />
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          color: 'text.secondary',
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function InfoRow({ icon, label, value }) {
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
        {icon ? <Iconify icon={icon} width={16} sx={{ color: 'text.disabled', flexShrink: 0 }} /> : null}
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

