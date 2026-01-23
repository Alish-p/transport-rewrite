/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { Iconify } from 'src/components/iconify';
import { ColumnSelectorList } from 'src/components/table';
import { usePopover } from 'src/components/custom-popover';

import { INVENTORY_ACTIVITY_TABLE_COLUMNS } from './part-inventory-activity-table-config';

const ACTIVITY_TYPES = [
  { value: 'all', label: 'All types' },
  { value: 'INITIAL', label: 'Initial' },
  { value: 'PURCHASE_RECEIPT', label: 'Purchase Receipt' },
  { value: 'ADJUSTMENT', label: 'Adjustment' },
  { value: 'TRANSFER', label: 'Transfer' },
  { value: 'WORK_ORDER_ISSUE', label: 'Work Order Issue' },
];

export default function PartInventoryActivityTableToolbar({
  filters,
  onFilters,
  locations,
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

  const handleFilterLocation = useCallback(
    (event) => {
      onFilters('inventoryLocation', event.target.value);
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
        <TextField
          select
          size="small"
          label="Type"
          value={filters.type}
          onChange={handleFilterType}
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
          onChange={handleFilterLocation}
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
          <Tooltip title="Column Settings">
            <Button
              onClick={columnsPopover.onOpen}
              startIcon={
                <Badge
                  color="error"
                  variant="dot"
                  invisible={!canResetColumns}
                  sx={{
                    '& .MuiBadge-badge': {
                      top: 2,
                      right: 2,
                    },
                  }}
                >
                  <Iconify icon="mdi:table-column-plus-after" />
                </Badge>
              }
            >
              Columns
            </Button>
          </Tooltip>
        </Stack>
      </Stack>

      <ColumnSelectorList
        open={Boolean(columnsPopover.open)}
        onClose={columnsPopover.onClose}
        TABLE_COLUMNS={INVENTORY_ACTIVITY_TABLE_COLUMNS}
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

