/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ColumnSelectorList } from 'src/components/table';
import { usePopover } from 'src/components/custom-popover';

import { ACTIVITY_TYPES } from '../../part/part-constant';
import { PART_LOCATION_INVENTORY_ACTIVITY_TABLE_COLUMNS } from './part-location-inventory-activity-table-config';

export default function PartLocationInventoryActivityTableToolbar({
    filters,
    onFilters,
    dateRangeLabel,
    onOpenDateDialog,
    performedByLabel,
    onOpenContactsDialog,
    onResetFilters,
    canReset,
    visibleColumns,
    disabledColumns = {},
    onToggleColumn,
    onToggleAllColumns,
    onResetColumns,
    canResetColumns,
}) {
    const columnsPopover = usePopover();

    const handleFilterType = useCallback(
        (event) => {
            onFilters('type', event.target.value);
        },
        [onFilters]
    );

    return (
        <>
            <Stack
                spacing={2}
                alignItems={{ xs: 'flex-start', md: 'center' }}
                direction={{ xs: 'column', md: 'row' }}
                sx={{
                    pb: 2.5,
                    gap: 2,
                }}
            >
                <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }} size="small">
                    <InputLabel id="type-select-label">Type</InputLabel>
                    <Select
                        value={filters.type || ''}
                        onChange={handleFilterType}
                        input={<OutlinedInput label="Type" />}
                        labelId="type-select-label"
                    >
                        {ACTIVITY_TYPES.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                <Label variant="soft" color={opt.color}>
                                    {opt.label}
                                </Label>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    size="small"
                    label="Performed By"
                    value={performedByLabel}
                    onClick={onOpenContactsDialog}
                    sx={{ minWidth: 200 }}
                    InputProps={{
                        readOnly: true,
                    }}
                />

                <Button
                    variant="outlined"
                    startIcon={<Iconify icon="mdi:calendar" />}
                    onClick={onOpenDateDialog}
                    sx={{ px: 2 }}
                >
                    {dateRangeLabel}
                </Button>

                {canReset && (
                    <Button
                        variant="text"
                        color="secondary"
                        size="small"
                        onClick={onResetFilters}
                        startIcon={<Iconify icon="solar:restart-bold" />}
                    >
                        Reset filters
                    </Button>
                )}

                <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
                    <Button
                        color="inherit"
                        variant="outlined"
                        onClick={columnsPopover.onOpen}
                        startIcon={
                            <Badge color="error" variant="dot" invisible={!canResetColumns}>
                                <Iconify icon="solar:settings-bold" />
                            </Badge>
                        }
                        sx={{ flexShrink: 0 }}
                    >
                        Columns
                    </Button>
                </Stack>
            </Stack>

            <ColumnSelectorList
                open={Boolean(columnsPopover.open)}
                onClose={columnsPopover.onClose}
                TABLE_COLUMNS={PART_LOCATION_INVENTORY_ACTIVITY_TABLE_COLUMNS}
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
