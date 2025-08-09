import { useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { copyToClipboard } from 'src/utils/copy-to-clipboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { InfoItem } from 'src/sections/transporter/widgets/info-item';

export function RouteBasicWidget({ route }) {
  const { _id, routeName, tripType, transportType, fromPlace, toPlace } = route || {};

  const handleCopy = useCallback(() => {
    const text = JSON.stringify(
      { routeName, tripType, transportType, fromPlace, toPlace },
      null,
      2
    );
    copyToClipboard(text);
    toast.success('Copied to clipboard');
  }, [routeName, tripType, transportType, fromPlace, toPlace]);

  return (
    <Card sx={{ height: 1 }}>
      <CardHeader
        title="Basic Details"
        avatar={<Iconify icon="solar:road-bold" color="primary.main" width={24} />}
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
        <InfoItem label="Route Name" value={routeName} />
        <InfoItem label="Trip Type" value={tripType} />
        <InfoItem label="Transport Type" value={transportType} />
        <InfoItem label="From Place" value={fromPlace} />
        <InfoItem label="To Place" value={toPlace} />
      </Stack>
    </Card>
  );
}

export default RouteBasicWidget;
