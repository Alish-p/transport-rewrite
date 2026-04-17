import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Unstable_Grid2';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';
import { fCurrency, fShortenNumber } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import { useMaintenanceDashboard } from 'src/query/use-dashboard';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';
import { LoadingScreen } from 'src/components/loading-screen';

import { DashboardTotalWidget } from 'src/sections/overview/app/app-total-widget';

// ---- Reusable Widgets ----

function DonutWidget({ title, subheader, labels, data, colors }) {
  const chartOptions = useChart({
    colors,
    labels,
    stroke: { width: 0 },
    tooltip: {
      y: {
        formatter: (value) => fShortenNumber(value),
        title: { formatter: (seriesName) => `${seriesName}` },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            value: { formatter: (value) => fShortenNumber(value) },
            total: {
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return fShortenNumber(sum);
              },
            },
          },
        },
      },
    },
  });

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <Chart
          type="donut"
          series={data}
          options={chartOptions}
          width={{ xs: 220, xl: 240 }}
          height={{ xs: 220, xl: 240 }}
        />
      </Box>
    </Card>
  );
}

function BarWidget({
  title,
  subheader,
  categories,
  series,
  colors,
  height = 320,
  stacked = false,
  yAxisFormatter,
}) {
  const chartOptions = useChart({
    colors,
    chart: { stacked },
    xaxis: { categories },
    yaxis: yAxisFormatter ? { labels: { formatter: yAxisFormatter } } : undefined,
    tooltip: yAxisFormatter ? { y: { formatter: yAxisFormatter } } : undefined,
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '50%',
      },
    },
  });

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 3, pb: 1 }}>
        <Chart dir="ltr" type="bar" series={series} options={chartOptions} height={height} />
      </Box>
    </Card>
  );
}

function StatCard({ title, value, icon, color, subtext }) {
  const theme = useTheme();

  return (
    <Stack
      spacing={1}
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: alpha(theme.palette[color].main, 0.08),
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: `${color}.main`,
          bgcolor: alpha(theme.palette[color].main, 0.12),
        }}
      >
        <Iconify icon={icon} width={24} />
      </Box>
      <Typography variant="h5">{value}</Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {subtext && (
        <Typography variant="caption" color="text.disabled">
          {subtext}
        </Typography>
      )}
    </Stack>
  );
}

const PO_STATUS_COLOR = {
  'pending-approval': 'warning',
  approved: 'info',
  purchased: 'primary',
  'partial-received': 'secondary',
  received: 'success',
  rejected: 'error',
};

const WO_STATUS_COLOR = {
  open: 'error',
  pending: 'warning',
  completed: 'success',
};

// ---- Main View ----

