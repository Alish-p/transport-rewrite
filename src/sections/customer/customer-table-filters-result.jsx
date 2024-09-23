/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CustomerTableFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  results,
  ...other
}) {
  const handleRemoveCustomerName = () => {
    onFilters('customerName', '');
  };

  const handleRemoveGSTNo = () => {
    onFilters('GSTNo', '');
  };

  const handleRemovePANNo = () => {
    onFilters('PANNo', '');
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
        {filters.customerName && (
          <Block label="Customer Name :">
            <Chip size="small" label={filters.customerName} onDelete={handleRemoveCustomerName} />
          </Block>
        )}

        {filters.GSTNo && (
          <Block label="GST No:">
            <Chip size="small" label={filters.GSTNo} onDelete={handleRemoveGSTNo} />
          </Block>
        )}

        {filters.PANNo && (
          <Block label="PAN No:">
            <Chip size="small" label={filters.PANNo} onDelete={handleRemovePANNo} />
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
