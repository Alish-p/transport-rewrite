/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ColumnSelectorList } from 'src/components/table';
import { usePopover } from 'src/components/custom-popover';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { TABLE_COLUMNS } from './work-order-table-config';
import { KanbanPartsDialog } from '../kanban/components/kanban-parts-dialog';
import { KanbanVehicleDialog } from '../kanban/components/kanban-vehicle-dialog';
import { KanbanContactsDialog } from '../kanban/components/kanban-contacts-dialog';
import { WORK_ORDER_PRIORITY_OPTIONS, WORK_ORDER_CATEGORY_OPTIONS } from './work-order-config';

export default function WorkOrderTableToolbar({
  filters,
  onFilters,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
  onToggleAllColumns,
  onResetColumns,
  canResetColumns,
  selectedVehicle,
  onSelectVehicle,
  selectedPart,
  onSelectPart,
  selectedCreatedBy,
  onSelectCreatedBy,
  selectedClosedBy,
  onSelectClosedBy,
}) {
  const columnsPopover = usePopover();
  const vehicleDialog = usePopover();
  const partDialog = usePopover();
  const createdByDialog = useBoolean();
  const closedByDialog = useBoolean();

  const handleFilterPriority = useCallback(
    (event) => {
      onFilters('priority', event.target.value);
    },
    [onFilters]
  );

  const handleFilterCategory = useCallback(
    (event) => {
      onFilters('category', event.target.value);
    },
    [onFilters]
  );

  const handleSelectVehicle = useCallback(
    (vehicle) => {
      if (onSelectVehicle) {
        onSelectVehicle(vehicle || null);
      }
      vehicleDialog.onClose();
    },
    [onSelectVehicle, vehicleDialog]
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

  const handleSelectCreatedBy = useCallback(
    (assignees) => {
      const user = assignees[0];
      onFilters('createdBy', user?._id || '');
      if (onSelectCreatedBy) onSelectCreatedBy(user || null);
      createdByDialog.onFalse();
    },
    [onFilters, onSelectCreatedBy, createdByDialog]
  );

  const handleSelectClosedBy = useCallback(
    (assignees) => {
      const user = assignees[0];
      onFilters('closedBy', user?._id || '');
      if (onSelectClosedBy) onSelectClosedBy(user || null);
      closedByDialog.onFalse();
    },
    [onFilters, onSelectClosedBy, closedByDialog]
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
        <TextField
          select
          fullWidth
          label="Filter by priority"
          value={filters.priority}
          onChange={handleFilterPriority}
        >
          <MenuItem value="all">All priorities</MenuItem>
          {WORK_ORDER_PRIORITY_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Filter by category"
          value={filters.category}
          onChange={handleFilterCategory}
        >
          <MenuItem value="all">All categories</MenuItem>
          {WORK_ORDER_CATEGORY_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <DialogSelectButton
          onClick={vehicleDialog.onOpen}
          selected={selectedVehicle?.vehicleNo}
          placeholder="Filter by vehicle"
          iconName="mdi:truck"
          sx={{ maxWidth: 260 }}
        />

        <DialogSelectButton
          onClick={partDialog.onOpen}
          selected={selectedPart?.name}
          placeholder="Filter by part"
          iconName="mdi:cube"
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
          onClick={closedByDialog.onTrue}
          selected={selectedClosedBy?.name}
          placeholder="Closed By"
          iconName="mdi:account-check"
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

      <KanbanVehicleDialog
        open={Boolean(vehicleDialog.open)}
        onClose={vehicleDialog.onClose}
        selectedVehicle={selectedVehicle}
        onVehicleChange={handleSelectVehicle}
      />

      <KanbanPartsDialog
        open={Boolean(partDialog.open)}
        onClose={partDialog.onClose}
        selectedPart={selectedPart}
        onPartChange={handleSelectPart}
      />

      <KanbanContactsDialog
        assignees={selectedCreatedBy ? [selectedCreatedBy] : []}
        open={createdByDialog.value}
        onClose={createdByDialog.onFalse}
        onAssigneeChange={handleSelectCreatedBy}
        single
      />

      <KanbanContactsDialog
        assignees={selectedClosedBy ? [selectedClosedBy] : []}
        open={closedByDialog.value}
        onClose={closedByDialog.onFalse}
        onAssigneeChange={handleSelectClosedBy}
        single
      />
    </>
  );
}
