/* eslint-disable react/prop-types */
import { useMemo, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { usePaginatedPartLocations } from 'src/query/use-part-location';

import { Iconify } from 'src/components/iconify';
import { ColumnSelectorList } from 'src/components/table';
import { usePopover } from 'src/components/custom-popover';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { TABLE_COLUMNS } from './purchase-order-table-config';
import { KanbanPartsDialog } from '../kanban/components/kanban-parts-dialog';
import { KanbanVendorDialog } from '../kanban/components/kanban-vendor-dialog';

export default function PurchaseOrderTableToolbar({
  filters,
  onFilters,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
  onToggleAllColumns,
  onResetColumns,
  canResetColumns,
  selectedPart,
  onSelectPart,
  selectedVendor,
  onSelectVendor,
}) {
  const columnsPopover = usePopover();
  const partDialog = usePopover();
  const vendorDialog = useBoolean();
  const dateRange = useBoolean();

  const { data: locationsResponse } = usePaginatedPartLocations(
    { page: 1, rowsPerPage: 1000 },
    { staleTime: 1000 * 60 * 10 }
  );

  const locations = useMemo(
    () =>
      locationsResponse?.locations ||
      locationsResponse?.partLocations ||
      locationsResponse?.results ||
      [],
    [locationsResponse]
  );

  const handleSelectPart = useCallback(
    (part) => {
      if (onSelectPart) {
        onSelectPart(part || null);
      }
      partDialog.onClose();
    },
    [onSelectPart, partDialog]
  );

  const handleSelectVendor = useCallback(
    (vendor) => {
      onFilters('vendorId', vendor?._id || '');
      if (onSelectVendor) {
        onSelectVendor(vendor || null);
      }
    },
    [onFilters, onSelectVendor]
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
        <DialogSelectButton
          onClick={vendorDialog.onTrue}
          selected={selectedVendor?.name}
          placeholder="Filter by vendor"
          iconName="mdi:office-building"
          sx={{ maxWidth: 260 }}
        />

        <DialogSelectButton
          onClick={partDialog.onOpen}
          selected={selectedPart?.name}
          placeholder="Filter by part"
          iconName="mdi:cube"
          sx={{ maxWidth: 260 }}
        />

        <TextField
          select
          label="Part Location"
          value={filters.partLocationId || ''}
          onChange={(event) => onFilters('partLocationId', event.target.value || '')}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Locations</MenuItem>
          {locations.map((loc) => (
            <MenuItem key={loc._id} value={loc._id}>
              {loc.name}
            </MenuItem>
          ))}
        </TextField>

        <DialogSelectButton
          onClick={dateRange.onTrue}
          selected={
            filters.fromDate && filters.toDate
              ? fDateRangeShortLabel(filters.fromDate, filters.toDate)
              : undefined
          }
          placeholder="Filter by date range"
          iconName="mdi:calendar"
          sx={{ maxWidth: 260 }}
        />

        <Stack direction="row" spacing={1}>
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
        TABLE_COLUMNS={TABLE_COLUMNS}
        visibleColumns={visibleColumns}
        disabledColumns={disabledColumns}
        handleToggleColumn={onToggleColumn}
        handleToggleAllColumns={onToggleAllColumns}
        onResetColumns={onResetColumns}
        canResetColumns={canResetColumns}
      />

      <KanbanPartsDialog
        open={Boolean(partDialog.open)}
        onClose={partDialog.onClose}
        selectedPart={selectedPart}
        onPartChange={handleSelectPart}
      />

      <KanbanVendorDialog
        open={vendorDialog.value}
        onClose={vendorDialog.onFalse}
        selectedVendor={selectedVendor}
        onVendorChange={handleSelectVendor}
      />

      <CustomDateRangePicker
        variant="calendar"
        open={dateRange.value}
        onClose={dateRange.onFalse}
        startDate={filters.fromDate}
        endDate={filters.toDate}
        onChangeStartDate={(date) => onFilters('fromDate', date)}
        onChangeEndDate={(date) => onFilters('toDate', date)}
      />
    </>
  );
}
