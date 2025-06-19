/* eslint-disable react/prop-types */
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function SubtripTableFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  results,
  selectedCustomerName,
  selectedVehicleNo,
  selectedDriverName,
  ...other
}) {
  const handleRemoveSubtripStatus = () => {
    onFilters('subtripStatus', 'all');
  };

  const handleRemoveCustomer = () => {
    onFilters('customerId', '');
  };

  const handleRemoveTransport = () => {
    onFilters('transportName', '');
  };

  const handleRemoveVehicleNo = () => {
    onFilters('vehicleNo', '');
  };

  const handleRemoveSubtripId = () => {
    onFilters('subtripId', '');
  };

  const handleRemoveDate = () => {
    onFilters('fromDate', null);
    onFilters('toDate', null);
  };

  const handleRemoveEndDate = () => {
    onFilters('subtripEndFromDate', null);
    onFilters('subtripEndToDate', null);
  };

  const handleRemoveDriver = () => {
    onFilters('driverId', '');
  };

  const handleRemoveMaterials = (value) => {
    const newValues = filters.materials.filter((v) => v !== value);
    onFilters('materials', newValues);
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
        {filters.subtripStatus !== 'all' && (
          <Block label="Subtrip Status :">
            <Chip size="small" label={filters.subtripStatus} onDelete={handleRemoveSubtripStatus} />
          </Block>
        )}

        {filters.customerId && (
          <Block label="Customer">
            <Chip size="small" label={selectedCustomerName || filters.customerId} onDelete={handleRemoveCustomer} />
          </Block>
        )}

        {filters.transportName && (
          <Block label="Transporter">
            <Chip size="small" label={filters.transportName} onDelete={handleRemoveTransport} />
          </Block>
        )}

        {filters.vehicleNo && (
          <Block label="Vehicle:">
            <Chip size="small" label={selectedVehicleNo || filters.vehicleNo} onDelete={handleRemoveVehicleNo} />
          </Block>
        )}

        {filters.driverId && (
          <Block label="Driver:">
            <Chip size="small" label={selectedDriverName || filters.driverId} onDelete={handleRemoveDriver} />
          </Block>
        )}

        {filters.subtripId && (
          <Block label="Subtrip Id:">
            <Chip size="small" label={filters.subtripId} onDelete={handleRemoveSubtripId} />
          </Block>
        )}

        {filters.fromDate && filters.toDate && (
          <Block label="Date:">
            <Chip size="small" label={shortLabel} onDelete={handleRemoveDate} />
          </Block>
        )}

        {filters.subtripEndFromDate && filters.subtripEndToDate && (
          <Block label="End Date:">
            <Chip
              size="small"
              label={fDateRangeShortLabel(filters.subtripEndFromDate, filters.subtripEndToDate)}
              onDelete={handleRemoveEndDate}
            />
          </Block>
        )}

        {filters.materials && filters.materials.length > 0 && (
          <Block label="Materials:">
            {filters.materials.map((m) => (
              <Chip key={m} size="small" label={m} onDelete={() => handleRemoveMaterials(m)} />
            ))}
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
