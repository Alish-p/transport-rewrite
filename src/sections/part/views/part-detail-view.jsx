import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';
import { CustomTabs } from 'src/components/custom-tabs';
import { HeroHeader } from 'src/components/hero-header-card';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useTable, TablePaginationCustom } from 'src/components/table';

import { useBoolean } from 'src/hooks/use-boolean';
import { useFilters } from 'src/hooks/use-filters';

import { fDateTime, fDateRangeShortLabel } from 'src/utils/format-time';

import { usePaginatedInventoryActivities } from 'src/query/use-inventory-activity';
import { usePaginatedPartLocations } from 'src/query/use-part-location';
import { useUsers } from 'src/query/use-user';

export function PartDetailView({ part }) {
  const {
    _id: partId,
    name,
    partNumber,
    category,
    manufacturer,
    description,
    unitCost,
    measurementUnit,
    quantity,
    inventoryLocation,
    locations: partLocations,
  } = part || {};

  const [currentTab, setCurrentTab] = useState('overview');

  const locations =
    partLocations && Array.isArray(partLocations)
      ? partLocations
      : inventoryLocation
        ? [
          {
            id: inventoryLocation.id || inventoryLocation._id || inventoryLocation.name,
            name: inventoryLocation.name,
            currentQty: quantity,
            reorderPoint: inventoryLocation.reorderPoint,
            pendingPoQty: inventoryLocation.pendingPoQty,
            workOrderQty: inventoryLocation.workOrderQty,
          },
        ]
        : [];

  return (
    <DashboardContent>
      <HeroHeader
        offsetTop={70}
        title={name || partNumber}
        status="Active"
        icon="mdi:cog-outline"
        meta={[
          { icon: 'mdi:format-list-numbered', label: partNumber },
          { icon: 'mdi:label-outline', label: category },
          { icon: 'mdi:factory', label: manufacturer },
        ]}
      />

      <Box sx={{ mt: 3 }}>
        <CustomTabs
          value={currentTab}
          onChange={(_event, value) => setCurrentTab(value)}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{ mb: 3, borderRadius: 1, boxShadow: 1 }}

        >
          <Tab value="overview" label="Overview" />
          <Tab value="inventoryActivity" label="Inventory Activity" />
          <Tab value="workOrderActivity" label="Work Order Activity" />
          <Tab value="purchaseHistory" label="Purchase History" />
        </CustomTabs>

        {currentTab === 'overview' && (
          <PartOverviewTab
            name={name}
            partNumber={partNumber}
            category={category}
            manufacturer={manufacturer}
            description={description}
            unitCost={unitCost}
            measurementUnit={measurementUnit}
            quantity={quantity}
            inventoryLocation={inventoryLocation}
            locations={locations}
          />
        )}

        {currentTab === 'inventoryActivity' && <PartInventoryActivityTab partId={partId} />}

        {currentTab === 'workOrderActivity' && <PartWorkOrderActivityTab />}

        {currentTab === 'purchaseHistory' && <PartPurchaseHistoryTab />}
      </Box>
    </DashboardContent >
  );
}

function DetailRow({ label, value, multiline }) {
  return (
    <Stack direction="row" alignItems={multiline ? 'flex-start' : 'center'} spacing={1.5}>
      <Box
        component="span"
        sx={{ color: 'text.secondary', width: 180, flexShrink: 0, typography: 'subtitle2' }}
      >
        {label}
      </Box>
      <Typography sx={{ flexGrow: 1 }}>{value || '-'}</Typography>
    </Stack>
  );
}

function PartOverviewTab({
  name,
  partNumber,
  category,
  manufacturer,
  description,
  unitCost,
  measurementUnit,
  quantity,
  inventoryLocation,
  locations = [],
}) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Part Details" />
          <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
            <DetailRow label="Part Number" value={partNumber} />
            <DetailRow label="Name" value={name} />
            <DetailRow label="Category" value={category} />
            <DetailRow label="Manufacturer" value={manufacturer} />
            <DetailRow label="Measurement Unit" value={measurementUnit} />
            <DetailRow label="Quantity" value={quantity} />
            <DetailRow
              label="Unit Cost"
              value={unitCost != null ? `₹ ${Number(unitCost).toFixed(2)}` : undefined}
            />
            <DetailRow label="Location" value={inventoryLocation?.name} />
            <DetailRow label="Description" value={description} multiline />
          </Stack>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="Locations"
          />
          <Box sx={{ p: 2.5, pb: 2 }}>
            {locations.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No locations configured for this part.
              </Typography>
            ) : (
              <Stack spacing={2.5}>
                {locations.map((location) => (
                  <LocationItem key={location.id || location.name} location={location} />
                ))}
              </Stack>
            )}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

