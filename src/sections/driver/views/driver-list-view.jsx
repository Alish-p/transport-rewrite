import sumBy from 'lodash/sumBy';
import { useNavigate } from 'react-router';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { paramCase } from 'src/utils/change-case';
import { exportToExcel } from 'src/utils/export-to-excel';

import { DashboardContent } from 'src/layouts/dashboard';

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

import DriverTableRow from '../driver-table-row';
import DriverTableToolbar from '../driver-table-toolbar';
import DriverTableFiltersResult from '../driver-table-filters-result';
import { useDeleteDriver, usePaginatedDrivers } from '../../../query/use-driver';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'driverName', label: 'Driver', align: 'center' },
  { id: 'driverCellNo', label: 'Mobile', align: 'center' },
  { id: 'permanentAddress', label: 'Address', align: 'center' },
  { id: 'experience', label: 'Experience', align: 'center' },
  { id: 'licenseTo', label: 'License Valid Till', align: 'center' },
  { id: 'aadharNo', label: 'Aadhar No', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: '' },
];

const defaultFilters = {
  search: '',
  status: 'all',
};

// ----------------------------------------------------------------------

export function DriverListView() {
  const theme = useTheme();
  const router = useRouter();
  const confirm = useBoolean();
  const navigate = useNavigate();
  const deleteDriver = useDeleteDriver();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const [filters, setFilters] = useState(defaultFilters);

  const { data, isLoading } = usePaginatedDrivers({
    search: filters.search || undefined,
    page: table.page + 1,
    rowsPerPage: table.rowsPerPage,
  });

  useEffect(() => {
    if (data?.drivers) {
      const statusMappedDrivers = data.drivers.map((driver) => {
        const licenseToDate = new Date(driver.licenseTo);
        const status = licenseToDate > new Date() ? 'valid' : 'expired';

        return {
          ...driver,
          status,
        };
      });
      setTableData(statusMappedDrivers);
    }
  }, [data]);

  const [tableData, setTableData] = useState([]);

  const totalCount = data?.totals?.all?.count || 0;

  const denseHeight = table.dense ? 56 : 76;

  const canReset = !!filters.search || filters.status !== 'all';

  const notFound = (!tableData.length && canReset) || !tableData.length;

  const getDriverLength = (status) => tableData.filter((item) => item.status === status).length;

  const getTotalAmount = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      'totalAmount'
    );

  const getPercentByStatus = (status) => (getDriverLength(status) / tableData.length) * 100;

  const TABS = [
    {
      value: 'all',
      label: 'All',
      color: 'default',
      count: totalCount,
    },
    {
      value: 'valid',
      label: 'Valid',
      color: 'success',
      count:
        (data?.totals && data.totals.valid?.count) || getDriverLength('valid'),
    },
    {
      value: 'expired',
      label: 'Expired',
      color: 'error',
      count:
        (data?.totals && data.totals.expired?.count) || getDriverLength('expired'),
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
    navigate(paths.dashboard.driver.edit(paramCase(id)));
  };
  const handleDeleteRows = useCallback(() => { }, []);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.driver.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Add state for column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    driverName: true,
    driverCellNo: true,
    permanentAddress: true,
    experience: true,
    licenseTo: true,
    aadharNo: false,
    status: true,
  });

  // Define which columns should be disabled (always visible)
  const disabledColumns = useMemo(
    () => ({
      driverName: true, // Driver name should always be visible
      driverCellNo: false,
      permanentAddress: false,
      experience: false,
      licenseTo: false,
      aadharNo: false,
      status: false,
    }),
    []
  );

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
          heading="Driver List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Driver',
              href: paths.dashboard.driver.root,
            },
            {
              name: 'Driver List',
            },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.driver.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Driver
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
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <DriverTableToolbar
            filters={filters}
            onFilters={handleFilters}
            tableData={tableData}
            visibleColumns={visibleColumns}
            disabledColumns={disabledColumns}
            onToggleColumn={handleToggleColumn}
          />

          {canReset && (
            <DriverTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={tableData.length}
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
                  {tableData.map((row) => (
                    <DriverTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onViewRow={() => handleViewRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
                      onDeleteRow={() => deleteDriver(row._id)}
                      visibleColumns={visibleColumns}
                      disabledColumns={disabledColumns}
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
