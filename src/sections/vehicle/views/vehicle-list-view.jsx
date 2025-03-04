import sumBy from 'lodash/sumBy';
import { useNavigate } from 'react-router';
import { useMemo, useState, useEffect, useCallback } from 'react';

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
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import VehicleTableRow from '../vehicle-table-row';
import VehicleAnalytic from '../widgets/vehicle-analytic';
import VehicleTableToolbar from '../vehicle-table-toolbar';
import { useDeleteVehicle } from '../../../query/use-vehicle';
import VehicleTableFiltersResult from '../vehicle-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'vehicleNo', label: 'Vehicle No' },
  {
    id: 'isOwn',
    label: 'Ownership',
  },
  { id: 'noOfTyres', label: 'No Of Tyres' },
  {
    id: 'manufacturingYear',
    label: 'Manufacturing Year',
  },
  { id: 'loadingCapacity', label: 'Loading Capacity' },
  { id: 'fuelTankCapacity', label: 'Fuel Tank Capacity' },
  {
    id: 'transporter',
    label: 'Transport Company',
  },
  { id: '' },
];

const defaultFilters = {
  vehicleNo: '',
  transporter: '',
  vehicleTypes: [],
};

// ----------------------------------------------------------------------

export function VehicleListView({ vehicles }) {
  const theme = useTheme();

  const router = useRouter();
  const confirm = useBoolean();

  const navigate = useNavigate();
  const deleteVehicle = useDeleteVehicle();
  const table = useTable({ defaultOrderBy: 'createDate' });

  const [filters, setFilters] = useState(defaultFilters);

  // Add state for column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    vehicleNo: true,
    isOwn: true,
    noOfTyres: true,
    manufacturingYear: true,
    loadingCapacity: true,
    fuelTankCapacity: true,
    transporter: true,
  });

  // Define which columns should be disabled (always visible)
  const disabledColumns = useMemo(
    () => ({
      vehicleNo: true, // Vehicle number should always be visible
      isOwn: false,
      noOfTyres: false,
      manufacturingYear: false,
      loadingCapacity: false,
      fuelTankCapacity: false,
      transporter: false,
    }),
    []
  );

  useEffect(() => {
    if (vehicles.length) {
      setTableData(vehicles);
    }
  }, [vehicles]);

  const [tableData, setTableData] = useState([]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 56 : 76;

  const canReset = !!filters.vehicleNo || !!filters.transporter || filters.vehicleTypes.length > 0;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getVehicleLength = (vehicleType) =>
    tableData.filter((item) => item.vehicleType === vehicleType).length;

  const getTotalAmount = (vehicleType) =>
    sumBy(
      tableData.filter((item) => item.vehicleType === vehicleType),
      'totalAmount'
    );

  const getPercentByvehicleType = (vehicleType) =>
    (getVehicleLength(vehicleType) / tableData.length) * 100;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData.length },
    { value: 'body', label: 'Body', color: 'default', count: getVehicleLength('body') },
    { value: 'trailer', label: 'Trailer', color: 'success', count: getVehicleLength('trailer') },
    { value: 'bulker', label: 'Bulker', color: 'warning', count: getVehicleLength('bulker') },
    {
      value: 'localBulker',
      label: 'Local Bulker',
      color: 'error',
      count: getVehicleLength('localBulker'),
    },
    { value: 'tanker', label: 'Tanker', color: 'default', count: getVehicleLength('tanker') },
    { value: 'pickup', label: 'Pickup', color: 'success', count: getVehicleLength('pickup') },
    { value: 'crane', label: 'Crane', color: 'warning', count: getVehicleLength('crane') },
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
    navigate(paths.dashboard.vehicle.edit(paramCase(id)));
  };
  const handleDeleteRows = useCallback(() => {}, []);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.vehicle.details(id));
    },
    [router]
  );

  const handleFiltervehicleType = useCallback(
    (event, newValue) => {
      if (newValue === 'all') {
        handleFilters('vehicleTypes', []);
      } else {
        handleFilters('vehicleTypes', [newValue]);
      }
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

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
          heading="Vehicle List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Vehicle',
              href: paths.dashboard.vehicle.root,
            },
            {
              name: 'Vehicle List',
            },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.vehicle.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Vehicle
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
              <VehicleAnalytic
                title="All"
                total={tableData.length}
                percent={100}
                price={sumBy(tableData, 'totalAmount')}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.info.main}
              />

              <VehicleAnalytic
                title="Body"
                total={getVehicleLength('body')}
                percent={getPercentByvehicleType('body')}
                price={getTotalAmount('body')}
                icon="solar:file-check-bold-duotone"
                color={theme.palette.success.main}
              />

              <VehicleAnalytic
                title="Trailer"
                total={getVehicleLength('trailer')}
                percent={getPercentByvehicleType('trailer')}
                price={getTotalAmount('trailer')}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.warning.main}
              />

              <VehicleAnalytic
                title="Bulker"
                total={getVehicleLength('bulker')}
                percent={getPercentByvehicleType('bulker')}
                price={getTotalAmount('bulker')}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.error.main}
              />
              <VehicleAnalytic
                title="Local Bulker"
                total={getVehicleLength('localBulker')}
                percent={getPercentByvehicleType('localBulker')}
                price={getTotalAmount('localBulker')}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.text.secondary}
              />
              <VehicleAnalytic
                title="Tanker"
                total={getVehicleLength('tanker')}
                percent={getPercentByvehicleType('tanker')}
                price={getTotalAmount('tanker')}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.primary.main}
              />
              <VehicleAnalytic
                title="Pickup"
                total={getVehicleLength('pickup')}
                percent={getPercentByvehicleType('pickup')}
                price={getTotalAmount('pickup')}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.secondary.main}
              />
              <VehicleAnalytic
                title="Crane"
                total={getVehicleLength('crane')}
                percent={getPercentByvehicleType('crane')}
                price={getTotalAmount('crane')}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.common.white}
              />
            </Stack>
          </Scrollbar>
        </Card>

        {/* Table Section */}
        <Card>
          {/* filtering Tabs */}
          <Tabs
            value={filters.vehicleTypes.length === 1 ? filters.vehicleTypes[0] : 'all'}
            onChange={handleFiltervehicleType}
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
                      (tab.value === 'all' && filters.vehicleTypes.length === 0) ||
                      (filters.vehicleTypes.length === 1 && filters.vehicleTypes[0] === tab.value)
                        ? 'filled'
                        : 'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <VehicleTableToolbar
            filters={filters}
            onFilters={handleFilters}
            tableData={dataFiltered}
            visibleColumns={visibleColumns}
            disabledColumns={disabledColumns}
            onToggleColumn={handleToggleColumn}
          />

          {canReset && (
            <VehicleTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

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
                      <VehicleTableRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onDeleteRow={() => deleteVehicle(row._id)}
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

// ----------------------------------------------------------------------

// filtering logic
function applyFilter({ inputData, comparator, filters }) {
  const { vehicleNo, transporter, vehicleTypes } = filters;

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
        record.vehicleNo && record.vehicleNo.toLowerCase().indexOf(vehicleNo.toLowerCase()) !== -1
    );
  }

  if (transporter) {
    inputData = inputData.filter(
      (record) => record.transporter && record.transporter._id === transporter
    );
  }

  if (vehicleTypes && vehicleTypes.length > 0) {
    inputData = inputData.filter((record) => vehicleTypes.includes(record.vehicleType));
  }

  return inputData;
}
