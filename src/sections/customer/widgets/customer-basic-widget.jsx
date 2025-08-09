import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';

import { Iconify } from 'src/components/iconify';

import { InfoItem } from './info-item';

export function CustomerBasicWidget({ customer }) {
  const { customerName, address, state, pinCode, cellNo } = customer || {};

  return (
    <Card sx={{ borderTop: (theme) => `4px solid ${theme.palette.primary.main}`, height: 1 }}>
      <CardHeader
        title="Basic Details"
        avatar={<Iconify icon="solar:user-bold" color="primary.main" width={24} />}
        sx={{
          '& .MuiCardHeader-avatar': { mr: 1 },
          '& .MuiCardHeader-title': { fontWeight: 'fontWeightBold' },
        }}
      />
      <Stack spacing={1.5} sx={{ p: 3 }}>
        <InfoItem label="Customer Name" value={customerName} />
        <InfoItem label="Address" value={address} />
        <InfoItem label="State" value={state} />
        <InfoItem label="Pin Code" value={pinCode} />
        <InfoItem label="Mobile" value={cellNo} />
      </Stack>
    </Card>
  );
}

export default CustomerBasicWidget;
