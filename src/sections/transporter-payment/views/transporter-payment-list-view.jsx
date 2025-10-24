import { useNavigate } from 'react-router';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components/router-link';

import { useFilters } from 'src/hooks/use-filters';
import { useColumnVisibility } from 'src/hooks/use-column-visibility';

import { exportToExcel, prepareDataForExport } from 'src/utils/export-to-excel';

import { DashboardContent } from 'src/layouts/dashboard';
import TransporterPaymentListPdf from 'src/pdfs/transporter-payment-list-pdf';
import {
  useDeleteTransporterPayment,
  usePaginatedTransporterPayments,
} from 'src/query/use-transporter-payment';

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

import { TABLE_COLUMNS } from '../transporter-payment-table-config';
import TransporterPaymentTableRow from '../transporter-payment-list/transporter-payment-table-row';
import TransporterPaymentTableToolbar from '../transporter-payment-list/transporter-payment-table-toolbar';
import TransporterPaymentTableFiltersResult from '../transporter-payment-list/transporter-payment-table-filters-result';

const STORAGE_KEY = 'transporter-payment-table-columns';

const defaultFilters = {
  transporterId: '',
  subtripId: '',
  paymentId: '',
  status: 'all',
  issueFromDate: null,
  issueToDate: null,
  hasTds: false,
};

export function TransporterPaymentListView() {
  const tenant = useTenantContext();
  const theme = useTheme();
  const router = useRouter();
  const navigate = useNavigate();
  const table = useTable({ defaultOrderBy: 'createDate', syncToUrl: true });
  const deleteTransporterPayment = useDeleteTransporterPayment();

  const { filters, handleFilters, handleResetFilters, canReset } = useFilters(defaultFilters);

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

  const { data, isLoading } = usePaginatedTransporterPayments({
    transporterId: filters.transporterId || undefined,
    subtripId: filters.subtripId || undefined,
    paymentId: filters.paymentId || undefined,
    status: filters.status !== 'all' ? filters.status : undefined,
    hasTds: filters.hasTds || undefined,
    issueFromDate: filters.issueFromDate || undefined,
    issueToDate: filters.issueToDate || undefined,
    page: table.page + 1,
    rowsPerPage: table.rowsPerPage,
  });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (data?.receipts) {
      setTableData(data.receipts);
    }
  }, [data]);

  const totals = data?.totals || {};
  const totalCount = totals.all?.count || 0;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: totalCount },
    { value: 'paid', label: 'Paid', color: 'success', count: totals.paid?.count || 0 },
    {
      value: 'generated',
      label: 'Generated',
      color: 'error',
      count: totals.generated?.count || 0,
    },
  ];

  const notFound = !isLoading && !tableData.length;

  const handleEditRow = (id) => {
    navigate(paths.dashboard.transporterPayment.edit(id));
  };

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.transporterPayment.details(id));
    },
    [router]
  );

  const handleDeleteRow = useCallback(
    (id) => {
      deleteTransporterPayment(id, {
        onSuccess: () => {
          setTableData((prev) => prev.filter((row) => row._id !== id));
        },
      });
    },
    [deleteTransporterPayment]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Transporter Payment List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Transporter Payment', href: paths.dashboard.transporterPayment.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.transporterPayment.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Transport Payment
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Tabs
          value={filters.status}
          onChange={(e, value) => handleFilters('status', value)}
          sx={{ px: 2.5, boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}` }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label variant={tab.value === filters.status ? 'filled' : 'soft'} color={tab.color}>
                  {tab.count}
                </Label>
              }
            />
          ))}
        </Tabs>

        <TransporterPaymentTableToolbar
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
          <TransporterPaymentTableFiltersResult
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
                <Tooltip title="Download Excel">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      const selectedRows = tableData.filter((r) => table.selected.includes(r._id));
                      const visibleCols = (columnOrder && columnOrder.length
                        ? columnOrder
                        : Object.keys(visibleColumns))
                        .filter((id) => visibleColumns[id]);
                      exportToExcel(
                        prepareDataForExport(selectedRows, TABLE_COLUMNS, visibleCols, columnOrder),
                        'Transporter-payment-selected'
                      );
                    }}
                  >
                    <Iconify icon="file-icons:microsoft-excel" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Download PDF">
                  <PDFDownloadLink
                    document={(() => {
                      const selectedRows = tableData.filter((r) =>
                        table.selected.includes(r._id)
                      );
                      const visibleCols = (columnOrder && columnOrder.length
                        ? columnOrder
                        : Object.keys(visibleColumns))
                        .filter((id) => visibleColumns[id]);
                      return (
                        <TransporterPaymentListPdf
                          payments={selectedRows}
                          visibleColumns={visibleCols}
                          tenant={tenant}
                        />
                      );
                    })()}
                    fileName="Transporter-payment-list.pdf"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {({ loading }) => (
                      <IconButton color="primary">
                        <Iconify icon={loading ? 'line-md:loading-loop' : 'eva:download-outline'} />
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
                order={table.order}
                orderBy={table.orderBy}
                headLabel={visibleHeaders}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onOrderChange={moveColumn}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row._id)
                  )
                }
              />
              <TableBody>
                {isLoading
                  ? Array.from({ length: table.rowsPerPage }).map((_, i) => (
                    <TableSkeleton key={i} />
                  ))
                  : tableData.map((row) => (
                    <TransporterPaymentTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onViewRow={() => handleViewRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
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
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </DashboardContent>
  );
}
