import { useNavigate } from 'react-router';
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

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useFilters } from 'src/hooks/use-filters';
import { useColumnVisibility } from 'src/hooks/use-column-visibility';

import { paramCase } from 'src/utils/change-case';
import { exportToExcel, prepareDataForExport } from 'src/utils/export-to-excel';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useDeleteDieselPrice,
  usePaginatedDieselPrices,
} from 'src/query/use-diesel-prices';

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
} from 'src/components/table';

import DieselPriceTableRow from '../diesel-price-table-row';
import { TABLE_COLUMNS } from '../diesel-price-table-config';
import DieselPriceTableToolbar from '../diesel-price-table-toolbar';
import DieselPriceTableFiltersResult from '../diesel-price-table-filters-result';

// ----------------------------------------------------------------------


const defaultFilters = {
  pump: null,
  fromDate: null,
  toDate: null,
};

// ----------------------------------------------------------------------

export function DieselPriceListView() {
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();

  const navigate = useNavigate();
  const deleteDieselPrice = useDeleteDieselPrice();

  const { filters, handleFilters, handleResetFilters, canReset } = useFilters(
    defaultFilters,
    {
      onResetPage: table.onResetPage,
    }
  );

  const {
    visibleColumns,
    visibleHeaders,
    disabledColumns,
    toggleColumnVisibility,
    toggleAllColumnsVisibility,
  } = useColumnVisibility(TABLE_COLUMNS);

  const { data, isLoading } = usePaginatedDieselPrices({
    pumpId: filters.pump?._id,
    fromDate: filters.fromDate || undefined,
    toDate: filters.toDate || undefined,
    page: table.page + 1,
    rowsPerPage: table.rowsPerPage,
  });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (data?.dieselPrices) {
      setTableData(data.dieselPrices);
    }
  }, [data]);

  const totalCount = data?.total || 0;

  const notFound = !isLoading && !tableData.length;

  const handleEditRow = (id) => {
    navigate(paths.dashboard.diesel.edit(paramCase(id)));
  };

  const handleDeleteRows = useCallback(() => { }, []);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.diesel.details(id));
    },
    [router]
  );

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
          heading="Diesel Prices List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Diesel Prices',
              href: paths.dashboard.diesel.root,
            },
            {
              name: 'Diesel Prices List',
            },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.diesel.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Diesel Price
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        {/* Table Section */}
        <Card>
          <DieselPriceTableToolbar
            filters={filters}
            onFilters={handleFilters}
            tableData={tableData}
            visibleColumns={visibleColumns}
            disabledColumns={disabledColumns}
            onToggleColumn={handleToggleColumn}
            onToggleAllColumns={toggleAllColumnsVisibility}
          />

          {canReset && (
            <DieselPriceTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
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
                          prepareDataForExport(
                            selectedRows,
                            TABLE_COLUMNS,
                            visibleCols
                          ),
                          'DieselPrice-selected'
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
                  {(isLoading ? [] : tableData).map((row) => (
                    <DieselPriceTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onViewRow={() => handleViewRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
                      onDeleteRow={() => deleteDieselPrice(row._id)}
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

