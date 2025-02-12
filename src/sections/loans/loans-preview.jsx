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

export default function LoansPreview({ loan }) {
  const renderHead = (
    <Stack direction="row" sx={{ mb: 3 }}>
      <Typography variant="h4" sx={{ flexGrow: 1 }}>
        Deduction Details - {loan?._id}
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
          <Typography variant="subtitle2">Name: {loan?.driverId?.driverName}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:phone-bold" />
          <Typography variant="subtitle2">Contact No: {loan?.driverId?.driverCellNo}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:license" />
          <Typography variant="subtitle2">License No: {loan?.driverId?.driverLicenceNo}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:bank" />
          <Typography variant="subtitle2">Bank: {loan?.driverId?.bankDetails?.name}</Typography>
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
          <Typography variant="subtitle2">Amount: {fCurrency(loan?.amount)}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:type" />
          <Typography variant="subtitle2">Type: {loan?.type}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:calendar-date-bold" />
          <Typography variant="subtitle2">Issued Date: {fDate(loan?.issuedDate)}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:remarks" />
          <Typography variant="subtitle2">Remarks: {loan?.remarks}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:install" />
          <Typography variant="subtitle2">Installments: {loan?.installments || 'N/A'}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:status" />
          <Typography variant="subtitle2">
            Status:{' '}
            <Chip
              label={loan?.status}
              color={loan?.status === 'pending' ? 'warning' : 'success'}
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
