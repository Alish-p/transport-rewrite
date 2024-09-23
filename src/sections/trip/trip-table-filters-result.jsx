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

export default function DriverTableFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  results,
  ...other
}) {
  const handleRemoveTripStatus = () => {
    onFilters('tripStatus', 'all');
  };

  const handleRemoveTripNo = () => {
    onFilters('TripNo', '');
  };

  const handleRemoveDriver = () => {
    onFilters('driver', '');
  };

  const handleRemoveVehicleNo = () => {
    onFilters('vehicleNo', '');
  };

  const handleRemoveDate = () => {
    onFilters('fromDate', null);
    onFilters('endDate', null);
  };

  const shortLabel = fDateRangeShortLabel(filters.fromDate, filters.endDate);

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

        {filters.tripNo && (
          <Block label="Trip:">
            <Chip size="small" label={filters.tripNo} onDelete={handleRemoveTripNo} />
          </Block>
        )}

        {filters.driver && (
          <Block label="driver">
            <Chip size="small" label={filters.driver} onDelete={handleRemoveDriver} />
          </Block>
        )}

        {filters.vehicleNo && (
          <Block label="Vehicle No:">
            <Chip size="small" label={filters.vehicleNo} onDelete={handleRemoveVehicleNo} />
          </Block>
        )}

        {filters.fromDate && filters.endDate && (
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
