/* eslint-disable react/prop-types */
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
  const handleRemoveExpenseType = () => {
    onFilters('expenseType', 'all');
  };

  const handleRemovePump = () => {
    onFilters('pump', null);
  };

  const handleRemoveTransporter = () => {
    onFilters('transporter', null);
  };

  const handleRemoveTripId = () => {
    onFilters('trip', null);
  };

  const handleRemoveVehicleNo = () => {
    onFilters('vehicle', null);
  };

  const handleRemoveSubtrip = () => {
    onFilters('subtrip', null);
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
        {filters.expenseType !== 'all' && (
          <Block label="Expense Type :">
            <Chip size="small" label={filters.expenseType} onDelete={handleRemoveExpenseType} />
          </Block>
        )}

        {filters.pump && (
          <Block label="Pump">
            <Chip
              size="small"
              label={filters.pump.pumpName}
              onDelete={handleRemovePump}
            />
          </Block>
        )}

        {filters.transporter && (
          <Block label="Transporter">
            <Chip
              size="small"
              label={filters.transporter.transportName}
              onDelete={handleRemoveTransporter}
            />
          </Block>
        )}

        {filters.trip && (
          <Block label="Trip">
            <Chip size="small" label={filters.trip._id} onDelete={handleRemoveTripId} />
          </Block>
        )}

        {filters.vehicle && (
          <Block label="Vehicle:">
            <Chip size="small" label={filters.vehicle.vehicleNo} onDelete={handleRemoveVehicleNo} />
          </Block>
        )}

        {filters.subtrip && (
          <Block label="Subtrip">
            <Chip size="small" label={filters.subtrip._id} onDelete={handleRemoveSubtrip} />
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
