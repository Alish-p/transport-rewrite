/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import { Tooltip } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { ColumnSelectorList } from 'src/components/table';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { TABLE_COLUMNS } from './work-order-table-config';
import { WORK_ORDER_PRIORITY_OPTIONS } from './work-order-config';
import { KanbanVehicleDialog } from '../kanban/components/kanban-vehicle-dialog';
import { KanbanPartsDialog } from '../kanban/components/kanban-parts-dialog';

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
}) {
  const columnsPopover = usePopover();
  const vehicleDialog = usePopover();
  const partDialog = usePopover();

  const handleFilterPriority = useCallback(
    (event) => {
      onFilters('priority', event.target.value);
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

        <Stack direction="row" spacing={1}>
          <Tooltip title="Column Settings">
            <IconButton onClick={columnsPopover.onOpen}>
              <Iconify icon="mdi:table-column-plus-after" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Reset Columns">
            <span>
              <IconButton onClick={onResetColumns} disabled={!canResetColumns}>
                <Badge color="error" variant="dot" invisible={!canResetColumns}>
                  <Iconify icon="solar:restart-bold" />
                </Badge>
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      <CustomPopover
        open={columnsPopover.open}
        onClose={columnsPopover.onClose}
        anchorEl={columnsPopover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <ColumnSelectorList
          TABLE_COLUMNS={TABLE_COLUMNS}
          visibleColumns={visibleColumns}
          disabledColumns={disabledColumns}
          handleToggleColumn={onToggleColumn}
          handleToggleAllColumns={onToggleAllColumns}
        />
      </CustomPopover>

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
    </>
  );
}
