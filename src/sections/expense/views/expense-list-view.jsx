import { toast } from 'sonner';
import sumBy from 'lodash/sumBy';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useState, useEffect, useCallback } from 'react';

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
import { deleteExpense } from 'src/redux/slices/expense';

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
import ExpenseTableFiltersResult from '../expense-list/expense-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'vehicleId', label: 'Vehicle', type: 'string' },
  { id: 'date', label: 'Date', type: 'date' },
  { id: 'expenseType', label: 'Expense Type', type: 'string' },
  { id: 'amount', label: 'Amount', type: 'number' },
  { id: 'slipNo', label: 'Slip No', type: 'string' },
  { id: 'pumpCd', label: 'Pump Code', type: 'string' },
  { id: 'remarks', label: 'Remarks', type: 'string' },
  { id: 'dieselLtr', label: 'Diesel (Ltr)', type: 'number' },
  { id: 'paidThrough', label: 'Paid Through', type: 'string' },
  { id: 'authorisedBy', label: 'Authorised By', type: 'string' },
];

const defaultFilters = {
  vehicleNo: '',
  pump: '',
  expenseType: 'all',
  fromDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export function ExpenseListView({ expenses }) {
  const theme = useTheme();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [filters, setFilters] = useState(defaultFilters);

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

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData.length },
    { value: 'diesel', label: 'Diesel', color: 'primary', count: getExpenseLength('diesel') },
    { value: 'adblue', label: 'Adblue', color: 'secondary', count: getExpenseLength('adblue') },
    {
      value: 'driver-salary',
      label: 'Driver Salary',
      color: 'success',
      count: getExpenseLength('driver-salary'),
    },
    {
      value: 'trip-advance',
      label: 'Driver Advance',
      color: 'error',
      count: getExpenseLength('trip-advance'),
    },
    {
      value: 'trip-extra-advance',
      label: 'Extra Advance',
      color: 'warning',
      count: getExpenseLength('trip-extra-advance'),
    },
    {
      value: 'puncher',
      label: 'Tyre puncher',
      color: 'success',
      count: getExpenseLength('puncher'),
    },
    {
      value: 'tyre-expense',
      label: 'Tyre Expense',
      color: 'error',
      count: getExpenseLength('tyre-expense'),
    },
    { value: 'police', label: 'Police', color: 'default', count: getExpenseLength('police') },
    { value: 'rto', label: 'Rto', color: 'success', count: getExpenseLength('rto') },
    { value: 'toll', label: 'Toll', color: 'default', count: getExpenseLength('toll') },
    {
      value: 'vehicle-repair',
      label: 'Vehicle Repair',
      color: 'default',
      count: getExpenseLength('vehicle-repair'),
    },
    { value: 'other', label: 'Other', color: 'default', count: getExpenseLength('other') },
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

  const handleDeleteRow = async (id) => {
    try {
      dispatch(deleteExpense(id));
      toast.success(`Expense ${id} Deleted successfully!`);
    } catch (error) {
      console.error(error);
    }
  };

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

  const handleFilterExpenseType = useCallback(
    (event, newValue) => {
      handleFilters('expenseType', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

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
                title="All"
                total={tableData.length}
                percent={100}
                price={sumBy(tableData, 'totalAmount')}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.info.main}
              />

              <ExpenseAnalytic
                title="Diesel"
                total={getExpenseLength('diesel')}
                percent={getPercentByExpenseType('diesel')}
                price={getTotalAmount('diesel')}
                icon="lucide:fuel"
                color={theme.palette.success.main}
              />

              <ExpenseAnalytic
                title="Adblue"
                total={getExpenseLength('adblue')}
                percent={getPercentByExpenseType('adblue')}
                price={getTotalAmount('adblue')}
                icon="mdi:fossil-fuel"
                color={theme.palette.warning.main}
              />

              <ExpenseAnalytic
                title="Driver Salary"
                total={getExpenseLength('driver-salary')}
                percent={getPercentByExpenseType('driver-salary')}
                price={getTotalAmount('driver-salary')}
                icon="mynaui:rupee-circle"
                color={theme.palette.error.main}
              />
              <ExpenseAnalytic
                title="Trip Advance"
                total={getExpenseLength('trip-advance')}
                percent={getPercentByExpenseType('trip-advance')}
                price={getTotalAmount('trip-advance')}
                icon="line-md:plus-square"
                color={theme.palette.text.secondary}
              />
              <ExpenseAnalytic
                title="Extra Advance"
                total={getExpenseLength('trip-extra-advance')}
                percent={getPercentByExpenseType('trip-extra-advance')}
                price={getTotalAmount('trip-extra-advance')}
                icon="line-md:plus-square"
                color={theme.palette.primary.main}
              />
              <ExpenseAnalytic
                title="Puncture"
                total={getExpenseLength('puncher')}
                percent={getPercentByExpenseType('puncher')}
                price={getTotalAmount('puncher')}
                icon="game-icons:flat-tire"
                color={theme.palette.secondary.main}
              />
              <ExpenseAnalytic
                title="Tyre expense"
                total={getExpenseLength('tyre-expense')}
                percent={getPercentByExpenseType('tyre-expense')}
                price={getTotalAmount('tyre-expense')}
                icon="solar:wheel-bold"
                color={theme.palette.secondary.main}
              />
              <ExpenseAnalytic
                title="Police"
                total={getExpenseLength('police')}
                percent={getPercentByExpenseType('police')}
                price={getTotalAmount('police')}
                icon="ri:police-badge-line"
                color={theme.palette.common.white}
              />
              <ExpenseAnalytic
                title="Rto"
                total={getExpenseLength('rto')}
                percent={getPercentByExpenseType('rto')}
                price={getTotalAmount('rto')}
                icon="hugeicons:office"
                color={theme.palette.common.white}
              />
              <ExpenseAnalytic
                title="Toll Tax"
                total={getExpenseLength('toll')}
                percent={getPercentByExpenseType('toll')}
                price={getTotalAmount('toll')}
                icon="healthicons:paved-road"
                color="orange"
              />
              <ExpenseAnalytic
                title="Vehicle Repair"
                total={getExpenseLength('vehicle-repair')}
                percent={getPercentByExpenseType('vehicle-repair')}
                price={getTotalAmount('vehicle-repair')}
                icon="mdi:truck-alert-outline"
                color={theme.palette.common.white}
              />
              <ExpenseAnalytic
                title="other"
                total={getExpenseLength('other')}
                percent={getPercentByExpenseType('other')}
                price={getTotalAmount('other')}
                icon="basil:other-1-outline"
                color={theme.palette.common.white}
              />
            </Stack>
          </Scrollbar>
        </Card>

        {/* Table Section */}
        <Card>
          {/* filtering Tabs */}
          <Tabs
            value={filters.expenseType}
            onChange={handleFilterExpenseType}
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
                      ((tab.value === 'all' || tab.value === filters.expenseType) && 'filled') ||
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
                  headLabel={TABLE_HEAD}
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
                        onDeleteRow={() => handleDeleteRow(row._id)}
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
  const { vehicleNo, pump, expenseType, fromDate, endDate } = filters;

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
