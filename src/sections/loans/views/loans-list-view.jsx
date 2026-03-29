import { useNavigate } from 'react-router';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components/router-link';

import { useFilters } from 'src/hooks/use-filters';
import { useBoolean } from 'src/hooks/use-boolean';
import { useColumnVisibility } from 'src/hooks/use-column-visibility';

import { exportToExcel, prepareDataForExport } from 'src/utils/export-to-excel';

import { DashboardContent } from 'src/layouts/dashboard';
import { useDeleteLoan, usePaginatedLoans } from 'src/query/use-loan';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { TABLE_COLUMNS } from '../loans-table-config';
import LoanTableRow from '../loans-list/loans-table-row';
import LoanTableToolbar from '../loans-list/loans-table-toolbar';
import { LOAN_STATUS, LOAN_STATUS_COLOR } from '../loans-config';
import LoanTableFiltersResult from '../loans-list/loans-table-filters-result';

const STORAGE_KEY = 'loan-table-columns';

// ----------------------------------------------------------------------

const defaultFilters = {
  loanNo: '',
  borrower: '',
  loanStatus: 'all',
  fromDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export function LoansListView() {
  const theme = useTheme();
  const router = useRouter();
  const navigate = useNavigate();

  const deleteLoan = useDeleteLoan();
  const table = useTable({ defaultOrderBy: 'createdAt', syncToUrl: true });
  const confirm = useBoolean();

  const { filters, handleFilters, handleResetFilters, canReset } = useFilters(defaultFilters, {
    onResetPage: table.onResetPage,
  });

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

  const [tableData, setTableData] = useState([]);
  const [selectAllMode, setSelectAllMode] = useState(false);

  const { data, isLoading } = usePaginatedLoans({
    loanNo: filters.loanNo || undefined,
    loanStatus: filters.loanStatus !== 'all' ? filters.loanStatus : undefined,
    fromDate: filters.fromDate || undefined,
    endDate: filters.endDate || undefined,
    page: table.page + 1,
    rowsPerPage: table.rowsPerPage,
  });

  const getVisibleColumnsForExport = () => {
    const orderedIds = (
      columnOrder && columnOrder.length ? columnOrder : Object.keys(visibleColumns)
    ).filter((id) => visibleColumns[id]);
    return orderedIds;
  };

  useEffect(() => {
    if (data?.loans) {
      setTableData(data.loans);
    }
  }, [data]);

  // Client-side borrower name filter (since server doesn't have name search on populated field)
  const filteredData = tableData.filter((row) => {
    if (!filters.borrower) return true;
    const name =
      row.borrowerType === 'Driver'
        ? row.borrowerId?.driverName
        : row.borrowerId?.transportName;
    return name && name.toLowerCase().includes(filters.borrower.toLowerCase());
  });

  const notFound = !isLoading && !filteredData.length;

  const totals = data?.totals || {};
  const totalCount = totals.all?.count || 0;

  const getStatusCount = (status) => totals[status]?.count || 0;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: totalCount },
    {
      value: LOAN_STATUS.ACTIVE,
      label: 'Active',
      color: LOAN_STATUS_COLOR[LOAN_STATUS.ACTIVE],
      count: getStatusCount(LOAN_STATUS.ACTIVE),
    },
    {
      value: LOAN_STATUS.CLOSED,
      label: 'Closed',
      color: LOAN_STATUS_COLOR[LOAN_STATUS.CLOSED],
      count: getStatusCount(LOAN_STATUS.CLOSED),
    },
  ];

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('loanStatus', newValue);
    },
    [handleFilters]
  );

  const handleEditRow = (id) => {
    navigate(paths.dashboard.loan.edit(id));
  };

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.loan.details(id));
    },
    [router]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Loans List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Loans', href: paths.dashboard.loan.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.loan.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Loan
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        {/* Table Section */}
        <Card>
          {/* Status Tabs */}
          <Tabs
            value={filters.loanStatus}
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
                      ((tab.value === 'all' || tab.value === filters.loanStatus) && 'filled') ||
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

          <LoanTableToolbar
            filters={filters}
            onFilters={handleFilters}
            visibleColumns={visibleColumns}
            disabledColumns={disabledColumns}
            onToggleColumn={toggleColumnVisibility}
            onToggleAllColumns={toggleAllColumnsVisibility}
            onResetColumns={resetColumns}
            canResetColumns={canResetColumns}
          />

          {canReset && (
            <LoanTableFiltersResult
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
              rowCount={filteredData.length}
              onSelectAllRows={(checked) => {
                if (!checked) {
                  setSelectAllMode(false);
                }
                table.onSelectAllRows(
                  checked,
                  filteredData.map((row) => row._id)
                );
              }}
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2">
                    {selectAllMode
                      ? `All ${totalCount} selected`
                      : `${table.selected.length} selected`}
                  </Typography>

                  {!selectAllMode &&
                    table.selected.length === filteredData.length &&
                    totalCount > filteredData.length && (
                      <Link
                        component="button"
                        variant="subtitle2"
                        onClick={() => {
                          setSelectAllMode(true);
                        }}
                        sx={{ ml: 1, color: 'primary.main', fontWeight: 'bold' }}
                      >
                        Select all {totalCount} loans
                      </Link>
                    )}
                </Stack>
              }
              action={
                <Stack direction="row">
                  <Tooltip title="Download Excel">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        const selectedRows = filteredData.filter((r) =>
                          table.selected.includes(r._id)
                        );
                        const visibleCols = getVisibleColumnsForExport();
                        exportToExcel(
                          prepareDataForExport(
                            selectedRows,
                            TABLE_COLUMNS,
                            visibleCols,
                            columnOrder
                          ),
                          'Loans-selected-list'
                        );
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
                  headLabel={visibleHeaders}
                  rowCount={filteredData.length}
                  numSelected={table.selected.length}
                  onOrderChange={moveColumn}
                  onSelectAllRows={(checked) => {
                    if (!checked) {
                      setSelectAllMode(false);
                    }
                    table.onSelectAllRows(
                      checked,
                      filteredData.map((row) => row._id)
                    );
                  }}
                />
                <TableBody>
                  {filteredData.map((row) => (
                    <LoanTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onViewRow={() => handleViewRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
                      onDeleteRow={() => deleteLoan(row._id)}
                      visibleColumns={visibleColumns}
                      disabledColumns={disabledColumns}
                      columnOrder={columnOrder}
                    />
                  ))}

                  <TableNoData notFound={notFound} />
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

      {/* Bulk Delete dialog */}
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
              table.selected.forEach((id) => deleteLoan(id));
              table.onSelectAllRows(false, []);
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
