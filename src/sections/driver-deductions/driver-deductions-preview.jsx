import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function DriverDeductionsPreview({ driverDeduction }) {
  const renderHead = (
    <Stack direction="row" sx={{ mb: 3 }}>
      <Typography variant="h4" sx={{ flexGrow: 1 }}>
        Deduction Details - {driverDeduction?._id}
      </Typography>
    </Stack>
  );

  const renderDriverInfo = (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Driver Information
      </Typography>
      <Divider sx={{ borderStyle: 'dashed', mb: 2 }} />
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:user-rounded-bold" />
          <Typography variant="subtitle2">Name: {driverDeduction?.driverId?.driverName}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:phone-bold" />
          <Typography variant="subtitle2">
            Contact No: {driverDeduction?.driverId?.driverCellNo}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:license" />
          <Typography variant="subtitle2">
            License No: {driverDeduction?.driverId?.driverLicenceNo}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:bank" />
          <Typography variant="subtitle2">
            Bank: {driverDeduction?.driverId?.bankDetails?.name}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );

  const renderDeductionDetails = (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Deduction Details
      </Typography>
      <Divider sx={{ borderStyle: 'dashed', mb: 2 }} />

      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="material-symbols:money" />
          <Typography variant="subtitle2">Amount: {fCurrency(driverDeduction?.amount)}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:type" />
          <Typography variant="subtitle2">Type: {driverDeduction?.type}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:calendar-date-bold" />
          <Typography variant="subtitle2">
            Issued Date: {fDate(driverDeduction?.issuedDate)}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:remarks" />
          <Typography variant="subtitle2">Remarks: {driverDeduction?.remarks}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:install" />
          <Typography variant="subtitle2">
            Installments: {driverDeduction?.installments || 'N/A'}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:status" />
          <Typography variant="subtitle2">
            Status:{' '}
            <Chip
              label={driverDeduction?.status}
              color={driverDeduction?.status === 'pending' ? 'warning' : 'success'}
              size="small"
            />
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );

  return (
    <Stack sx={{ maxWidth: 720, mx: 'auto', p: 3 }}>
      {renderHead}
      <Grid container spacing={3}>
        <Grid item xs={6}>
          {renderDriverInfo}
        </Grid>
        <Grid item xs={6}>
          {renderDeductionDetails}
        </Grid>
      </Grid>
    </Stack>
  );
}
