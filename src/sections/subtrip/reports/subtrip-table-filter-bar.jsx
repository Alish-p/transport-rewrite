/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Chip,
  Stack,
  Paper,
  Divider,
  Tooltip,
  Popover,
  Checkbox,
  Typography,
  ListItemText,
  useMediaQuery,
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

export default function SubtripTableFilters({ filters, onFilters, onSearch }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  // Define all filter chips for better organization
  const filterChips = [
    {
      id: 'status',
      label: 'Status',
      tooltip: 'Filter by status',
      onClick: statusPopover.onOpen,
      isSelected: Array.isArray(filters.status) && filters.status.length > 0,
      icon: <Iconify icon="mdi:filter-variant" />,
    },
    {
      id: 'dateRange',
      label: dateRangeSelected ? dateRangeShortLabel : 'Date Range',
      tooltip: 'Filter by date range',
      onClick: dateRangePopover.onOpen,
      isSelected: dateRangeSelected,
      icon: <Iconify icon="mdi:calendar" />,
    },
    {
      id: 'customer',
      label: selectedCustomer ? selectedCustomer.customerName : 'Customer',
      tooltip: 'Filter by customer',
      onClick: customerDialog.onTrue,
      isSelected: !!selectedCustomer,
      icon: <Iconify icon="mdi:office-building" />,
    },
    {
      id: 'transporter',
      label: selectedTransporter ? selectedTransporter.transportName : 'Transporter',
      tooltip: 'Filter by transporter',
      onClick: transporterDialog.onTrue,
      isSelected: !!selectedTransporter,
      icon: <Iconify icon="mdi:truck-delivery" />,
    },
    {
      id: 'vehicle',
      label: selectedVehicle ? selectedVehicle.vehicleNo : 'Vehicle',
      tooltip: 'Filter by vehicle',
      onClick: vehicleDialog.onTrue,
      isSelected: !!selectedVehicle,
      icon: <Iconify icon="mdi:truck" />,
    },
    {
      id: 'driver',
      label: selectedDriver ? selectedDriver.driverName : 'Driver',
      tooltip: 'Filter by driver',
      onClick: driverDialog.onTrue,
      isSelected: !!selectedDriver,
      icon: <Iconify icon="mdi:account" />,
    },
  ];

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

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
          endAdornment: filters.subtripId && (
            <InputAdornment position="end">
              <Tooltip title="Search">
                <Box component="span" sx={{ cursor: 'pointer' }} onClick={handleSearch}>
                  <Iconify icon="material-symbols:search" color="primary.main" />
                </Box>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      /> */}

      {/* Filter Chips Section */}
      <Box>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            mb: 1,
            flexWrap: 'nowrap',
            overflowX: isMobile ? 'auto' : 'visible',
            pb: isMobile ? 1 : 0,
            gap: 1,
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '6px',
            },
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mr: 1,
              whiteSpace: 'nowrap',
              display: 'inline-block',
            }}
          >
            Additional Filters:
          </Typography>

          <Divider orientation="vertical" flexItem sx={{ minHeight: '24px' }} />

          {filterChips.map((chip) => (
            <Tooltip key={chip.id} title={chip.tooltip} arrow>
              <Chip
                label={chip.label}
                onClick={chip.onClick}
                color={chip.isSelected ? 'primary' : 'default'}
                variant={chip.isSelected ? 'filled' : 'outlined'}
                icon={chip.icon}
                sx={{
                  minWidth: isMobile ? 'auto' : undefined,
                  '& .MuiChip-label': {
                    maxWidth: isMobile ? '120px' : '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  },
                }}
              />
            </Tooltip>
          ))}
        </Stack>
      </Box>

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
    </Box>
  );
}
