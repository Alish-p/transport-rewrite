import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { useBoolean } from 'src/hooks/use-boolean';
import { useFilters } from 'src/hooks/use-filters';

import { fDateTime, fDateRangeShortLabel } from 'src/utils/format-time';

import { usePaginatedPartLocations } from 'src/query/use-part-location';
import { usePaginatedInventoryActivities } from 'src/query/use-inventory-activity';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useTable, TablePaginationCustom } from 'src/components/table';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';
import { KanbanContactsDialog } from 'src/sections/kanban/components/kanban-contacts-dialog';

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
    const contactsDialog = useBoolean();

    const [performedByAssignees, setPerformedByAssignees] = useState([]);

    const { data: locationsResponse } = usePaginatedPartLocations(
        { page: 1, rowsPerPage: 1000 },
        { staleTime: 1000 * 60 * 10 }
    );

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
                        size="small"
                        label="Performed By"
                        value={
                            performedByAssignees[0]?.name ||
                            performedByAssignees[0]?.email ||
                            'All users'
                        }
                        onClick={contactsDialog.onTrue}
                        sx={{ minWidth: 200 }}
                        InputProps={{
                            readOnly: true,
                        }}
                    />

                    <Button
                        variant="outlined"
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
                            onClick={() => {
                                handleResetFilters();
                                setPerformedByAssignees([]);
                            }}
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
                                    <TableCell>Part Location</TableCell>
                                    <TableCell>Adjustment Type</TableCell>
                                    <TableCell>Adjustment Reason</TableCell>
                                    <TableCell align="right">Qty</TableCell>
                                    <TableCell>Performed By</TableCell>
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
                                        const previousQty =
                                            typeof qtyChange === 'number' && typeof qtyAfter === 'number'
                                                ? qtyAfter - qtyChange
                                                : null;

                                        return (
                                            <TableRow key={activity._id}>
                                                <TableCell>
                                                    {activity.activityDate || activity.date || activity.createdAt
                                                        ? fDateTime(
                                                            activity.activityDate || activity.date || activity.createdAt
                                                        )
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {activity.inventoryLocation?.name || activity.locationName || '-'}
                                                </TableCell>
                                                <TableCell>{activity.type || '-'}</TableCell>
                                                <TableCell>{activity.reason || '-'}</TableCell>

                                                <TableCell >
                                                    <QuantityChangeVisual
                                                        previousQty={activity.quantityBefore}
                                                        qtyAfter={qtyAfter}
                                                        qtyChange={qtyChange}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    {activity.performedBy?.name ||
                                                        activity.performedBy?.email ||
                                                        activity.performedByName ||
                                                        '-'}
                                                </TableCell>
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

                <KanbanContactsDialog
                    open={contactsDialog.value}
                    onClose={contactsDialog.onFalse}
                    assignees={performedByAssignees}
                    onAssigneeChange={(newAssignees) => {
                        setPerformedByAssignees(newAssignees);
                        const selected = newAssignees[0];
                        handleFilters('performedBy', selected?._id || '');
                        if (contactsDialog.value) {
                            contactsDialog.onFalse();
                        }
                    }}
                    single
                />
            </Box>
        </Card>
    );
}




export function QuantityChangeVisual({ previousQty, qtyAfter, qtyChange }) {
    if (typeof previousQty !== 'number' || typeof qtyAfter !== 'number') {
        return '-';
    }

    const isIncrease = qtyChange > 0;
    const color = isIncrease ? 'success' : qtyChange < 0 ? 'error' : 'grey';

    return (
        <Stack spacing={0.5} alignItems="flex-end">
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                    variant="caption"
                    sx={{
                        color: 'text.secondary',
                        textDecoration: 'line-through',
                        opacity: 0.7,
                    }}
                >
                    {previousQty}
                </Typography>
                <Iconify
                    icon="mdi:arrow-right"
                    width={14}
                    sx={{ color: 'text.disabled' }}
                />
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 700,
                        fontSize: '0.9375rem',
                    }}
                >
                    {qtyAfter}
                </Typography>
            </Stack>
            <Typography
                variant="caption"
                sx={{
                    color: `${color}.main`,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.25,
                }}
            >
                <Iconify
                    icon={isIncrease ? 'mdi:triangle-small-up' : 'mdi:triangle-small-down'}
                    width={16}
                />
                {isIncrease ? '+' : ''}{qtyChange}
            </Typography>
        </Stack>
    );
}
