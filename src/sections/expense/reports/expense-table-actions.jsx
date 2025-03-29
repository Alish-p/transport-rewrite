import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { Box, Stack, Button, Tooltip, IconButton } from '@mui/material';

import { exportToExcel } from 'src/utils/export-to-excel';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

export default function ExpenseTableActions({ tableData, onSearch, canSearch }) {
  const popover = usePopover();
  const columnsPopover = usePopover();

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2 }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Iconify icon="material-symbols:search" />}
        onClick={onSearch}
        disabled={!canSearch}
        sx={{ width: '90%' }}
      >
        Search
      </Button>

      <Stack direction="row" spacing={1} alignItems="center">
        <Box
          sx={{
            typography: 'body2',
            textWrap: 'nowrap',
          }}
        >
          <strong>{tableData?.length || 0}</strong>
          <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
            {' '}
            results found
          </Box>
        </Box>
        <Tooltip title="Column Settings">
          <IconButton onClick={columnsPopover.onOpen}>
            <Iconify icon="mdi:table-column-plus-after" />
          </IconButton>
        </Tooltip>
        <IconButton onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={popover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              exportToExcel(tableData, 'expense-report');
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </Stack>
  );
}
