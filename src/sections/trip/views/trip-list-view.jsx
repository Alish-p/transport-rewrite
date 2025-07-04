import { useNavigate } from 'react-router';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components/router-link';

import { useBoolean } from 'src/hooks/use-boolean';

import { paramCase } from 'src/utils/change-case';
import { exportToExcel } from 'src/utils/export-to-excel';
import { fIsAfter, fTimestamp } from 'src/utils/format-time';

import { useDeleteTrip } from 'src/query/use-trip';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import TripTableRow from '../trip-table-row';
import TripTableToolbar from '../trip-table-toolbar';
import TripTableFiltersResult from '../trip-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'vehicleNo', label: 'Vehicle Number & ID' },
  { id: 'driverName', label: 'Driver Name' },
  { id: 'tripStatus', label: 'Trip Status' },
  { id: 'fromDate', label: 'From Date' },
  { id: 'toDate', label: 'To Date' },
  { id: 'remarks', label: 'Remarks' },
  { id: '' },
];

const defaultFilters = {
  tripNo: '',
  driver: '',
  vehicleNo: '',
  tripStatus: 'all',
  fromDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export function TripListView({ trips }) {
  const theme = useTheme();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();
  const deleteTrip = useDeleteTrip();

  const navigate = useNavigate();

  const [filters, setFilters] = useState(defaultFilters);

  // Add state for column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    vehicleNo: true,
    driverName: true,
    tripStatus: true,
    fromDate: true,
    toDate: true,
    remarks: true,
  });

  // Define which columns should be disabled (always visible)
  const disabledColumns = useMemo(
    () => ({
      vehicleNo: true, // Vehicle number should always be visible
      driverName: false,
      tripStatus: false,
      fromDate: false,
      toDate: false,
      remarks: false,
    }),
    []
  );

  const dateError = fIsAfter(filters.fromDate, filters.endDate);

  useEffect(() => {
    if (trips.length) {
      setTableData(trips);
    }
  }, [trips]);

  const [tableData, setTableData] = useState([]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.vehicleNo ||
    !!filters.tripNo ||
    !!filters.driver ||
    filters.tripStatus !== 'all' ||
    (!!filters.fromDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getTripLength = (tripStatus) =>
    tableData.filter((item) => item.tripStatus === tripStatus).length;


  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData.length },
    { value: 'open', label: 'Open', color: 'warning', count: getTripLength('open') },
    { value: 'closed', label: 'Closed', color: 'success', count: getTripLength('closed') },
  ];

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleEditRow = (id) => {
    navigate(paths.dashboard.trip.edit(paramCase(id)));
  };
  const handleDeleteRows = useCallback(() => {}, []);

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

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
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
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.trip.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Trip
            </Button>
          }
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
            tableData={dataFiltered}
            visibleColumns={visibleColumns}
            disabledColumns={disabledColumns}
            onToggleColumn={handleToggleColumn}
          />

          {canReset && (
            <TripTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row._id)
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
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row._id)
                    )
                  }
                />
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <TripTableRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onDeleteRow={() => deleteTrip(row._id)}
                        visibleColumns={visibleColumns}
                        disabledColumns={disabledColumns}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
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

// filtering logic
function applyFilter({ inputData, comparator, filters, dateError }) {
  const { vehicleNo, tripNo, driver, tripStatus, fromDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (driver) {
    inputData = inputData.filter(
      (record) =>
        record.driverId &&
        record.driverId.driverName &&
        record.driverId.driverName.toLowerCase().indexOf(driver.toLowerCase()) !== -1
    );
  }

  if (vehicleNo) {
    inputData = inputData.filter(
      (record) =>
        record.vehicleId &&
        record.vehicleId.vehicleNo &&
        record.vehicleId.vehicleNo.toLowerCase().indexOf(vehicleNo.toLowerCase()) !== -1
    );
  }
  if (tripNo) {
    inputData = inputData.filter(
      (record) => record._id && record._id.toLowerCase().indexOf(tripNo.toLowerCase()) !== -1
    );
  }

  if (tripStatus !== 'all') {
    inputData = inputData.filter((record) => record.tripStatus === tripStatus);
  }
  if (!dateError) {
    if (fromDate && endDate) {
      inputData = inputData.filter(
        (trip) =>
          fTimestamp(trip.fromDate) >= fTimestamp(fromDate) &&
          fTimestamp(trip.fromDate) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
