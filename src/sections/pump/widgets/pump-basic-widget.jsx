import { useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';

import { copyToClipboard } from 'src/utils/copy-to-clipboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { InfoItem } from './info-item';

export function PumpBasicWidget({ pump }) {
  const { name, ownerName, phone, address } = pump || {};

  const handleCopy = useCallback(() => {
    const text = JSON.stringify({ name, ownerName, phone, address }, null, 2);
    copyToClipboard(text);
    toast.success('Copied to clipboard');
  }, [name, ownerName, phone, address]);

  return (
    <Card sx={{ height: 1 }}>
      <CardHeader
        title="Pump Details"
        avatar={<Iconify icon="solar:gas-station-bold" color="primary.main" width={24} />}
        action={
          <Tooltip title="Copy">
            <IconButton onClick={handleCopy}>
              <Iconify icon="solar:copy-bold" />
            </IconButton>
          </Tooltip>
        }
        sx={{
          p: 2.5,
          pb: 1.5,
          '& .MuiCardHeader-avatar': { mr: 1 },
          '& .MuiCardHeader-title': { fontWeight: 'fontWeightBold' },
        }}
      />
      <Stack spacing={1} sx={{ px: 2.5, pb: 2.5, pt: 1 }}>
        <InfoItem icon="solar:gas-station-bold" label="Pump Name" value={name} />
        <InfoItem icon="mdi:account" label="Owner" value={ownerName} />
        <InfoItem icon="mdi:phone" label="Phone" value={phone} />
        <InfoItem icon="mdi:map-marker" label="Address" value={address} />
      </Stack>
    </Card>
  );
}

export default PumpBasicWidget;
