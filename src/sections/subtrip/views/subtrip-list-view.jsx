import { useMemo, useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
// @mui
import { alpha, useTheme } from '@mui/material/styles';

// _mock

import { useNavigate } from 'react-router';

import { TableContainer } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components/router-link';

import { useBoolean } from 'src/hooks/use-boolean';

import { paramCase } from 'src/utils/change-case';
import { exportToExcel } from 'src/utils/export-to-excel';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import SubtripAnalytic from '../widgets/subtrip-analytic';
import SubtripTableRow from '../active-list/subtrip-table-row';
import SubtripTableToolbar from '../active-list/subtrip-table-toolbar';
import { useDeleteSubtrip, usePaginatedSubtrips } from '../../../query/use-subtrip';
import SubtripTableFiltersResult from '../active-list/subtrip-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'vehicleNo', label: 'Details', align: 'center' },
  { id: 'customerId', label: 'Customer', align: 'center' },
  { id: 'routeName', label: 'Route', align: 'center', type: 'string' },
  { id: 'invoiceNo', label: 'Invoice No', align: 'center', type: 'string' },
  { id: 'startDate', label: 'Start Date', align: 'center' },
  { id: 'transport', label: 'Transporter', align: 'center', type: 'string' },
  { id: 'subtripStatus', label: 'Subtrip Status', align: 'cen', type: 'string' },
  { id: '' },
];

const defaultFilters = {
  customerId: '',
  subtripId: '',
  vehicleNo: '',
  transportName: '',
  driverId: '',
  subtripStatus: 'all',
  fromDate: null,
  toDate: null,
  subtripEndFromDate: null,
  subtripEndToDate: null,
  materials: [],
};

// ----------------------------------------------------------------------

