import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { Box, Stack, Button, Tooltip, IconButton } from '@mui/material';

import { exportToExcel } from 'src/utils/export-to-excel';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

export default function ExpenseTableActions({
  tableData,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
  onSearch,
  canSearch,
}) {
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

      {/* Column Settings */}
      <CustomPopover
        open={columnsPopover.open}
        onClose={columnsPopover.onClose}
        anchorEl={columnsPopover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList sx={{ width: 200 }}>
          {Object.keys(visibleColumns).map((column) => (
            <MenuItem
              key={column}
              onClick={() => !disabledColumns[column] && onToggleColumn(column)}
              disabled={disabledColumns[column]}
              sx={disabledColumns[column] ? { opacity: 0.7 } : {}}
            >
              <Checkbox checked={visibleColumns[column]} disabled={disabledColumns[column]} />
              <ListItemText
                primary={
                  column
                    .replace(/([A-Z])/g, ' $1')
                    .charAt(0)
                    .toUpperCase() + column.replace(/([A-Z])/g, ' $1').slice(1)
                }
                secondary={disabledColumns[column] ? '(Always visible)' : null}
              />
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>

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
