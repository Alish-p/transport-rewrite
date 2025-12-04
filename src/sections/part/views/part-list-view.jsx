import { useNavigate } from 'react-router';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useFilters } from 'src/hooks/use-filters';
import { useBoolean } from 'src/hooks/use-boolean';
import { useColumnVisibility } from 'src/hooks/use-column-visibility';

import { paramCase } from 'src/utils/change-case';
import { fShortenNumber } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import { usePaginatedPartLocations } from 'src/query/use-part-location';
import { useDeletePart, usePaginatedParts, useCreateBulkParts } from 'src/query/use-part';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { BulkImportDialog } from 'src/components/bulk-import';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import PartTableRow from '../part-table-row';
import PartTableToolbar from '../part-table-toolbar';
import { TABLE_COLUMNS } from '../part-table-config';
import PartAnalytic from '../part-list/part-analytic';
import PartTableFiltersResult from '../part-table-filters-result';
import { PART_BULK_IMPORT_SCHEMA, PART_BULK_IMPORT_COLUMNS } from './part-bulk-import-view';

const STORAGE_KEY = 'part-table-columns';

const defaultFilters = {
  search: '',
  inventoryLocation: 'all',
};

export function PartListView() {
  const theme = useTheme();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'name', syncToUrl: true });

  const navigate = useNavigate();
  const deletePart = useDeletePart();
  const createBulkParts = useCreateBulkParts();
  const importDialog = useBoolean();

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

  const { data, isLoading } = usePaginatedParts({
    search: filters.search || undefined,
    inventoryLocation:
      filters.inventoryLocation && filters.inventoryLocation !== 'all'
        ? filters.inventoryLocation
        : undefined,
    page: table.page + 1,
    rowsPerPage: table.rowsPerPage,
  });

  const { data: locationsResponse, isLoading: isLoadingLocations } = usePaginatedPartLocations(
    { page: 1, rowsPerPage: 1000 },
    { staleTime: 1000 * 60 * 10 }
  );

  const locations =
    locationsResponse?.locations ||
    locationsResponse?.partLocations ||
    locationsResponse?.results ||
    [];

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (data?.parts) {
      setTableData(data.parts);
    } else if (data?.results) {
      setTableData(data.results);
    }
  }, [data]);

  const totalCount = data?.total || tableData.length;
  const totalInventoryValue = data?.totalInventoryValue || 0;
  const totalQuantityItems = data?.totalQuantityItems || 0;
  const outOfStockItems = data?.outOfStockItems || 0;
  const selectedLocationName =
    filters.inventoryLocation && filters.inventoryLocation !== 'all'
      ? locations.find((loc) => loc._id === filters.inventoryLocation)?.name
      : '';

  const notFound = (!tableData.length && canReset) || !tableData.length;

  const handleEditRow = (id) => {
    navigate(paths.dashboard.part.edit(paramCase(id)));
  };

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.part.details(id));
    },
    [router]
  );

  const handleToggleColumn = useCallback(
    (columnName) => {
      toggleColumnVisibility(columnName);
    },
    [toggleColumnVisibility]
  );

  const handleFilterLocation = useCallback(
    (event, newValue) => {
      handleFilters('inventoryLocation', newValue);
    },
    [handleFilters]
  );

  const locationTabs = [
    { value: 'all', label: 'All' },
    ...locations.map((loc) => ({
      value: loc._id,
      label: loc.name,
    })),
  ];

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Parts List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Vehicle Maintenance', href: paths.dashboard.part.root },
            { name: 'Parts List' },
          ]}
          action={
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                onClick={importDialog.onTrue}
              >
                Import
              </Button>
              <Button
                component={RouterLink}
                href={paths.dashboard.part.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New Part
              </Button>
            </Stack>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
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
              <PartAnalytic
                title="Inventory value"
                subtitle={`₹ ${fShortenNumber(totalInventoryValue)}`}
                icon="mdi:clipboard-list-outline"
                color={theme.palette.info.main}
              />

              <PartAnalytic
                title="Total Parts Quantity"
                subtitle={`${totalQuantityItems} Units`}
                icon="mdi:package-variant-closed"
                color={theme.palette.primary.main}
              />

              <PartAnalytic
                title="Out of Stock"
                subtitle={`${fShortenNumber(outOfStockItems)} Parts`}
                icon="mdi:alert-circle-outline"
                color={theme.palette.error.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          {/* Location Tabs */}
          <Tabs
            value={filters.inventoryLocation}
            onChange={handleFilterLocation}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {locationTabs.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} disabled={isLoadingLocations} />
            ))}
          </Tabs>

          <PartTableToolbar
            filters={filters}
            onFilters={handleFilters}
            visibleColumns={visibleColumns}
            disabledColumns={disabledColumns}
            onToggleColumn={handleToggleColumn}
            onToggleAllColumns={toggleAllColumnsVisibility}
            onResetColumns={resetColumns}
            canResetColumns={canResetColumns}
          />

          {canReset && (
            <PartTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              selectedLocationName={selectedLocationName}
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
                      <PartTableRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onDeleteRow={() => deletePart(row._id)}
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

      <BulkImportDialog
        open={importDialog.value}
        onClose={importDialog.onFalse}
        entityName="Part"
        schema={PART_BULK_IMPORT_SCHEMA}
        columns={PART_BULK_IMPORT_COLUMNS}
        onImport={(importData) => createBulkParts({ parts: importData })}
      />
    </>
  );
}
