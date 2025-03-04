/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
// @mui
import InputAdornment from '@mui/material/InputAdornment';
// components

import { Tooltip, MenuList, Checkbox, ListItemText } from '@mui/material';

import { exportToExcel } from 'src/utils/export-to-excel';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function PumpTableToolbar({
  filters,
  onFilters,
  tableData,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
}) {
  const popover = usePopover();
  const columnsPopover = usePopover();

  const handleFilterPumpName = useCallback(
    (event) => {
      onFilters('pumpName', event.target.value);
    },
    [onFilters]
  );

  const handleFilterPlace = useCallback(
    (event) => {
      onFilters('placeName', event.target.value);
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
          value={filters.pumpName}
          onChange={handleFilterPumpName}
          placeholder="Search Pump Name..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          value={filters.placeName}
          onChange={handleFilterPlace}
          placeholder="Search place..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
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

      {/* Column visibility popover */}
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
              <ListItemText primary={column.charAt(0).toUpperCase() + column.slice(1)} />
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
              exportToExcel(tableData, 'Pumps-list');
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