function LocationItem({ location }) {
  const {
    name,
    currentQty,
    reorderPoint,
    pendingPoQty,
    workOrderQty,
  } = location || {};

  return (
    <Box
      sx={(theme) => ({
        p: 2.5,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Stack
        direction="row"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            color='primary.main'
          >
            {name || 'Unnamed location'}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <ButtonGroup
            variant="outlined"
            size="small"
          >
            <Tooltip title="Adjust inventory">
              <Button>
                <Iconify icon="mdi:plus-minus-variant" width={18} />
              </Button>
            </Tooltip>
            <Tooltip title="Transfer">
              <Button>
                <Iconify icon="mdi:swap-horizontal" width={18} />
              </Button>
            </Tooltip>
            <Tooltip title="Purchase">
              <Button>
                <Iconify icon="mdi:cart-outline" width={18} />
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed', mb: 2 }} />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        divider={
          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: 'none', sm: 'block' }, borderStyle: 'dashed' }}
          />
        }
        spacing={2}
      >
        <LocationMetric label="Current Qty" value={currentQty} />
        <LocationMetric label="Reorder Point" value={reorderPoint} />
        <LocationMetric label="Pending PO Qty" value={pendingPoQty} highlightPositive />
        <LocationMetric label="WO Current Qty" value={workOrderQty} highlightPositive />
      </Stack>
    </Box>
  );
}

