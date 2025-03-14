import { useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components/router-link';

import { useBoolean } from 'src/hooks/use-boolean';

import { exportToExcel } from 'src/utils/export-to-excel';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
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

import SubtripTableRow from '../subtrip-table-row';
import SubtripTableToolbar from '../subtrip-table-toolbar';

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
  customer: '',
  subtripId: '',
  vehicleNo: '',
  transportName: '',
  fromDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export function SubtripBilledPaidView() {
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();
  const router = useRouter();

  const [filters, setFilters] = useState(defaultFilters);
  const [tableData, setTableData] = useState([]);

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

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.vehicleNo ||
    !!filters.subtripId ||
    !!filters.customer ||
    (!!filters.fromDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = (name, value) => {
    table.onResetPage();
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleViewRow = (id) => {
    router.push(paths.dashboard.subtrip.details(id));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
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
        <SubtripTableToolbar
          filters={filters}
          onFilters={handleFilters}
          tableData={dataFiltered}
          visibleColumns={visibleColumns}
          disabledColumns={disabledColumns}
          onToggleColumn={handleToggleColumn}
        />

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
          count={dataFiltered.length}
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

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { vehicleNo, subtripId, customer, fromDate, endDate, transportName } = filters;

  // First filter to only show billed-paid subtrips
  inputData = inputData.filter((record) => record.subtripStatus === 'billed-paid');

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
        record.tripId &&
        record.tripId.vehicleId &&
        record.tripId.vehicleId.vehicleNo &&
        record.tripId.vehicleId.vehicleNo.toLowerCase().indexOf(vehicleNo.toLowerCase()) !== -1
    );
  }

  if (transportName) {
    inputData = inputData.filter(
      (record) =>
        record.tripId &&
        record.tripId.vehicleId &&
        record.tripId.vehicleId.transporter &&
        record.tripId.vehicleId.transporter.transportName &&
        record.tripId.vehicleId.transporter.transportName
          .toLowerCase()
          .indexOf(transportName.toLowerCase()) !== -1
    );
  }

  if (customer) {
    inputData = inputData.filter(
      (record) =>
        record.customerId &&
        record.customerId.customerName &&
        record.customerId.customerName.toLowerCase().indexOf(customer.toLowerCase()) !== -1
    );
  }

  if (subtripId) {
    inputData = inputData.filter(
      (record) => record._id && record._id.toLowerCase().indexOf(subtripId.toLowerCase()) !== -1
    );
  }

  if (!dateError) {
    if (fromDate && endDate) {
      inputData = inputData.filter(
        (subtrip) =>
          new Date(subtrip.startDate) >= new Date(fromDate) &&
          new Date(subtrip.startDate) <= new Date(endDate)
      );
    }
  }

  return inputData;
}
