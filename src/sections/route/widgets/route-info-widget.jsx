import { useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { copyToClipboard } from 'src/utils/copy-to-clipboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { InfoItem } from 'src/sections/transporter/widgets/info-item';

export function RouteInfoWidget({ route }) {
  const { _id, noOfDays, tollAmt, distance, ratePerTon, validFromDate, validTillDate } =
    route || {};

  const handleCopy = useCallback(() => {
    const text = JSON.stringify(
      { noOfDays, tollAmt, distance, ratePerTon, validFromDate, validTillDate },
      null,
      2
    );
    copyToClipboard(text);
    toast.success('Copied to clipboard');
  }, [noOfDays, tollAmt, distance, ratePerTon, validFromDate, validTillDate]);

  return (
    <Card sx={{ height: 1 }}>
      <CardHeader
        title="Route Information"
        avatar={<Iconify icon="solar:map-point-bold" color="primary.main" width={24} />}
        action={
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Copy">
              <IconButton onClick={handleCopy}>
                <Iconify icon="solar:copy-bold" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton component={RouterLink} href={paths.dashboard.route.edit(_id)}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>
          </Stack>
        }
        sx={{
          '& .MuiCardHeader-avatar': { mr: 1 },
          '& .MuiCardHeader-title': { fontWeight: 'fontWeightBold' },
        }}
      />
      <Stack spacing={1.5} sx={{ p: 3 }}>
        <InfoItem label="Number of Days" value={noOfDays} />
        <InfoItem label="Toll Amount" value={tollAmt} />
        <InfoItem label="Distance (KM)" value={distance} />
        <InfoItem label="Rate Per Ton" value={ratePerTon} />
        <InfoItem label="Valid From" value={validFromDate && fDate(validFromDate)} />
        <InfoItem label="Valid Till" value={validTillDate && fDate(validTillDate)} />
      </Stack>
    </Card>
  );
}

export default RouteInfoWidget;
