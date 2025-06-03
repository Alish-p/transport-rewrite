/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Chip,
  Stack,
  Divider,
  Tooltip,
  Popover,
  Checkbox,
  MenuList,
  Typography,
  ListItemText,
  useMediaQuery,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';
import { useDrivers } from 'src/query/use-driver';
import { useVehicles } from 'src/query/use-vehicle';
import { useTransporters } from 'src/query/use-transporter';
import { useCustomersSummary } from 'src/query/use-customer';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { usePopover } from 'src/components/custom-popover';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { SUBTRIP_STATUS } from 'src/sections/subtrip/constants';
import { KanbanDriverDialog } from 'src/sections/kanban/components/kanban-driver-dialog';
import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';
import { KanbanCustomerDialog } from 'src/sections/kanban/components/kanban-customer-dialog';
import { KanbanTransporterDialog } from 'src/sections/kanban/components/kanban-transporter-dialog';

// ----------------------------------------------------------------------

export default function SubtripTableFilters({ filters, onFilters }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const startDateRangePopover = usePopover();
  const ewayDateRangePopover = usePopover();
  const endDateRangePopover = usePopover();
  const statusPopover = usePopover();
  const materialPopover = usePopover();

  const { data: customers = [] } = useCustomersSummary();
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

  const handleFilterDispatchStartDate = useCallback(
    (newValue) => {
      onFilters('startFromDate', newValue);
    },
    [onFilters]
  );

  const handleFilterDispatchEndDate = useCallback(
    (newValue) => {
      onFilters('startEndDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEwayStartDate = useCallback(
    (newValue) => {
      onFilters('ewayExpiryFromDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEwayEndDate = useCallback(
    (newValue) => {
      onFilters('ewayExpiryEndDate', newValue);
    },
    [onFilters]
  );

  const handleFilterSubtripEndDate = useCallback(
    (newValue) => {
      onFilters('subtripEndEndDate', newValue);
    },
    [onFilters]
  );

  const handleFilterSubtripStartDate = useCallback(
    (newValue) => {
      onFilters('subtripEndFromDate', newValue);
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

  const handleToggleMaterialTypes = useCallback(
    (materials) => {
      const currentMaterials = Array.isArray(filters.materials) ? [...filters.materials] : [];
      const newMaterials = currentMaterials.includes(materials)
        ? currentMaterials.filter((s) => s !== materials)
        : [...currentMaterials, materials];

      onFilters('materials', newMaterials);
    },
    [filters.materials, onFilters]
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

  const startDateRangeSelected = !!filters.startFromDate && !!filters.startEndDate;
  const ewayDateRangeSelected = !!filters.ewayExpiryFromDate && !!filters.ewayExpiryEndDate;
  const endDateRangeSelected = !!filters.subtripEndFromDate && !!filters.subtripEndEndDate;

  const startDateRangeShortLabel = startDateRangeSelected
    ? fDateRangeShortLabel(filters.startFromDate, filters.startEndDate)
    : '';
  const ewayDateRangeShortLabel = ewayDateRangeSelected
    ? fDateRangeShortLabel(filters.ewayExpiryFromDate, filters.ewayExpiryEndDate)
    : '';
  const endDateRangeShortLabel = endDateRangeSelected
    ? fDateRangeShortLabel(filters.subtripEndFromDate, filters.subtripEndEndDate)
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
      id: 'startDateRange',
      label: startDateRangeSelected
        ? `Dispatch: ${startDateRangeShortLabel}`
        : 'Dispatch Date Range',
      tooltip: 'Filter by Dispatch date range',
      onClick: startDateRangePopover.onOpen,
      isSelected: startDateRangeSelected,
      icon: <Iconify icon="mdi:calendar" />,
    },
    {
      id: 'ewayDateRange',
      label: ewayDateRangeSelected ? `E-way: ${ewayDateRangeShortLabel}` : 'E-way Expiry Range',
      tooltip: 'Filter by e-way expiry date range',
      onClick: ewayDateRangePopover.onOpen,
      isSelected: ewayDateRangeSelected,
      icon: <Iconify icon="mdi:calendar" />,
    },
    {
      id: 'endDateRange',
      label: endDateRangeSelected ? `Received: ${endDateRangeShortLabel}` : 'Received Date Range',
      tooltip: 'Filter by Received date range',
      onClick: endDateRangePopover.onOpen,
      isSelected: endDateRangeSelected,
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

    {
      id: 'materials',
      label: 'Materials',
      tooltip: 'Filter by Material Types',
      onClick: materialPopover.onOpen,
      isSelected: Array.isArray(filters.materials) && filters.materials.length > 0,
      icon: <Iconify icon="mdi:filter-variant" />,
    },
  ];

  return (
    <Box sx={{ p: 2, pb: 1 }}>
      {/* Filter Chips Section */}

      <Stack sx={{ mb: 1 }} direction={isMobile ? 'column' : 'row'}>
        <Stack direction="row" alignItems="center">
          <Typography variant="body2" color="text.secondary" noWrap sx={{ mr: 1 }}>
            Additional Filters:
          </Typography>

          {!isMobile && <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />}
        </Stack>

        <Box sx={{ width: '100%' }}>
          <Scrollbar>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                py: 1,
                px: 0.5,
                gap: 1,
                minWidth: 'min-content',
              }}
            >
              {filterChips.map((chip) => (
                <Tooltip key={chip.id} title={chip.tooltip} arrow>
                  <Chip
                    label={chip.label}
                    onClick={chip.onClick}
                    color={chip.isSelected ? 'primary' : 'default'}
                    variant={chip.isSelected ? 'filled' : 'outlined'}
                    icon={chip.icon}
                  />
                </Tooltip>
              ))}
            </Stack>
          </Scrollbar>
        </Box>
      </Stack>

      {/* Status Filter Popover */}
      <Popover
        open={statusPopover.open}
        onClose={statusPopover.onClose}
        anchorEl={statusPopover.anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuList sx={{ width: 200 }}>
          {Object.values(SUBTRIP_STATUS).map((status) => (
            <MenuItem key={status} onClick={() => handleToggleStatus(status)}>
              <Checkbox
                checked={Array.isArray(filters.status) && filters.status.includes(status)}
              />
              <ListItemText primary={status} />
            </MenuItem>
          ))}
        </MenuList>
      </Popover>

      {/* Material Type Filter Popover */}
      <Popover
        open={materialPopover.open}
        onClose={materialPopover.onClose}
        anchorEl={materialPopover.anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuList sx={{ width: 200, height: 400, overflowY: 'auto' }}>
          {Object.values(CONFIG.materialOptions).map(({ label, value }) => (
            <MenuItem key={value} onClick={() => handleToggleMaterialTypes(value)}>
              <Checkbox
                checked={Array.isArray(filters.materials) && filters.materials.includes(value)}
              />
              <ListItemText primary={value} />
            </MenuItem>
          ))}
        </MenuList>
      </Popover>

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

      <CustomDateRangePicker
        variant="calendar"
        title="Select dispatch date range"
        startDate={filters.startFromDate}
        endDate={filters.startEndDate}
        onChangeStartDate={handleFilterDispatchStartDate}
        onChangeEndDate={handleFilterDispatchEndDate}
        open={startDateRangePopover.open}
        onClose={startDateRangePopover.onClose}
        selected={startDateRangeSelected}
        error={false}
      />

      <CustomDateRangePicker
        variant="calendar"
        title="Select e-way expiry date range"
        startDate={filters.ewayExpiryFromDate}
        endDate={filters.ewayExpiryEndDate}
        onChangeStartDate={handleFilterEwayStartDate}
        onChangeEndDate={handleFilterEwayEndDate}
        open={ewayDateRangePopover.open}
        onClose={ewayDateRangePopover.onClose}
        selected={ewayDateRangeSelected}
        error={false}
      />

      <CustomDateRangePicker
        variant="calendar"
        title="Select end date range"
        startDate={filters.subtripEndFromDate}
        endDate={filters.subtripEndEndDate}
        onChangeStartDate={handleFilterSubtripStartDate}
        onChangeEndDate={handleFilterSubtripEndDate}
        open={endDateRangePopover.open}
        onClose={endDateRangePopover.onClose}
        selected={endDateRangeSelected}
        error={false}
      />
    </Box>
  );
}
