import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

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

import ExpenseTableRow from '../past-list/expense-table-row';
import ExpenseTableToolbar from '../past-list/expense-table-toolbar';
import ExpenseTableFiltersResult from '../past-list/expense-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'vehicleNo', label: 'Details', align: 'center' },
  { id: 'customerId', label: 'Customer', align: 'center' },
  { id: 'expenseType', label: 'Expense Type', align: 'center', type: 'string' },
  { id: 'invoiceNo', label: 'Invoice No', align: 'center', type: 'string' },
  { id: 'date', label: 'Date', align: 'center' },
  { id: 'transport', label: 'Transporter', align: 'center', type: 'string' },
  { id: 'amount', label: 'Amount', align: 'right' },
  { id: 'expenseStatus', label: 'Status', align: 'center', type: 'string' },
  { id: '' },
];

const defaultFilters = {
  customerId: '',
  expenseId: '',
  vehicleNo: '',
  transportName: '',
  fromDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export function ExpenseReportView() {
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();
  const router = useRouter();

  const [filters, setFilters] = useState(defaultFilters);
  const [searchParams, setSearchParams] = useState(null);

  // Add state for column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    vehicleNo: true,
    customerId: true,
    expenseType: true,
    invoiceNo: true,
    date: true,
    expenseStatus: true,
    transport: true,
    amount: true,
  });

  // Define which columns should be disabled (always visible)
  const disabledColumns = {
    vehicleNo: true,
    customerId: false,
    expenseType: false,
    invoiceNo: false,
    date: false,
    expenseStatus: false,
    transport: false,
    amount: false,
  };

  const dateError =
    filters.fromDate && filters.endDate ? filters.fromDate > filters.endDate : false;

  // Use the filtered expenses query
  const { data: tableData = [], isLoading } = useFilteredExpenses({
    ...searchParams,
  });

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.vehicleNo ||
    !!filters.expenseId ||
    !!filters.transportName ||
    !!filters.customerId ||
    (!!filters.fromDate && !!filters.endDate);

  const notFound = (!tableData.length && canReset) || !tableData.length;

  const handleFilters = (name, value) => {
    table.onResetPage();
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const handleToggleColumn = (columnName) => {
    if (disabledColumns[columnName]) return;
    setVisibleColumns((prev) => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };

  // Filter the table head based on visible columns
  const visibleTableHead = TABLE_HEAD.filter(
    (column) => column.id === '' || visibleColumns[column.id]
  );

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
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
          <ExpenseTableToolbar
            filters={filters}
            onFilters={handleFilters}
            tableData={tableData}
            onSearch={handleSearch}
            visibleColumns={visibleColumns}
            disabledColumns={disabledColumns}
            onToggleColumn={handleToggleColumn}
          />
        </Stack>

        {canReset && (
          <ExpenseTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            results={tableData.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        {!searchParams ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Please select filters and click search to view expenses
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
                  <Stack direction="row" spacing={1}>
                    <Button
                      color="error"
                      variant="contained"
                      onClick={confirm.onTrue}
                      startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                    >
                      Delete
                    </Button>

                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => {
                        const selectedRows = tableData.filter(({ _id }) =>
                          table.selected.includes(_id)
                        );
                        exportToExcel(selectedRows, 'expenses');
                      }}
                      startIcon={<Iconify icon="eva:download-outline" />}
                    >
                      Export
                    </Button>
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
