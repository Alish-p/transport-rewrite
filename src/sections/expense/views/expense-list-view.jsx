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
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components/router-link';

import { useBoolean } from 'src/hooks/use-boolean';

import { paramCase } from 'src/utils/change-case';
import { exportToExcel } from 'src/utils/export-to-excel';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { useDeleteExpense, usePaginatedExpenses } from 'src/query/use-expense';

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

import { TABLE_COLUMNS } from '../config/table-columns';
import ExpenseAnalytic from '../expense-list/expense-analytic';
import ExpenseTableRow from '../expense-list/expense-table-row';
import { useVisibleColumns } from '../hooks/use-visible-columns';
import ExpenseTableToolbar from '../expense-list/expense-table-toolbar';
import { subtripExpenseTypes, vehicleExpenseTypes } from '../expense-config';
import ExpenseTableFiltersResult from '../expense-list/expense-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  ...TABLE_COLUMNS.map(({ id, label, type, align }) => ({
    id,
    label,
    type,
    align,
  })),
  { id: '' },
];

const defaultFilters = {
  vehicleNo: '',
  pump: '',
  transporter: '',
  tripId: '',
  expenseCategory: 'all',
  expenseType: 'all',
  fromDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export function ExpenseListView() {
  const theme = useTheme();
  const router = useRouter();
  const table = useTable({});
  const confirm = useBoolean();

  const navigate = useNavigate();
  const deleteExpense = useDeleteExpense();

  const [filters, setFilters] = useState(defaultFilters);

  // Column visibility state handled via custom hook
  const { visibleColumns, disabledColumns, toggleColumnVisibility } = useVisibleColumns();

  const dateError = fIsAfter(filters.fromDate, filters.endDate);

  const { data, isLoading } = usePaginatedExpenses({
    vehicleNo: filters.vehicleNo || undefined,
    pump: filters.pump || undefined,
    transporter: filters.transporter || undefined,
    tripId: filters.tripId || undefined,
    expenseCategory: filters.expenseCategory !== 'all' ? filters.expenseCategory : undefined,
    expenseType: filters.expenseType !== 'all' ? filters.expenseType : undefined,
    startDate: filters.fromDate || undefined,
    endDate: filters.endDate || undefined,
    page: table.page + 1,
    rowsPerPage: table.rowsPerPage,
  });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (data?.expenses) {
      setTableData(data.expenses);
    }
  }, [data]);

  const totals = data?.totals || {};
  const totalCount = totals.all?.count || 0;

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.vehicleNo ||
    !!filters.pump ||
    !!filters.transporter ||
    !!filters.tripId ||
    filters.expenseType !== 'all' ||
    (!!filters.fromDate && !!filters.endDate);

  const notFound = (!tableData.length && canReset) || !tableData.length;

  const getPercentByCategory = (category) =>
    totalCount ? ((totals[category]?.count || 0) / totalCount) * 100 : 0;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: totalCount },
    {
      value: 'subtrip',
      label: 'Subtrip Expenses',
      color: 'primary',
      count: totals.subtrip?.count || 0,
    },
    {
      value: 'vehicle',
      label: 'Vehicle Expenses',
      color: 'secondary',
      count: totals.vehicle?.count || 0,
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
      toggleColumnVisibility(columnName);
    },
    [toggleColumnVisibility]
  );

  // Filter the table head based on visible columns
  const visibleTableHead = TABLE_HEAD.filter(
    (column) => column.id === '' || visibleColumns[column.id]
  );

  return (
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
              total={totalCount}
              percent={100}
              price={totals.all?.amount || 0}
              icon="solar:bill-list-bold-duotone"
              color={theme.palette.info.main}
              loading={isLoading}
            />

            <ExpenseAnalytic
              title="Subtrip Expenses"
              total={totals.subtrip?.count || 0}
              percent={getPercentByCategory('subtrip')}
              price={totals.subtrip?.amount || 0}
              icon="material-symbols:route"
              color={theme.palette.primary.main}
              loading={isLoading}
            />

            <ExpenseAnalytic
              title="Vehicle Expenses"
              total={totals.vehicle?.count || 0}
              percent={getPercentByCategory('vehicle')}
              price={totals.vehicle?.amount || 0}
              icon="mdi:truck"
              color={theme.palette.secondary.main}
              loading={isLoading}
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
                isLoading ? (
                  <CircularProgress size={16} />
                ) : (
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
                )
              }
            />
          ))}
        </Tabs>

        <ExpenseTableToolbar
          filters={filters}
          onFilters={handleFilters}
          tableData={tableData}
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
              </Stack>
            }
          />

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                headLabel={visibleTableHead}
                rowCount={tableData.length}
                numSelected={table.selected.length}
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
  );
}

// ----------------------------------------------------------------------

// filtering logic
function applyFilter({ inputData, comparator, filters, dateError }) {
  const { vehicleNo, pump, transporter, tripId, expenseCategory, expenseType, fromDate, endDate } =
    filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (vehicleNo) {
    const vehicleNoLower = vehicleNo.toLowerCase();
    inputData = inputData.filter((record) => {
      const recordVehicleNo = record.vehicleId?.vehicleNo || record.vehicleNo || '';
      return recordVehicleNo.toLowerCase().includes(vehicleNoLower);
    });
  }

  if (pump) {
    inputData = inputData.filter(
      (record) =>
        record.pumpCd &&
        record.pumpCd.pumpName &&
        record.pumpCd.pumpName.toLowerCase().indexOf(pump.toLowerCase()) !== -1
    );
  }

  if (transporter) {
    inputData = inputData.filter(
      (record) =>
        record.tripId &&
        record.tripId.vehicleId &&
        record.tripId.vehicleId.transporter &&
        record.tripId.vehicleId.transporter.transportName &&
        record.tripId.vehicleId.transporter.transportName
          .toLowerCase()
          .indexOf(transporter.toLowerCase()) !== -1
    );
  }

  if (tripId) {
    inputData = inputData.filter(
      (record) =>
        record.tripId &&
        record.tripId._id &&
        record.tripId._id.toLowerCase().indexOf(tripId.toLowerCase()) !== -1
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
