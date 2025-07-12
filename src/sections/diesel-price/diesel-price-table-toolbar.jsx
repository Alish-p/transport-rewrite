/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
// @mui

// components

import { Tooltip, MenuList } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateRangeShortLabel } from 'src/utils/format-time';
import { exportToExcel, prepareDataForExport } from 'src/utils/export-to-excel';

import { Iconify } from 'src/components/iconify';
import { ColumnSelectorList } from 'src/components/table';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { KanbanPumpDialog } from 'src/sections/kanban/components/kanban-pump-dialog';

import { TABLE_COLUMNS } from './diesel-price-table-config';

// ----------------------------------------------------------------------

export default function DieselPriceTableToolbar({
  filters,
  onFilters,
  tableData,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
  onToggleAllColumns,
}) {
  const popover = usePopover();
  const columnsPopover = usePopover();
  const pumpDialog = useBoolean();
  const dateDialog = useBoolean();

  const handleSelectPump = useCallback(
    (pump) => {
      onFilters('pump', pump);
    },
    [onFilters]
  );

  const handleFilterFromDate = useCallback(
    (newValue) => {
      onFilters('fromDate', newValue);
    },
    [onFilters]
  );

  const handleFilterToDate = useCallback(
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
        <DialogSelectButton
          onClick={pumpDialog.onTrue}
          selected={filters.pump?.pumpName}
          placeholder="Pump"
          iconName="mdi:gas-station"
        />

        <DialogSelectButton
          onClick={dateDialog.onTrue}
          selected={
            filters.fromDate && filters.toDate
              ? fDateRangeShortLabel(filters.fromDate, filters.toDate)
              : undefined
          }
          placeholder="Date Range"
          iconName="mdi:calendar"
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
        <ColumnSelectorList
          TABLE_COLUMNS={TABLE_COLUMNS}
          visibleColumns={visibleColumns}
          disabledColumns={disabledColumns}
          handleToggleColumn={onToggleColumn}
          handleToggleAllColumns={onToggleAllColumns}
        />
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
              const visibleCols = Object.keys(visibleColumns).filter((c) => visibleColumns[c]);
              exportToExcel(
                prepareDataForExport(tableData, TABLE_COLUMNS, visibleCols),
                'DieselPrice-list'
              );
              popover.onClose();
            }}
          >
            <Iconify icon="solar:export-bold" />
            Excel
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <KanbanPumpDialog
        open={pumpDialog.value}
        onClose={pumpDialog.onFalse}
        selectedPump={filters.pump}
        onPumpChange={handleSelectPump}
      />

      <CustomDateRangePicker
        variant="calendar"
        open={dateDialog.value}
        onClose={dateDialog.onFalse}
        startDate={filters.fromDate}
        endDate={filters.toDate}
        onChangeStartDate={handleFilterFromDate}
        onChangeEndDate={handleFilterToDate}
      />
    </>
  );
}
