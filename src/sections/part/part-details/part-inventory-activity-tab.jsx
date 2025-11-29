import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useTable, TablePaginationCustom } from 'src/components/table';

import { useBoolean } from 'src/hooks/use-boolean';
import { useFilters } from 'src/hooks/use-filters';

import { fDateTime, fDateRangeShortLabel } from 'src/utils/format-time';

import { usePaginatedInventoryActivities } from 'src/query/use-inventory-activity';
import { usePaginatedPartLocations } from 'src/query/use-part-location';
import { useUsers } from 'src/query/use-user';

export function PartInventoryActivityTab({ partId }) {
    const defaultFilters = useMemo(
        () => ({
            fromDate: null,
            toDate: null,
            type: 'all',
            inventoryLocation: '',
            performedBy: '',
        }),
        []
    );

    const table = useTable({
        defaultOrderBy: 'activityDate',
        defaultRowsPerPage: 10,
    });

    const { filters, handleFilters, handleResetFilters, canReset } = useFilters(defaultFilters, {
        onResetPage: table.onResetPage,
    });

    const dateDialog = useBoolean();

    const { data: locationsResponse } = usePaginatedPartLocations(
        { page: 1, rowsPerPage: 1000 },
        { staleTime: 1000 * 60 * 10 }
    );

    const { data: users = [] } = useUsers();

    const locations =
        locationsResponse?.locations ||
        locationsResponse?.partLocations ||
        locationsResponse?.results ||
        [];

    const { data, isLoading } = usePaginatedInventoryActivities({
        part: partId,
        fromDate: filters.fromDate ? filters.fromDate.toISOString() : undefined,
        toDate: filters.toDate ? filters.toDate.toISOString() : undefined,
        type: filters.type === 'all' ? undefined : filters.type,
        inventoryLocation: filters.inventoryLocation || undefined,
        performedBy: filters.performedBy || undefined,
        limit: table.rowsPerPage,
        skip: table.page * table.rowsPerPage,
    });

    const activities = data?.activities || data?.results || data?.rows || [];
    const totalCount =
        data?.total || data?.count || data?.pagination?.total || (isLoading ? 0 : activities.length);

    const handleChangeStartDate = (date) => {
        handleFilters('fromDate', date);
    };

    const handleChangeEndDate = (date) => {
        handleFilters('toDate', date);
    };

    const ACTIVITY_TYPES = [
        { value: 'all', label: 'All types' },
        { value: 'INITIAL', label: 'Initial' },
        { value: 'PURCHASE_RECEIPT', label: 'Purchase Receipt' },
        { value: 'ADJUSTMENT', label: 'Adjustment' },
        { value: 'TRANSFER', label: 'Transfer' },
        { value: 'WORK_ORDER_ISSUE', label: 'Work Order Issue' },
    ];

    return (
        <Card>
            <CardHeader title="Inventory Activity" />
            <Box sx={{ p: 3 }}>
                <Stack
                    spacing={2}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    direction={{ xs: 'column', md: 'row' }}
                    sx={{ mb: 2 }}
                >
                    <TextField
                        select
                        size="small"
                        label="Type"
                        value={filters.type}
                        onChange={(event) => handleFilters('type', event.target.value)}
                        sx={{ minWidth: 160 }}
                    >
                        {ACTIVITY_TYPES.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        size="small"
                        label="Location"
                        value={filters.inventoryLocation}
                        onChange={(event) => handleFilters('inventoryLocation', event.target.value)}
                        sx={{ minWidth: 200 }}
                    >
                        <MenuItem value="">All locations</MenuItem>
                        {locations.map((loc) => (
                            <MenuItem key={loc._id} value={loc._id}>
                                {loc.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        size="small"
                        label="Performed By"
                        value={filters.performedBy}
                        onChange={(event) => handleFilters('performedBy', event.target.value)}
                        sx={{ minWidth: 200 }}
                    >
                        <MenuItem value="">All users</MenuItem>
                        {users.map((user) => (
                            <MenuItem key={user._id} value={user._id}>
                                {user.name || user.email}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Iconify icon="mdi:calendar" />}
                        onClick={dateDialog.onTrue}
                    >
                        {filters.fromDate && filters.toDate
                            ? fDateRangeShortLabel(filters.fromDate, filters.toDate)
                            : 'Date range'}
                    </Button>

                    {canReset && (
                        <Button
                            variant="text"
                            color="secondary"
                            size="small"
                            onClick={handleResetFilters}
                            startIcon={<Iconify icon="solar:restart-bold" />}
                        >
                            Reset filters
                        </Button>
                    )}
                </Stack>

                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    <Scrollbar>
                        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell align="right">Qty Change</TableCell>
                                    <TableCell align="right">Qty After</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Performed By</TableCell>
                                    <TableCell>Note</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!isLoading &&
                                    activities.map((activity) => {
                                        const qtyChange =
                                            activity.quantityChange ??
                                            activity.delta ??
                                            activity.change ??
                                            activity.quantityDelta;
                                        const qtyAfter =
                                            activity.quantityAfter ?? activity.newQuantity ?? activity.currentQuantity;

                                        return (
                                            <TableRow key={activity._id}>
                                                <TableCell>
                                                    {activity.activityDate || activity.date || activity.createdAt
                                                        ? fDateTime(
                                                            activity.activityDate || activity.date || activity.createdAt
                                                        )
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>{activity.type || '-'}</TableCell>
                                                <TableCell align="right">
                                                    {typeof qtyChange === 'number' ? qtyChange : '-'}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {typeof qtyAfter === 'number' ? qtyAfter : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {activity.inventoryLocation?.name || activity.locationName || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {activity.performedBy?.name ||
                                                        activity.performedBy?.email ||
                                                        activity.performedByName ||
                                                        '-'}
                                                </TableCell>
                                                <TableCell>{activity.note || activity.description || '-'}</TableCell>
                                            </TableRow>
                                        );
                                    })}

                                {!isLoading && !activities.length && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <Typography variant="body2" color="text.secondary">
                                                No inventory activity found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <Typography variant="body2" color="text.secondary">
                                                Loading inventory activity...
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
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
                />

                <CustomDateRangePicker
                    open={dateDialog.value}
                    onClose={dateDialog.onFalse}
                    startDate={filters.fromDate}
                    endDate={filters.toDate}
                    onChangeStartDate={handleChangeStartDate}
                    onChangeEndDate={handleChangeEndDate}
                />
            </Box>
        </Card>
    );
}
