import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import { Chip, Tooltip, Divider, IconButton, CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { exportToExcel } from 'src/utils/export-to-excel';

import { PDFDownloadButton } from 'src/pdfs/common';
import { DashboardContent } from 'src/layouts/dashboard';
import { useFilteredSubtrips } from 'src/query/use-subtrip';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  ColumnSelectorList,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { transformSubtripsForExcel } from '../utils';
import SubtripTableRow from '../reports/subtrip-table-row';
import SubtripQuickFilters from '../reports/subtrip-quick-filters-bar';
import SubtripTableActions from '../reports/subtrip-filter-search-bar';
import SubtripTableFiltersResult from '../reports/subtrip-filters-result';
import SubtripTableFilters from '../reports/subtrip-additional-filter-bar';
import { DEFAULT_FILTERS, isAnyFilterApplied } from '../config/subtrip-reports-filters';
import {
  TABLE_COLUMNS,
  getDisabledColumns,
  getDefaultVisibleColumns,
} from '../config/table-columns';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function SubtripReportsView() {
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();
  const router = useRouter();
  const columnsPopover = usePopover();
  const denseHeight = table.dense ? 56 : 76;

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchParams, setSearchParams] = useState(null);

  // Initialize visible columns from config
  const [visibleColumns, setVisibleColumns] = useState(getDefaultVisibleColumns());
  const disabledColumns = getDisabledColumns();

  // Use the filtered subtrips query
  const { data: tableData = [], isLoading } = useFilteredSubtrips({
    ...searchParams,
  });

  const isFilterApplied = isAnyFilterApplied(filters);

  const notFound = (!tableData.length && isFilterApplied) || !tableData.length;

  const handleFilters = (name, value) => {
    table.onResetPage();

    // If reset action, reset all filters
    if (name === 'reset') {
      setFilters(DEFAULT_FILTERS);
      return;
    }

    // Handle batch filter updates from quick filters
    if (name === 'batch') {
      const newFilters = {
        ...DEFAULT_FILTERS,
        ...value,
      };

      setFilters(newFilters);

      return;
    }

    const newFilters = {
      ...filters,
      [name]: value,
    };

    console.log({ newFilters });

    setFilters(newFilters);
  };

  const handleSearch = () => {
    // Prepare search parameters
    const params = {
      vehicleId: filters.vehicleNo || undefined,
      subtripId: filters.subtripId || undefined,
      customerId: filters.customerId || undefined,
      fromDate: filters.startFromDate || undefined,
      toDate: filters.startEndDate || undefined,
      ewayExpiryFromDate: filters.ewayExpiryFromDate || undefined,
      ewayExpiryToDate: filters.ewayExpiryEndDate || undefined,
      subtripEndFromDate: filters.subtripEndFromDate || undefined,
      subtripEndToDate: filters.subtripEndEndDate || undefined,
      transporterId: filters.transportName || undefined,
      subtripStatus: filters.status?.length > 0 ? filters.status : undefined,
      materials: filters.materials?.length > 0 ? filters.materials : undefined,
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
    setFilters(DEFAULT_FILTERS);
    setSearchParams(null);
  };

  const handleToggleColumn = (columnName) => {
    if (disabledColumns[columnName]) return;
    setVisibleColumns((prev) => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };

  const handleToggleAllColumns = (checked) => {
    setVisibleColumns((prev) =>
      TABLE_COLUMNS.reduce((acc, column) => {
        acc[column.id] = disabledColumns[column.id] ? prev[column.id] : checked;
        return acc;
      }, {})
    );
  };

  // Filter the table head based on visible columns
  const visibleTableHead = TABLE_COLUMNS.filter(
    (column) => column.id === '' || visibleColumns[column.id]
  );

  // Get visible columns for export
  const getVisibleColumnsForExport = () =>
    TABLE_COLUMNS.filter((column) => visibleColumns[column.id]).map((column) => column.id);

  // Render methods for different states
  const renderNoFiltersState = () => (
    <Box sx={{ p: 5, textAlign: 'center' }}>
      <Iconify
        icon="mdi:file-search-outline"
        width={64}
        height={64}
        sx={{ color: 'text.disabled', mb: 2 }}
      />
      <Typography variant="h6" sx={{ mb: 1 }}>
        No Filters Applied
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: 'text.secondary', mb: 3, maxWidth: 500, mx: 'auto' }}
      >
        Please select filters and click search to view subtrip reports. You can filter by vehicle,
        customer, date range, or status.
      </Typography>
    </Box>
  );

  const renderLoadingState = () => (
    <Box
      sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}
    >
      <CircularProgress />
    </Box>
  );

  const renderNoResultsState = () => (
    <Box sx={{ p: 5, textAlign: 'center' }}>
      <Iconify
        icon="mdi:file-search-outline"
        width={64}
        height={64}
        sx={{ color: 'text.disabled', mb: 2 }}
      />
      <Typography variant="h6" sx={{ mb: 1 }}>
        No Results Found
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: 'text.secondary', mb: 3, maxWidth: 500, mx: 'auto' }}
      >
        {isFilterApplied
          ? 'No subtrips match your current filters. Try adjusting your search criteria or reset filters to see all results.'
          : 'No subtrip reports are available at this time.'}
      </Typography>
      {isFilterApplied && (
        <Button
          variant="outlined"
          startIcon={<Iconify icon="mdi:refresh" />}
          onClick={handleResetFilters}
          sx={{ mr: 1 }}
        >
          Reset Filters
        </Button>
      )}
    </Box>
  );

  const renderTableHeader = () => (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ mr: 1 }}>
          Results:
        </Typography>
        <Chip label={tableData.length} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
      </Box>

      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Iconify icon="mdi:export" />}
          onClick={() => {
            const selectedVisibleColumns = getVisibleColumnsForExport();
            exportToExcel(
              transformSubtripsForExcel(tableData, selectedVisibleColumns),
              'subtrip-reports'
            );
          }}
        >
          Export
        </Button>

        <PDFDownloadButton
          fileName="Subtrip-list.pdf"
          getDocument={async () => {
            const { default: SubtripListPdf } = await import('src/pdfs/subtrip-list-pdf');
            const visibleCols = getVisibleColumnsForExport();
            return () => <SubtripListPdf subtrips={tableData} visibleColumns={visibleCols} />;
          }}
        />

        <Button
          variant="outlined"
          size="small"
          startIcon={<Iconify icon="mdi:view-column" />}
          onClick={columnsPopover.onOpen}
        >
          Columns
        </Button>

        <CustomPopover
          open={columnsPopover.open}
          onClose={columnsPopover.onClose}
          anchorEl={columnsPopover.anchorEl}
          slotProps={{
            arrow: { placement: 'right-top' },
          }}
        >
          <ColumnSelectorList
            TABLE_COLUMNS={TABLE_COLUMNS}
            visibleColumns={visibleColumns}
            disabledColumns={disabledColumns}
            handleToggleColumn={handleToggleColumn}
            handleToggleAllColumns={handleToggleAllColumns}
          />
        </CustomPopover>
      </Stack>
    </Box>
  );

  const renderTableContent = () => (
    <>
      {renderTableHeader()}
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
                    const selectedVisibleColumns = getVisibleColumnsForExport();
                    exportToExcel(selectedRows, 'filtered', selectedVisibleColumns);
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
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }} stickyHeader>
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
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Subtrip Reports"
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
            name: 'Subtrip Reports',
          },
        ]}
        sx={{
          my: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <SubtripQuickFilters onFilters={handleFilters} />

        <SubtripTableFilters filters={filters} onFilters={handleFilters} />

        {isFilterApplied && (
          <SubtripTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
          />
        )}

        <Divider orientation="horizontal" flexItem />

        <SubtripTableActions onSearch={handleSearch} canSearch={isFilterApplied} />
      </Card>

      <Card sx={{ mt: 3 }}>
        {!searchParams
          ? renderNoFiltersState()
          : isLoading
            ? renderLoadingState()
            : notFound
              ? renderNoResultsState()
              : renderTableContent()}
      </Card>
    </DashboardContent>
  );
}
