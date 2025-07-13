import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { Scrollbar } from 'src/components/scrollbar';

import { fShortenNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

export function AppInvoiceAmountSummary({ summary, ...other }) {
  const theme = useTheme();

  if (!summary) {
    return null;
  }

  const ITEMS = [
    {
      title: 'Invoice yet to bill amount',
      amount: summary.pendingAmount,
      icon: 'mdi:clock-outline',
      color: theme.palette.warning.main,
    },
    {
      title: 'Invoice generated amount',
      amount: summary.generatedAmount,
      icon: 'mdi:clipboard-list-outline',
      color: theme.palette.info.main,
    },
    {
      title: 'Invoice paid amount',
      amount: summary.paidAmount,
      icon: 'mdi:check-decagram-outline',
      color: theme.palette.success.main,
    },
  ];

  return (
    <Card {...other}>
      <CardHeader title="Invoice Summary" sx={{ mb: 2 }} />
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
