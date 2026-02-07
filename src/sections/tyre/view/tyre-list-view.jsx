import { useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useFilters } from 'src/hooks/use-filters';
import { useColumnVisibility } from 'src/hooks/use-column-visibility';

import { useGetTyres } from 'src/query/use-tyre';
import { DashboardContent } from 'src/layouts/dashboard';

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

import TyreTableRow from '../tyre-table-row';
import TyreTableToolbar from '../tyre-table-toolbar';
import { TYRE_TABLE_COLUMNS } from '../tyre-table-config';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'tyre-table-columns';

const defaultFilters = {
    serialNumber: '',
    brand: '',
};

export default function TyreListView() {
    const router = useRouter();
    const table = useTable({ defaultOrderBy: 'serialNumber', syncToUrl: true });

    const { filters, handleFilters, canReset } = useFilters(defaultFilters, {
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
    } = useColumnVisibility(TYRE_TABLE_COLUMNS, STORAGE_KEY);

    const { data, isLoading } = useGetTyres({
        page: table.page + 1,
        limit: table.rowsPerPage,
        serialNumber: filters.serialNumber || undefined,
        brand: filters.brand || undefined,
    });

    const tableData = data?.tyres || data?.data || [];
    const totalCount = data?.total || 0;

    const notFound = (!tableData.length && canReset) || !tableData.length;

    const handleEditRow = useCallback(
        (id) => {
            router.push(paths.dashboard.tyre.edit(id));
            console.info('EDIT', id);
        },
        [router]
    );

    const handleViewRow = useCallback(
        (id) => {
            router.push(paths.dashboard.tyre.details(id));
            console.info('VIEW', id);
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
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Tyre List"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Tyre', href: paths.dashboard.tyre.root },
                    { name: 'List' },
                ]}
                action={
                    <Button
                        component={RouterLink}
                        href={paths.dashboard.tyre.new}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        New Tyre
                    </Button>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Card>
                <TyreTableToolbar
                    filters={filters}
                    onFilters={handleFilters}
                    visibleColumns={visibleColumns}
                    disabledColumns={disabledColumns}
                    onToggleColumn={handleToggleColumn}
                    onToggleAllColumns={toggleAllColumnsVisibility}
                    onResetColumns={resetColumns}
                    canResetColumns={canResetColumns}
                />

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
                                        <TyreTableRow
                                            key={row._id}
                                            row={row}
                                            selected={table.selected.includes(row._id)}
                                            onSelectRow={() => table.onSelectRow(row._id)}
                                            onViewRow={() => handleViewRow(row._id)}
                                            onEditRow={() => handleEditRow(row._id)}
                                            onDeleteRow={() => console.info('DELETE', row._id)}
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
