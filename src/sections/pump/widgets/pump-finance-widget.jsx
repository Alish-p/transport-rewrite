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

import { InfoItem } from './info-item';

export function PumpFinanceWidget({ pump }) {
  const { _id, bankAccount } = pump || {};

  const handleCopy = useCallback(() => {
    const text = JSON.stringify({ bankAccount }, null, 2);
    copyToClipboard(text);
    toast.success('Copied to clipboard');
  }, [bankAccount]);

  return (
    <Card sx={{ height: 1 }}>
      <CardHeader
        title="Bank Details"
        avatar={<Iconify icon="solar:wallet-bold" color="primary.main" width={24} />}
        action={
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Copy">
              <IconButton onClick={handleCopy}>
                <Iconify icon="solar:copy-bold" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton component={RouterLink} href={paths.dashboard.pump.edit(_id)}>
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
        <InfoItem label="Bank Name" value={bankAccount?.name} />
        <InfoItem label="Branch" value={bankAccount?.branch} />
        <InfoItem label="IFSC" value={bankAccount?.ifsc} />
        <InfoItem label="Place" value={bankAccount?.place} />
        <InfoItem label="Account No" value={bankAccount?.accNo} />
      </Stack>
    </Card>
  );
}

export default PumpFinanceWidget;
