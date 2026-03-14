import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { fShortenNumber } from 'src/utils/format-number';

import { useInventoryDashboardSummary } from 'src/query/use-dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

function StatItem({ icon, label, value, color }) {
  return (
    <Stack
      spacing={0.5}
      alignItems="center"
      sx={{
        minWidth: 110,
        p: 1.5,
        borderRadius: 1.5,
        textAlign: 'center',
        transition: (t) =>
          t.transitions.create(['background-color', 'transform'], {
            duration: t.transitions.duration.shorter,
          }),
        '&:hover': {
          bgcolor: alpha(color, 0.08),
          transform: 'translateY(-2px)',
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
          color,
          bgcolor: alpha(color, 0.12),
        }}
      >
        <Iconify icon={icon} width={22} />
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Stack>
  );
}

export function AppInventorySummaryWidget({ ...other }) {
  const theme = useTheme();
  const { data, isLoading } = useInventoryDashboardSummary();

  if (isLoading || !data) return null;

  const { lowStockAlerts, totalInventoryValue, totalQuantity } = data;

  return (
    <Card {...other}>
      <CardHeader
        title="Parts & Inventory"
        subheader="Stock health and inventory value overview"
      />

      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="space-around"
        sx={{ px: 2, py: 3, gap: 2 }}
      >
        <StatItem
          icon="mdi:alert-outline"
          label="Low Stock Alerts"
          value={lowStockAlerts}
          color={lowStockAlerts > 0 ? theme.palette.error.main : theme.palette.success.main}
        />
        <StatItem
          icon="mdi:package-variant"
          label="Total Items in Stock"
          value={fShortenNumber(totalQuantity)}
          color={theme.palette.primary.main}
        />
        <StatItem
          icon="mdi:currency-inr"
          label="Inventory Value"
          value={`₹${fShortenNumber(totalInventoryValue)}`}
          color={theme.palette.success.main}
        />
      </Stack>
    </Card>
  );
}
