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
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useFilters } from 'src/hooks/use-filters';
import { useBoolean } from 'src/hooks/use-boolean';
import { useColumnVisibility } from 'src/hooks/use-column-visibility';

import { paramCase } from 'src/utils/change-case';
import { exportToExcel, prepareDataForExport } from 'src/utils/export-to-excel';

import VehicleListPdf from 'src/pdfs/vehicle-list-pdf';
import { DashboardContent } from 'src/layouts/dashboard';
import { useDeleteVehicle, usePaginatedVehicles } from 'src/query/use-vehicle';

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

import VehicleTableRow from '../vehicle-table-row';
import { TABLE_COLUMNS } from '../vehicle-table-config';
import VehicleTableToolbar from '../vehicle-table-toolbar';
import VehicleCleanupDialog from '../cleanup/vehicle-cleanup-dialog';
import VehicleTableFiltersResult from '../vehicle-table-filters-result';

const STORAGE_KEY = 'vehicle-table-columns';

const defaultFilters = {
  vehicleNo: '',
  transporter: '',
  vehicleType: '',
  noOfTyres: '',
  isOwn: 'all',
};

export function VehicleListView() {
  const tenant = useTenantContext();
  const theme = useTheme();
  const router = useRouter();
  const navigate = useNavigate();
  const deleteVehicle = useDeleteVehicle();
  const table = useTable({ syncToUrl: true });
  const cleanupDialog = useBoolean();

  // Use custom filters hook
  const {
    filters,
    handleFilters,
    handleResetFilters: resetFilters,
    canReset,
  } = useFilters(defaultFilters);

  const [selectedTransporter, setSelectedTransporter] = useState(null);

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

  const { data, isLoading } = usePaginatedVehicles({
    page: table.page + 1,
    rowsPerPage: table.rowsPerPage,
    vehicleNo: filters.vehicleNo || undefined,
    vehicleType: filters.vehicleType || undefined,
    noOfTyres: filters.noOfTyres || undefined,
    transporter: filters.transporter || undefined,
    isOwn: filters.isOwn === 'all' ? undefined : filters.isOwn === 'own',
  });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (data?.results) setTableData(data.results);
  }, [data]);

  const totalCount = data?.total || 0;

  // Handlers
  const handleFilterOwnership = useCallback(
    (event, newValue) => handleFilters('isOwn', newValue),
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

  const handleResetAll = useCallback(() => {
    resetFilters();
    setSelectedTransporter(null);
  }, [resetFilters]);

  const getVisibleColumnsForExport = () => {
    const orderedIds = (
      columnOrder && columnOrder.length ? columnOrder : TABLE_COLUMNS.map((c) => c.id)
    ).filter((id) => visibleColumns[id]);
    return orderedIds;
  };

  // Render tabs
  const renderTabs = () => {
    const TABS = [
      { value: 'all', label: 'All', color: 'default', count: data?.total },
      { value: 'own', label: 'Own', color: 'success', count: data?.totalOwnVehicle },
      { value: 'market', label: 'Market', color: 'warning', count: data?.totalMarketVehicle },
    ];

    return (
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
                <Label variant={tab.value === filters.isOwn ? 'filled' : 'soft'} color={tab.color}>
                  {tab.count}
                </Label>
              )
            }
          />
        ))}
      </Tabs>
    );
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Vehicle List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Vehicle', href: paths.dashboard.vehicle.root },
          { name: 'Vehicle List' },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<Iconify icon="mdi:broom" />}
              onClick={cleanupDialog.onTrue}
            >
              Cleanup
            </Button>
            <Button
              component={RouterLink}
              href={paths.dashboard.vehicle.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Vehicle
            </Button>
          </Stack>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        {renderTabs()}

        <VehicleTableToolbar
          filters={filters}
          onFilters={handleFilters}
          visibleColumns={visibleColumns}
          disabledColumns={disabledColumns}
          onToggleColumn={toggleColumnVisibility}
          onToggleAllColumns={toggleAllColumnsVisibility}
          selectedTransporter={selectedTransporter}
          onSelectTransporter={handleSelectTransporter}
          onResetColumns={resetColumns}
          canResetColumns={canResetColumns}
        />

        {canReset && (
          <VehicleTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetAll}
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
                <Tooltip title="Download Excel">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      const selectedRows = tableData.filter((r) => table.selected.includes(r._id));
                      const visibleCols = getVisibleColumnsForExport();

                      exportToExcel(
                        prepareDataForExport(selectedRows, TABLE_COLUMNS, visibleCols, columnOrder),
                        'Vehcles-selected-list'
                      );
                    }}
                  >
                    <Iconify icon="file-icons:microsoft-excel" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Download PDF">
                  <PDFDownloadLink
                    document={(() => {
                      const selectedRows = tableData.filter((r) => table.selected.includes(r._id));
                      const visibleCols = getVisibleColumnsForExport();
                      return (
                        <VehicleListPdf
                          vehicles={selectedRows}
                          visibleColumns={visibleCols}
                          tenant={tenant}
                        />
                      );
                    })()}
                    fileName="Vehicle-list.pdf"
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
                order={table.order}
                orderBy={table.orderBy}
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
                {isLoading
                  ? Array.from({ length: table.rowsPerPage }).map((_, i) => (
                    <TableSkeleton key={i} />
                  ))
                  : tableData.map((row) => (
                    <VehicleTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onViewRow={() => router.push(paths.dashboard.vehicle.details(row._id))}
                      onEditRow={() => navigate(paths.dashboard.vehicle.edit(paramCase(row._id)))}
                      onDeleteRow={() => deleteVehicle(row._id)}
                      visibleColumns={visibleColumns}
                      disabledColumns={disabledColumns}
                      columnOrder={columnOrder}
                    />
                  ))}
                <TableNoData notFound={!tableData.length && canReset} />
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

      <VehicleCleanupDialog open={cleanupDialog.value} onClose={cleanupDialog.onFalse} />
    </DashboardContent >
  );
}
