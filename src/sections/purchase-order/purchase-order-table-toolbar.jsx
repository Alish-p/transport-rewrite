/* eslint-disable react/prop-types */
import { useMemo, useCallback } from 'react';

import Stack from '@mui/material/Stack';
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
import { KanbanContactsDialog } from '../kanban/components/kanban-contacts-dialog';

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
  selectedCreatedBy,
  onSelectCreatedBy,
  selectedApprovedBy,
  onSelectApprovedBy,
  selectedPurchasedBy,
  onSelectPurchasedBy,
}) {
  const columnsPopover = usePopover();
  const partDialog = usePopover();
  const vendorDialog = useBoolean();
  const dateRange = useBoolean();
  const createdByDialog = useBoolean();
  const approvedByDialog = useBoolean();
  const purchasedByDialog = useBoolean();

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

  const handleSelectCreatedBy = useCallback(
    (assignees) => {
      const user = assignees[0];
      onFilters('createdBy', user?._id || '');
      if (onSelectCreatedBy) onSelectCreatedBy(user || null);
      createdByDialog.onFalse();
    },
    [onFilters, onSelectCreatedBy, createdByDialog]
  );

  const handleSelectApprovedBy = useCallback(
    (assignees) => {
      const user = assignees[0];
      onFilters('approvedBy', user?._id || '');
      if (onSelectApprovedBy) onSelectApprovedBy(user || null);
      approvedByDialog.onFalse();
    },
    [onFilters, onSelectApprovedBy, approvedByDialog]
  );

  const handleSelectPurchasedBy = useCallback(
    (assignees) => {
      const user = assignees[0];
      onFilters('purchasedBy', user?._id || '');
      if (onSelectPurchasedBy) onSelectPurchasedBy(user || null);
      purchasedByDialog.onFalse();
    },
    [onFilters, onSelectPurchasedBy, purchasedByDialog]
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

        <DialogSelectButton
          onClick={createdByDialog.onTrue}
          selected={selectedCreatedBy?.name}
          placeholder="Created By"
          iconName="mdi:account"
          sx={{ maxWidth: 260 }}
        />

        <DialogSelectButton
          onClick={approvedByDialog.onTrue}
          selected={selectedApprovedBy?.name}
          placeholder="Approved By"
          iconName="mdi:account-check"
          sx={{ maxWidth: 260 }}
        />

        <DialogSelectButton
          onClick={purchasedByDialog.onTrue}
          selected={selectedPurchasedBy?.name}
          placeholder="Purchased By"
          iconName="mdi:cart"
          sx={{ maxWidth: 260 }}
        />

        <Stack direction="row" spacing={1}>
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

      <KanbanContactsDialog
        assignees={selectedCreatedBy ? [selectedCreatedBy] : []}
        open={createdByDialog.value}
        onClose={createdByDialog.onFalse}
        onAssigneeChange={handleSelectCreatedBy}
        single
      />

      <KanbanContactsDialog
        assignees={selectedApprovedBy ? [selectedApprovedBy] : []}
        open={approvedByDialog.value}
        onClose={approvedByDialog.onFalse}
        onAssigneeChange={handleSelectApprovedBy}
        single
      />

      <KanbanContactsDialog
        assignees={selectedPurchasedBy ? [selectedPurchasedBy] : []}
        open={purchasedByDialog.value}
        onClose={purchasedByDialog.onFalse}
        onAssigneeChange={handleSelectPurchasedBy}
        single
      />
    </>
  );
}
