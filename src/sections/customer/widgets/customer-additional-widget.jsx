import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';

import { Iconify } from 'src/components/iconify';

import { InfoItem } from './info-item';

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
    <Card sx={{ borderTop: (theme) => `4px solid ${theme.palette.primary.main}`, height: 1 }}>
      <CardHeader
        title="Additional Details"
        avatar={<Iconify icon="solar:settings-bold" color="primary.main" width={24} />}
        sx={{
          '& .MuiCardHeader-avatar': { mr: 1 },
          '& .MuiCardHeader-title': { fontWeight: 'fontWeightBold' },
        }}
      />
      <Stack spacing={1.5} sx={{ p: 3 }}>
        <InfoItem label="Transporter Code" value={transporterCode} width={180} />
        <InfoItem label="Invoice Prefix" value={invoicePrefix} width={180} />
        <InfoItem label="Invoice Suffix" value={invoiceSuffix} width={180} />
        <InfoItem label="Current Serial No" value={currentInvoiceSerialNumber} width={180} />
        <InfoItem label="Next Invoice No" value={nextInvoiceNumber} width={180} />
        <InfoItem label="Invoice Due (days)" value={invoiceDueInDays} width={180} />
      </Stack>
    </Card>
  );
}

export default CustomerAdditionalWidget;