export default function MaintenanceDashboardView() {
  const theme = useTheme();
  const { data, isLoading } = useMaintenanceDashboard();

  if (isLoading || !data) return <LoadingScreen />;

  const { parts, locations, purchaseOrders, workOrders, vendors, recentActivity } = data;

  // PO donut
  const poLabels = ['Pending', 'Approved', 'Purchased', 'Partial', 'Received', 'Rejected'];
  const poData = [
    purchaseOrders.statusBreakdown.pendingApproval,
    purchaseOrders.statusBreakdown.approved,
    purchaseOrders.statusBreakdown.purchased,
    purchaseOrders.statusBreakdown.partialReceived,
    purchaseOrders.statusBreakdown.received,
    purchaseOrders.statusBreakdown.rejected,
  ];
  const poColors = [
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
  ];

  // WO donut
  const woLabels = ['Open', 'Pending', 'Completed'];
  const woData = [
    workOrders.statusBreakdown.open,
    workOrders.statusBreakdown.pending,
    workOrders.statusBreakdown.completed,
  ];
  const woColors = [theme.palette.error.main, theme.palette.warning.main, theme.palette.success.main];

  // WO monthly trend bar chart
  const woMonthLabels = workOrders.monthlyTrend.map((m) => m.month);
  const woMonthSeries = [
    { name: 'Labour Cost', data: workOrders.monthlyTrend.map((m) => m.labourCost) },
    { name: 'Parts Cost', data: workOrders.monthlyTrend.map((m) => m.partsCost) },
  ];

  // WO category bar chart
  const woCatLabels = workOrders.categoryBreakdown.map((c) => c.category);
  const woCatSeries = [
    { name: 'Count', data: workOrders.categoryBreakdown.map((c) => c.count) },
  ];

  // Part category bar chart
  const partCatLabels = parts.categoryBreakdown.map((c) => c.category);
  const partCatSeries = [{ name: 'Parts', data: parts.categoryBreakdown.map((c) => c.count) }];

  // Location stock bar chart
  const locLabels = locations.stockByLocation.map((l) => l.locationName);
  const locSeries = [{ name: 'Quantity', data: locations.stockByLocation.map((l) => l.totalQuantity) }];

  return (
    <DashboardContent>
      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography variant="h4">Maintenance & Inventory Dashboard</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* ---- TOP STAT CARDS ---- */}
        <Grid xs={6} sm={4} md={2}>
          <DashboardTotalWidget
            title="Total Parts"
            total={parts.totalParts}
            color="primary"
            icon={<Iconify icon="mdi:cog-box" width={36} />}
          />
        </Grid>
        <Grid xs={6} sm={4} md={2}>
          <DashboardTotalWidget
            title="Total Stock"
            total={parts.totalStock}
            color="info"
            icon={<Iconify icon="mdi:warehouse" width={36} />}
          />
        </Grid>
        <Grid xs={6} sm={4} md={2}>
          <DashboardTotalWidget
            title="Locations"
            total={locations.totalLocations}
            color="secondary"
            icon={<Iconify icon="mdi:map-marker-multiple" width={36} />}
          />
        </Grid>
        <Grid xs={6} sm={4} md={2}>
          <DashboardTotalWidget
            title="Purchase Orders"
            total={purchaseOrders.total}
            color="warning"
            icon={<Iconify icon="mdi:clipboard-list" width={36} />}
          />
        </Grid>
        <Grid xs={6} sm={4} md={2}>
          <DashboardTotalWidget
            title="Work Orders"
            total={workOrders.total}
            color="error"
            icon={<Iconify icon="mdi:wrench" width={36} />}
          />
        </Grid>
        <Grid xs={6} sm={4} md={2}>
          <DashboardTotalWidget
            title="Vendors"
            total={vendors.totalVendors}
            color="success"
            icon={<Iconify icon="mdi:store" width={36} />}
          />
        </Grid>

        {/* ---- INVENTORY HEALTH ---- */}
        <Grid xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Inventory Health" subheader="Stock status overview" />
            <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
            <Stack spacing={2} sx={{ p: 3 }}>
              <StatCard
                title="Inventory Value"
                value={fCurrency(parts.totalInventoryValue)}
                icon="mdi:currency-inr"
                color="success"
              />
              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <StatCard
                    title="Low Stock"
                    value={parts.lowStockParts}
                    icon="mdi:alert-circle-outline"
                    color="warning"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <StatCard
                    title="Out of Stock"
                    value={parts.outOfStockParts}
                    icon="mdi:close-circle-outline"
                    color="error"
                  />
                </Box>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {/* PO Status Donut */}
        <Grid xs={12} md={6} lg={4}>
          <DonutWidget
            title="Purchase Orders"
            subheader={`Total spend: ${fCurrency(purchaseOrders.totalSpend)}`}
            labels={poLabels}
            data={poData}
            colors={poColors}
          />
        </Grid>

        {/* WO Status Donut */}
        <Grid xs={12} md={6} lg={4}>
          <DonutWidget
            title="Work Orders"
            subheader={`Maintenance cost: ${fCurrency(workOrders.totalMaintenanceCost)}`}
            labels={woLabels}
            data={woData}
            colors={woColors}
          />
        </Grid>

        {/* ---- PARTS CATEGORY ---- */}
        <Grid xs={12} md={6}>
          <BarWidget
            title="Parts by Category"
            subheader="Top categories in inventory"
            categories={partCatLabels}
            series={partCatSeries}
            colors={[theme.palette.primary.main]}
          />
        </Grid>

        {/* ---- LOCATION STOCK ---- */}
        <Grid xs={12} md={6}>
          <BarWidget
            title="Stock by Location"
            subheader="Quantity across warehouse locations"
            categories={locLabels}
            series={locSeries}
            colors={[theme.palette.info.main]}
          />
        </Grid>

        {/* ---- WO MONTHLY TREND ---- */}
        <Grid xs={12} md={6}>
          <BarWidget
            title="Maintenance Cost Trend"
            subheader="Monthly breakdown — Last 6 months"
            categories={woMonthLabels}
            series={woMonthSeries}
            colors={[theme.palette.warning.main, theme.palette.primary.main]}
            stacked
            yAxisFormatter={(value) => fShortenNumber(value)}
          />
        </Grid>

        {/* ---- WO BY CATEGORY ---- */}
        <Grid xs={12} md={6}>
          <BarWidget
            title="Work Orders by Category"
            subheader="Service type distribution"
            categories={woCatLabels}
            series={woCatSeries}
            colors={[theme.palette.error.main]}
          />
        </Grid>

        {/* ---- TOP VENDORS ---- */}
        <Grid xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Top Vendors" subheader="By total spend" />
            <TableContainer sx={{ p: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Vendor</TableCell>
                    <TableCell align="right">Orders</TableCell>
                    <TableCell align="right">Total Spend</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchaseOrders.topVendors.map((v, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                              color: 'primary.main',
                            }}
                          >
                            <Iconify icon="mdi:store-outline" width={16} />
                          </Box>
                          <Typography variant="body2">{v.vendor}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">{v.orders}</TableCell>
                      <TableCell align="right">{fCurrency(v.spend)}</TableCell>
                    </TableRow>
                  ))}
                  {purchaseOrders.topVendors.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography variant="body2" color="text.secondary">No vendors yet</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* ---- RECENT ACTIVITY ---- */}
        <Grid xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Inventory Movement" subheader="Last 30 days" />
            <Box sx={{ p: 3 }}>
              <Stack spacing={2}>
                {recentActivity.map((activity) => (
                  <Stack key={activity.type} direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.info.main, 0.08),
                        color: 'info.main',
                      }}
                    >
                      <Iconify
                        icon={
                          activity.type.includes('PURCHASE') ? 'mdi:package-variant-closed' :
                            activity.type.includes('WORK_ORDER') ? 'mdi:wrench' :
                              activity.type.includes('TRANSFER') ? 'mdi:swap-horizontal' : 'mdi:history'
                        }
                        width={22}
                      />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2">
                        {activity.type.replace(/_/g, ' ')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activity.count} transactions · {fShortenNumber(activity.totalQtyChange)} units
                      </Typography>
                    </Box>
                  </Stack>
                ))}
                {recentActivity.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No inventory activity in the last 30 days
                  </Typography>
                )}
              </Stack>
            </Box>
          </Card>
        </Grid>

        {/* ---- RECENT PURCHASE ORDERS ---- */}
        <Grid xs={12} md={6}>
          <Card>
            <CardHeader title="Recent Purchase Orders" />
            <TableContainer sx={{ p: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>PO#</TableCell>
                    <TableCell>Vendor</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchaseOrders.recentOrders.map((po) => (
                    <TableRow key={po._id}>
                      <TableCell>
                        <Typography variant="subtitle2">{po.purchaseOrderNo}</Typography>
                      </TableCell>
                      <TableCell>{po.vendor}</TableCell>
                      <TableCell>
                        <Chip label={po.status} size="small" color={PO_STATUS_COLOR[po.status] || 'default'} variant="soft" />
                      </TableCell>
                      <TableCell align="right">{fCurrency(po.total)}</TableCell>
                      <TableCell>{fDate(po.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* ---- RECENT WORK ORDERS ---- */}
        <Grid xs={12} md={6}>
          <Card>
            <CardHeader title="Recent Work Orders" />
            <TableContainer sx={{ p: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>WO#</TableCell>
                    <TableCell>Vehicle</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workOrders.recentOrders.map((wo) => (
                    <TableRow key={wo._id}>
                      <TableCell>
                        <Typography variant="subtitle2">{wo.workOrderNo}</Typography>
                      </TableCell>
                      <TableCell>{wo.vehicle}</TableCell>
                      <TableCell>{wo.category}</TableCell>
                      <TableCell>
                        <Chip label={wo.status} size="small" color={WO_STATUS_COLOR[wo.status] || 'default'} variant="soft" />
                      </TableCell>
                      <TableCell align="right">{fCurrency(wo.totalCost)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
