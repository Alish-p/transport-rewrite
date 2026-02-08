import { useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useFilters } from 'src/hooks/use-filters';
import { useColumnVisibility } from 'src/hooks/use-column-visibility';

import { useGetTyres } from 'src/query/use-tyre';
import { useVehicle } from 'src/query/use-vehicle';
import { DashboardContent } from 'src/layouts/dashboard';

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

import TyreAnalytic from '../tyre-analytic';
import TyreTableRow from '../tyre-table-row';
import { TYRE_STATUS } from '../tyre-constants';
import TyreTableToolbar from '../tyre-table-toolbar';
import { TYRE_TABLE_COLUMNS } from '../tyre-table-config';
import TyreTableFiltersResult from '../tyre-table-filters-result';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'tyre-table-columns';

const defaultFilters = {
    serialNumber: '',
    brand: '',
    status: 'all',
    vehicle: null,
};

export default function TyreListView() {
    const theme = useTheme();
    const router = useRouter();
    const table = useTable({ defaultOrderBy: 'serialNumber', syncToUrl: true });

    const { filters, handleFilters, canReset, handleResetFilters } = useFilters(defaultFilters, {
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
        vehicleId: filters.vehicle || undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
    });

    const { data: vehicleData } = useVehicle(filters.vehicle);

    const tableData = data?.tyres || data?.data || [];
    const totalCount = data?.total || 0;
    const totals = data?.totals || {};

    const getTyreLength = (status) => totals[status]?.count || 0;
    const getTotalValue = (status) => totals[status]?.value || 0;
    const getPercentByStatus = (status) => (totalCount ? (getTyreLength(status) / totalCount) * 100 : 0);

    const TABS = [
        { value: 'all', label: 'All', color: 'default', count: totals.all?.count || 0 },
        { value: TYRE_STATUS.IN_STOCK, label: 'In Stock', color: 'success', count: getTyreLength(TYRE_STATUS.IN_STOCK) },
        { value: TYRE_STATUS.MOUNTED, label: 'Mounted', color: 'warning', count: getTyreLength(TYRE_STATUS.MOUNTED) },
        { value: TYRE_STATUS.SCRAPPED, label: 'Scrapped', color: 'error', count: getTyreLength(TYRE_STATUS.SCRAPPED) },
    ];

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

    const handleFilterStatus = useCallback(
        (event, newValue) => {
            handleFilters('status', newValue);
        },
        [handleFilters]
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
                        <TyreAnalytic
                            title="All"
                            total={totals.all?.count || 0}
                            percent={100}
                            price={totals.all?.value || 0}
                            icon="solar:bill-list-bold-duotone"
                            color={theme.palette.info.main}
                        />

                        <TyreAnalytic
                            title="In Stock"
                            total={getTyreLength(TYRE_STATUS.IN_STOCK)}
                            percent={getPercentByStatus(TYRE_STATUS.IN_STOCK)}
                            price={getTotalValue(TYRE_STATUS.IN_STOCK)}
                            icon="solar:box-bold-duotone"
                            color={theme.palette.success.main}
                        />

                        <TyreAnalytic
                            title="Mounted"
                            total={getTyreLength(TYRE_STATUS.MOUNTED)}
                            percent={getPercentByStatus(TYRE_STATUS.MOUNTED)}
                            price={getTotalValue(TYRE_STATUS.MOUNTED)}
                            icon="solar:wheel-angle-bold-duotone"
                            color={theme.palette.warning.main}
                        />

                        <TyreAnalytic
                            title="Scrapped"
                            total={getTyreLength(TYRE_STATUS.SCRAPPED)}
                            percent={getPercentByStatus(TYRE_STATUS.SCRAPPED)}
                            price={getTotalValue(TYRE_STATUS.SCRAPPED)}
                            icon="solar:trash-bin-trash-bold-duotone"
                            color={theme.palette.error.main}
                        />
                    </Stack>
                </Scrollbar>
            </Card>

            <Card>
                <Tabs
                    value={filters.status}
                    onChange={handleFilterStatus}
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
                                        ((tab.value === 'all' || tab.value === filters.status) && 'filled') ||
                                        'soft'
                                    }
                                    color={tab.color}
                                >
                                    {tab.count}
                                </Label>
                            }
                        />
                    ))}
                </Tabs>
                <TyreTableToolbar
                    filters={filters}
                    onFilters={handleFilters}
                    visibleColumns={visibleColumns}
                    disabledColumns={disabledColumns}
                    onToggleColumn={handleToggleColumn}
                    onToggleAllColumns={toggleAllColumnsVisibility}
                    onResetColumns={resetColumns}
                    canResetColumns={canResetColumns}
                    vehicleData={vehicleData}
                />

                {canReset && (
                    <TyreTableFiltersResult
                        filters={filters}
                        onFilters={handleFilters}
                        //
                        onResetFilters={handleResetFilters}
                        //
                        results={totalCount}
                        selectedVehicleName={vehicleData?.vehicleNo}
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
