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

export function CustomerBasicWidget({ customer }) {
  const { customerName, address, state, pinCode, cellNo } = customer || {};

  return (
    <Card>
      <CardHeader title="Basic Details" />
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
