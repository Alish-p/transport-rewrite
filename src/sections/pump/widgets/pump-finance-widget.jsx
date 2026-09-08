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

export function PumpFinanceWidget({ pump }) {
  const { bankDetails } = pump || {};

  const handleCopy = useCallback(() => {
    const text = JSON.stringify({ bankDetails }, null, 2);
    copyToClipboard(text);
    toast.success('Copied to clipboard');
  }, [bankDetails]);

  return (
    <Card sx={{ height: 1 }}>
      <CardHeader
        title="Bank Details"
        avatar={<Iconify icon="solar:wallet-bold" color="primary.main" width={24} />}
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
        <InfoItem icon="mdi:bank" label="Bank Name" value={bankDetails?.name} />
        <InfoItem icon="mdi:source-branch" label="Branch" value={bankDetails?.branch} />
        <InfoItem icon="mdi:barcode" label="IFSC" value={bankDetails?.ifsc} />
        <InfoItem icon="mdi:map-marker" label="Place" value={bankDetails?.place} />
        <InfoItem icon="mdi:numeric" label="Account No" value={bankDetails?.accNo} />
      </Stack>
    </Card>
  );
}

export default PumpFinanceWidget;
