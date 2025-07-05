/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
// @mui
// components

import { Tooltip, Checkbox, MenuList, ListItemText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { exportToExcel } from 'src/utils/export-to-excel';

import { Iconify } from 'src/components/iconify';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { fDateRangeShortLabel } from '../../utils/format-time';
import { KanbanDriverDialog } from '../kanban/components/kanban-driver-dialog';
import { KanbanVehicleDialog } from '../kanban/components/kanban-vehicle-dialog';
import { KanbanSubtripDialog } from '../kanban/components/kanban-subtrip-dialog';

// ----------------------------------------------------------------------

export default function TripTableToolbar({
  filters,
  onFilters,
  tableData,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
  selectedVehicle,
  onSelectVehicle,
  selectedDriver,
  onSelectDriver,
  selectedSubtrip,
  onSelectSubtrip,
}) {
  const popover = usePopover();
  const columnsPopover = usePopover();
  const vehicleDialog = useBoolean();
  const driverDialog = useBoolean();
  const subtripDialog = useBoolean();
  const dateDialog = useBoolean();

  const handleFilterTripNo = useCallback(
    (event) => {
      onFilters('tripId', event.target.value);
    },
    [onFilters]
  );

  const handleSelectDriver = useCallback(
    (driver) => {
      if (onSelectDriver) onSelectDriver(driver);
      onFilters('driverId', driver ? driver._id : '');
    },
    [onFilters, onSelectDriver]
  );

  const handleSelectVehicle = useCallback(
    (vehicle) => {
      if (onSelectVehicle) onSelectVehicle(vehicle);
      onFilters('vehicleId', vehicle ? vehicle._id : '');
    },
    [onFilters, onSelectVehicle]
  );

  const handleSelectSubtrip = useCallback(
    (subtrip) => {
      if (onSelectSubtrip) onSelectSubtrip(subtrip);
      onFilters('subtripId', subtrip ? subtrip._id : '');
    },
    [onFilters, onSelectSubtrip]
  );

  const handleFilterFromDate = useCallback(
    (newValue) => {
      onFilters('fromDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onFilters('toDate', newValue);
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
        <TextField
          fullWidth
          value={filters.tripId}
          onChange={handleFilterTripNo}
          placeholder="Search TripId..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <DialogSelectButton
          onClick={driverDialog.onTrue}
          placeholder="Driver"
          selected={selectedDriver?.driverName}
          iconName="mdi:account"
          sx={{ maxWidth: { md: 200 } }}
        />

        <DialogSelectButton
          onClick={vehicleDialog.onTrue}
          placeholder="Vehicle"
          selected={selectedVehicle?.vehicleNo}
          iconName="mdi:truck"
          sx={{ maxWidth: { md: 200 } }}
        />

        <DialogSelectButton
          onClick={subtripDialog.onTrue}
          placeholder="Subtrip"
          selected={selectedSubtrip?._id}
          iconName="mdi:bookmark"
          sx={{ maxWidth: { md: 200 } }}
        />

        <DialogSelectButton
          onClick={dateDialog.onTrue}
          placeholder="Date Range"
          selected={
            filters.fromDate && filters.toDate
              ? fDateRangeShortLabel(filters.fromDate, filters.toDate)
              : undefined
          }
          iconName="mdi:calendar"
          sx={{ maxWidth: { md: 200 } }}
        />

        <Tooltip title="Column Settings">
          <IconButton onClick={columnsPopover.onOpen}>
            <Iconify icon="mdi:table-column-plus-after" />
          </IconButton>
        </Tooltip>

        <IconButton onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <CustomPopover
        open={columnsPopover.open}
        onClose={columnsPopover.onClose}
        anchorEl={columnsPopover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList sx={{ width: 200 }}>
          {Object.keys(visibleColumns).map((column) => (
            <MenuItem
              key={column}
              onClick={() => !disabledColumns[column] && onToggleColumn(column)}
              disabled={disabledColumns[column]}
              sx={disabledColumns[column] ? { opacity: 0.7 } : {}}
            >
              <Checkbox checked={visibleColumns[column]} disabled={disabledColumns[column]} />
              <ListItemText
                primary={
                  column
                    .replace(/([A-Z])/g, ' $1')
                    .charAt(0)
                    .toUpperCase() + column.replace(/([A-Z])/g, ' $1').slice(1)
                }
                secondary={disabledColumns[column] ? '(Always visible)' : null}
              />
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={popover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            Print
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:import-bold" />
            Import
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              exportToExcel(
                tableData.map((data) => ({
                  ...data,
                  driverId: data?.driverId?.driverName,
                  vehicleId: data?.vehicleId?.vehicleNo,
                  subtrips: data?.subtrips?.map((st) => st._id).join(','),
                })),
                'Trips-list'
              );
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <KanbanDriverDialog
        open={driverDialog.value}
        onClose={driverDialog.onFalse}
        selectedDriver={selectedDriver}
        onDriverChange={handleSelectDriver}
      />

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
          'in-queue',
          'loaded',
          'received',
          'error',
          'billed-pending',
          'billed-overdue',
          'billed-paid',
          'closed',
        ]}
      />

      <CustomDateRangePicker
        variant="calendar"
        open={dateDialog.value}
        onClose={dateDialog.onFalse}
        startDate={filters.fromDate}
        endDate={filters.toDate}
        onChangeStartDate={handleFilterFromDate}
        onChangeEndDate={handleFilterEndDate}
      />
    </>
  );
}
