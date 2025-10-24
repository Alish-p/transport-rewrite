import { useNavigate } from 'react-router';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useFilters } from 'src/hooks/use-filters';
import { useColumnVisibility } from 'src/hooks/use-column-visibility';

import { exportToExcel, prepareDataForExport } from 'src/utils/export-to-excel';

import TripListPdf from 'src/pdfs/trip-list-pdf';
import { DashboardContent } from 'src/layouts/dashboard';
import { useDeleteTrip, usePaginatedTrips } from 'src/query/use-trip';

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

import TripTableRow from '../trip-table-row';
import TripTableToolbar from '../trip-table-toolbar';
import { TABLE_COLUMNS } from '../trip-table-config';
import TripTableFiltersResult from '../trip-table-filters-result';

const STORAGE_KEY = 'trip-table-columns';

// ----------------------------------------------------------------------

const defaultFilters = {
  tripNo: '',
  driverId: '',
  vehicleId: '',
  subtripId: '',
  tripStatus: 'all',
  fromDate: null,
  toDate: null,
};

// ----------------------------------------------------------------------

export function TripListView() {
  const tenant = useTenantContext();
  const theme = useTheme();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'createDate', syncToUrl: true });
  const confirm = useBoolean();
  const deleteTrip = useDeleteTrip();

  const navigate = useNavigate();

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedSubtrip, setSelectedSubtrip] = useState(null);

  const { filters, handleFilters, handleResetFilters, canReset } = useFilters(defaultFilters, {
    onResetPage: table.onResetPage,
  });

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
  } = useColumnVisibility(TABLE_COLUMNS, STORAGE_KEY);

  const { data, isLoading } = usePaginatedTrips({
    page: table.page + 1,
    rowsPerPage: table.rowsPerPage,
    tripNo: filters.tripNo || undefined,
    driverId: filters.driverId || undefined,
    vehicleId: filters.vehicleId || undefined,
    subtripId: filters.subtripId || undefined,
    fromDate: filters.fromDate || undefined,
    toDate: filters.toDate || undefined,
    status: filters.tripStatus !== 'all' ? [filters.tripStatus] : undefined,
  });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (data?.trips) {
      setTableData(data.trips);
    }
  }, [data]);

  const totalCount = data?.total || 0;

  const notFound = (!tableData.length && canReset) || !tableData.length;

  const getVisibleColumnsForExport = () => {
    const orderedIds = (columnOrder && columnOrder.length
      ? columnOrder
      : TABLE_COLUMNS.map((c) => c.id))
      .filter((id) => visibleColumns[id]);
    return orderedIds;
  };

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: data?.total },
    { value: 'open', label: 'Open', color: 'warning', count: data?.totalOpen },
    { value: 'closed', label: 'Closed', color: 'success', count: data?.totalClosed },
  ];

  const handleEditRow = (id) => {
    navigate(paths.dashboard.trip.edit(id));
  };

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.trip.details(id));
    },
    [router]
  );

  const handleFilterTripStatus = useCallback(
    (event, newValue) => {
      handleFilters('tripStatus', newValue);
    },
    [handleFilters]
  );

  const handleResetAll = useCallback(() => {
    handleResetFilters();
    setSelectedVehicle(null);
    setSelectedDriver(null);
    setSelectedSubtrip(null);
  }, [handleResetFilters]);

  // Add handler for toggling column visibility
  const handleToggleColumn = useCallback(
    (columnName) => {
      toggleColumnVisibility(columnName);
    },
    [toggleColumnVisibility]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Trip List"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Trip',
            href: paths.dashboard.trip.root,
          },
          {
            name: 'Trip List',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* Table Section */}
      <Card>
        {/* filtering Tabs */}
        <Tabs
          value={filters.tripStatus}
          onChange={handleFilterTripStatus}
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
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filters.vehicleType) && 'filled') ||
                    'soft'
                  }
                  color={tab.color}
                >
                  {tab.count}
                </Label>
              }
            />
          ))}
        </Tabs>

        <TripTableToolbar
          filters={filters}
          onFilters={handleFilters}
          visibleColumns={visibleColumns}
          disabledColumns={disabledColumns}
          onToggleColumn={handleToggleColumn}
          onToggleAllColumns={toggleAllColumnsVisibility}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={setSelectedVehicle}
          selectedDriver={selectedDriver}
          onSelectDriver={setSelectedDriver}
          selectedSubtrip={selectedSubtrip}
          onSelectSubtrip={setSelectedSubtrip}
          onResetColumns={resetColumns}
          canResetColumns={canResetColumns}
        />

        {canReset && (
          <TripTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetAll}
            results={totalCount}
            selectedDriverName={selectedDriver?.driverName}
            selectedVehicleNo={selectedVehicle?.vehicleNo}
            selectedSubtripNo={selectedSubtrip?.subtripNo}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
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

                <Tooltip title="Download Excel">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      const selectedRows = tableData.filter(({ _id }) =>
                        table.selected.includes(_id)
                      );
                      const visibleCols = getVisibleColumnsForExport();
                      exportToExcel(
                        prepareDataForExport(selectedRows, TABLE_COLUMNS, visibleCols, columnOrder),
                        'Trips-selected'
                      );
                    }}
                  >
                    <Iconify icon="file-icons:microsoft-excel" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Print">
                  <IconButton color="primary">
                    <Iconify icon="solar:printer-minimalistic-bold" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Download PDF">
                  <PDFDownloadLink
                    document={(() => {
                      const selectedRows = tableData.filter(({ _id }) =>
                        table.selected.includes(_id)
                      );
                      const visibleCols = getVisibleColumnsForExport();
                      return (
                        <TripListPdf trips={selectedRows} visibleColumns={visibleCols} tenant={tenant} />
                      );
                    })()}
                    fileName="Trip-list.pdf"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {({ loading }) => (
                      <IconButton color="primary">
                        <Iconify icon={loading ? 'line-md:loading-loop' : 'eva:download-outline'} />
                      </IconButton>
                    )}
                  </PDFDownloadLink>
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
                headLabel={visibleHeaders}
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
                {isLoading
                  ? Array.from({ length: table.rowsPerPage }).map((_, index) => (
                    <TableSkeleton key={index} />
                  ))
                  : tableData.map((row) => (
                    <TripTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onViewRow={handleViewRow}
                      onEditRow={handleEditRow}
                      onDeleteRow={deleteTrip}
                      visibleColumns={visibleColumns}
                      disabledColumns={disabledColumns}
                      columnOrder={columnOrder}
                    />
                  ))}

                <TableNoData notFound={notFound} />
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
      </Card>
    </DashboardContent>
  );
}
