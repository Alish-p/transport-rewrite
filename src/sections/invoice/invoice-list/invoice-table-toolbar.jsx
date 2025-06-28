/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { MenuList } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { exportToExcel } from 'src/utils/export-to-excel';

import { useCustomersSummary } from 'src/query/use-customer';

import { Iconify } from 'src/components/iconify';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
// @mui
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { SUBTRIP_STATUS } from 'src/sections/subtrip/constants';
import { KanbanSubtripDialog } from 'src/sections/kanban/components/kanban-subtrip-dialog';
import { KanbanCustomerDialog } from 'src/sections/kanban/components/kanban-customer-dialog';

import { fDateRangeShortLabel } from '../../../utils/format-time';

// ----------------------------------------------------------------------

export default function InvoiceTableToolbar({ filters, onFilters, tableData }) {
  const popover = usePopover();
  const customerDialog = useBoolean();
  const subtripDialog = useBoolean();
  const dateDialog = useBoolean();
  const { data: customers = [] } = useCustomersSummary();
  const [selectedSubtrip, setSelectedSubtrip] = useState(null);

  const selectedCustomer = customers.find((c) => c._id === filters.customerId);

  const handleSelectCustomer = useCallback(
    (customer) => {
      onFilters('customerId', customer._id);
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

  const handleFilterInvoiceNo = useCallback(
    (event) => {
      onFilters('invoiceNo', event.target.value);
    },
    [onFilters]
  );

  const handleChangeStartDate = useCallback(
    (date) => {
      onFilters('fromDate', date);
    },
    [onFilters]
  );

  const handleChangeEndDate = useCallback(
    (date) => {
      onFilters('endDate', date);
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
          onClick={customerDialog.onTrue}
          placeholder="Search customer"
          selected={selectedCustomer?.customerName}
          iconName="mdi:office-building"
        />

        <DialogSelectButton
          onClick={subtripDialog.onTrue}
          placeholder="Search subtrip"
          selected={selectedSubtrip?._id}
          iconName="mdi:bookmark"
        />

        <TextField
          fullWidth
          value={filters.invoiceNo}
          onChange={handleFilterInvoiceNo}
          placeholder="Invoice No"
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
            filters.fromDate && filters.endDate
              ? `${fDateRangeShortLabel(filters.fromDate, filters.endDate)}`
              : undefined
          }
          iconName="mdi:calendar"
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
              exportToExcel(tableData, 'Invoice-list');
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <KanbanCustomerDialog
        open={customerDialog.value}
        onClose={customerDialog.onFalse}
        selectedCustomer={selectedCustomer}
        onCustomerChange={handleSelectCustomer}
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
        startDate={filters.fromDate}
        endDate={filters.endDate}
        onChangeStartDate={handleChangeStartDate}
        onChangeEndDate={handleChangeEndDate}
      />
    </>
  );
}
