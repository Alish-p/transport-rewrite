import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

// _mock

import { useNavigate } from 'react-router';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components/router-link';

import { useBoolean } from 'src/hooks/use-boolean';

import { fIsAfter } from 'src/utils/format-time';
import { exportToExcel } from 'src/utils/export-to-excel';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useDeleteTransporterPayment,
  usePaginatedTransporterPayments,
} from 'src/query/use-transporter-payment';

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

import TransporterPaymentTableRow from '../transporter-payment-list/transporter-payment-table-row';
import TransporterPaymentTableToolbar from '../transporter-payment-list/transporter-payment-table-toolbar';
import TransporterPaymentTableFiltersResult from '../transporter-payment-list/transporter-payment-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '_id', label: '#' },
  { id: 'transporter', label: 'Transporter' },
  { id: 'status', label: 'Status' },
  { id: 'createdDate', label: 'Created Date' },
  { id: 'amount', label: 'Amount' },
  { id: '', label: '' },
];

const defaultFilters = {
  transporterId: '',
  subtripId: '',
  paymentId: '',
  status: 'all',
  issueFromDate: null,
  issueToDate: null,
  hasTds: false,
};

// ----------------------------------------------------------------------

export function TransporterPaymentListView() {
  const theme = useTheme();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();

  const navigate = useNavigate();
  const deleteTransporterPayment = useDeleteTransporterPayment();

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = fIsAfter(filters.issueFromDate, filters.issueToDate);

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
      color: 'warning',
      count: totals.generated?.count || 0,
    },
  ];

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.transporterId ||
    !!filters.subtripId ||
    !!filters.paymentId ||
    filters.status !== 'all' ||
    (!!filters.issueFromDate && !!filters.issueToDate) ||
    filters.hasTds;

  const notFound = !isLoading && !tableData.length;

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

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Transporter Payment List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Transporter Payment',
              href: paths.dashboard.transporterPayment.root,
            },
            {
              name: 'List',
            },
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
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        {/* Table Section */}
        <Card>
          {/* filtering Tabs */}
          <Tabs
            value={filters.status}
            onChange={(e, value) => handleFilters('status', value)}
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
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') ||
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

          <TransporterPaymentTableToolbar
            filters={filters}
            onFilters={handleFilters}
            tableData={tableData}
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
              rowCount={totalCount}
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
                  rowCount={totalCount}
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
                    .map((row) => (
                      <TransporterPaymentTableRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
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

