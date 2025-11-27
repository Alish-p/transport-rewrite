import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useFilters } from 'src/hooks/use-filters';
import { useColumnVisibility } from 'src/hooks/use-column-visibility';

import { DashboardContent } from 'src/layouts/dashboard';
import { usePaginatedWorkOrders } from 'src/query/use-work-order';

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

import WorkOrderTableRow from '../work-order-table-row';
import { TABLE_COLUMNS } from '../work-order-table-config';
import WorkOrderTableToolbar from '../work-order-table-toolbar';
import { WORK_ORDER_STATUS_OPTIONS } from '../work-order-config';
import WorkOrderTableFiltersResult from '../work-order-table-filters-result';

const STORAGE_KEY = 'work-order-table-columns';

const defaultFilters = {
  status: 'all',
  priority: 'all',
  vehicleId: '',
  partId: '',
};

const STATUS_TABS = [
  { value: 'all', label: 'All', color: 'default' },
  ...WORK_ORDER_STATUS_OPTIONS.map((status) => ({
    value: status.value,
    label: status.label,
    color: status.color,
  })),
];

export function WorkOrderListView() {
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'createdAt', syncToUrl: true });

  const { filters, handleFilters, handleResetFilters, canReset } = useFilters(defaultFilters, {
    onResetPage: table.onResetPage,
  });

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);

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

  const { data, isLoading } = usePaginatedWorkOrders({
    status: filters.status === 'all' ? undefined : filters.status,
    priority: filters.priority === 'all' ? undefined : filters.priority,
    vehicle: filters.vehicleId || undefined,
    part: filters.partId || undefined,
    page: table.page + 1,
    rowsPerPage: table.rowsPerPage,
  });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (data?.workOrders) {
      setTableData(data.workOrders);
    } else if (data?.results) {
      setTableData(data.results);
    } else {
      setTableData([]);
    }
  }, [data]);

  const totalCount = data?.total || tableData.length;

  const notFound = (!tableData.length && canReset) || !tableData.length;

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.workOrder.details(id));
    },
    [router]
  );

  const handleToggleColumn = useCallback(
    (columnName) => {
      toggleColumnVisibility(columnName);
    },
    [toggleColumnVisibility]
  );

  const handleSelectVehicle = useCallback(
    (vehicle) => {
      setSelectedVehicle(vehicle);
      handleFilters('vehicleId', vehicle?._id || '');
    },
    [handleFilters]
  );

  const handleSelectPart = useCallback(
    (part) => {
      setSelectedPart(part);
      handleFilters('partId', part?._id || '');
    },
    [handleFilters]
  );

  useEffect(() => {
    if (!filters.vehicleId) setSelectedVehicle(null);
  }, [filters.vehicleId]);

  useEffect(() => {
    if (!filters.partId) setSelectedPart(null);
  }, [filters.partId]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Work Orders"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Vehicle Maintenance', href: paths.dashboard.workOrder.root },
          { name: 'Work Orders' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.workOrder.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Work Order
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Tabs
          value={filters.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
          }}
        >
          {STATUS_TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
            />
          ))}
        </Tabs>

        <WorkOrderTableToolbar
          filters={filters}
          onFilters={handleFilters}
          visibleColumns={visibleColumns}
          disabledColumns={disabledColumns}
          onToggleColumn={handleToggleColumn}
          onToggleAllColumns={toggleAllColumnsVisibility}
          onResetColumns={resetColumns}
          canResetColumns={canResetColumns}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={handleSelectVehicle}
          selectedPart={selectedPart}
          onSelectPart={handleSelectPart}
        />

        {canReset && (
          <WorkOrderTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            selectedVehicle={selectedVehicle}
            selectedPart={selectedPart}
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
                    <WorkOrderTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onViewRow={() => handleViewRow(row._id)}
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
  );
}
