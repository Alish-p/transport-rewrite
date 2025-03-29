import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import { Tooltip, Divider, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components/router-link';

import { useBoolean } from 'src/hooks/use-boolean';

import { exportToExcel } from 'src/utils/export-to-excel';

import { DashboardContent } from 'src/layouts/dashboard';
import { useFilteredExpenses } from 'src/query/use-expense';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import ExpenseTableRow from '../reports/expense-table-row';
import ExpenseTableActions from '../reports/expense-table-actions';
import ExpenseQuickFilters from '../reports/expense-quick-filters';
import ExpenseTableFilterBar from '../reports/expense-table-filter-bar';
import ExpenseTableFiltersResult from '../reports/expense-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'vehicleNo', label: 'Details', align: 'center' },
  { id: 'customerId', label: 'Customer', align: 'center' },
  { id: 'expenseType', label: 'Expense Type', align: 'center', type: 'string' },
  { id: 'invoiceNo', label: 'Invoice No', align: 'center', type: 'string' },
  { id: 'date', label: 'Date', align: 'center' },
  { id: 'transport', label: 'Transporter', align: 'center', type: 'string' },
  { id: 'amount', label: 'Amount', align: 'right' },
  { id: '' },
];

const defaultFilters = {
  customerId: '',
  expenseId: '',
  vehicleNo: '',
  transportName: '',
  subtripId: '',
  tripId: '',
  pumpName: '',
  expenseCategory: '',
  expenseType: [],
  fromDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export function ExpenseReportsView() {
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();
  const router = useRouter();

  const [filters, setFilters] = useState(defaultFilters);
  const [searchParams, setSearchParams] = useState(null);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState(null);

  // Use the filtered expenses query
  const { data: tableData = [], isLoading } = useFilteredExpenses({
    ...searchParams,
  });

  const denseHeight = table.dense ? 56 : 76;

  const isFilterApplied =
    !!filters.vehicleNo ||
    !!filters.expenseId ||
    !!filters.transportName ||
    !!filters.customerId ||
    !!filters.subtripId ||
    !!filters.tripId ||
    !!filters.pumpName ||
    !!filters.expenseCategory ||
    (Array.isArray(filters.expenseType) && filters.expenseType.length > 0) ||
    (!!filters.fromDate && !!filters.endDate);

  const notFound = (!tableData.length && isFilterApplied) || !tableData.length;

  const handleFilters = (name, value) => {
    table.onResetPage();

    // If reset action, reset all filters
    if (name === 'reset') {
      setFilters(defaultFilters);
      return;
    }

    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Reset search params when any filter changes
    setSearchParams(null);
  };

  const handleSearch = () => {
    // Prepare search parameters
    const params = {
      vehicleId: filters.vehicleNo || undefined,
      expenseId: filters.expenseId || undefined,
      customerId: filters.customerId || undefined,
      fromDate: filters.fromDate || undefined,
      toDate: filters.endDate || undefined,
      transporterId: filters.transportName || undefined,
      subtripId: filters.subtripId || undefined,
      tripId: filters.tripId || undefined,
      pumpName: filters.pumpName || undefined,
      expenseCategory: filters.expenseCategory || undefined,
      expenseType: filters.expenseType?.length > 0 ? filters.expenseType : undefined,
    };

    // Remove undefined values
    Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);

    setSearchParams(params);
  };

  const handleViewRow = (id) => {
    router.push(paths.dashboard.expense.details(id));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setSearchParams(null);
  };

  const handleClearQuickFilter = () => {
    setSelectedQuickFilter(null);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Expense Report"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Expenses',
            href: paths.dashboard.expense.list,
          },
          {
            name: 'Report',
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

      <Card>
        {/* Quick Filter Chips */}
        <ExpenseQuickFilters
          onApplyFilter={handleFilters}
          onSearch={handleSearch}
          selectedFilter={selectedQuickFilter}
          onSetSelectedFilter={setSelectedQuickFilter}
        />

        <ExpenseTableFilterBar
          filters={filters}
          onFilters={handleFilters}
          tableData={tableData}
          onSearch={handleSearch}
        />

        {isFilterApplied && (
          <ExpenseTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            onClearQuickFilter={handleClearQuickFilter}
            results={tableData.length}
            sx={{ p: 2, pt: 0 }}
          />
        )}

        <Divider orientation="horizontal" flexItem />

        {/* Action Items Section */}
        <ExpenseTableActions
          tableData={tableData}
          onSearch={handleSearch}
          canSearch={isFilterApplied}
        />

        {!searchParams ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Please select filters and click search to view expense reportsdada
            </Typography>
          </Box>
        ) : (
          <>
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
                          exportToExcel(selectedRows, 'filtered-expenses');
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
                    {tableData
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
              count={tableData.length}
              page={table.page}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              dense={table.dense}
              onChangeDense={table.onChangeDense}
            />
          </>
        )}
      </Card>
    </DashboardContent>
  );
}
