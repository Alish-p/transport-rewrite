/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// components

import { MenuList } from '@mui/material';

import { exportToExcel } from 'src/utils/export-to-excel';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function DieselPriceTableToolbar({ filters, onFilters, tableData, pumpsList }) {
  const popover = usePopover();

  const handleFilterPump = useCallback(
    (event) => {
      console.log({ event });
      onFilters('pump', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (event) => {
      onFilters('startDate', event.target.value);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (event) => {
      onFilters('endDate', event.target.value);
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
          select
          name="pump"
          label="Pump"
          value={filters.pump}
          onChange={handleFilterPump}
          fullWidth
        >
          {pumpsList?.map((p) => (
            <MenuItem key={p._id} value={p._id}>
              {p.pumpName}
            </MenuItem>
          ))}
        </TextField>

        <DatePicker
          label="Start date"
          value={filters.startDate}
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{
            maxWidth: { md: 180 },
          }}
        />

        <DatePicker
          label="End Date"
          value={filters.endDate}
          onChange={handleFilterEndDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{
            maxWidth: { md: 180 },
          }}
        />

        <IconButton onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
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
              exportToExcel(tableData, 'Diesel-Prices-list');
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
