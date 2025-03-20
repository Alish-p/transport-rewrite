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
import { useFilteredSubtrips } from 'src/query/use-subtrip';

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

import SubtripTableRow from '../past-list/subtrip-table-row';
import SubtripTableToolbar from '../past-list/subtrip-table-toolbar';
import SubtripTableFiltersResult from '../past-list/subtrip-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'vehicleNo', label: 'Details', align: 'center' },
  { id: 'customerId', label: 'Customer', align: 'center' },
  { id: 'routeName', label: 'Route', align: 'center', type: 'string' },
  { id: 'invoiceNo', label: 'Invoice No', align: 'center', type: 'string' },
  { id: 'startDate', label: 'Start Date', align: 'center' },
  { id: 'transport', label: 'Transporter', align: 'center', type: 'string' },
  { id: 'subtripStatus', label: 'Subtrip Status', align: 'center', type: 'string' },
  { id: '' },
];

const defaultFilters = {
  customerId: '',
  subtripId: '',
  vehicleNo: '',
  transportName: '',
  fromDate: null,
  endDate: null,
  status: [],
  driverId: '',
};

// ----------------------------------------------------------------------

export function SubtripReportsView() {
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();
  const router = useRouter();

  const [filters, setFilters] = useState(defaultFilters);
  const [searchParams, setSearchParams] = useState(null);

  // Add state for column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    vehicleNo: true,
    customerId: true,
    routeName: true,
    invoiceNo: true,
    startDate: true,
    subtripStatus: true,
    transport: true,
  });

  // Define which columns should be disabled (always visible)
  const disabledColumns = {
    vehicleNo: true,
    customerId: false,
    routeName: false,
    invoiceNo: false,
    startDate: false,
    subtripStatus: false,
    transport: false,
  };

  const dateError =
    filters.startDate && filters.endDate ? filters.startDate > filters.endDate : false;

  // Use the filtered subtrips query
  const { data: tableData = [], isLoading } = useFilteredSubtrips({
    ...searchParams,
  });

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.vehicleNo ||
    !!filters.subtripId ||
    !!filters.transportName ||
    !!filters.customerId ||
    !!filters.driverId ||
    (!!filters.fromDate && !!filters.endDate) ||
    (filters.status && filters.status.length > 0);

  const notFound = (!tableData.length && canReset) || !tableData.length;

  const handleFilters = (name, value) => {
    table.onResetPage();
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
      subtripId: filters.subtripId || undefined,
      customerId: filters.customerId || undefined,
      fromDate: filters.fromDate || undefined,
      toDate: filters.endDate || undefined,
      transporterId: filters.transportName || undefined,
      subtripStatus: filters.status?.length > 0 ? filters.status : undefined,
      driverId: filters.driverId || undefined,
    };

    // Remove undefined values
    Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);

    setSearchParams(params);
  };

  const handleViewRow = (id) => {
    router.push(paths.dashboard.subtrip.details(id));
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
        heading="Billed Paid Subtrips"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Subtrips',
            href: paths.dashboard.subtrip.list,
          },
          {
            name: 'Billed Paid',
          },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.subtrip.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Subtrip
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
          <SubtripTableToolbar
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
          <SubtripTableFiltersResult
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
              Please select filters and click search to view billed paid subtrips
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
                        exportToExcel(selectedRows, 'billed-paid-subtrips');
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
                        <SubtripTableRow
                          key={row._id}
                          row={row}
                          selected={table.selected.includes(row._id)}
                          onSelectRow={() => table.onSelectRow(row._id)}
                          onViewRow={() => handleViewRow(row._id)}
                          onEditRow={() => {}}
                          onDeleteRow={() => {}}
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

// ----------------------------------------------------------------------
