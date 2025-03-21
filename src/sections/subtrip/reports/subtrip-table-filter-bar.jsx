/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, Chip, Stack, Select, Checkbox, ListItemText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { useDrivers } from 'src/query/use-driver';
import { useVehicles } from 'src/query/use-vehicle';
import { useCustomers } from 'src/query/use-customer';
import { useTransporters } from 'src/query/use-transporter';

import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { SUBTRIP_STATUS } from 'src/sections/subtrip/constants';
import { KanbanDriverDialog } from 'src/sections/kanban/components/kanban-driver-dialog';
import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';
import { KanbanCustomerDialog } from 'src/sections/kanban/components/kanban-customer-dialog';
import { KanbanTransporterDialog } from 'src/sections/kanban/components/kanban-transporter-dialog';

// ----------------------------------------------------------------------

export default function SubtripTableFilters({ filters, onFilters }) {
  const dateRangePopover = usePopover();

  const { data: customers = [] } = useCustomers();
  const { data: vehicles = [] } = useVehicles();
  const { data: transporters = [] } = useTransporters();
  const { data: drivers = [] } = useDrivers();

  const vehicleDialog = useBoolean();
  const driverDialog = useBoolean();
  const customerDialog = useBoolean();
  const transporterDialog = useBoolean();

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

  const handleFilterSubtripId = useCallback(
    (event) => {
      onFilters('subtripId', event.target.value);
    },
    [onFilters]
  );

  const handleFilterDateRange = useCallback(
    (startDate, endDate) => {
      onFilters('fromDate', startDate);
      onFilters('endDate', endDate);
    },
    [onFilters]
  );

  const handleFilterStatus = useCallback(
    (event) => {
      onFilters('status', event.target.value);
    },
    [onFilters]
  );

  const handleFilterVehicle = useCallback(
    (vehicle) => {
      onFilters('vehicleNo', vehicle._id);
    },
    [onFilters]
  );

  const handleFilterDriver = useCallback(
    (driver) => {
      onFilters('driverId', driver._id);
    },
    [onFilters]
  );

  const selectedVehicle = vehicles.find((v) => v._id === filters.vehicleNo);
  const selectedDriver = drivers.find((d) => d._id === filters.driverId);
  const selectedCustomer = customers.find((c) => c._id === filters.customerId);
  const selectedTransporter = transporters.find((t) => t._id === filters.transportName);

  const dateRangeSelected = !!filters.fromDate && !!filters.endDate;
  const dateRangeShortLabel = dateRangeSelected
    ? fDateRangeShortLabel(filters.fromDate, filters.endDate)
    : '';

  return (
    <Stack spacing={2}>
      {/* Filter Section */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(5, 1fr)',
          lg: 'repeat(7, 1fr)',
        }}
        gap={1}
      >
        <TextField
          value={filters.subtripId}
          onChange={handleFilterSubtripId}
          placeholder="Search by ID"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <Select
          multiple
          displayEmpty
          value={Array.isArray(filters.status) ? filters.status : []}
          onChange={handleFilterStatus}
          sx={{
            maxHeight: 70,
            overflow: 'hidden',
          }}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <Box sx={{ color: 'text.disabled' }}>Select Status</Box>;
            }
            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" color="info" variant="soft" />
                ))}
              </Box>
            );
          }}
        >
          {Object.values(SUBTRIP_STATUS).map((status) => (
            <MenuItem key={status} value={status}>
              <Checkbox
                size="small"
                checked={Array.isArray(filters.status) && filters.status.includes(status)}
              />
              <ListItemText primary={status} />
            </MenuItem>
          ))}
        </Select>

        <Button
          onClick={dateRangePopover.onOpen}
          variant="outlined"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          {dateRangeSelected ? dateRangeShortLabel : 'Select Date Range'}
          <Iconify
            icon="mdi:calendar"
            sx={{ color: dateRangeSelected ? 'success.main' : 'inherit' }}
          />
        </Button>

        <Button
          onClick={customerDialog.onTrue}
          variant="outlined"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          {selectedCustomer ? selectedCustomer.customerName : 'Select Customer'}
          <Iconify
            icon={selectedCustomer ? 'mdi:office-building' : 'mdi:office-building-outline'}
            sx={{ color: selectedCustomer ? 'success.main' : 'inherit' }}
          />
        </Button>

        <Button
          onClick={transporterDialog.onTrue}
          variant="outlined"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          {selectedTransporter ? selectedTransporter.transportName : 'Select Transporter'}
          <Iconify
            icon={selectedTransporter ? 'mdi:truck-delivery' : 'mdi:truck-delivery-outline'}
            sx={{ color: selectedTransporter ? 'success.main' : 'inherit' }}
          />
        </Button>

        <Button
          onClick={vehicleDialog.onTrue}
          variant="outlined"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          {selectedVehicle ? selectedVehicle.vehicleNo : 'Select Vehicle'}
          <Iconify
            icon={selectedVehicle ? 'mdi:truck' : 'mdi:truck-outline'}
            sx={{ color: selectedVehicle ? 'success.main' : 'inherit' }}
          />
        </Button>

        <Button
          onClick={driverDialog.onTrue}
          variant="outlined"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          {selectedDriver ? selectedDriver.driverName : 'Select Driver'}
          <Iconify
            icon={selectedDriver ? 'mdi:account' : 'mdi:account-outline'}
            sx={{ color: selectedDriver ? 'success.main' : 'inherit' }}
          />
        </Button>
      </Box>

      <CustomDateRangePicker
        variant="calendar"
        title="Select date range"
        startDate={filters.fromDate}
        endDate={filters.endDate}
        onChangeStartDate={(date) => handleFilterDateRange(date, filters.endDate)}
        onChangeEndDate={(date) => handleFilterDateRange(filters.fromDate, date)}
        open={dateRangePopover.open}
        onClose={dateRangePopover.onClose}
        selected={dateRangeSelected}
        error={false}
      />

      <KanbanVehicleDialog
        open={vehicleDialog.value}
        onClose={vehicleDialog.onFalse}
        selectedVehicle={selectedVehicle}
        onVehicleChange={handleFilterVehicle}
      />

      <KanbanDriverDialog
        open={driverDialog.value}
        onClose={driverDialog.onFalse}
        selectedDriver={selectedDriver}
        onDriverChange={handleFilterDriver}
      />

      <KanbanCustomerDialog
        open={customerDialog.value}
        onClose={customerDialog.onFalse}
        selectedCustomer={selectedCustomer}
        onCustomerChange={handleFilterCustomer}
      />

      <KanbanTransporterDialog
        open={transporterDialog.value}
        onClose={transporterDialog.onFalse}
        selectedTransporter={selectedTransporter}
        onTransporterChange={handleFilterTransporter}
      />
    </Stack>
  );
}
