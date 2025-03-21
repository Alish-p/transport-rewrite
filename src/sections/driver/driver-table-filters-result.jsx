/* eslint-disable react/prop-types */
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

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
  const handleRemoveStatus = () => {
    onFilters('status', 'all');
  };

  const handleRemoveDriverName = () => {
    onFilters('driverName', '');
  };

  const handleRemoveDriverLicenceNo = () => {
    onFilters('driverLicenceNo', '');
  };

  const handleRemoveDriverCellNo = () => {
    onFilters('driverCellNo', '');
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.status !== 'all' && (
          <Block label="Status:">
            <Chip size="small" label={filters.status} onDelete={handleRemoveStatus} />
          </Block>
        )}

        {filters.driverName && (
          <Block label="Driver Name:">
            <Chip size="small" label={filters.driverName} onDelete={handleRemoveDriverName} />
          </Block>
        )}

        {filters.driverLicenceNo && (
          <Block label="Driver Licence No:">
            <Chip
              size="small"
              label={filters.driverLicenceNo}
              onDelete={handleRemoveDriverLicenceNo}
            />
          </Block>
        )}

        {filters.driverCellNo && (
          <Block label="Driver Cell No:">
            <Chip size="small" label={filters.driverCellNo} onDelete={handleRemoveDriverCellNo} />
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
