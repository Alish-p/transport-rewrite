import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fShortenNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

export function AppTransporterPaymentSummary({ summary, ...other }) {
  const theme = useTheme();

  if (!summary) {
    return null;
  }

  const ITEMS = [
    {
      title: 'Not Billed amount',
      amount: summary.yetToCreateAmount,
      icon: 'mdi:clock-outline',
      color: theme.palette.warning.main,
    },
    {
      title: 'Payable amount',
      amount: summary.generatedAmount,
      icon: 'mdi:file-document-outline',
      color: theme.palette.info.main,
    },
    {
      title: 'Paid amount',
      amount: summary.paidAmount,
      icon: 'mdi:check-decagram-outline',
      color: theme.palette.success.main,
    },
  ];

  return (
    <Card {...other}>
      <CardHeader title="Transporter Payment summary" sx={{ mb: 2 }} />
      <Scrollbar>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-around"
          divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
          sx={{ px: 3, py: 2 }}
        >
          {ITEMS.map((item) => (
            <Stack key={item.title} spacing={1} alignItems="center" sx={{ minWidth: 120 }}>
              <Iconify icon={item.icon} width={24} sx={{ color: item.color }} />
              <Box sx={{ typography: 'subtitle2', color: 'text.secondary', textAlign: 'center' }}>
                {item.title}
              </Box>
              <Box sx={{ typography: 'h6' }}>₹ {fShortenNumber(item.amount)}</Box>
            </Stack>
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}
