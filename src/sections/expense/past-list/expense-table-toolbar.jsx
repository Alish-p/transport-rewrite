/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, MenuList, Checkbox, ListItemText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { exportToExcel } from 'src/utils/export-to-excel';

import { useVehicles } from 'src/query/use-vehicle';
import { useCustomers } from 'src/query/use-customer';
import { useTransporters } from 'src/query/use-transporter';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';
import { KanbanCustomerDialog } from 'src/sections/kanban/components/kanban-customer-dialog';
import { KanbanTransporterDialog } from 'src/sections/kanban/components/kanban-transporter-dialog';

// ----------------------------------------------------------------------

export default function ExpenseTableToolbar({
  filters,
  onFilters,
  onSearch,
  tableData,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
}) {
  const columnsPopover = usePopover();
  const openVehicleDialog = useBoolean();
  const openCustomerDialog = useBoolean();
  const openTransporterDialog = useBoolean();

  const { data: customers = [] } = useCustomers();
  const { data: vehicles = [] } = useVehicles();
  const { data: transporters = [] } = useTransporters();

  const handleFilterCustomer = useCallback(
    (customer) => {
      onFilters('customerId', customer._id);
    },
    [onFilters]
  );

  const handleFilterTransporter = useCallback(
    (transporter) => {
      onFilters('transportName', transporter._id);
    },
    [onFilters]
  );

  const handleFilterVehicle = useCallback(
    (event) => {
      onFilters('vehicleNo', event.target.value);
    },
    [onFilters]
  );

  const handleFilterExpenseId = useCallback(
    (event) => {
      onFilters('expenseId', event.target.value);
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

  const handleVehicleChange = (vehicle) => {
    onFilters('vehicleNo', vehicle._id);
  };

  const selectedVehicle = vehicles.find((v) => v._id === filters.vehicleNo);
  const selectedCustomer = customers.find((c) => c._id === filters.customerId);
  const selectedTransporter = transporters.find((t) => t._id === filters.transportName);

  const canSearch = !!(
    filters.customerId ||
    filters.transportName ||
    filters.vehicleNo ||
    filters.expenseId ||
    filters.fromDate ||
    filters.endDate
  );

  return (
    <>
      <Box
        sx={{
          overflowX: 'auto',
          width: '100%',
        }}
      >
        <Stack spacing={2.5}>
          <Stack
            spacing={2}
            alignItems={{ xs: 'flex-end', md: 'center' }}
            direction={{
              xs: 'column',
              md: 'row',
            }}
            sx={{
              pt: 2.5,
              px: 2.5,
              minWidth: { md: '1200px' },
            }}
          >
            <TextField
              fullWidth
              value={filters.expenseId}
              onChange={handleFilterExpenseId}
              placeholder="Expense ID"
              sx={{ width: { xs: 1, md: 200 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              onClick={openCustomerDialog.onTrue}
              variant="outlined"
              sx={{
                width: { xs: 1, md: 200 },
                height: 56,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {selectedCustomer ? selectedCustomer.customerName : 'Select Customer'}
              <Iconify
                icon={selectedCustomer ? 'mdi:office-building' : 'mdi:office-building-outline'}
                sx={{ color: selectedCustomer ? 'success.main' : 'inherit' }}
              />
            </Button>

            <Button
              onClick={openTransporterDialog.onTrue}
              variant="outlined"
              sx={{
                width: { xs: 1, md: 200 },
                height: 56,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {selectedTransporter ? selectedTransporter.transportName : 'Select Transporter'}
              <Iconify
                icon={selectedTransporter ? 'mdi:truck-delivery' : 'mdi:truck-delivery-outline'}
                sx={{ color: selectedTransporter ? 'success.main' : 'inherit' }}
              />
            </Button>

            <Button
              onClick={openVehicleDialog.onTrue}
              variant="outlined"
              sx={{
                width: { xs: 1, md: 200 },
                height: 56,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {selectedVehicle ? selectedVehicle.vehicleNo : 'Select Vehicle'}
              <Iconify
                icon={selectedVehicle ? 'mdi:truck' : 'mdi:truck-outline'}
                sx={{ color: selectedVehicle ? 'success.main' : 'inherit' }}
              />
            </Button>

            <DatePicker
              label="From Date"
              value={filters.fromDate}
              onChange={handleFilterFromDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: { width: { xs: 1, md: 200 } },
                },
              }}
            />

            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={handleFilterEndDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: { width: { xs: 1, md: 200 } },
                },
              }}
            />

            <Button
              variant="contained"
              onClick={onSearch}
              disabled={!canSearch}
              startIcon={<Iconify icon="eva:search-fill" />}
              sx={{
                width: { xs: 1, md: 200 },
                height: 56,
              }}
            >
              Search
            </Button>

            <Button
              variant="outlined"
              onClick={() => exportToExcel(tableData, 'expenses')}
              startIcon={<Iconify icon="eva:download-fill" />}
              sx={{
                width: { xs: 1, md: 200 },
                height: 56,
              }}
            >
              Export
            </Button>

            <IconButton
              onClick={columnsPopover.onOpen}
              sx={{
                width: 56,
                height: 56,
                border: (t) => `solid 1px ${t.palette.divider}`,
              }}
            >
              <Iconify icon="eva:settings-2-fill" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <KanbanVehicleDialog
        open={openVehicleDialog.value}
        onClose={openVehicleDialog.onFalse}
        onVehicleChange={handleVehicleChange}
      />

      <KanbanCustomerDialog
        open={openCustomerDialog.value}
        onClose={openCustomerDialog.onFalse}
        onCustomerChange={handleFilterCustomer}
      />

      <KanbanTransporterDialog
        open={openTransporterDialog.value}
        onClose={openTransporterDialog.onFalse}
        onTransporterChange={handleFilterTransporter}
      />

      <CustomPopover
        open={columnsPopover.open}
        onClose={columnsPopover.onClose}
        anchorEl={columnsPopover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          {Object.entries(visibleColumns).map(([key, value]) => (
            <MenuItem key={key} onClick={() => onToggleColumn(key)} disabled={disabledColumns[key]}>
              <Checkbox checked={value} />
              <ListItemText primary={key} />
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
