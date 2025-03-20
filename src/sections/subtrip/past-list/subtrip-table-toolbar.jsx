/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Box,
  Tooltip,
  MenuList,
  Checkbox,
  useTheme,
  ListItemText,
  useMediaQuery,
} from '@mui/material';

import { exportToExcel } from 'src/utils/export-to-excel';
import { fDateRangeShortLabel } from 'src/utils/format-time';

import { useDrivers } from 'src/query/use-driver';
import { useVehicles } from 'src/query/use-vehicle';
import { useCustomers } from 'src/query/use-customer';
import { useTransporters } from 'src/query/use-transporter';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { SUBTRIP_STATUS } from 'src/sections/subtrip/constants';
import { KanbanDriverDialog } from 'src/sections/kanban/components/kanban-driver-dialog';
import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';
import { KanbanCustomerDialog } from 'src/sections/kanban/components/kanban-customer-dialog';
import { KanbanTransporterDialog } from 'src/sections/kanban/components/kanban-transporter-dialog';

// ----------------------------------------------------------------------

export default function SubtripTableToolbar({
  filters,
  onFilters,
  onSearch,
  tableData,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const popover = usePopover();
  const columnsPopover = usePopover();
  const dateRangePopover = usePopover();

  const { data: customers = [] } = useCustomers();
  const { data: vehicles = [] } = useVehicles();
  const { data: transporters = [] } = useTransporters();
  const { data: drivers = [] } = useDrivers();

  const [openVehicleDialog, setOpenVehicleDialog] = useState(false);
  const [openDriverDialog, setOpenDriverDialog] = useState(false);
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
  const [openTransporterDialog, setOpenTransporterDialog] = useState(false);

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
    (event, newValue) => {
      onFilters('status', newValue);
    },
    [onFilters]
  );

  const handleOpenVehicleDialog = () => {
    setOpenVehicleDialog(true);
  };

  const handleCloseVehicleDialog = () => {
    setOpenVehicleDialog(false);
  };

  const handleVehicleChange = (vehicle) => {
    onFilters('vehicleNo', vehicle._id);
  };

  const handleOpenCustomerDialog = () => {
    setOpenCustomerDialog(true);
  };

  const handleCloseCustomerDialog = () => {
    setOpenCustomerDialog(false);
  };

  const handleOpenTransporterDialog = () => {
    setOpenTransporterDialog(true);
  };

  const handleCloseTransporterDialog = () => {
    setOpenTransporterDialog(false);
  };

  const handleOpenDriverDialog = () => {
    setOpenDriverDialog(true);
  };

  const handleCloseDriverDialog = () => {
    setOpenDriverDialog(false);
  };

  const handleDriverChange = (driver) => {
    onFilters('driverId', driver._id);
  };

  const selectedVehicle = vehicles.find((v) => v._id === filters.vehicleNo);
  const selectedDriver = drivers.find((d) => d._id === filters.driverId);
  const selectedCustomer = customers.find((c) => c._id === filters.customerId);
  const selectedTransporter = transporters.find((t) => t._id === filters.transportName);

  const dateRangeSelected = !!filters.fromDate && !!filters.endDate;
  const dateRangeShortLabel = dateRangeSelected
    ? fDateRangeShortLabel(filters.fromDate, filters.endDate)
    : '';

  const canSearch = !!(
    filters.customerId ||
    filters.transportName ||
    filters.vehicleNo ||
    filters.subtripId ||
    dateRangeSelected ||
    filters.status
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
          {/* Main Filters Grid */}
          <Box
            sx={{
              pt: 2.5,
              px: 2.5,
              minWidth: { md: '1200px' },
            }}
          >
            <Stack spacing={2} direction="row" flexWrap="wrap" alignItems="center" sx={{ gap: 2 }}>
              {/* ID Search */}
              <TextField
                value={filters.subtripId}
                onChange={handleFilterSubtripId}
                placeholder="Search by ID"
                sx={{ width: { xs: 1, md: 200 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Status Filter */}
              <Autocomplete
                multiple
                disableCloseOnSelect
                options={Object.values(SUBTRIP_STATUS)}
                value={filters.status || []}
                onChange={handleFilterStatus}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Status"
                    sx={{ width: { xs: 1, md: 200 } }}
                  />
                )}
                sx={{ width: { xs: 1, md: 200 } }}
              />

              {/* Date Range Filter */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {dateRangeSelected ? (
                  <Button
                    size="small"
                    onClick={dateRangePopover.onOpen}
                    variant="outlined"
                    sx={{ width: { xs: 1, md: 200 }, height: 56 }}
                  >
                    {dateRangeShortLabel}{' '}
                    <Iconify
                      icon="mdi:calendar"
                      sx={{ color: dateRangeSelected ? 'success.main' : 'inherit' }}
                    />
                  </Button>
                ) : (
                  <Button
                    onClick={dateRangePopover.onOpen}
                    variant="outlined"
                    sx={{
                      width: { xs: 1, md: 200 },
                      height: 56,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      borderStyle: 'dashed',
                    }}
                  >
                    Select Date Range
                    <Iconify icon="mdi:calendar" />
                  </Button>
                )}

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
              </Box>

              {/* Customer Filter */}
              <Button
                onClick={handleOpenCustomerDialog}
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

              {/* Transporter Filter */}
              <Button
                onClick={handleOpenTransporterDialog}
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

              {/* Vehicle Filter */}
              <Button
                onClick={handleOpenVehicleDialog}
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

              {/* Driver Filter */}
              <Button
                onClick={handleOpenDriverDialog}
                variant="outlined"
                sx={{
                  width: { xs: 1, md: 200 },
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {selectedDriver ? selectedDriver.driverName : 'Select Driver'}
                <Iconify
                  icon={selectedDriver ? 'mdi:account' : 'mdi:account-outline'}
                  sx={{ color: selectedDriver ? 'success.main' : 'inherit' }}
                />
              </Button>

              {/* Action Buttons */}
              <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
                <Tooltip title="Column Settings">
                  <IconButton onClick={columnsPopover.onOpen}>
                    <Iconify icon="mdi:table-column-plus-after" />
                  </IconButton>
                </Tooltip>

                <IconButton onClick={popover.onOpen}>
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Iconify icon="material-symbols:search" />}
                  onClick={onSearch}
                  disabled={!canSearch}
                  sx={{
                    height: 40,
                    boxShadow: theme.customShadows.primary,
                  }}
                >
                  Search
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Column Settings */}
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
              <ListItemText
                primary={
                  column
                    .replace(/([A-Z])/g, ' $1')
                    .charAt(0)
                    .toUpperCase() + column.replace(/([A-Z])/g, ' $1').slice(1)
                }
                secondary={disabledColumns[column] ? '(Always visible)' : null}
              />
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
              exportToExcel(tableData, 'billed-paid-subtrips');
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <KanbanVehicleDialog
        open={openVehicleDialog}
        onClose={handleCloseVehicleDialog}
        selectedVehicle={selectedVehicle}
        onVehicleChange={handleVehicleChange}
      />

      <KanbanDriverDialog
        open={openDriverDialog}
        onClose={handleCloseDriverDialog}
        selectedDriver={selectedDriver}
        onDriverChange={handleDriverChange}
      />

      <KanbanCustomerDialog
        open={openCustomerDialog}
        onClose={handleCloseCustomerDialog}
        selectedCustomer={selectedCustomer}
        onCustomerChange={handleFilterCustomer}
      />

      <KanbanTransporterDialog
        open={openTransporterDialog}
        onClose={handleCloseTransporterDialog}
        selectedTransporter={selectedTransporter}
        onTransporterChange={handleFilterTransporter}
      />
    </>
  );
}
