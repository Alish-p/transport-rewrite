import { useNavigate } from 'react-router';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { TableContainer } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components/router-link';

import { paramCase } from 'src/utils/change-case';
import { exportToExcel, prepareDataForExport } from 'src/utils/export-to-excel';

import SubtripListPdf from 'src/pdfs/subtrip-list-pdf';
import { DashboardContent } from 'src/layouts/dashboard';
import { useDeleteSubtrip, usePaginatedSubtrips } from 'src/query/use-subtrip';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { useTenantContext } from 'src/auth/tenant';

import { TABLE_COLUMNS } from '../config/table-columns';
import SubtripTableRow from '../active-list/subtrip-table-row';
import { useVisibleColumns } from '../hooks/use-visible-columns';
import SubtripTableToolbar from '../active-list/subtrip-table-toolbar';
import SubtripTableFiltersResult from '../active-list/subtrip-table-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  customerId: '',
  subtripNo: '',
  referenceSubtripNo: '',
  vehicleNo: '',
  transportName: '',
  driverId: '',
  routeId: '',
  subtripStatus: 'all',
  fromDate: null,
  toDate: null,
  subtripEndFromDate: null,
  subtripEndToDate: null,
  materials: [],
  isOwn: false,
};

// ----------------------------------------------------------------------

