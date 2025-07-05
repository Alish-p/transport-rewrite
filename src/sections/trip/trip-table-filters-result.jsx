// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
// types

// ----------------------------------------------------------------------

export default function TripTableFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  results,
  selectedDriverName,
  selectedVehicleNo,
  selectedSubtripId,
  ...other
}) {
  const handleRemoveTripStatus = () => {
    onFilters('tripStatus', 'all');
  };

  const handleRemoveTripId = () => {
    onFilters('tripId', '');
  };

  const handleRemoveDriver = () => {
    onFilters('driverId', '');
  };

  const handleRemoveVehicle = () => {
    onFilters('vehicleId', '');
  };

  const handleRemoveSubtrip = () => {
    onFilters('subtripId', '');
  };

  const handleRemoveDate = () => {
    onFilters('fromDate', null);
    onFilters('toDate', null);
  };

  const shortLabel = fDateRangeShortLabel(filters.fromDate, filters.toDate);

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.tripStatus !== 'all' && (
          <Block label="Trip Type :">
            <Chip size="small" label={filters.tripStatus} onDelete={handleRemoveTripStatus} />
          </Block>
        )}

        {filters.tripId && (
          <Block label="Trip:">
            <Chip size="small" label={filters.tripId} onDelete={handleRemoveTripId} />
          </Block>
        )}

        {filters.driverId && (
          <Block label="driver">
            <Chip size="small" label={selectedDriverName || filters.driverId} onDelete={handleRemoveDriver} />
          </Block>
        )}

        {filters.vehicleId && (
          <Block label="Vehicle No:">
            <Chip size="small" label={selectedVehicleNo || filters.vehicleId} onDelete={handleRemoveVehicle} />
          </Block>
        )}

        {filters.subtripId && (
          <Block label="Subtrip:">
            <Chip size="small" label={selectedSubtripId || filters.subtripId} onDelete={handleRemoveSubtrip} />
          </Block>
        )}

        {filters.fromDate && filters.toDate && (
          <Block label="Date:">
            <Chip size="small" label={shortLabel} onDelete={handleRemoveDate} />
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>
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
