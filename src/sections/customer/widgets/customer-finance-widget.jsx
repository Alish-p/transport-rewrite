import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

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

export function CustomerFinanceWidget({ customer }) {
  const { bankDetails, gstEnabled, GSTNo, PANNo } = customer || {};

  return (
    <Card>
      <CardHeader title="Finance Details" />
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
