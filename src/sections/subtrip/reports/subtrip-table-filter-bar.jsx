/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import MenuItem from '@mui/material/MenuItem';
import {
  Box,
  Chip,
  Stack,
  Paper,
  Select,
  Divider,
  Tooltip,
  Popover,
  Checkbox,
  Typography,
  ListItemText,
} from '@mui/material';

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
  const statusPopover = usePopover();

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

  const handleToggleStatus = useCallback(
    (status) => {
      const currentStatuses = Array.isArray(filters.status) ? [...filters.status] : [];
      const newStatuses = currentStatuses.includes(status)
        ? currentStatuses.filter((s) => s !== status)
        : [...currentStatuses, status];

      onFilters('status', newStatuses);
    },
    [filters.status, onFilters]
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
    <Box sx={{ p: 2, pb: 1 }}>
      {/* Search Field */}
      {/* <TextField
        fullWidth
        value={filters.subtripId}
        onChange={handleFilterSubtripId}
        placeholder="Search by ID"
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      /> */}

      {/* Filter Chips Section */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          mb: 1,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          Additional Filters:
        </Typography>

        <Divider orientation="vertical" flexItem />

        {/* Status Filter */}
        <Tooltip title="Filter by status" arrow>
          <Chip
            label="Status"
            onClick={statusPopover.onOpen}
            color={
              Array.isArray(filters.status) && filters.status.length > 0 ? 'primary' : 'default'
            }
            variant={
              Array.isArray(filters.status) && filters.status.length > 0 ? 'filled' : 'outlined'
            }
            icon={<Iconify icon="mdi:filter-variant" />}
          />
        </Tooltip>

        {/* Date Range Filter */}
        <Tooltip title="Filter by date range" arrow>
          <Chip
            label={dateRangeSelected ? dateRangeShortLabel : 'Date Range'}
            onClick={dateRangePopover.onOpen}
            color={dateRangeSelected ? 'primary' : 'default'}
            variant={dateRangeSelected ? 'filled' : 'outlined'}
            icon={<Iconify icon="mdi:calendar" />}
          />
        </Tooltip>

        {/* Customer Filter */}
        <Tooltip title="Filter by customer" arrow>
          <Chip
            label={selectedCustomer ? selectedCustomer.customerName : 'Customer'}
            onClick={customerDialog.onTrue}
            color={selectedCustomer ? 'primary' : 'default'}
            variant={selectedCustomer ? 'filled' : 'outlined'}
            icon={<Iconify icon="mdi:office-building" />}
          />
        </Tooltip>

        {/* Transporter Filter */}
        <Tooltip title="Filter by transporter" arrow>
          <Chip
            label={selectedTransporter ? selectedTransporter.transportName : 'Transporter'}
            onClick={transporterDialog.onTrue}
            color={selectedTransporter ? 'primary' : 'default'}
            variant={selectedTransporter ? 'filled' : 'outlined'}
            icon={<Iconify icon="mdi:truck-delivery" />}
          />
        </Tooltip>

        {/* Vehicle Filter */}
        <Tooltip title="Filter by vehicle" arrow>
          <Chip
            label={selectedVehicle ? selectedVehicle.vehicleNo : 'Vehicle'}
            onClick={vehicleDialog.onTrue}
            color={selectedVehicle ? 'primary' : 'default'}
            variant={selectedVehicle ? 'filled' : 'outlined'}
            icon={<Iconify icon="mdi:truck" />}
          />
        </Tooltip>

        {/* Driver Filter */}
        <Tooltip title="Filter by driver" arrow>
          <Chip
            label={selectedDriver ? selectedDriver.driverName : 'Driver'}
            onClick={driverDialog.onTrue}
            color={selectedDriver ? 'primary' : 'default'}
            variant={selectedDriver ? 'filled' : 'outlined'}
            icon={<Iconify icon="mdi:account" />}
          />
        </Tooltip>
      </Stack>

      {/* Status Filter Popover */}
      <Popover
        open={statusPopover.open}
        onClose={statusPopover.onClose}
        anchorEl={statusPopover.anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: { width: 220, p: 1 },
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ px: 1, pb: 1 }}>
          Select Status
        </Typography>
        <Paper sx={{ maxHeight: 240, overflow: 'auto' }}>
          {Object.values(SUBTRIP_STATUS).map((status) => (
            <MenuItem key={status} onClick={() => handleToggleStatus(status)}>
              <Checkbox
                size="small"
                checked={Array.isArray(filters.status) && filters.status.includes(status)}
              />
              <ListItemText primary={status} />
            </MenuItem>
          ))}
        </Paper>
      </Popover>

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

      {/* Status Filter Select - hidden but still functional */}
      <Select
        multiple
        displayEmpty
        value={Array.isArray(filters.status) ? filters.status : []}
        onChange={handleFilterStatus}
        sx={{ display: 'none' }}
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
    </Box>
  );
}
