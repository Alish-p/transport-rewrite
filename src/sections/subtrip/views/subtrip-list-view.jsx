import sumBy from 'lodash/sumBy';
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

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components/router-link';

import { useBoolean } from 'src/hooks/use-boolean';

import { paramCase } from 'src/utils/change-case';
import { exportToExcel } from 'src/utils/export-to-excel';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';

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

import SubtripTableRow from '../subtrip-table-row';
import SubtripAnalytic from '../widgets/subtrip-analytic';
import SubtripTableToolbar from '../subtrip-table-toolbar';
import { useDeleteSubtrip } from '../../../query/use-subtrip';
import SubtripTableFiltersResult from '../subtrip-table-filters-result';

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
  customer: '',
  subtripId: '',
  vehicleNo: '',
  transportName: '',
  subtripStatus: 'all',
  fromDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export function SubtripListView({ subtrips }) {
  const theme = useTheme();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();

  const navigate = useNavigate();
  const deleteSubtrip = useDeleteSubtrip();

  const [filters, setFilters] = useState(defaultFilters);

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

  const dateError = fIsAfter(filters.fromDate, filters.endDate);

  useEffect(() => {
    if (subtrips.length) {
      setTableData(subtrips);
    }
  }, [subtrips]);

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
    !!filters.subtripId ||
    !!filters.customer ||
    filters.subtripStatus !== 'all' ||
    (!!filters.fromDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getSubtripLength = (subtripStatus) =>
    tableData.filter((item) => item.subtripStatus === subtripStatus).length;

  const getTotalAmount = (subtripStatus) =>
    sumBy(
      tableData.filter((item) => item.subtripStatus === subtripStatus),
      'totalAmount'
    );

  const getPercentBySubtripStatus = (subtripStatus) =>
    (getSubtripLength(subtripStatus) / tableData.length) * 100;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData.length },
    { value: 'in-queue', label: 'In-queue', color: 'error', count: getSubtripLength('in-queue') },
    { value: 'loaded', label: 'Loaded', color: 'success', count: getSubtripLength('loaded') },
    { value: 'received', label: 'Recieved', color: 'success', count: getSubtripLength('received') },
    { value: 'error', label: 'Error', color: 'error', count: getSubtripLength('error') },
    { value: 'closed', label: 'Closed', color: 'success', count: getSubtripLength('closed') },
    { value: 'billed', label: 'Billed', color: 'error', count: getSubtripLength('billed') },
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
    navigate(paths.dashboard.subtrip.edit(paramCase(id)));
  };
  const handleDeleteRows = useCallback(() => {}, []);

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
            <Button
              component={RouterLink}
              href={paths.dashboard.subtrip.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Subtrip
            </Button>
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
              <SubtripAnalytic
                title="All"
                total={tableData.length}
                percent={100}
                price={sumBy(tableData, 'totalAmount')}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.info.main}
              />

              <SubtripAnalytic
                title="In-queue"
                total={getSubtripLength('in-queue')}
                percent={getPercentBySubtripStatus('in-queue')}
                price={getTotalAmount('in-queue')}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.warning.main}
              />

              <SubtripAnalytic
                title="Loaded"
                total={getSubtripLength('loaded')}
                percent={getPercentBySubtripStatus('loaded')}
                price={getTotalAmount('loaded')}
                icon="mdi:truck"
                color={theme.palette.success.main}
              />

              <SubtripAnalytic
                title="Recieved"
                total={getSubtripLength('received')}
                percent={getPercentBySubtripStatus('received')}
                price={getTotalAmount('received')}
                icon="material-symbols:call-received"
                color={theme.palette.primary.main}
              />

              <SubtripAnalytic
                title="Error"
                total={getSubtripLength('error')}
                percent={getPercentBySubtripStatus('error')}
                price={getTotalAmount('error')}
                icon="material-symbols:error-outline"
                color={theme.palette.error.main}
              />

              <SubtripAnalytic
                title="Closed"
                total={getSubtripLength('closed')}
                percent={getPercentBySubtripStatus('closed')}
                price={getTotalAmount('closed')}
                icon="zondicons:lock-closed"
                color={theme.palette.secondary.main}
              />
              <SubtripAnalytic
                title="Billed"
                total={getSubtripLength('billed')}
                percent={getPercentBySubtripStatus('billed')}
                price={getTotalAmount('billed')}
                icon="mdi:progress-tick"
                color={theme.palette.success.main}
              />
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
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.subtripStatus) && 'filled') ||
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

          <SubtripTableToolbar
            filters={filters}
            onFilters={handleFilters}
            tableData={dataFiltered}
            visibleColumns={visibleColumns}
            disabledColumns={disabledColumns}
            onToggleColumn={handleToggleColumn}
          />

          {canReset && (
            <SubtripTableFiltersResult
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
  const { vehicleNo, subtripId, customer, subtripStatus, fromDate, endDate, transportName } =
    filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (vehicleNo) {
    inputData = inputData.filter(
      (record) =>
        record.tripId &&
        record.tripId.vehicleId &&
        record.tripId.vehicleId.vehicleNo &&
        record.tripId.vehicleId.vehicleNo.toLowerCase().indexOf(vehicleNo.toLowerCase()) !== -1
    );
  }

  if (transportName) {
    inputData = inputData.filter(
      (record) =>
        record.tripId &&
        record.tripId.vehicleId &&
        record.tripId.vehicleId.transporter &&
        record.tripId.vehicleId.transporter.transportName &&
        record.tripId.vehicleId.transporter.transportName
          .toLowerCase()
          .indexOf(transportName.toLowerCase()) !== -1
    );
  }

  if (customer) {
    inputData = inputData.filter(
      (record) =>
        record.customerId &&
        record.customerId.customerName &&
        record.customerId.customerName.toLowerCase().indexOf(customer.toLowerCase()) !== -1
    );
  }
  if (subtripId) {
    inputData = inputData.filter(
      (record) => record._id && record._id.toLowerCase().indexOf(subtripId.toLowerCase()) !== -1
    );
  }

  if (subtripStatus !== 'all') {
    inputData = inputData.filter((record) => record.subtripStatus === subtripStatus);
  }

  if (!dateError) {
    if (fromDate && endDate) {
      inputData = inputData.filter((subtrip) => fIsBetween(subtrip.startDate, fromDate, endDate));
    }
  }

  return inputData;
}
