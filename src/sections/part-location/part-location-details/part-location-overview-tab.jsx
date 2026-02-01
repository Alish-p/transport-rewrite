import { useNavigate } from 'react-router';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import TableCell from '@mui/material/TableCell';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import LinearProgress from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';

import { usePaginatedParts } from 'src/query/use-part';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {
    useTable,
    TableNoData,
    TableSkeleton,
    TableHeadCustom,
    TablePaginationCustom,
} from 'src/components/table';

const TABLE_HEAD = [
    { id: 'partNumber', label: 'Part #', width: 120 },
    { id: 'name', label: 'Part Details' },
    { id: 'category', label: 'Category', width: 140 },
    { id: 'quantity', label: 'Stock Level', width: 180 },
    { id: 'unitCost', label: 'Unit Cost', width: 100 },
    { id: 'status', label: 'Status', width: 120, align: 'center' },
];

// ----------------------------------------------------------------------

function StockLevelIndicator({ quantity, threshold, unit }) {
    const theme = useTheme();

    const percentage = threshold > 0 ? Math.min((quantity / threshold) * 100, 100) : 100;
    const isLow = quantity < threshold && quantity > 0;
    const isOut = quantity === 0;

    let color = theme.palette.success.main;
    if (isOut) color = theme.palette.error.main;
    else if (isLow) color = theme.palette.warning.main;

    return (
        <Tooltip title={`${quantity} ${unit} / Threshold: ${threshold} ${unit}`} arrow placement="top">
            <Box sx={{ width: '100%', maxWidth: 140 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {quantity}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {unit}
                    </Typography>
                </Stack>
                <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                        height: 6,
                        borderRadius: 1,
                        bgcolor: alpha(color, 0.16),
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 1,
                            bgcolor: color,
                        },
                    }}
                />
            </Box>
        </Tooltip>
    );
}

// ----------------------------------------------------------------------

