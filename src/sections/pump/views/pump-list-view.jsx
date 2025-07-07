import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
// @mui
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

// _mock

import { useNavigate } from 'react-router';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useFilters } from 'src/hooks/use-filters';
import { useColumnVisibility } from 'src/hooks/use-column-visibility';

import { paramCase } from 'src/utils/change-case';
import { exportToExcel, prepareDataForExport } from 'src/utils/export-to-excel';

import { useDeletePump, usePaginatedPumps } from 'src/query/use-pump';
import { DashboardContent } from 'src/layouts/dashboard';

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
  TableSkeleton,
} from 'src/components/table';

import PumpTableRow from '../pump-table-row';
import PumpTableToolbar from '../pump-table-toolbar';
import { TABLE_COLUMNS } from '../pump-table-config';
import PumpTableFiltersResult from '../pump-table-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  search: '',
};

// ----------------------------------------------------------------------

export function PumpListView() {
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();

  const deletePump = useDeletePump();

  const navigate = useNavigate();

  const { filters, handleFilters, handleResetFilters, canReset } = useFilters(defaultFilters, {
    onResetPage: table.onResetPage,
  });

  const {
    visibleColumns,
    visibleHeaders,
    disabledColumns,
    toggleColumnVisibility,
    toggleAllColumnsVisibility,
  } = useColumnVisibility(TABLE_COLUMNS);

  const { data, isLoading } = usePaginatedPumps({
    search: filters.search || undefined,
    page: table.page + 1,
    rowsPerPage: table.rowsPerPage,
  });

  useEffect(() => {
    if (data?.pumps) {
      setTableData(data.pumps);
    }
  }, [data]);

  const totalCount = data?.total || 0;

  const [tableData, setTableData] = useState([]);

  const denseHeight = table.dense ? 56 : 76;

  const notFound = (!tableData.length && canReset) || !tableData.length;

  const handleEditRow = (id) => {
    navigate(paths.dashboard.pump.edit(paramCase(id)));
  };

  const handleDeleteRows = useCallback(() => { }, []);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.pump.details(id));
    },
    [router]
  );

  // Update handler for toggling column visibility to respect disabled columns
  const handleToggleColumn = useCallback(
    (columnName) => {
      toggleColumnVisibility(columnName);
    },
    [toggleColumnVisibility]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Pumps List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Pumps',
              href: paths.dashboard.pump.root,
            },
            {
              name: 'Pumps List',
            },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.pump.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Pump
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        {/* Table Section */}
        <Card>
          <PumpTableToolbar
            filters={filters}
            onFilters={handleFilters}
            tableData={tableData}
            visibleColumns={visibleColumns}
            disabledColumns={disabledColumns}
            onToggleColumn={handleToggleColumn}
            onToggleAllColumns={toggleAllColumnsVisibility}
          />

          {canReset && (
            <PumpTableFiltersResult
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
                        const selectedRows = tableData.filter((r) =>
                          table.selected.includes(r._id)
                        );
                        const visibleCols = Object.keys(visibleColumns).filter(
                          (c) => visibleColumns[c]
                        );
                        exportToExcel(
                          prepareDataForExport(selectedRows, TABLE_COLUMNS, visibleCols),
                          'Pumps-selected'
                        );
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
                  headLabel={visibleHeaders}
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
                  {isLoading
                    ? Array.from({ length: table.rowsPerPage }).map((_, i) => (
                        <TableSkeleton key={i} />
                      ))
                    : tableData.map((row) => (
                      <PumpTableRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onDeleteRow={() => deletePump(row._id)}
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
