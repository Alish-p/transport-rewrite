/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { MenuList } from '@mui/material';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useBoolean } from 'src/hooks/use-boolean';

import { exportToExcel } from 'src/utils/export-to-excel';

import { Iconify } from 'src/components/iconify';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { SUBTRIP_STATUS } from 'src/sections/subtrip/constants';
import { KanbanSubtripDialog } from 'src/sections/kanban/components/kanban-subtrip-dialog';
import { KanbanTransporterDialog } from 'src/sections/kanban/components/kanban-transporter-dialog';

import { fDateRangeShortLabel } from '../../../utils/format-time';

// ----------------------------------------------------------------------

export default function TransporterPaymentTableToolbar({ filters, onFilters, tableData }) {
  const popover = usePopover();
  const transporterDialog = useBoolean();
  const subtripDialog = useBoolean();
  const dateDialog = useBoolean();
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [selectedSubtrip, setSelectedSubtrip] = useState(null);

  const handleSelectTransporter = useCallback(
    (transporter) => {
      setSelectedTransporter(transporter);
      onFilters('transporterId', transporter._id);
    },
    [onFilters]
  );

  const handleSelectSubtrip = useCallback(
    (subtrip) => {
      setSelectedSubtrip(subtrip);
      onFilters('subtripId', subtrip._id);
    },
    [onFilters]
  );

  const handleChangeStartDate = useCallback(
    (date) => {
      onFilters('issueFromDate', date);
    },
    [onFilters]
  );

  const handleChangeEndDate = useCallback(
    (date) => {
      onFilters('issueToDate', date);
    },
    [onFilters]
  );

  const handlePaymentId = useCallback(
    (event) => {
      onFilters('paymentId', event.target.value);
    },
    [onFilters]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >
        <DialogSelectButton
          onClick={transporterDialog.onTrue}
          placeholder="Search transporter"
          selected={selectedTransporter?.transportName}
          iconName="mdi:truck"
        />

        <DialogSelectButton
          onClick={subtripDialog.onTrue}
          placeholder="Search subtrip"
          selected={selectedSubtrip?._id}
          iconName="mdi:bookmark"
        />

        <TextField
          fullWidth
          value={filters.paymentId}
          onChange={handlePaymentId}
          placeholder="Payment ID"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <DialogSelectButton
          onClick={dateDialog.onTrue}
          placeholder="Issue date range"
          selected={
            filters.issueFromDate && filters.issueToDate
              ? `${fDateRangeShortLabel(filters.issueFromDate, filters.issueToDate)}`
              : undefined
          }
          iconName="mdi:calendar"
        />

        <FormControlLabel
          label="TDS"
          labelPlacement="top"
          control={
            <Switch
              checked={filters.hasTds}
              onChange={(e) => onFilters('hasTds', e.target.checked)}
            />
          }
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
              exportToExcel(tableData, 'Transporter-list');
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <KanbanTransporterDialog
        open={transporterDialog.value}
        onClose={transporterDialog.onFalse}
        selectedTransporter={selectedTransporter}
        onTransporterChange={handleSelectTransporter}
      />

      <KanbanSubtripDialog
        open={subtripDialog.value}
        onClose={subtripDialog.onFalse}
        selectedSubtrip={selectedSubtrip}
        onSubtripChange={handleSelectSubtrip}
        statusList={[
          SUBTRIP_STATUS.BILLED_PENDING,
          SUBTRIP_STATUS.BILLED_OVERDUE,
          SUBTRIP_STATUS.BILLED_PAID,
        ]}
      />

      <CustomDateRangePicker
        variant="calendar"
        open={dateDialog.value}
        onClose={dateDialog.onFalse}
        startDate={filters.issueFromDate}
        endDate={filters.issueToDate}
        onChangeStartDate={handleChangeStartDate}
        onChangeEndDate={handleChangeEndDate}
      />
    </>
  );
}
