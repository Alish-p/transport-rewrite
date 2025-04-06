import { Box, Button } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';

export default function SubtripTableActions({
  tableData,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
  onSearch,
  canSearch,
}) {
  const columnsPopover = usePopover();
  const actionsPopover = usePopover();

  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* Left side - Search button */}
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
