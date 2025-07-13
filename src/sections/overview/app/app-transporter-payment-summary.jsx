import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';

import { fShortenNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

export function AppTransporterPaymentSummary({ summary, ...other }) {
  const theme = useTheme();

  if (!summary) {
    return null;
  }

  const ITEMS = [
    {
      title: 'Payment yet to create amount',
      amount: summary.yetToCreateAmount,
      icon: 'mdi:clock-outline',
      color: theme.palette.warning.main,
    },
    {
      title: 'Payment generated amount',
      amount: summary.generatedAmount,
      icon: 'mdi:file-document-outline',
      color: theme.palette.info.main,
    },
    {
      title: 'Payment paid amount',
      amount: summary.paidAmount,
      icon: 'mdi:check-decagram-outline',
      color: theme.palette.success.main,
    },
  ];

  return (
    <Card {...other}>
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
    </Card>
  );
}
