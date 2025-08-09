import { toast } from 'sonner';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

function InfoItem({ label, value }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ typography: 'body2' }}>
      <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
        {label}
      </Box>
      <Typography>{value || '-'}</Typography>
    </Stack>
  );
}

export function CustomerAdditionalWidget({ customer, customerId }) {
  const {
    transporterCode,
    invoicePrefix,
    invoiceSuffix,
    currentInvoiceSerialNumber,
    invoiceDueInDays,
  } = customer || {};

  const nextInvoiceNumber = `${invoicePrefix || ''}${
    typeof currentInvoiceSerialNumber === 'number' ? currentInvoiceSerialNumber + 1 : ''
  }${invoiceSuffix || ''}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `Transporter Code: ${transporterCode || ''}\nInvoice Prefix: ${invoicePrefix || ''}\nInvoice Suffix: ${invoiceSuffix || ''}\nCurrent Serial No: ${currentInvoiceSerialNumber || ''}\nNext Invoice No: ${nextInvoiceNumber || ''}\nInvoice Due (days): ${invoiceDueInDays || ''}`
      );
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <Card>
      <CardHeader
        title="Additional Details"
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
        <InfoItem label="Transporter Code" value={transporterCode} />
        <InfoItem label="Invoice Prefix" value={invoicePrefix} />
        <InfoItem label="Invoice Suffix" value={invoiceSuffix} />
        <InfoItem label="Current Serial No" value={currentInvoiceSerialNumber} />
        <InfoItem label="Next Invoice No" value={<Label color="primary">{nextInvoiceNumber}</Label>} />
        <InfoItem label="Invoice Due (days)" value={invoiceDueInDays} />
      </Stack>
    </Card>
  );
}

export default CustomerAdditionalWidget;