function StatCard({ title, value, icon, color, onClick, active }) {
    const theme = useTheme();

    return (
        <Card
            onClick={onClick}
            sx={{
                p: 3,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s ease-in-out',
                border: active ? `2px solid ${color}` : '2px solid transparent',
                '&:hover': onClick
                    ? {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.customShadows?.z8 || theme.shadows[8],
                    }
                    : {},
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        display: 'flex',
                        borderRadius: 1.5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(color, 0.12),
                    }}
                >
                    <Iconify icon={icon} width={28} sx={{ color }} />
                </Box>
                <Box>
                    <Typography variant="h3" sx={{ color }}>
                        {value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {title}
                    </Typography>
                </Box>
            </Stack>
        </Card>
    );
}

// ----------------------------------------------------------------------

export function PartLocationOverviewTab({ partLocation }) {
    const theme = useTheme();
    const navigate = useNavigate();
    const table = useTable({ defaultOrderBy: 'name' });

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const { data, isLoading } = usePaginatedParts(
        {
            inventoryLocation: partLocation?._id,
            search: search || undefined,
            page: table.page + 1,
            rowsPerPage: table.rowsPerPage,
        },
        {
            enabled: !!partLocation?._id,
        }
    );

    const parts = data?.parts || [];
    const totalParts = data?.total || 0;
    const outOfStock = data?.outOfStockItems || 0;
    const lowStock = data?.lowStockItems || 0;
    const inStock = totalParts - outOfStock - lowStock;

    // Filter parts based on status filter
    const filteredParts = parts.filter((part) => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'outOfStock') return part.totalQuantity === 0;
        if (statusFilter === 'lowStock')
            return part.totalQuantity < part.threshold && part.totalQuantity > 0;
        if (statusFilter === 'inStock') return part.totalQuantity >= part.threshold;
        return true;
    });

    const notFound = !filteredParts.length && !isLoading;

    const handleSearchChange = useCallback(
        (event) => {
            setSearch(event.target.value);
            table.onResetPage();
        },
        [table]
    );

    const handleStatusFilter = useCallback(
        (status) => {
            setStatusFilter((prev) => (prev === status ? 'all' : status));
            table.onResetPage();
        },
        [table]
    );

    const handleRowClick = useCallback(
        (partId) => {
            navigate(paths.dashboard.part.details(partId));
        },
        [navigate]
    );

    return (
        <Stack spacing={3}>
            {/* Stats Row */}
            <Grid container spacing={3}>
                <Grid xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Parts"
                        value={totalParts}
                        icon="mdi:package-variant-closed"
                        color={theme.palette.info.main}
                        onClick={() => handleStatusFilter('all')}
                        active={statusFilter === 'all'}
                    />
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                    <StatCard
                        title="In Stock"
                        value={inStock}
                        icon="mdi:check-circle-outline"
                        color={theme.palette.success.main}
                        onClick={() => handleStatusFilter('inStock')}
                        active={statusFilter === 'inStock'}
                    />
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                    <StatCard
                        title="Low Stock"
                        value={lowStock}
                        icon="mdi:alert-outline"
                        color={theme.palette.warning.main}
                        onClick={() => handleStatusFilter('lowStock')}
                        active={statusFilter === 'lowStock'}
                    />
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                    <StatCard
                        title="Out of Stock"
                        value={outOfStock}
                        icon="mdi:alert-circle-outline"
                        color={theme.palette.error.main}
                        onClick={() => handleStatusFilter('outOfStock')}
                        active={statusFilter === 'outOfStock'}
                    />
                </Grid>
            </Grid>

            {/* Parts Table */}
            <Card>
                <CardHeader
                    title={
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <span>Parts Inventory</span>
                            {statusFilter !== 'all' && (
                                <Chip
                                    size="small"
                                    label={
                                        statusFilter === 'outOfStock'
                                            ? 'Out of Stock'
                                            : statusFilter === 'lowStock'
                                                ? 'Low Stock'
                                                : 'In Stock'
                                    }
                                    onDelete={() => setStatusFilter('all')}
                                    color={
                                        statusFilter === 'outOfStock'
                                            ? 'error'
                                            : statusFilter === 'lowStock'
                                                ? 'warning'
                                                : 'success'
                                    }
                                />
                            )}
                        </Stack>
                    }
                    action={
                        <TextField
                            size="small"
                            placeholder="Search parts..."
                            value={search}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: 240 }}
                        />
                    }
                    sx={{ mb: 1 }}
                />

                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    <Scrollbar>
                        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                            <TableHeadCustom
                                order={table.order}
                                orderBy={table.orderBy}
                                headLabel={TABLE_HEAD}
                                onSort={table.onSort}
                            />

                            <TableBody>
                                {isLoading
                                    ? Array.from({ length: 5 }).map((_, index) => (
                                        <TableSkeleton key={index} sx={{ height: 72 }} />
                                    ))
                                    : filteredParts.map((row) => {
                                        const isLowStock = row.totalQuantity < row.threshold;
                                        const isOutOfStock = row.totalQuantity === 0;

                                        return (
                                            <TableRow
                                                key={row._id}
                                                hover
                                                onClick={() => handleRowClick(row._id)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    ...(isOutOfStock && {
                                                        bgcolor: alpha(theme.palette.error.main, 0.04),
                                                    }),
                                                    ...(isLowStock &&
                                                        !isOutOfStock && {
                                                        bgcolor: alpha(theme.palette.warning.main, 0.04),
                                                    }),
                                                    '&:hover': {
                                                        bgcolor: isOutOfStock
                                                            ? alpha(theme.palette.error.main, 0.08)
                                                            : isLowStock
                                                                ? alpha(theme.palette.warning.main, 0.08)
                                                                : undefined,
                                                    },
                                                }}
                                            >
                                                <TableCell>
                                                    <Typography variant="subtitle2" sx={{ fontFamily: 'monospace' }}>
                                                        {row.partNumber}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Stack spacing={0.5}>
                                                        <Typography variant="subtitle2">{row.name}</Typography>
                                                        {row.manufacturer && (
                                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                                {row.manufacturer}
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    {row.category && (
                                                        <Chip
                                                            size="small"
                                                            label={row.category}
                                                            variant="soft"
                                                            sx={{ borderRadius: 1 }}
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <StockLevelIndicator
                                                        quantity={row.totalQuantity}
                                                        threshold={row.threshold}
                                                        unit={row.measurementUnit || 'units'}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        ₹{row.unitCost?.toLocaleString() || 0}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Label
                                                        variant="soft"
                                                        color={isOutOfStock ? 'error' : isLowStock ? 'warning' : 'success'}
                                                    >
                                                        {isOutOfStock
                                                            ? 'Out of Stock'
                                                            : isLowStock
                                                                ? 'Low Stock'
                                                                : 'In Stock'}
                                                    </Label>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}

                                <TableNoData notFound={notFound} />
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </TableContainer>

                <TablePaginationCustom
                    count={totalParts}
                    page={table.page}
                    rowsPerPage={table.rowsPerPage}
                    onPageChange={table.onChangePage}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                    dense={table.dense}
                    onChangeDense={table.onChangeDense}
                />
            </Card>
        </Stack>
    );
}
