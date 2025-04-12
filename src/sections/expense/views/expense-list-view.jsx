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
import { RouterLink } from 'src/routes/components/router-link';

import { useBoolean } from 'src/hooks/use-boolean';

import { paramCase } from 'src/utils/change-case';
import { exportToExcel } from 'src/utils/export-to-excel';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { useDeleteExpense } from 'src/query/use-expense';

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

import ExpenseAnalytic from '../expense-list/expense-analytic';
import ExpenseTableRow from '../expense-list/expense-table-row';
import ExpenseTableToolbar from '../expense-list/expense-table-toolbar';
import { subtripExpenseTypes, vehicleExpenseTypes } from '../expense-config';
import ExpenseTableFiltersResult from '../expense-list/expense-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'vehicleNo', label: 'Vehicle', type: 'string' },
  { id: 'subtripId', label: 'Subtrip', type: 'string' },
  { id: 'date', label: 'Date', type: 'date' },
  { id: 'expenseType', label: 'Expense Type', type: 'string' },
  { id: 'amount', label: 'Amount', type: 'number' },
  { id: 'slipNo', label: 'Slip No', type: 'string' },
  { id: 'pumpCd', label: 'Pump Code', type: 'string' },
  { id: 'remarks', label: 'Remarks', type: 'string' },
  { id: 'dieselLtr', label: 'Diesel (Ltr)', type: 'number' },
  { id: 'paidThrough', label: 'Paid Through', type: 'string' },
  { id: 'authorisedBy', label: 'Authorised By', type: 'string' },
  { id: '' },
];

const defaultFilters = {
  vehicleNo: '',
  pump: '',
  expenseCategory: 'all',
  expenseType: 'all',
  fromDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export function ExpenseListView({ expenses }) {
  const theme = useTheme();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });
  const confirm = useBoolean();

  const navigate = useNavigate();
  const deleteExpense = useDeleteExpense();

  const [filters, setFilters] = useState(defaultFilters);

  // Add state for column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    vehicleNo: true,
    subtripId: true,
    date: true,
    expenseType: true,
    amount: true,
    slipNo: false,
    pumpCd: false,
    remarks: true,
    dieselLtr: false,
    paidThrough: true,
    authorisedBy: true,
  });

  // Define which columns should be disabled (always visible)
  const disabledColumns = useMemo(
    () => ({
      vehicleNo: true,
      subtripId: false,
      date: false,
      expenseType: false,
      amount: false,
      slipNo: false,
      pumpCd: false,
      remarks: false,
      dieselLtr: false,
      paidThrough: false,
      authorisedBy: false,
    }),
    []
  );

  const dateError = fIsAfter(filters.fromDate, filters.endDate);

  useEffect(() => {
    if (expenses.length) {
      setTableData(expenses);
    }
  }, [expenses]);

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
    !!filters.pump ||
    filters.expenseType !== 'all' ||
    (!!filters.fromDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getExpenseLength = (expenseType) =>
    tableData.filter((item) => item.expenseType === expenseType).length;

  const getTotalAmount = (expenseType) =>
    sumBy(
      tableData.filter((item) => item.expenseType === expenseType),
      'totalAmount'
    );

  const getPercentByExpenseType = (expenseType) =>
    (getExpenseLength(expenseType) / tableData.length) * 100;

  const getExpensesByCategory = (category) =>
    tableData.filter((item) => item.expenseCategory === category);

  const getTotalAmountByCategory = (category) =>
    sumBy(getExpensesByCategory(category), 'totalAmount');

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData.length },
    {
      value: 'subtrip',
      label: 'Subtrip Expenses',
      color: 'primary',
      count: tableData.filter((item) => item.expenseCategory === 'subtrip').length,
    },
    {
      value: 'vehicle',
      label: 'Vehicle Expenses',
      color: 'secondary',
      count: tableData.filter((item) => item.expenseCategory === 'vehicle').length,
    },
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
    navigate(paths.dashboard.expense.edit(paramCase(id)));
  };
  const handleDeleteRows = useCallback(() => {}, []);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.expense.details(id));
    },
    [router]
  );

  const handleFilterExpenseCategory = useCallback(
    (event, newValue) => {
      handleFilters('expenseCategory', newValue);
      handleFilters('expenseType', 'all');
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
          heading="Expense List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Expense',
              href: paths.dashboard.expense.root,
            },
            {
              name: 'Expense List',
            },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.expense.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Expense
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
              <ExpenseAnalytic
                title="All Expenses"
                total={tableData.length}
                percent={100}
                price={sumBy(tableData, 'totalAmount')}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.info.main}
              />

              <ExpenseAnalytic
                title="Subtrip Expenses"
                total={getExpensesByCategory('subtrip').length}
                percent={(getExpensesByCategory('subtrip').length / tableData.length) * 100}
                price={getTotalAmountByCategory('subtrip')}
                icon="material-symbols:route"
                color={theme.palette.primary.main}
              />

              <ExpenseAnalytic
                title="Vehicle Expenses"
                total={getExpensesByCategory('vehicle').length}
                percent={(getExpensesByCategory('vehicle').length / tableData.length) * 100}
                price={getTotalAmountByCategory('vehicle')}
                icon="mdi:truck"
                color={theme.palette.secondary.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

        {/* Table Section */}
        <Card>
          {/* filtering Tabs */}
          <Tabs
            value={filters.expenseCategory}
            onChange={handleFilterExpenseCategory}
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
                      ((tab.value === 'all' || tab.value === filters.expenseCategory) &&
                        'filled') ||
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

          <ExpenseTableToolbar
            filters={filters}
            onFilters={handleFilters}
            tableData={dataFiltered}
            subtripExpenseTypes={subtripExpenseTypes}
            vehicleExpenseTypes={vehicleExpenseTypes}
            visibleColumns={visibleColumns}
            disabledColumns={disabledColumns}
            onToggleColumn={handleToggleColumn}
          />

          {canReset && (
            <ExpenseTableFiltersResult
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
                      <ExpenseTableRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onDeleteRow={() => deleteExpense(row._id)}
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
  const { vehicleNo, pump, expenseCategory, expenseType, fromDate, endDate } = filters;

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
        record.vehicleId &&
        record.vehicleId.vehicleNo &&
        record.vehicleId.vehicleNo.toLowerCase().indexOf(vehicleNo.toLowerCase()) !== -1
    );
  }

  if (pump) {
    inputData = inputData.filter(
      (record) =>
        record.pumpCd &&
        record.pumpCd.pumpName &&
        record.pumpCd.pumpName.toLowerCase().indexOf(pump.toLowerCase()) !== -1
    );
  }

  if (expenseCategory !== 'all') {
    inputData = inputData.filter((record) => record.expenseCategory === expenseCategory);
  }

  if (expenseType !== 'all') {
    inputData = inputData.filter((record) => record.expenseType === expenseType);
  }

  if (!dateError) {
    if (fromDate && endDate) {
      inputData = inputData.filter((expense) => fIsBetween(expense.date, fromDate, endDate));
    }
  }

  return inputData;
}
