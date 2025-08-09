import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

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

export function CustomerAdditionalWidget({ customer }) {
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

  return (
    <Card>
      <CardHeader title="Additional Details" />
      <Stack spacing={1.5} sx={{ p: 3 }}>
        <InfoItem label="Transporter Code" value={transporterCode} />
        <InfoItem label="Invoice Prefix" value={invoicePrefix} />
        <InfoItem label="Invoice Suffix" value={invoiceSuffix} />
        <InfoItem label="Current Serial No" value={currentInvoiceSerialNumber} />
        <InfoItem label="Next Invoice No" value={nextInvoiceNumber} />
        <InfoItem label="Invoice Due (days)" value={invoiceDueInDays} />
      </Stack>
    </Card>
  );
}

export default CustomerAdditionalWidget;
