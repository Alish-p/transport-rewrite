/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useBoolean } from 'src/hooks/use-boolean';
// components

import Badge from '@mui/material/Badge';
import { MenuList } from '@mui/material';
import Button from '@mui/material/Button';

import { exportToExcel } from 'src/utils/export-to-excel';

import { Iconify } from 'src/components/iconify';
import { ColumnSelectorList } from 'src/components/table';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { SUBTRIP_STATUS } from 'src/sections/subtrip/constants';
import { KanbanDriverDialog } from 'src/sections/kanban/components/kanban-driver-dialog';
import { KanbanSubtripDialog } from 'src/sections/kanban/components/kanban-subtrip-dialog';

import { TABLE_COLUMNS } from './driver-payroll-table-config';

// ----------------------------------------------------------------------

export default function DriverPayrollTableToolbar({
  filters,
  onFilters,
  tableData,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
  onToggleAllColumns,
  onResetColumns,
  canResetColumns,
}) {
  const popover = usePopover();
  const columnsPopover = usePopover();
  const driverDialogOpen = useBoolean();
  const subtripDialogOpen = useBoolean();

  const handleFilterDriverName = useCallback(
    (driver) => {
      onFilters('driver', driver);
    },
    [onFilters]
  );

  const handleFilterSubtrip = useCallback(
    (subtrip) => {
      onFilters('subtrip', subtrip);
    },
    [onFilters]
  );

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
          onClick={driverDialogOpen.onTrue}
          placeholder="Driver"
          selected={filters.driver?.driverName}
          iconName="mdi:steering"
        />

        <DialogSelectButton
          onClick={subtripDialogOpen.onTrue}
          placeholder="Job"
          selected={filters.subtrip?.subtripNo}
          iconName="mdi:bookmark"
        />

        <DatePicker
          label="Start date"
          value={filters.fromDate}
          onChange={handleFilterFromDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{
            maxWidth: { md: 180 },
          }}
        />

        <DatePicker
          label="End date"
          value={filters.endDate}
          onChange={handleFilterEndDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{
            maxWidth: { md: 180 },
          }}
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
          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Stack>

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
              exportToExcel(tableData, 'Driver-list');
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>

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
      {driverDialogOpen.value && (
        <KanbanDriverDialog
          open={driverDialogOpen.value}
          onClose={driverDialogOpen.onFalse}
          onDriverChange={handleFilterDriverName}
          selectedDriver={filters.driver}
        />
      )}

      {subtripDialogOpen.value && (
        <KanbanSubtripDialog
          open={subtripDialogOpen.value}
          onClose={subtripDialogOpen.onFalse}
          onSubtripChange={handleFilterSubtrip}
          selectedSubtrip={filters.subtrip}
          statusList={Object.values(SUBTRIP_STATUS)}
        />
      )}
    </>
  );
}
