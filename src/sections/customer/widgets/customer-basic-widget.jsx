import { toast } from 'sonner';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

function InfoItem({ label, value }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ typography: 'body2' }}>
      <Box component="span" sx={{ color: 'text.secondary', width: 140, flexShrink: 0 }}>
        {label}
      </Box>
      <Typography>{value || '-'}</Typography>
    </Stack>
  );
}

export function CustomerBasicWidget({ customer, customerId }) {
  const { customerName, address, state, pinCode, cellNo } = customer || {};

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `Customer Name: ${customerName || ''}\nAddress: ${address || ''}\nState: ${state || ''}\nPin Code: ${pinCode || ''}\nMobile: ${cellNo || ''}`
      );
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <Card>
      <CardHeader
        title="Basic Details"
        action={
          <Stack direction="row" spacing={1}>
            <IconButton color="inherit" onClick={handleCopy}>
              <Iconify icon="solar:copy-bold" />
            </IconButton>
            <IconButton
              color="inherit"
              component={RouterLink}
              href={paths.dashboard.customer.edit(customerId)}
            >
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Stack>
        }
        sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
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
