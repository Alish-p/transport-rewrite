/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
// @mui
// components

import { Tooltip, MenuList } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ColumnSelectorList } from 'src/components/table';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { KanbanPumpDialog } from 'src/sections/kanban/components/kanban-pump-dialog';
import { KanbanTripDialog } from 'src/sections/kanban/components/kanban-trip-dialog';
import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';
import { KanbanSubtripDialog } from 'src/sections/kanban/components/kanban-subtrip-dialog';
import { KanbanTransporterDialog } from 'src/sections/kanban/components/kanban-transporter-dialog';

import { TABLE_COLUMNS } from '../expense-table-config';
import { SUBTRIP_STATUS } from '../../subtrip/constants';

// ----------------------------------------------------------------------

export default function ExpenseTableToolbar({
  filters,
  onFilters,
  subtripExpenseTypes,
  vehicleExpenseTypes,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
  onToggleAllColumns,
  onResetColumns,
  canResetColumns,
  selectedVehicle,
  onSelectVehicle,
  selectedSubtrip,
  onSelectSubtrip,
  selectedPump,
  onSelectPump,
  selectedTransporter,
  onSelectTransporter,
  selectedTrip,
  onSelectTrip,
}) {
  const columnsPopover = usePopover();
  const dateDialog = useBoolean();
  // removed unused tenant context

  const vehicleDialog = useBoolean();
  const pumpDialog = useBoolean();
  const transporterDialog = useBoolean();
  const tripDialog = useBoolean();
  const subtripDialog = useBoolean();
  // Route dialog removed
  const typePopover = usePopover();

  const handleSelectVehicle = useCallback(
    (vehicle) => {
      if (onSelectVehicle) onSelectVehicle(vehicle);
      onFilters('vehicleId', vehicle?._id || '');
    },
    [onFilters, onSelectVehicle]
  );

  const handleSelectPump = useCallback(
    (pump) => {
      if (onSelectPump) onSelectPump(pump);
      onFilters('pumpId', pump?._id || '');
    },
    [onFilters, onSelectPump]
  );

  const handleSelectTransporter = useCallback(
    (transporter) => {
      if (onSelectTransporter) onSelectTransporter(transporter);
      onFilters('transporterId', transporter?._id || '');
    },
    [onFilters, onSelectTransporter]
  );

  const handleSelectTrip = useCallback(
    (trip) => {
      if (onSelectTrip) onSelectTrip(trip);
      onFilters('tripId', trip?._id || '');
    },
    [onFilters, onSelectTrip]
  );

  const handleSelectSubtrip = useCallback(
    (subtrip) => {
      if (onSelectSubtrip) onSelectSubtrip(subtrip);
      onFilters('subtripId', subtrip?._id || '');
    },
    [onFilters, onSelectSubtrip]
  );

  // Route selection removed

  const handleFilterFromDate = useCallback(
    (newValue) => {
      onFilters('fromDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onFilters('endDate', newValue);
    },
    [onFilters]
  );

  const handleToggleExpenseType = useCallback(
    (value) => {
      const current = Array.isArray(filters.expenseType) ? [...filters.expenseType] : [];
      const newValues = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      onFilters('expenseType', newValues);
    },
    [filters.expenseType, onFilters]
  );

  const handleFilterVehicleType = useCallback(
    (event) => {
      onFilters('vehicleType', event.target.value);
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
        <DialogSelectButton
          onClick={vehicleDialog.onTrue}
          selected={selectedVehicle?.vehicleNo}
          placeholder="Vehicle"
          iconName="mdi:truck"
          sx={{ maxWidth: { md: 200 } }}
        />

        <DialogSelectButton
          onClick={subtripDialog.onTrue}
          selected={selectedSubtrip?.subtripNo}
          placeholder="Job"
          iconName="mdi:map-marker-path"
          sx={{ maxWidth: { md: 200 } }}
        />

        <DialogSelectButton
          onClick={pumpDialog.onTrue}
          selected={selectedPump?.name}
          placeholder="Pump"
          iconName="mdi:gas-station"
          sx={{ maxWidth: { md: 200 } }}
        />

        <DialogSelectButton
          onClick={transporterDialog.onTrue}
          selected={selectedTransporter?.transportName}
          placeholder="Transporter"
          iconName="mdi:truck-delivery"
          sx={{ maxWidth: { md: 200 } }}
        />

        <DialogSelectButton
          onClick={tripDialog.onTrue}
          selected={selectedTrip?.tripNo}
          placeholder="Trip"
          iconName="mdi:truck-fast"
          sx={{ maxWidth: { md: 200 } }}
        />

        {/* Route filter removed */}

        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel id="expense-vehicle-type-select-label">Vehicle Type</InputLabel>
          <Select
            value={filters.vehicleType || ''}
            onChange={handleFilterVehicleType}
            input={<OutlinedInput label="Vehicle Type" />}
            labelId="expense-vehicle-type-select-label"
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
          >
            <MenuItem value="">All</MenuItem>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <MenuItem value="Market">Market</MenuItem>
            <MenuItem value="Own">Own</MenuItem>
          </Select>
        </FormControl>

        <DialogSelectButton
          sx={{ maxWidth: { md: 200 } }}
          placeholder="Date Range"
          selected={
            filters.fromDate && filters.endDate
              ? fDateRangeShortLabel(filters.fromDate, filters.endDate)
              : undefined
          }
          onClick={dateDialog.onTrue}
          iconName="mdi:calendar"
        />
        <CustomDateRangePicker
          variant="calendar"
          open={dateDialog.value}
          onClose={dateDialog.onFalse}
          startDate={filters.fromDate}
          endDate={filters.endDate}
          onChangeStartDate={handleFilterFromDate}
          onChangeEndDate={handleFilterEndDate}
        />

        <DialogSelectButton
          onClick={typePopover.onOpen}
          selected={
            filters.expenseType.length > 0 ? `${filters.expenseType.length} types` : undefined
          }
          placeholder="Expense Type"
          iconName="mdi:filter-variant"
          sx={{ maxWidth: { md: 200 } }}
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

          {/* Removed export popover (moved to TableSelectedAction) */}
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

      <CustomPopover
        open={typePopover.open}
        onClose={typePopover.onClose}
        anchorEl={typePopover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <Scrollbar sx={{ width: 200, maxHeight: 400 }}>
          <MenuList>
            {[...subtripExpenseTypes, ...vehicleExpenseTypes].map((option) => (
              <MenuItem key={option.label} onClick={() => handleToggleExpenseType(option.label)}>
                <Checkbox checked={filters.expenseType.includes(option.label)} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </MenuList>
        </Scrollbar>
      </CustomPopover>

      {/* Removed export popover */}

      <KanbanVehicleDialog
        open={vehicleDialog.value}
        onClose={vehicleDialog.onFalse}
        selectedVehicle={selectedVehicle}
        onVehicleChange={handleSelectVehicle}
      />

      <KanbanSubtripDialog
        open={subtripDialog.value}
        onClose={subtripDialog.onFalse}
        selectedSubtrip={selectedSubtrip}
        onSubtripChange={handleSelectSubtrip}
        statusList={[
          SUBTRIP_STATUS.IN_QUEUE,
          SUBTRIP_STATUS.LOADED,
          SUBTRIP_STATUS.RECEIVED,
          SUBTRIP_STATUS.ERROR,
          SUBTRIP_STATUS.BILLED,
        ]}
      />

      <KanbanPumpDialog
        open={pumpDialog.value}
        onClose={pumpDialog.onFalse}
        selectedPump={selectedPump}
        onPumpChange={handleSelectPump}
      />

      <KanbanTransporterDialog
        open={transporterDialog.value}
        onClose={transporterDialog.onFalse}
        selectedTransporter={selectedTransporter}
        onTransporterChange={handleSelectTransporter}
      />

      {/* Route dialog removed */}

      <KanbanTripDialog
        open={tripDialog.value}
        onClose={tripDialog.onFalse}
        selectedTrip={selectedTrip}
        onTripChange={handleSelectTrip}
        status={['open', 'closed']}
      />
    </>
  );
}
