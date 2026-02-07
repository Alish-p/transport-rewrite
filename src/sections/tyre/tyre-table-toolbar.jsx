/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { ColumnSelectorList } from 'src/components/table';
import { usePopover } from 'src/components/custom-popover';
import { DialogSelectButton } from 'src/components/dialog-select-button/dialog-select-button';

import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';

import { TYRE_TABLE_COLUMNS } from './tyre-table-config';

// ----------------------------------------------------------------------

export default function TyreTableToolbar({
    filters,
    onFilters,
    visibleColumns,
    disabledColumns,
    //
    onToggleColumn,
    onToggleAllColumns,
    onResetColumns,
    canResetColumns,
    vehicleData,
}) {
    const columnsPopover = usePopover();

    const vehiclePopover = usePopover();

    const handleFilterVehicle = useCallback(
        (vehicle) => {
            onFilters('vehicle', vehicle?._id || null);
        },
        [onFilters]
    );

    const handleFilterTyreNumber = useCallback(
        (event) => {
            onFilters('serialNumber', event.target.value);
        },
        [onFilters]
    );

    const handleFilterBrand = useCallback(
        (event) => {
            onFilters('brand', event.target.value);
        },
        [onFilters]
    );

    return (
        <>
            <Stack
                spacing={2}
                alignItems={{ xs: 'flex-end', md: 'center' }}
                direction={{
                    xs: 'column',
                    md: 'row',
                }}
                sx={{
                    p: 2.5,
                    pr: { xs: 2.5, md: 1 },
                }}
            >
                <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
                    <TextField
                        fullWidth
                        value={filters.serialNumber}
                        onChange={handleFilterTyreNumber}
                        placeholder="Search Tyre Number..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        value={filters.brand}
                        onChange={handleFilterBrand}
                        placeholder="Search Brand..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <DialogSelectButton
                        fullWidth
                        onClick={vehiclePopover.onOpen}
                        disabled={false}
                        iconName="mdi:truck-outline"
                        placeholder="Filter by Vehicle"
                        selected={vehicleData?.vehicleNo}
                        onClear={() => handleFilterVehicle(null)}
                        sx={{ maxWidth: { md: 200 } }}
                    />

                    <KanbanVehicleDialog
                        open={vehiclePopover.open}
                        onClose={vehiclePopover.onClose}
                        onVehicleChange={handleFilterVehicle}
                        onlyOwn
                    />
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Column Settings">
                        <Button
                            onClick={columnsPopover.onOpen}
                            startIcon={<Iconify icon="mdi:table-column-plus-after" />}
                        >
                            Columns
                        </Button>
                    </Tooltip>
                </Stack>
            </Stack>

            <ColumnSelectorList
                open={Boolean(columnsPopover.open)}
                onClose={columnsPopover.onClose}
                TABLE_COLUMNS={TYRE_TABLE_COLUMNS}
                visibleColumns={visibleColumns}
                disabledColumns={disabledColumns}
                handleToggleColumn={onToggleColumn}
                handleToggleAllColumns={onToggleAllColumns}
                onResetColumns={onResetColumns}
                canResetColumns={canResetColumns}
            />
        </>
    );
}
