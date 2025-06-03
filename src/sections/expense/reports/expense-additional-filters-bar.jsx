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
  Typography,
  ListItemText,
  useMediaQuery,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { useTrips } from 'src/query/use-trip';
import { usePumps } from 'src/query/use-pump';
import { useSubtrips } from 'src/query/use-subtrip';
import { useVehiclesSummary } from 'src/query/use-vehicle';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { usePopover } from 'src/components/custom-popover';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { KanbanTripDialog } from 'src/sections/kanban/components/kanban-trip-dialog';
import { KanbanPumpDialog } from 'src/sections/kanban/components/kanban-pump-dialog';
import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';
// import { KanbanSubtripDialog } from 'src/sections/kanban/components/';
import { subtripExpenseTypes, vehicleExpenseTypes } from 'src/sections/expense/expense-config';

// ----------------------------------------------------------------------

const EXPENSE_CATEGORIES = [
  { value: 'vehicle', label: 'Vehicle Expense' },
  { value: 'subtrip', label: 'Subtrip Expense' },
];

// tripId: '',
// subtripId: '',
// vehicleId: '',
// startDate: null,
// endDate: null,
// expenseType: [],
// expenseCategory: '',
// pumpCd: '',
// paidThrough: '',

export default function ExpenseTableFilterBar({ filters, onFilters }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dateRangePopover = usePopover();
  const expenseTypePopover = usePopover();
  const categoryPopover = usePopover();

  const { data: vehicles = [] } = useVehiclesSummary();
  const { data: pumps = [] } = usePumps();
  const { data: subtrips = [] } = useSubtrips();
  const { data: trips = [] } = useTrips();

  const vehicleDialog = useBoolean();
  const tripDialog = useBoolean();
  const subtripDialog = useBoolean();
  const pumpDialog = useBoolean();

  const handleFilterTrip = useCallback(
    (trip) => {
      onFilters('tripId', trip._id);
    },
    [onFilters]
  );

  const handleFilterPump = useCallback(
    (pump) => {
      onFilters('pumpCd', pump._id);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      onFilters('startDate', newValue);
    },
    [onFilters]
  );
  const handleFilterEndDate = useCallback(
    (newValue) => {
      onFilters('endDate', newValue);
    },
    [onFilters]
  );

  const handleFilterCategory = useCallback(
    (category) => {
      onFilters('expenseCategory', category);
    },
    [onFilters]
  );

  const handleFilterVehicle = useCallback(
    (vehicle) => {
      onFilters('vehicleId', vehicle._id);
    },
    [onFilters]
  );

  const handleFilterExpenseType = useCallback(
    (expenseType) => {
      const currentTypes = Array.isArray(filters.expenseType) ? [...filters.expenseType] : [];
      const newTypes = currentTypes.includes(expenseType)
        ? currentTypes.filter((t) => t !== expenseType)
        : [...currentTypes, expenseType];

      onFilters('expenseType', newTypes);
    },
    [filters.expenseType, onFilters]
  );

  const selectedVehicle = vehicles.find((v) => v._id === filters.vehicleId);
  const selectedPump = pumps.find((p) => p._id === filters.pumpCd);
  const selectedSubtrip = subtrips.find((s) => s._id === filters.subtripId);
  const selectedTrip = trips.find((t) => t._id === filters.tripId);

  const dateRangeSelected = !!filters.startDate && !!filters.endDate;
  const dateRangeShortLabel = dateRangeSelected
    ? fDateRangeShortLabel(filters.startDate, filters.endDate)
    : '';

  // Combine expense types based on selected category
  const availableExpenseTypes =
    filters.expenseCategory === 'vehicle'
      ? vehicleExpenseTypes
      : filters.expenseCategory === 'subtrip'
        ? subtripExpenseTypes
        : [...subtripExpenseTypes, ...vehicleExpenseTypes];

  // Define all filter chips for better organization
  const filterChips = [
    {
      id: 'dateRange',
      label: dateRangeSelected ? dateRangeShortLabel : 'Date Range',
      tooltip: 'Filter by date range',
      onClick: dateRangePopover.onOpen,
      isSelected: dateRangeSelected,
      icon: <Iconify icon="mdi:calendar" />,
    },
    {
      id: 'expenseType',
      label:
        Array.isArray(filters.expenseType) && filters.expenseType.length > 0
          ? `${filters.expenseType.length} types selected`
          : 'Expense Type',
      tooltip: 'Filter by expense type',
      onClick: expenseTypePopover.onOpen,
      isSelected: Array.isArray(filters.expenseType) && filters.expenseType.length > 0,
      icon: <Iconify icon="mdi:filter-variant" />,
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
      id: 'subtrip',
      label: selectedSubtrip ? selectedSubtrip._id : 'Subtrip',
      tooltip: 'Filter by subtrip',
      onClick: subtripDialog.onTrue,
      isSelected: !!selectedSubtrip,
      icon: <Iconify icon="mdi:routes" />,
    },
    {
      id: 'trip',
      label: selectedTrip ? selectedTrip._id : 'Trip',
      tooltip: 'Filter by trip',
      onClick: tripDialog.onTrue,
      isSelected: !!selectedTrip,
      icon: <Iconify icon="mdi:map-marker-path" />,
    },
    {
      id: 'pump',
      label: selectedPump ? selectedPump.pumpName : 'Pump',
      tooltip: 'Filter by pump',
      onClick: pumpDialog.onTrue,
      isSelected: !!selectedPump,
      icon: <Iconify icon="mdi:gas-station" />,
    },

    {
      id: 'category',
      label: filters.expenseCategory
        ? EXPENSE_CATEGORIES.find((c) => c.value === filters.expenseCategory)?.label
        : 'Category',
      tooltip: 'Filter by expense category',
      onClick: categoryPopover.onOpen,
      isSelected: !!filters.expenseCategory,
      icon: <Iconify icon="mdi:category" />,
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
                    sx={{
                      height: 'auto',
                      '& .MuiChip-label': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        padding: '4px 8px',
                      },
                    }}
                  />
                </Tooltip>
              ))}
            </Stack>
          </Scrollbar>
        </Box>
      </Stack>

      {/* Date Range Picker Popover */}
      <CustomDateRangePicker
        variant="calendar"
        open={dateRangePopover.open}
        onClose={dateRangePopover.onClose}
        startDate={filters.startDate}
        endDate={filters.endDate}
        onChangeStartDate={handleFilterStartDate}
        onChangeEndDate={handleFilterEndDate}
        selected={dateRangeSelected}
        error={false}
      />

      {/* Expense Type Popover */}
      <Popover
        open={expenseTypePopover.open}
        onClose={expenseTypePopover.onClose}
        anchorEl={expenseTypePopover.anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: { width: 220, p: 1 },
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ px: 1, py: 1 }}>
          Expense Types
        </Typography>

        <Box sx={{ height: 300, maxHeight: 300, overflow: 'auto' }}>
          <Stack spacing={1}>
            {availableExpenseTypes.map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => handleFilterExpenseType(option.value)}
                sx={{ p: 0.5, borderRadius: 0.75, typography: 'body2' }}
              >
                <Checkbox
                  size="small"
                  checked={
                    Array.isArray(filters.expenseType)
                      ? filters.expenseType.includes(option.value)
                      : false
                  }
                />
                <ListItemText
                  primary={option.label}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </MenuItem>
            ))}
          </Stack>
        </Box>
      </Popover>

      {/* Category Popover */}
      <Popover
        open={categoryPopover.open}
        onClose={categoryPopover.onClose}
        anchorEl={categoryPopover.anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: { width: 220, p: 1 },
          },
        }}
      >
        <Stack spacing={1}>
          <Typography variant="subtitle2" sx={{ px: 1 }}>
            Expense Categories
          </Typography>

          {EXPENSE_CATEGORIES.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => {
                handleFilterCategory(option.value);
                categoryPopover.onClose();
              }}
              sx={{ p: 0.5, borderRadius: 0.75, typography: 'body2' }}
            >
              <Checkbox size="small" checked={filters.expenseCategory === option.value} />
              <ListItemText primary={option.label} primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
          ))}
        </Stack>
      </Popover>

      {/* Dialog Components */}
      {pumpDialog.value && (
        <KanbanPumpDialog
          open={pumpDialog.value}
          onClose={pumpDialog.onFalse}
          onPumpChange={handleFilterPump}
          selectedPump={selectedPump?._id || ''}
        />
      )}

      {vehicleDialog.value && (
        <KanbanVehicleDialog
          open={vehicleDialog.value}
          onClose={vehicleDialog.onFalse}
          onVehicleChange={handleFilterVehicle}
          selectedVehicle={selectedVehicle?._id || ''}
        />
      )}

      {/* {subtripDialog.value && (
        <KanbanSubtripDialog
          open={subtripDialog.value}
          onClose={subtripDialog.onFalse}
          onSelect={handleFilterSubtrip}
          selected={selectedSubtrip?._id || ''}
        />
      )} */}

      {tripDialog.value && (
        <KanbanTripDialog
          open={tripDialog.value}
          onClose={tripDialog.onFalse}
          onTripChange={handleFilterTrip}
          selectedTrip={selectedTrip?._id || ''}
          trips={trips}
        />
      )}
    </Box>
  );
}