export function SubtripListView() {
  const theme = useTheme();
  const router = useRouter();
  const navigate = useNavigate();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const deleteSubtrip = useDeleteSubtrip();

  const [filters, setFilters] = useState(defaultFilters);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const tenant = useTenantContext();

  // Column visibility logic handled via custom hook
  const {
    visibleColumns,
    visibleHeaders,
    columnOrder,
    disabledColumns,
    toggleColumnVisibility,
    toggleAllColumnsVisibility,
    moveColumn,
    resetColumns,
    canReset: canResetColumns,
  } = useVisibleColumns();

  const [tableData, setTableData] = useState([]);

  const { data, isLoading, isFetching } = usePaginatedSubtrips({
    page: table.page + 1,
    rowsPerPage: table.rowsPerPage,
    subtripStatus: filters.subtripStatus !== 'all' ? filters.subtripStatus : undefined,
    subtripNo: filters.subtripNo || undefined,
    referenceSubtripNo: filters.referenceSubtripNo || undefined,
    transporterId: filters.transportName || undefined,
    customerId: filters.customerId || undefined,
    vehicleId: filters.vehicleNo || undefined,
    driverId: filters.driverId || undefined,
    routeId: filters.routeId || undefined,
    fromDate: filters.fromDate || undefined,
    toDate: filters.toDate || undefined,
    subtripEndFromDate: filters.subtripEndFromDate || undefined,
    subtripEndToDate: filters.subtripEndToDate || undefined,
    materials: filters.materials.length ? filters.materials : undefined,
    isOwn: filters.isOwn ? true : undefined,
  });

  useEffect(() => {
    if (data?.results) {
      setTableData(data.results);
    }
  }, [data]);

  const totalCount = data?.total || 0;
  const isCountLoading = isFetching;

  const canReset =
    !!filters.vehicleNo ||
    !!filters.subtripNo ||
    !!filters.referenceSubtripNo ||
    !!filters.customerId ||
    !!filters.driverId ||
    !!filters.routeId ||
    !!filters.transportName ||
    filters.materials.length > 0 ||
    filters.subtripStatus !== 'all' ||
    filters.isOwn ||
    (!!filters.fromDate && !!filters.toDate) ||
    (!!filters.subtripEndFromDate && !!filters.subtripEndToDate);

  const notFound = !isLoading && !tableData.length;

  const statusCounts = {
    'in-queue': data?.totalInqueue || 0,
    loaded: data?.totalLoaded || 0,
    received: data?.totalReceived || 0,
    error: data?.totalError || 0,
    billed: data?.totalBilled || 0,
  };

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: totalCount },
    {
      value: 'in-queue',
      label: 'In-queue',
      color: 'error',
      count: statusCounts['in-queue'],
    },
    {
      value: 'loaded',
      label: 'Loaded',
      color: 'success',
      count: statusCounts.loaded,
    },
    {
      value: 'received',
      label: 'Recieved',
      color: 'success',
      count: statusCounts.received,
    },
    {
      value: 'error',
      label: 'Error',
      color: 'error',
      count: statusCounts.error,
    },
    {
      value: 'billed',
      label: 'Billed',
      color: 'success',
      count: statusCounts.billed,
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
      if (name === 'transportName' && !value) {
        setSelectedTransporter(null);
      }
      if (name === 'routeId' && !value) {
        setSelectedRoute(null);
      }
    },
    [table]
  );

  const handleEditRow = (id) => {
    navigate(paths.dashboard.subtrip.edit(paramCase(id)));
  };

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

  const handleSelectTransporter = useCallback(
    (transporter) => {
      setSelectedTransporter(transporter);
      handleFilters('transportName', transporter._id);
    },
    [handleFilters]
  );

  const handleSelectRoute = useCallback(
    (route) => {
      setSelectedRoute(route);
      handleFilters('routeId', route._id);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSelectedCustomer(null);
    setSelectedVehicle(null);
    setSelectedDriver(null);
    setSelectedTransporter(null);
    setSelectedRoute(null);
  }, []);

  // Add handler for toggling column visibility
  const handleToggleColumn = useCallback(
    (columnName) => {
      toggleColumnVisibility(columnName);
    },
    [toggleColumnVisibility]
  );

  const handleToggleAllColumns = (checked) => {
    toggleAllColumnsVisibility(checked);
  };

  // Filter the table head based on visible columns and order
  const visibleTableHead = visibleHeaders;

  const getVisibleColumnsForExport = () =>
    TABLE_COLUMNS.filter((column) => visibleColumns[column.id]).map((column) => column.id);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Job List"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Job List',
          },
        ]}
        action={
          <Stack direction="row" spacing={2}>
            <Button
              component={RouterLink}
              href={paths.dashboard.subtrip.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Job
            </Button>
          </Stack>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

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
          onToggleAllColumns={handleToggleAllColumns}
          columnOrder={columnOrder}
          selectedTransporter={selectedTransporter}
          onSelectTransporter={handleSelectTransporter}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={handleSelectCustomer}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={handleSelectVehicle}
          selectedDriver={selectedDriver}
          onSelectDriver={handleSelectDriver}
          selectedRoute={selectedRoute}
          onSelectRoute={handleSelectRoute}
          onResetColumns={resetColumns}
          canResetColumns={canResetColumns}
        />

        {canReset && (
          <SubtripTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            selectedTransporterName={selectedTransporter?.transportName}
            selectedCustomerName={selectedCustomer?.customerName}
            selectedVehicleNo={selectedVehicle?.vehicleNo}
            selectedDriverName={selectedDriver?.driverName}
            selectedRouteName={
              selectedRoute ? `${selectedRoute.fromPlace} → ${selectedRoute.toPlace}` : undefined
            }
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
                <Tooltip title="Download Excel">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      const selectedRows = tableData.filter(({ _id }) =>
                        table.selected.includes(_id)
                      );
                      const selectedVisibleColumns = getVisibleColumnsForExport();
                      exportToExcel(
                        prepareDataForExport(
                          selectedRows,
                          TABLE_COLUMNS,
                          selectedVisibleColumns,
                          columnOrder
                        ),
                        'filtered'
                      );
                    }}
                  >
                    <Iconify icon="vscode-icons:file-type-excel" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Download PDF">
                  <PDFDownloadLink
                    document={(() => {
                      const selectedRows = tableData.filter(({ _id }) =>
                        table.selected.includes(_id)
                      );
                      const selectedVisibleColumns = getVisibleColumnsForExport();
                      return (
                        <SubtripListPdf
                          subtrips={selectedRows}
                          visibleColumns={selectedVisibleColumns}
                          tenant={tenant}
                        />
                      );
                    })()}
                    fileName="Job-list.pdf"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {({ loading }) => (
                      <IconButton color="primary">
                        <Iconify icon={loading ? 'line-md:loading-loop' : 'eva:download-outline'} />
                      </IconButton>
                    )}
                  </PDFDownloadLink>
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
                onOrderChange={moveColumn}
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
                        columnOrder={columnOrder}
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
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </DashboardContent>
  );
}
