import sumBy from 'lodash/sumBy';
import { useNavigate } from 'react-router';
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
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

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
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import DriverTableRow from '../driver-table-row';
import DriverTableToolbar from '../driver-table-toolbar';
import DriverAnalytics from '../widgets/driver-analytic';
import { useDeleteDriver } from '../../../query/use-driver';
import DriverTableFiltersResult from '../driver-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'driverName', label: 'Driver', align: 'center' },
  { id: 'driverCellNo', label: 'Mobile', align: 'center' },
  { id: 'permanentAddress', label: 'Address', align: 'center' },
  { id: 'experience', label: 'Experience', align: 'center' },
  { id: 'licenseTo', label: 'License Valid Till', align: 'center' },
  { id: 'aadharNo', label: 'Aadhar No', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: '' },
];

const defaultFilters = {
  driverName: '',
  driverLicenceNo: '',
  driverCellNo: '',
  status: 'all',
};

// ----------------------------------------------------------------------

export function DriverListView({ drivers }) {
  const theme = useTheme();
  const router = useRouter();
  const confirm = useBoolean();
  const navigate = useNavigate();
  const deleteDriver = useDeleteDriver();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const [filters, setFilters] = useState(defaultFilters);

  const today = new Date();

  useEffect(() => {
    if (drivers.length) {
      const statusMappedDrivers = drivers.map((driver) => {
        const licenseToDate = new Date(driver.licenseTo);
        const status = licenseToDate > today ? 'valid' : 'expired';

        return {
          ...driver,
          status,
        };
      });

      setTableData(statusMappedDrivers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drivers]);

  const [tableData, setTableData] = useState([]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.driverName ||
    !!filters.driverLicenceNo ||
    !!filters.driverCellNo ||
    filters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getDriverLength = (status) => tableData.filter((item) => item.status === status).length;

  const getTotalAmount = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      'totalAmount'
    );

  const getPercentByStatus = (status) => (getDriverLength(status) / tableData.length) * 100;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData.length },
    { value: 'valid', label: 'Valid', color: 'success', count: getDriverLength('valid') },
    { value: 'expired', label: 'Expired', color: 'error', count: getDriverLength('expired') },
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
    navigate(paths.dashboard.driver.edit(paramCase(id)));
  };
  const handleDeleteRows = useCallback(() => {}, []);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.driver.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Add state for column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    driverName: true,
    driverCellNo: true,
    permanentAddress: true,
    experience: true,
    licenseTo: true,
    aadharNo: false,
    status: true,
  });

  // Define which columns should be disabled (always visible)
  const disabledColumns = useMemo(
    () => ({
      driverName: true, // Driver name should always be visible
      driverCellNo: false,
      permanentAddress: false,
      experience: false,
      licenseTo: false,
      aadharNo: false,
      status: false,
    }),
    []
  );

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
          heading="Driver List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Driver',
              href: paths.dashboard.driver.root,
            },
            {
              name: 'Driver List',
            },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.driver.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Driver
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
              <DriverAnalytics
                title="Total"
                total={tableData.length}
                percent={100}
                price={sumBy(tableData, 'totalAmount')}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.info.main}
              />

              <DriverAnalytics
                title="Valid"
                total={getDriverLength('valid')}
                percent={getPercentByStatus('valid')}
                price={getTotalAmount('valid')}
                icon="solar:file-check-bold-duotone"
                color={theme.palette.success.main}
              />

              <DriverAnalytics
                title="Expired"
                total={getDriverLength('expired')}
                percent={getPercentByStatus('expired')}
                price={getTotalAmount('expired')}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.warning.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

        {/* Table Section */}
        <Card>
          {/* filtering Tabs */}
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
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
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <DriverTableToolbar
            filters={filters}
            onFilters={handleFilters}
            tableData={dataFiltered}
            visibleColumns={visibleColumns}
            disabledColumns={disabledColumns}
            onToggleColumn={handleToggleColumn}
          />

          {canReset && (
            <DriverTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
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
                      <DriverTableRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onDeleteRow={() => deleteDriver(row._id)}
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
function applyFilter({ inputData, comparator, filters }) {
  const { driverName, driverLicenceNo, driverCellNo, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (driverName) {
    inputData = inputData.filter(
      (record) =>
        record.driverName &&
        record.driverName.toLowerCase().indexOf(driverName.toLowerCase()) !== -1
    );
  }

  if (driverLicenceNo) {
    inputData = inputData.filter(
      (record) =>
        record.driverLicenceNo &&
        record.driverLicenceNo.toLowerCase().indexOf(driverLicenceNo.toLowerCase()) !== -1
    );
  }

  if (driverCellNo) {
    inputData = inputData.filter(
      (record) =>
        record.driverCellNo &&
        record.driverCellNo.toLowerCase().indexOf(driverCellNo.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((record) => record.status === status);
  }

  return inputData;
}
