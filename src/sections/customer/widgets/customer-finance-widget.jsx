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

export function CustomerFinanceWidget({ customer, customerId }) {
  const { bankDetails, gstEnabled, GSTNo, PANNo } = customer || {};

  const gstLabel = gstEnabled ? (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Iconify icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
      Yes
    </Stack>
  ) : (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Iconify icon="solar:close-circle-bold" sx={{ color: 'error.main' }} />
      No
    </Stack>
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `Bank Name: ${bankDetails?.name || ''}\nBranch: ${bankDetails?.branch || ''}\nIFSC: ${bankDetails?.ifsc || ''}\nPlace: ${bankDetails?.place || ''}\nAccount No: ${bankDetails?.accNo || ''}\nGST Enabled: ${gstEnabled ? 'Yes' : 'No'}\nGST No: ${GSTNo || ''}\nPAN No: ${PANNo || ''}`
      );
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <Card>
      <CardHeader
        title="Finance Details"
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
        <InfoItem label="Bank Name" value={bankDetails?.name} />
        <InfoItem label="Branch" value={bankDetails?.branch} />
        <InfoItem label="IFSC" value={bankDetails?.ifsc} />
        <InfoItem label="Place" value={bankDetails?.place} />
        <InfoItem label="Account No" value={bankDetails?.accNo} />
        <InfoItem label="GST Enabled" value={gstLabel} />
        <InfoItem label="GST No" value={GSTNo} />
        <InfoItem label="PAN No" value={PANNo} />
      </Stack>
    </Card>
  );
}

export default CustomerFinanceWidget;
