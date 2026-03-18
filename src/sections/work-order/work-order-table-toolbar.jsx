/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

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
  selectedIssueAssignee,
  onSelectIssueAssignee,
}) {
  const columnsPopover = usePopover();
  const vehicleDialog = usePopover();
  const partDialog = usePopover();
  const createdByDialog = useBoolean();
  const closedByDialog = useBoolean();
  const issueAssigneeDialog = useBoolean();

  const handleFilterCategory = useCallback(
    (event, newValue) => {
      onFilters('category', newValue || 'all');
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

  const handleSelectIssueAssignee = useCallback(
    (assignees) => {
      const user = assignees[0];
      onFilters('issueAssignee', user?._id || '');
      if (onSelectIssueAssignee) onSelectIssueAssignee(user || null);
      issueAssigneeDialog.onFalse();
    },
    [onFilters, onSelectIssueAssignee, issueAssigneeDialog]
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
        useFlexGap
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
          flexWrap: 'wrap',
        }}
      >
        <Autocomplete
          fullWidth
          options={[
            { value: 'all', label: 'All Expenses' },
            { value: 'true', label: 'Added' },
            { value: 'false', label: 'Not Added' },
          ]}
          getOptionLabel={(option) => option.label}
          value={
            [
              { value: 'all', label: 'All Expenses' },
              { value: 'true', label: 'Added' },
              { value: 'false', label: 'Not Added' },
            ].find((opt) => opt.value === filters.expenseAdded) || { value: 'all', label: 'All Expenses' }
          }
          onChange={(event, newValue) => {
            onFilters('expenseAdded', newValue?.value || 'all');
          }}
          renderInput={(params) => <TextField {...params} label="Expense Status" />}
          sx={{ width: { xs: 1, md: 170 } }}
        />

        <Autocomplete
          fullWidth
          options={WORK_ORDER_PRIORITY_OPTIONS}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
          value={WORK_ORDER_PRIORITY_OPTIONS.find((opt) => opt.value === filters.priority) || null}
          onChange={(event, newValue) => {
            onFilters('priority', newValue?.value || 'all');
          }}
          renderInput={(params) => <TextField {...params} label="Priority" />}
          sx={{ width: { xs: 1, md: 200 } }}
        />

        <Autocomplete
          freeSolo
          options={WORK_ORDER_CATEGORY_OPTIONS}
          value={filters.category === 'all' ? '' : filters.category}
          onChange={handleFilterCategory}
          onInputChange={(event, newInputValue) => {
            handleFilterCategory(event, newInputValue);
          }}
          renderInput={(params) => <TextField {...params} label="Category" />}
          sx={{ width: { xs: 1, md: 200 } }}
        />

        <DialogSelectButton
          onClick={vehicleDialog.onOpen}
          selected={selectedVehicle?.vehicleNo}
          placeholder="Vehicle"
          iconName="mdi:truck"
          sx={{ width: { xs: 1, md: 150 } }}
        />

        <DialogSelectButton
          onClick={partDialog.onOpen}
          selected={selectedPart?.name}
          placeholder="Part"
          iconName="mdi:cube"
          sx={{ width: { xs: 1, md: 150 } }}
        />

        <DialogSelectButton
          onClick={createdByDialog.onTrue}
          selected={selectedCreatedBy?.name}
          placeholder="Created By"
          iconName="mdi:account"
          sx={{ width: { xs: 1, md: 150 } }}
        />

        <DialogSelectButton
          onClick={closedByDialog.onTrue}
          selected={selectedClosedBy?.name}
          placeholder="Closed By"
          iconName="mdi:account-check"
          sx={{ width: { xs: 1, md: 150 } }}
        />

        <DialogSelectButton
          onClick={issueAssigneeDialog.onTrue}
          selected={selectedIssueAssignee?.name}
          placeholder="Issue Assignee"
          iconName="mdi:account-hard-hat"
          sx={{ width: { xs: 1, md: 150 } }}
        />

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

      <KanbanContactsDialog
        assignees={selectedIssueAssignee ? [selectedIssueAssignee] : []}
        open={issueAssigneeDialog.value}
        onClose={issueAssigneeDialog.onFalse}
        onAssigneeChange={handleSelectIssueAssignee}
        single
      />
    </>
  );
}