export function SubtripListView() {
  const theme = useTheme();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();

  const navigate = useNavigate();
  const deleteSubtrip = useDeleteSubtrip();

  const [filters, setFilters] = useState(defaultFilters);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Add state for column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    vehicleNo: true,
    customerId: true,
    routeName: true,
    invoiceNo: true,
    startDate: true,
    subtripStatus: true,
    transport: true,
  });

  // Define which columns should be disabled (always visible)
  const disabledColumns = useMemo(
    () => ({
      vehicleNo: true, // Vehicle number should always be visible
      customerId: false,
      routeName: false,
      invoiceNo: false,
      startDate: false,
      subtripStatus: false,
      transport: false,
    }),
    []
  );

  const [tableData, setTableData] = useState([]);

  const { data, isLoading, isFetching } = usePaginatedSubtrips({
    page: table.page + 1,
    rowsPerPage: table.rowsPerPage,
    subtripStatus:
      filters.subtripStatus !== 'all' ? filters.subtripStatus : undefined,
    subtripId: filters.subtripId || undefined,
    transporterId: filters.transportName || undefined,
    customerId: filters.customerId || undefined,
    vehicleId: filters.vehicleNo || undefined,
    driverId: filters.driverId || undefined,
    fromDate: filters.fromDate || undefined,
    toDate: filters.toDate || undefined,
    subtripEndFromDate: filters.subtripEndFromDate || undefined,
    subtripEndToDate: filters.subtripEndToDate || undefined,
    materials: filters.materials.length ? filters.materials : undefined,
  });

  useEffect(() => {
    if (data?.results) {
      setTableData(data.results);
    }
  }, [data]);

  const totalCount = data?.total || 0;
  const isCountLoading = isFetching;

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.vehicleNo ||
    !!filters.subtripId ||
    !!filters.customerId ||
    !!filters.driverId ||
    !!filters.transportName ||
    filters.materials.length > 0 ||
    filters.subtripStatus !== 'all' ||
    (!!filters.fromDate && !!filters.toDate) ||
    (!!filters.subtripEndFromDate && !!filters.subtripEndToDate);

  const notFound = !isLoading && !tableData.length;

  const statusCounts = {
    'in-queue': data?.totalInqueue || 0,
    loaded: data?.totalLoaded || 0,
    received: data?.totalReceived || 0,
    error: data?.totalError || 0,
    'billed-pending': data?.totalBilledPending || 0,
    'billed-overdue': data?.totalBilledOverdue || 0,
    'billed-paid': data?.totalBilledPaid || 0,
  };

  const getSubtripLength = (subtripStatus) => statusCounts[subtripStatus] || 0;


  const getPercentBySubtripStatus = (subtripStatus) =>
    (getSubtripLength(subtripStatus) / totalCount) * 100;

  const TABS = [
    {
      value: 'all',
      label: 'All',
      color: 'default',
      count: totalCount,
      icon: 'solar:bill-list-bold-duotone',
      analyticsColor: theme.palette.info.main,
    },
    {
      value: 'in-queue',
      label: 'In-queue',
      color: 'error',
      count: statusCounts['in-queue'],
      icon: 'solar:sort-by-time-bold-duotone',
      analyticsColor: theme.palette.warning.main,
    },
    {
      value: 'loaded',
      label: 'Loaded',
      color: 'success',
      count: statusCounts.loaded,
      icon: 'mdi:truck',
      analyticsColor: theme.palette.success.main,
    },
    {
      value: 'received',
      label: 'Recieved',
      color: 'success',
      count: statusCounts.received,
      icon: 'material-symbols:call-received',
      analyticsColor: theme.palette.primary.main,
    },
    {
      value: 'error',
      label: 'Error',
      color: 'error',
      count: statusCounts.error,
      icon: 'material-symbols:error-outline',
      analyticsColor: theme.palette.error.main,
    },
    {
      value: 'billed-pending',
      label: 'Billed Pending',
      color: 'warning',
      count: statusCounts['billed-pending'],
      icon: 'mdi:file-document-alert',
      analyticsColor: theme.palette.warning.main,
    },
    {
      value: 'billed-overdue',
      label: 'Billed Overdue',
      color: 'error',
      count: statusCounts['billed-overdue'],
      icon: 'mdi:file-document-alert-outline',
      analyticsColor: theme.palette.error.main,
    },
    {
      value: 'billed-paid',
      label: 'Billed Paid',
      color: 'success',
      count: statusCounts['billed-paid'],
      icon: 'mdi:check-bold',
      analyticsColor: theme.palette.success.main,
    },
  ];

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      if (name === 'customerId' && !value) {
        setSelectedCustomer(null);
      }
      if (name === 'vehicleNo' && !value) {
        setSelectedVehicle(null);
      }
      if (name === 'driverId' && !value) {
        setSelectedDriver(null);
      }
    },
    [table]
  );

  const handleEditRow = (id) => {
    navigate(paths.dashboard.subtrip.edit(paramCase(id)));
  };
  const handleDeleteRows = useCallback(() => { }, []);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.subtrip.details(id));
    },
    [router]
  );

  const handleFilterSubtripStatus = useCallback(
    (event, newValue) => {
      handleFilters('subtripStatus', newValue);
    },
    [handleFilters]
  );

  const handleSelectCustomer = useCallback(
    (customer) => {
      setSelectedCustomer(customer);
      handleFilters('customerId', customer._id);
    },
    [handleFilters]
  );

  const handleSelectVehicle = useCallback(
    (vehicle) => {
      setSelectedVehicle(vehicle);
      handleFilters('vehicleNo', vehicle._id);
    },
    [handleFilters]
  );

  const handleSelectDriver = useCallback(
    (driver) => {
      setSelectedDriver(driver);
      handleFilters('driverId', driver._id);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSelectedCustomer(null);
    setSelectedVehicle(null);
    setSelectedDriver(null);
  }, []);

  // Add handler for toggling column visibility
  const handleToggleColumn = useCallback(
    (columnName) => {
      // Don't toggle if the column is disabled
      if (disabledColumns[columnName]) return;

      setVisibleColumns((prev) => ({
        ...prev,
        [columnName]: !prev[columnName],
      }));
    },
    [disabledColumns]
  );

  // Filter the table head based on visible columns
  const visibleTableHead = TABLE_HEAD.filter(
    (column) => column.id === '' || visibleColumns[column.id]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Subtrip List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Subtrip List',
            },
          ]}
          action={
            <Stack direction="row" spacing={2}>
              <Button
                component={RouterLink}
                href={paths.dashboard.subtrip.reports}
                variant="outlined"
                startIcon={<Iconify icon="mdi:progress-tick" />}
              >
                Reports
              </Button>
              <Button
                component={RouterLink}
                href={paths.dashboard.subtrip.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New Subtrip
              </Button>
            </Stack>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        {/* Analytics Section */}
        <Card
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              {TABS.map((tab) => (
                isCountLoading ? (
                  <Stack
                    key={tab.value}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ width: 1, minWidth: 200 }}
                  >
                    <CircularProgress />
                  </Stack>
                ) : (
                  <SubtripAnalytic
                    key={tab.value}
                    title={tab.label}
                    total={tab.count}
                    percent={
                      tab.value === 'all' ? 100 : getPercentBySubtripStatus(tab.value)
                    }
                    icon={tab.icon}
                    color={tab.analyticsColor}
                  />
                )
              ))}
            </Stack>
          </Scrollbar>
        </Card>

        {/* Table Section */}
        <Card>
          {/* filtering Tabs */}
          <Tabs
            value={filters.subtripStatus}
            onChange={handleFilterSubtripStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  isCountLoading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Label
                      variant={
                        ((tab.value === 'all' || tab.value === filters.subtripStatus) && 'filled') ||
                        'soft'
                      }
                      color={tab.color}
                    >
                      {tab.count}
                    </Label>
                  )
                }
              />
            ))}
          </Tabs>

          <SubtripTableToolbar
            filters={filters}
            onFilters={handleFilters}
            tableData={tableData}
            visibleColumns={visibleColumns}
            disabledColumns={disabledColumns}
            onToggleColumn={handleToggleColumn}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={handleSelectCustomer}
            selectedVehicle={selectedVehicle}
            onSelectVehicle={handleSelectVehicle}
            selectedDriver={selectedDriver}
            onSelectDriver={handleSelectDriver}
          />

          {canReset && (
            <SubtripTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              selectedCustomerName={selectedCustomer?.customerName}
              selectedVehicleNo={selectedVehicle?.vehicleNo}
              selectedDriverName={selectedDriver?.driverName}
              results={totalCount}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row._id)
                )
              }
              action={
                <Stack direction="row">
                  <Tooltip title="Sent">
                    <IconButton color="primary">
                      <Iconify icon="iconamoon:send-fill" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        const selectedRows = tableData.filter(({ _id }) =>
                          table.selected.includes(_id)
                        );
                        exportToExcel(selectedRows, 'filtered');
                      }}
                    >
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Print">
                    <IconButton color="primary">
                      <Iconify icon="solar:printer-minimalistic-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={visibleTableHead}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row._id)
                    )
                  }
                />
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: table.rowsPerPage }).map((_, index) => (
                      <TableSkeleton key={index} />
                    ))
                  ) : (
                    <>
                      {tableData.map((row) => (
                        <SubtripTableRow
                          key={row._id}
                          row={row}
                          selected={table.selected.includes(row._id)}
                          onSelectRow={() => table.onSelectRow(row._id)}
                          onViewRow={() => handleViewRow(row._id)}
                          onEditRow={() => handleEditRow(row._id)}
                          onDeleteRow={() => deleteSubtrip(row._id)}
                          visibleColumns={visibleColumns}
                          disabledColumns={disabledColumns}
                        />
                      ))}

                      <TableNoData notFound={notFound} />
                    </>
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
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </DashboardContent>

      {/* Delete Confirmations dialogue */}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