function LocationMetric({ label, value, highlightPositive }) {
  const isNumber = typeof value === 'number';
  const displayValue = value ?? '-';

  return (
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="caption"
        sx={{
          mb: 0.5,
          display: 'inline-flex',
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{
          mt: 0.5,
          color: highlightPositive && isNumber && value > 0 ? 'success.main' : 'text.primary',
        }}
      >
        {displayValue}
      </Typography>
    </Box>
  );
}

function PartInventoryActivityTab({ partId }) {
  const defaultFilters = useMemo(
    () => ({
      fromDate: null,
      toDate: null,
      type: 'all',
      inventoryLocation: '',
      performedBy: '',
    }),
    []
  );

  const table = useTable({
    defaultOrderBy: 'activityDate',
    defaultRowsPerPage: 10,
  });

  const { filters, handleFilters, handleResetFilters, canReset } = useFilters(defaultFilters, {
    onResetPage: table.onResetPage,
  });

  const dateDialog = useBoolean();

  const { data: locationsResponse } = usePaginatedPartLocations(
    { page: 1, rowsPerPage: 1000 },
    { staleTime: 1000 * 60 * 10 }
  );

  const { data: users = [] } = useUsers();

  const locations =
    locationsResponse?.locations ||
    locationsResponse?.partLocations ||
    locationsResponse?.results ||
    [];

  const { data, isLoading } = usePaginatedInventoryActivities({
    part: partId,
    fromDate: filters.fromDate ? filters.fromDate.toISOString() : undefined,
    toDate: filters.toDate ? filters.toDate.toISOString() : undefined,
    type: filters.type === 'all' ? undefined : filters.type,
    inventoryLocation: filters.inventoryLocation || undefined,
    performedBy: filters.performedBy || undefined,
    limit: table.rowsPerPage,
    skip: table.page * table.rowsPerPage,
  });

  const activities = data?.activities || data?.results || data?.rows || [];
  const totalCount =
    data?.total || data?.count || data?.pagination?.total || (isLoading ? 0 : activities.length);

  const handleChangeStartDate = (date) => {
    handleFilters('fromDate', date);
  };

  const handleChangeEndDate = (date) => {
    handleFilters('toDate', date);
  };

  const ACTIVITY_TYPES = [
    { value: 'all', label: 'All types' },
    { value: 'INITIAL', label: 'Initial' },
    { value: 'PURCHASE_RECEIPT', label: 'Purchase Receipt' },
    { value: 'ADJUSTMENT', label: 'Adjustment' },
    { value: 'TRANSFER', label: 'Transfer' },
    { value: 'WORK_ORDER_ISSUE', label: 'Work Order Issue' },
  ];

  return (
    <Card>
      <CardHeader title="Inventory Activity" />
      <Box sx={{ p: 3 }}>
        <Stack
          spacing={2}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          direction={{ xs: 'column', md: 'row' }}
          sx={{ mb: 2 }}
        >
          <TextField
            select
            size="small"
            label="Type"
            value={filters.type}
            onChange={(event) => handleFilters('type', event.target.value)}
            sx={{ minWidth: 160 }}
          >
            {ACTIVITY_TYPES.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Location"
            value={filters.inventoryLocation}
            onChange={(event) => handleFilters('inventoryLocation', event.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All locations</MenuItem>
            {locations.map((loc) => (
              <MenuItem key={loc._id} value={loc._id}>
                {loc.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Performed By"
            value={filters.performedBy}
            onChange={(event) => handleFilters('performedBy', event.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All users</MenuItem>
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.name || user.email}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            size="small"
            startIcon={<Iconify icon="mdi:calendar" />}
            onClick={dateDialog.onTrue}
          >
            {filters.fromDate && filters.toDate
              ? fDateRangeShortLabel(filters.fromDate, filters.toDate)
              : 'Date range'}
          </Button>

          {canReset && (
            <Button
              variant="text"
              color="secondary"
              size="small"
              onClick={handleResetFilters}
              startIcon={<Iconify icon="solar:restart-bold" />}
            >
              Reset filters
            </Button>
          )}
        </Stack>

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Qty Change</TableCell>
                  <TableCell align="right">Qty After</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Performed By</TableCell>
                  <TableCell>Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!isLoading &&
                  activities.map((activity) => {
                    const qtyChange =
                      activity.quantityChange ??
                      activity.delta ??
                      activity.change ??
                      activity.quantityDelta;
                    const qtyAfter =
                      activity.quantityAfter ?? activity.newQuantity ?? activity.currentQuantity;

                    return (
                      <TableRow key={activity._id}>
                        <TableCell>
                          {activity.activityDate || activity.date || activity.createdAt
                            ? fDateTime(
                                activity.activityDate || activity.date || activity.createdAt
                              )
                            : '-'}
                        </TableCell>
                        <TableCell>{activity.type || '-'}</TableCell>
                        <TableCell align="right">
                          {typeof qtyChange === 'number' ? qtyChange : '-'}
                        </TableCell>
                        <TableCell align="right">
                          {typeof qtyAfter === 'number' ? qtyAfter : '-'}
                        </TableCell>
                        <TableCell>
                          {activity.inventoryLocation?.name || activity.locationName || '-'}
                        </TableCell>
                        <TableCell>
                          {activity.performedBy?.name ||
                            activity.performedBy?.email ||
                            activity.performedByName ||
                            '-'}
                        </TableCell>
                        <TableCell>{activity.note || activity.description || '-'}</TableCell>
                      </TableRow>
                    );
                  })}

                {!isLoading && !activities.length && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No inventory activity found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Loading inventory activity...
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={totalCount}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />

        <CustomDateRangePicker
          open={dateDialog.value}
          onClose={dateDialog.onFalse}
          startDate={filters.fromDate}
          endDate={filters.toDate}
          onChangeStartDate={handleChangeStartDate}
          onChangeEndDate={handleChangeEndDate}
        />
      </Box>
    </Card>
  );
}

function PartWorkOrderActivityTab() {
  return (
    <Card>
      <CardHeader title="Work Order Activity" />
      <Box sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Work order activity will appear here.
        </Typography>
      </Box>
    </Card>
  );
}

function PartPurchaseHistoryTab() {
  return (
    <Card>
      <CardHeader title="Purchase History" />
      <Box sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Purchase history will appear here.
        </Typography>
      </Box>
    </Card>
  );
}
