import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import ToggleButton from '@mui/material/ToggleButton';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useFilters } from 'src/hooks/use-filters';
import { useBoolean } from 'src/hooks/use-boolean';
import { useColumnVisibility } from 'src/hooks/use-column-visibility';

import { DashboardContent } from 'src/layouts/dashboard';
import { usePaginatedDocuments } from 'src/query/use-documents';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { DocumentDetailsDrawer } from 'src/sections/vehicle/documents/document-details-drawer';
import { VehicleDocumentsGridContent } from 'src/sections/vehicle/documents/components/documents-grid-view';
import VehicleDocumentFormDialog from 'src/sections/vehicle/documents/components/vehicle-document-form-dialog';

import DocumentsTableRow from '../documents-table-row';
import { TABLE_COLUMNS } from '../config/table-columns';
import DocumentsTableToolbar from '../documents-table-toolbar';
import DocumentsFiltersResult from '../documents-filters-result';

const STORAGE_KEY = 'vehicle-documents-table-columns';

const defaultFilters = {
  status: 'all', // expiring | missing | expired | valid | all
  vehicleId: '',
  docType: '',
  docNumber: '',
  issuer: '',
  issueFrom: null,
  issueTo: null,
  expiryFrom: null,
  expiryTo: null,
  days: '', // expiring window (optional)
};

export function VehicleDocumentsListView() {
  const theme = useTheme();
  const table = useTable({ syncToUrl: true });
  const [view, setView] = useState('list');

  const { filters, handleFilters, handleResetFilters, canReset } = useFilters(defaultFilters, {
    onResetPage: table.onResetPage,
  });

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const addDialog = useBoolean();

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

  const { data, isLoading } = usePaginatedDocuments(
    {
      page: table.page + 1,
      rowsPerPage: table.rowsPerPage,
      status: filters.status !== 'all' ? filters.status : undefined,
      vehicleId: filters.vehicleId || undefined,
      docType: filters.docType || undefined,
      docNumber: filters.docNumber || undefined,
      issuer: filters.issuer || undefined,
      issueFrom: filters.issueFrom || undefined,
      issueTo: filters.issueTo || undefined,
      expiryFrom: filters.expiryFrom || undefined,
      expiryTo: filters.expiryTo || undefined,
      days: filters.days || undefined,
    },
    { enabled: view === 'list' }
  );

  const [tableData, setTableData] = useState([]);
  const [detailsDoc, setDetailsDoc] = useState(null);

  useEffect(() => {
    if (data?.results) setTableData(data.results);
  }, [data]);

  const totalCount = data?.total ?? data?.docsTotal ?? 0;

  const handleFilterStatus = useCallback(
    (event, newValue) => handleFilters('status', newValue),
    [handleFilters]
  );

  const handleSelectVehicle = useCallback(
    (vehicle) => {
      setSelectedVehicle(vehicle);
      handleFilters('vehicleId', vehicle?._id || '');
    },
    [handleFilters]
  );

  const handleClearVehicle = useCallback(() => {
    setSelectedVehicle(null);
    handleFilters('vehicleId', '');
  }, [handleFilters]);

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: totalCount },
    { value: 'valid', label: 'Valid', color: 'success', count: data?.totalValid || 0 },
    { value: 'expiring', label: 'Expiring', color: 'warning', count: data?.totalExpiring || 0 },
    { value: 'expired', label: 'Expired', color: 'error', count: data?.totalExpired || 0 },
  ];

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Vehicle Documents"
        action={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
            <Button
              variant="contained"
              startIcon={<Iconify icon="bytesize:upload" />}
              onClick={addDialog.onTrue}
              size='small'
            >
              Upload
            </Button>

            <ToggleButtonGroup
              exclusive
              size="small"
              value={view}
              onChange={(_e, v) => v && setView(v)}
            >
              <ToggleButton value="list" aria-label="List view">
                <Iconify icon="material-symbols:list-rounded" />
              </ToggleButton>
              <ToggleButton value="grid" aria-label="Grid view">
                <Iconify icon="ph:dots-nine-bold" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        }
        sx={{ mb: { xs: 1, md: 1 } }}
      />

      {view === 'list' ? (
        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{ px: 2.5, boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}` }}
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
                      variant={tab.value === filters.status ? 'filled' : 'soft'}
                      color={tab.color}
                    >
                      {tab.count}
                    </Label>
                  )
                }
              />
            ))}
          </Tabs>

          <DocumentsTableToolbar
            filters={filters}
            onFilters={handleFilters}
            tableData={tableData}
            visibleColumns={visibleColumns}
            disabledColumns={disabledColumns}
            onToggleColumn={toggleColumnVisibility}
            onToggleAllColumns={toggleAllColumnsVisibility}
            columnOrder={columnOrder}
            selectedVehicle={selectedVehicle}
            onSelectVehicle={handleSelectVehicle}
            onResetColumns={resetColumns}
            canResetColumns={canResetColumns}
          />

          {canReset && (
            <DocumentsFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={() => {
                handleResetFilters();
                setSelectedVehicle(null);
              }}
              selectedVehicleNo={selectedVehicle?.vehicleNo}
              onRemoveVehicle={handleClearVehicle}
              results={totalCount}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom headLabel={visibleHeaders} onOrderChange={moveColumn} />
                <TableBody>
                  {isLoading
                    ? Array.from({ length: table.rowsPerPage }).map((_, i) => (
                      <TableSkeleton key={i} />
                    ))
                    : tableData.map((row) => (
                      <DocumentsTableRow
                        key={row._id}
                        row={row}
                        onOpenDetails={(r) => setDetailsDoc(r)}
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
      ) : (
        <VehicleDocumentsGridContent />
      )}

      <VehicleDocumentFormDialog
        open={addDialog.value}
        onClose={addDialog.onFalse}
        mode="create"
        initialVehicle={selectedVehicle || null}
      />

      {view === 'list' && (
        <DocumentDetailsDrawer
          open={!!detailsDoc}
          onClose={() => setDetailsDoc(null)}
          doc={detailsDoc}
        />
      )}
    </DashboardContent>
  );
}
