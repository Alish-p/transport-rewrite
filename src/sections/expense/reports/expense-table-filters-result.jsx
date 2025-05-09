import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { useTrips } from 'src/query/use-trip';
import { useVehicles } from 'src/query/use-vehicle';
import { useSubtrips } from 'src/query/use-subtrip';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { usePumps } from '../../../query/use-pump';

// const defaultFilters = {
//   tripId: '',
//   subtripId: '',
//   vehicleId: '',
//   startDate: null,
//   endDate: null,
//   expenseType: [],
//   expenseCategory: '',
//   pumpCd: '',
//   paidThrough: '',
// };

// ----------------------------------------------------------------------

export default function ExpenseTableFiltersResult({ filters, onFilters, onResetFilters }) {
  console.log({ filters });

  const { data: vehicles = [] } = useVehicles();
  const { data: subtrips = [] } = useSubtrips();
  const { data: trips = [] } = useTrips();
  const { data: pumps = [] } = usePumps();

  const handleRemoveVehicleNo = () => {
    onFilters('vehicleId', '');
  };

  const handleRemoveExpenseId = () => {
    onFilters('expenseId', '');
  };

  const handleRemoveDate = () => {
    onFilters('startDate', null);
    onFilters('endDate', null);
  };

  const handleRemoveExpenseType = () => {
    onFilters('expenseType', []);
  };

  const handleRemoveSubtrip = () => {
    onFilters('subtripId', '');
  };

  const handleRemoveTrip = () => {
    onFilters('tripId', '');
  };

  const handleRemovePump = () => {
    onFilters('pumpCd', '');
  };

  const handleRemoveCategory = () => {
    onFilters('expenseCategory', '');
  };

  const handleClearAll = () => {
    onResetFilters();
  };

  const getVehicleNumber = (id) => {
    const vehicle = vehicles.find((v) => v._id === id);
    return vehicle?.vehicleNo || id;
  };

  const getPumpName = (id) => {
    const pump = pumps.find((p) => p._id === id);
    return pump?.pumpName || id;
  };

  const getSubtripId = (id) => {
    const subtrip = subtrips.find((s) => s._id === id);
    return subtrip?._id || id;
  };

  const getTripId = (id) => {
    const trip = trips.find((t) => t._id === id);
    return trip?._id || id;
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'vehicle':
        return 'Vehicle Expense';
      case 'subtrip':
        return 'Subtrip Expense';
      default:
        return category;
    }
  };

  const shortLabel = fDateRangeShortLabel(filters.startDate, filters.endDate);

  return (
    <Stack spacing={1.5}>
      <Box sx={{ width: '100%' }}>
        <Scrollbar>
          <Stack
            flexGrow={1}
            spacing={1}
            direction="row"
            alignItems="center"
            sx={{
              py: 1,
              px: 0.5,
              minWidth: 'min-content',
            }}
          >
            {filters.vehicleId && (
              <Block label="Vehicle No:">
                <Chip
                  size="small"
                  label={getVehicleNumber(filters.vehicleId)}
                  onDelete={handleRemoveVehicleNo}
                />
              </Block>
            )}

            {filters.subtripId && (
              <Block label="Subtrip Id:">
                <Chip
                  size="small"
                  label={getSubtripId(filters.subtripId)}
                  onDelete={handleRemoveSubtrip}
                />
              </Block>
            )}

            {filters.tripId && (
              <Block label="Trip Id:">
                <Chip size="small" label={getTripId(filters.tripId)} onDelete={handleRemoveTrip} />
              </Block>
            )}

            {filters.expenseId && (
              <Block label="Expense Id:">
                <Chip size="small" label={filters.expenseId} onDelete={handleRemoveExpenseId} />
              </Block>
            )}

            {filters.pumpCd && (
              <Block label="Pump:">
                <Chip
                  size="small"
                  label={getPumpName(filters.pumpCd)}
                  onDelete={handleRemovePump}
                />
              </Block>
            )}

            {filters.expenseCategory && (
              <Block label="Category:">
                <Chip
                  size="small"
                  label={getCategoryLabel(filters.expenseCategory)}
                  onDelete={handleRemoveCategory}
                />
              </Block>
            )}

            {filters.startDate && filters.endDate && (
              <Block label="Date:">
                <Chip size="small" label={shortLabel} onDelete={handleRemoveDate} />
              </Block>
            )}

            {Array.isArray(filters.expenseType) && filters.expenseType.length > 0 && (
              <Block label="Expense Type:">
                {filters.expenseType.map((type) => (
                  <Chip
                    key={type}
                    size="small"
                    label={type}
                    onDelete={() => {
                      const newTypes = filters.expenseType.filter((t) => t !== type);
                      onFilters('expenseType', newTypes);
                    }}
                  />
                ))}
              </Block>
            )}

            <Button
              color="error"
              onClick={handleClearAll}
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            >
              Clear
            </Button>
          </Stack>
        </Scrollbar>
      </Box>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
