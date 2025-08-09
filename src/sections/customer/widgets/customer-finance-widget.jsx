import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';

import { Iconify } from 'src/components/iconify';

import { InfoItem } from './info-item';

export function CustomerFinanceWidget({ customer }) {
  const { bankDetails, gstEnabled, GSTNo, PANNo } = customer || {};

  return (
    <Card sx={{ borderTop: (theme) => `4px solid ${theme.palette.info.main}`, height: 1 }}>
      <CardHeader
        title="Finance Details"
        avatar={<Iconify icon="solar:wallet-bold" color="info.main" width={24} />}
        sx={{
          '& .MuiCardHeader-avatar': { mr: 1 },
          '& .MuiCardHeader-title': { fontWeight: 'fontWeightBold' },
        }}
      />
      <Stack spacing={1.5} sx={{ p: 3 }}>
        <InfoItem label="Bank Name" value={bankDetails?.name} />
        <InfoItem label="Branch" value={bankDetails?.branch} />
        <InfoItem label="IFSC" value={bankDetails?.ifsc} />
        <InfoItem label="Place" value={bankDetails?.place} />
        <InfoItem label="Account No" value={bankDetails?.accNo} />
        <InfoItem label="GST Enabled" value={gstEnabled ? 'Yes' : 'No'} />
        <InfoItem label="GST No" value={GSTNo} />
        <InfoItem label="PAN No" value={PANNo} />
      </Stack>
    </Card>
  );
}

export default CustomerFinanceWidget;
