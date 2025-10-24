import { useNavigate } from 'react-router';
import { PDFDownloadLink } from '@react-pdf/renderer';
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

import { useFilters } from 'src/hooks/use-filters';
import { useColumnVisibility } from 'src/hooks/use-column-visibility';

import { paramCase } from 'src/utils/change-case';
import { fShortenNumber } from 'src/utils/format-number';
import { exportToExcel, prepareDataForExport } from 'src/utils/export-to-excel';

import ExpenseListPdf from 'src/pdfs/expense-list-pdf';
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

import { useTenantContext } from 'src/auth/tenant';

import { TABLE_COLUMNS } from '../expense-table-config';
import ExpenseAnalytic from '../expense-list/expense-analytic';
import ExpenseTableRow from '../expense-list/expense-table-row';
import ExpenseTableToolbar from '../expense-list/expense-table-toolbar';
import { useSubtripExpenseTypes, useVehicleExpenseTypes } from '../expense-config';
import ExpenseTableFiltersResult from '../expense-list/expense-table-filters-result';

const STORAGE_KEY = 'expense-table-columns';

// ----------------------------------------------------------------------

const defaultFilters = {
  vehicleId: '',
  subtripId: '',
  pumpId: '',
  transporterId: '',
  routeId: '',
  tripId: '',
  expenseCategory: 'all',
  expenseType: [],
  fromDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export function ExpenseListView() {
  const tenant = useTenantContext();
  const theme = useTheme();
  const router = useRouter();
  const table = useTable({ syncToUrl: true });
  const navigate = useNavigate();
  const deleteExpense = useDeleteExpense();
  const subtripExpenseTypes = useSubtripExpenseTypes();
  const vehicleExpenseTypes = useVehicleExpenseTypes();

  const { filters, handleFilters, handleResetFilters, setFilters, canReset } = useFilters(
    defaultFilters,
    {
      onResetPage: table.onResetPage,
    }
  );

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedSubtrip, setSelectedSubtrip] = useState(null);
  const [selectedPump, setSelectedPump] = useState(null);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

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

  const { data, isLoading } = usePaginatedExpenses({
    vehicleId: filters.vehicleId || undefined,
    subtripId: filters.subtripId || undefined,
    pumpId: filters.pumpId || undefined,
    transporterId: filters.transporterId || undefined,
    routeId: filters.routeId || undefined,
    tripId: filters.tripId || undefined,
    expenseCategory: filters.expenseCategory !== 'all' ? filters.expenseCategory : undefined,
    expenseType: filters.expenseType.length ? filters.expenseType : undefined,
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

  const notFound = (!tableData.length && canReset) || !tableData.length;
  const getVisibleColumnsForExport = () => {
    const orderedIds = (
      columnOrder && columnOrder.length ? columnOrder : TABLE_COLUMNS.map((c) => c.id)
    ).filter((id) => visibleColumns[id]);
    return orderedIds;
  };

  const getPercentByCategory = (category) =>
    totalCount ? ((totals[category]?.count || 0) / totalCount) * 100 : 0;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: totalCount },
    {
      value: 'subtrip',
      label: 'Job Expenses',
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
      // Batch update to avoid race between two URL updates
      setFilters({ expenseCategory: newValue });
    },
    [setFilters]
  );

  // Clear local selected objects when filters cleared via chips/url
  useEffect(() => {
    if (!filters.vehicleId) setSelectedVehicle(null);
  }, [filters.vehicleId]);
  useEffect(() => {
    if (!filters.subtripId) setSelectedSubtrip(null);
  }, [filters.subtripId]);
  useEffect(() => {
    if (!filters.pumpId) setSelectedPump(null);
  }, [filters.pumpId]);
  useEffect(() => {
    if (!filters.transporterId) setSelectedTransporter(null);
  }, [filters.transporterId]);
  useEffect(() => {
    if (!filters.tripId) setSelectedTrip(null);
  }, [filters.tripId]);
  useEffect(() => {
    if (!filters.routeId) setSelectedRoute(null);
  }, [filters.routeId]);

  // Add handler for toggling column visibility
  const handleToggleColumn = useCallback(
    (columnName) => {
      toggleColumnVisibility(columnName);
    },
    [toggleColumnVisibility]
  );

  const handleToggleAllColumns = useCallback(
    (checked) => {
      toggleAllColumnsVisibility(checked);
    },
    [toggleAllColumnsVisibility]
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
              title="Job Expenses"
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
                    {fShortenNumber(tab.count)}
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
          onToggleAllColumns={handleToggleAllColumns}
          columnOrder={columnOrder}
          onResetColumns={resetColumns}
          canResetColumns={canResetColumns}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={(v) => {
            setSelectedVehicle(v);
            handleFilters('vehicleId', v?._id || '');
          }}
          selectedSubtrip={selectedSubtrip}
          onSelectSubtrip={(s) => {
            setSelectedSubtrip(s);
            handleFilters('subtripId', s?._id || '');
          }}
          selectedPump={selectedPump}
          onSelectPump={(p) => {
            setSelectedPump(p);
            handleFilters('pumpId', p?._id || '');
          }}
          selectedTransporter={selectedTransporter}
          onSelectTransporter={(t) => {
            setSelectedTransporter(t);
            handleFilters('transporterId', t?._id || '');
          }}
          selectedTrip={selectedTrip}
          onSelectTrip={(t) => {
            setSelectedTrip(t);
            handleFilters('tripId', t?._id || '');
          }}
          selectedRoute={selectedRoute}
          onSelectRoute={(r) => {
            setSelectedRoute(r);
            handleFilters('routeId', r?._id || '');
          }}
        />

        {canReset && (
          <ExpenseTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={() => {
              handleResetFilters();
              setSelectedVehicle(null);
              setSelectedSubtrip(null);
              setSelectedPump(null);
              setSelectedTransporter(null);
              setSelectedTrip(null);
              setSelectedRoute(null);
            }}
            results={totalCount}
            selectedVehicleNo={selectedVehicle?.vehicleNo}
            selectedSubtripNo={selectedSubtrip?.subtripNo}
            selectedPumpName={selectedPump?.name}
            selectedTransporterName={selectedTransporter?.transportName}
            selectedTripNo={selectedTrip?.tripNo}
            selectedRouteName={
              selectedRoute ? `${selectedRoute.fromPlace} → ${selectedRoute.toPlace}` : undefined
            }
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
                        'Expense-selected-list'
                      );
                    }}
                  >
                    <Iconify icon="file-icons:microsoft-excel" />
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
                        <ExpenseListPdf
                          expenses={selectedRows}
                          visibleColumns={visibleCols}
                          tenant={tenant}
                        />
                      );
                    })()}
                    fileName="Expense-list.pdf"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {({ loading }) => (
                      <IconButton color="primary">
                        <Iconify icon={loading ? 'line-md:loading-loop' : 'fa:file-pdf-o'} />
                      </IconButton>
                    )}
                  </PDFDownloadLink>
                </Tooltip>
              </Stack>
            }
          />

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                headLabel={visibleHeaders}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                onOrderChange={moveColumn}
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
                        columnOrder={columnOrder}
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
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
