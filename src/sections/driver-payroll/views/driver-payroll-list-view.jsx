import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
// @mui
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

// _mock

import { useNavigate } from 'react-router';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components/router-link';

import { useBoolean } from 'src/hooks/use-boolean';

import { paramCase } from 'src/utils/change-case';
import { exportToExcel } from 'src/utils/export-to-excel';
import { fIsAfter, fTimestamp } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { useDeleteDriverPayroll } from 'src/query/use-driver-payroll';

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

import DriverPayrollTableRow from '../driver-payroll-list/driver-payroll-table-row';
import DriverPayrollTableToolbar from '../driver-payroll-list/driver-payroll-table-toolbar';
import DriverPayrollTableFiltersResult from '../driver-payroll-list/driver-payroll-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '_id', label: '#' },
  { id: 'driver', label: 'Driver' },
  { id: 'createdDate', label: 'Created Date' },
  { id: 'amount', label: 'Amount' },
  { id: 'duration', label: 'Duration' },
  { id: '', label: '' },
];

const defaultFilters = {
  driver: '',
  subtrip: '',
  fromDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export function DriverPayrollListView({ driversPayrolls }) {
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'createDate', syncToUrl: true });
  const confirm = useBoolean();

  const navigate = useNavigate();

  const deleteDriverPayroll = useDeleteDriverPayroll();

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = fIsAfter(filters.fromDate, filters.endDate);

  useEffect(() => {
    if (driversPayrolls.length) {
      setTableData(driversPayrolls);
    }
  }, [driversPayrolls]);

  const [tableData, setTableData] = useState([]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.driver || !!filters.subtrip || (!!filters.fromDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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
    navigate(paths.dashboard.driverSalary.edit(paramCase(id)));
  };

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.driverSalary.details(id));
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Payslip List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Driver Salary',
              href: paths.dashboard.driverSalary.root,
            },
            {
              name: 'List',
            },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.driverSalary.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Payslip
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        {/* Table Section */}
        <Card>
          <DriverPayrollTableToolbar
            filters={filters}
            onFilters={handleFilters}
            tableData={dataFiltered}
          />

          {canReset && (
            <DriverPayrollTableFiltersResult
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
                  <Tooltip title="Download Excel">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        const selectedRows = tableData.filter(({ _id }) =>
                          table.selected.includes(_id)
                        );
                        exportToExcel(selectedRows, 'filtered');
                      }}
                    >
                      <Iconify icon="file-icons:microsoft-excel" />
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
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
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
                      <DriverPayrollTableRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onDeleteRow={() => deleteDriverPayroll(row._id)}
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
              // handleDeleteRows();
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
  const { driver, subtrip, invoiceStatus, fromDate, endDate } = filters;

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
        record.driverId.driverName.toLowerCase().indexOf(driver.toLowerCase()) !== -1
    );
  }
  if (subtrip) {
    inputData = inputData.filter(
      (record) => record.subtrips && record.subtrips.some((st) => st._id === subtrip)
    );
  }

  if (invoiceStatus !== 'all') {
    inputData = inputData.filter((record) => record.invoiceStatus === invoiceStatus);
  }
  if (!dateError) {
    if (fromDate && endDate) {
      inputData = inputData.filter(
        (Invoice) =>
          fTimestamp(Invoice.date) >= fTimestamp(fromDate) &&
          fTimestamp(Invoice.date) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
