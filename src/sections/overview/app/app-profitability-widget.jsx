import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { alpha, useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CircularProgress from '@mui/material/CircularProgress';

import { fShortenNumber } from 'src/utils/format-number';

import { useMonthlyProfitability } from 'src/query/use-dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function AppProfitabilityWidget({ ...other }) {
  const theme = useTheme();
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  const monthParam = useMemo(() => selectedMonth?.format('YYYY-MM'), [selectedMonth]);

  const { data, isLoading } = useMonthlyProfitability(monthParam);

  const own = data?.own || { subtripCount: 0, totalFreight: 0, totalExpenses: 0, profit: 0 };
  const market = data?.market || { subtripCount: 0, totalLoadingWeight: 0, totalCommission: 0 };

  const totalIncome = own.profit + market.totalCommission;
  const totalSubtrips = own.subtripCount + market.subtripCount;

  const highlights = [
    {
      label: 'Net income',
      value: `₹ ${fShortenNumber(totalIncome)}`,
      color: totalIncome >= 0 ? theme.palette.success.main : theme.palette.error.main,
      icon: totalIncome >= 0 ? 'mdi:trending-up' : 'mdi:trending-down',
    },
    {
      label: 'Own profit',
      value: `₹ ${fShortenNumber(own.profit)}`,
      color: own.profit >= 0 ? theme.palette.primary.main : theme.palette.error.main,
      icon: 'mdi:truck-check-outline',
    },
    {
      label: 'Market commission',
      value: `₹ ${fShortenNumber(market.totalCommission)}`,
      color: theme.palette.secondary.main,
      icon: 'mdi:hand-coin-outline',
    },
  ];

  return (
    <Card {...other}>
      <CardHeader
        title="Profitability Overview"
        subheader={selectedMonth.format('MMMM YYYY')}
        action={
          <DatePicker
            label="Select month"
            views={['year', 'month']}
            openTo="month"
            value={selectedMonth}
            onChange={(value) => value && setSelectedMonth(value)}
            disableFuture
            slotProps={{
              textField: {
                size: 'small',
                sx: { minWidth: 140 },
              },
            }}
          />
        }
      />

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={3} sx={{ px: 3, pb: 3 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.03),
              border: `1px dashed ${alpha(theme.palette.primary.main, 0.18)}`,
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Monthly snapshot
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.5 }}>
                  ₹ {fShortenNumber(totalIncome)}
                </Typography>
              </Box>

              <Chip
                size="small"
                icon={<Iconify icon="mdi:truck-fast-outline" width={16} />}
                label={`${totalSubtrips} billed subtrips`}
                sx={{
                  height: 28,
                  fontWeight: 600,
                  color: 'text.secondary',
                  bgcolor: 'background.paper',
                  border: `1px solid ${theme.vars?.palette?.divider || theme.palette.divider}`,
                }}
              />
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gap: 1.5,
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
              }}
            >
              {highlights.map((item) => (
                <HighlightItem
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  color={item.color}
                  icon={item.icon}
                />
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
            }}
          >
            <SectionCard
              title="Own vehicle"
              color={theme.palette.primary.main}
              icon="mdi:truck-check-outline"
              footerLabel="Net profit"
              footerValue={`₹ ${fShortenNumber(own.profit)}`}
              footerColor={own.profit >= 0 ? theme.palette.success.main : theme.palette.error.main}
              metrics={[
                { label: 'Billed subtrips', value: own.subtripCount },
                { label: 'Freight', value: `₹ ${fShortenNumber(own.totalFreight)}` },
                { label: 'Expenses', value: `₹ ${fShortenNumber(own.totalExpenses)}` },
              ]}
            />

            <SectionCard
              title="Market vehicle"
              color={theme.palette.secondary.main}
              icon="mdi:truck-outline"
              footerLabel="Commission"
              footerValue={`₹ ${fShortenNumber(market.totalCommission)}`}
              footerColor={theme.palette.secondary.main}
              metrics={[
                { label: 'Billed subtrips', value: market.subtripCount },
                { label: 'Weight moved', value: `${fShortenNumber(market.totalLoadingWeight)} MT` },
                { label: 'Contribution', value: `₹ ${fShortenNumber(market.totalCommission)}` },
              ]}
            />
          </Box>
        </Stack>
      )}
    </Card>
  );
}

// ----------------------------------------------------------------------

function HighlightItem({ icon, label, value, color }) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor: alpha(color, 0.08),
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          bgcolor: alpha(color, 0.14),
        }}
      >
        <Iconify icon={icon} width={18} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {label}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

function SectionCard({ title, color, icon, metrics, footerLabel, footerValue, footerColor }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${theme.vars?.palette?.divider || theme.palette.divider}`,
        bgcolor: 'background.neutral',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 2 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            bgcolor: alpha(color, 0.12),
          }}
        >
          <Iconify icon={icon} width={20} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2">{title}</Typography>
          <Typography variant="caption" color="text.secondary">
            Monthly performance breakdown
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={1.25}>
        {metrics.map((item, index) => (
          <Box key={item.label}>
            {!!index && <Divider sx={{ borderStyle: 'dashed', mb: 1.25 }} />}
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="subtitle2">{item.value}</Typography>
            </Stack>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ borderStyle: 'dashed', my: 1.5 }} />

      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Typography variant="subtitle2">{footerLabel}</Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: footerColor }}>
          {footerValue}
        </Typography>
      </Stack>
    </Box>
  );
}
