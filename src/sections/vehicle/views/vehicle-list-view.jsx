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
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { paramCase } from 'src/utils/change-case';
import { exportToExcel } from 'src/utils/export-to-excel';

import { DashboardContent } from 'src/layouts/dashboard';
import { useDeleteVehicle, usePaginatedVehicles } from 'src/query/use-vehicle';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import VehicleTableRow from '../vehicle-table-row';
import VehicleTableToolbar from '../vehicle-table-toolbar';
import VehicleTableFiltersResult from '../vehicle-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'vehicleNo', label: 'Vehicle No' },
  {
    id: 'isOwn',
    label: 'Ownership',
  },
  {
    id: 'transporter',
    label: 'Transport Company',
    align: 'center',
  },
  { id: 'noOfTyres', label: 'No Of Tyres' },
  {
    id: 'manufacturingYear',
    label: 'Manufacturing Year',
  },
  { id: 'loadingCapacity', label: 'Loading Capacity' },
  { id: 'fuelTankCapacity', label: 'Fuel Tank Capacity' },
  { id: 'vehicleCompany', label: 'Vehicle Company' },
  { id: 'modelType', label: 'Vehicle Model' },
  { id: 'chasisNo', label: 'Chasis No' },
  { id: 'engineNo', label: 'Engine No' },
  { id: 'engineType', label: 'Engine Type' },

  { id: '' },
];

const defaultFilters = {
  vehicleNo: '',
  transporter: '',
  vehicleType: '',
  isOwn: 'all',
};

// ----------------------------------------------------------------------

export function VehicleListView() {
  const theme = useTheme();

  const router = useRouter();
  const confirm = useBoolean();

  const navigate = useNavigate();
  const deleteVehicle = useDeleteVehicle();
  const table = useTable({ defaultOrderBy: 'createDate' });

  const [filters, setFilters] = useState(defaultFilters);
  const [selectedTransporter, setSelectedTransporter] = useState(null);

  // Add state for column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    vehicleNo: true,
    isOwn: true,
    noOfTyres: true,
    manufacturingYear: true,
    loadingCapacity: true,
    fuelTankCapacity: true,
    transporter: true,
    vehicleCompany: false,
    modelType: false,
    chasisNo: false,
    engineNo: false,
    engineType: false,
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
      vehicleCompany: false,
      modelType: false,
      chasisNo: false,
      engineNo: false,
      engineType: false,
    }),
    []
  );

  const { data, isLoading } = usePaginatedVehicles({
    page: table.page + 1,
    rowsPerPage: table.rowsPerPage,
    vehicleNo: filters.vehicleNo || undefined,
    vehicleType: filters.vehicleType || undefined,
    transporter: filters.transporter || undefined,
    isOwn: filters.isOwn === 'all' ? undefined : filters.isOwn === 'own',
  });

  useEffect(() => {
    if (data?.results) {
      setTableData(data.results);
    }
  }, [data]);

  const [tableData, setTableData] = useState([]);

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.vehicleNo ||
    !!filters.transporter ||
    !!filters.vehicleType ||
    filters.isOwn !== 'all';

  const notFound = (!tableData.length && canReset) || !tableData.length;

  const totalCount = data?.total || 0;

  const getOwnershipLength = (own) => tableData.filter((item) => item.isOwn === own).length;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: data?.total },
    { value: 'own', label: 'Own', color: 'success', count: data?.totalOwnVehicle },
    { value: 'market', label: 'Market', color: 'warning', count: data?.totalMarketVehicle },
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

  const handleFilterOwnership = useCallback(
    (event, newValue) => {
      handleFilters('isOwn', newValue);
    },
    [handleFilters]
  );

  const handleSelectTransporter = useCallback(
    (transporter) => {
      setSelectedTransporter(transporter);
      handleFilters('transporter', transporter._id);
    },
    [handleFilters]
  );

  const handleClearTransporter = useCallback(() => {
    setSelectedTransporter(null);
    handleFilters('transporter', '');
  }, [handleFilters]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSelectedTransporter(null);
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

        {/* Table Section */}
        <Card>
          {/* filtering Tabs */}
          <Tabs
            value={filters.isOwn}
            onChange={handleFilterOwnership}
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
                      variant={tab.value === filters.isOwn ? 'filled' : 'soft'}
                      color={tab.color}
                    >
                      {tab.count}
                    </Label>
                  )
                }
              />
            ))}
          </Tabs>

          <VehicleTableToolbar
            filters={filters}
            onFilters={handleFilters}
            tableData={tableData}
            visibleColumns={visibleColumns}
            disabledColumns={disabledColumns}
            onToggleColumn={handleToggleColumn}
            selectedTransporter={selectedTransporter}
            onSelectTransporter={handleSelectTransporter}
          />

          {canReset && (
            <VehicleTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              selectedTransporterName={selectedTransporter?.transportName}
              onRemoveTransporter={handleClearTransporter}
              results={data?.total}
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
                  {isLoading ? (
                    Array.from({ length: table.rowsPerPage }).map((_, index) => (
                      <TableSkeleton key={index} />
                    ))
                  ) : (
                    <>
                      {tableData.map((row) => (
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
