import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

import { fShortenNumber } from 'src/utils/format-number';
import { exportTransporterPaymentSummaryToExcel } from 'src/utils/export-transporter-payment-summary-to-excel';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

export function AppTransporterPaymentSummary({ summary, ...other }) {
  const theme = useTheme();

  if (!summary) {
    return null;
  }

  const ITEMS = [
    {
      title: 'Not Billed Amount',
      description: 'Amount for subtrips completed but payment not yet generated',
      amount: summary.pendingAmount,
      icon: 'mdi:clock-outline',
      color: theme.palette.warning.main,
    },
    {
      title: 'Payable Amount',
      description: 'Payment generated and pending to pay the transporter',
      amount: summary.payableAmount,
      icon: 'mdi:clipboard-list-outline',
      color: theme.palette.info.main,
    },
    {
      title: 'Paid Amount',
      description: 'Payment amount successfully paid to transporter',
      amount: summary.paidAmount,
      icon: 'mdi:check-decagram-outline',
      color: theme.palette.success.main,
    },
  ];

  const totalOutstanding = summary.pendingAmount + summary.payableAmount;

  return (
    <Card {...other}>
      <CardHeader
        title="Transporter Payment Summary"
        sx={{ mb: 2 }}
        action={
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Download Excel">
              <IconButton onClick={() => exportTransporterPaymentSummaryToExcel(summary)}>
                <Iconify icon="file-icons:microsoft-excel" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Breakdown of payment amounts for transporters">
              <IconButton>
                <Iconify icon="mdi:information-outline" sx={{ color: 'text.secondary' }} />
              </IconButton>
            </Tooltip>
          </Stack>
        }
      />
      <Scrollbar>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems="center"
          justifyContent="space-around"
          flexWrap="wrap"
          divider={
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderStyle: 'dashed', display: { xs: 'none', md: 'block' } }}
            />
          }
          sx={{ px: 3, py: 2, gap: 2 }}
        >
          {ITEMS.map((item) => (
            <Tooltip key={item.title} title={item.description}>
              <Stack
                spacing={1}
                alignItems="center"
                sx={{
                  minWidth: { xs: 1, md: 160 },
                  p: 2,
                  borderRadius: 2,
                  textAlign: 'center',
                  transition: (t) =>
                    t.transitions.create(['box-shadow', 'transform', 'background-color'], {
                      duration: t.transitions.duration.shorter,
                    }),
                  '&:hover': {
                    bgcolor: alpha(item.color, 0.08),
                    boxShadow: (t) => t.shadows[4],
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                    border: `1px solid ${alpha(item.color, 0.4)}`,
                    bgcolor: alpha(item.color, 0.1),
                  }}
                >
                  <Iconify icon={item.icon} width={24} />
                </Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {item.title}
                </Typography>
                <Typography variant="h6">₹ {fShortenNumber(item.amount)}</Typography>
              </Stack>
            </Tooltip>
          ))}
        </Stack>
      </Scrollbar>
      <Divider sx={{ borderStyle: 'dashed', mt: 1 }} />
      <Stack direction="row" justifyContent="flex-end" sx={{ px: 3, py: 2 }}>
        <Typography variant="subtitle2" sx={{ mr: 1 }}>
          Total Outstanding:
        </Typography>
        <Typography variant="subtitle2">{fShortenNumber(totalOutstanding)}</Typography>
      </Stack>
    </Card>
  );
}
