import { Box, Button } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export default function SubtripTableActions({ onSearch, canSearch }) {
  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Iconify icon="material-symbols:search" />}
        onClick={onSearch}
        disabled={!canSearch}
        sx={{ minWidth: 120 }}
      >
        Search
      </Button>
    </Box>
  );
}
