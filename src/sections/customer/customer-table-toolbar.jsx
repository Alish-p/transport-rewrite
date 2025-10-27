/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import { Tooltip } from '@mui/material';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { ColumnSelectorList } from 'src/components/table';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { TABLE_COLUMNS } from './customer-table-config';

// ----------------------------------------------------------------------

export default function CustomerTableToolbar({
  filters,
  onFilters,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
  onToggleAllColumns,
  onResetColumns,
  canResetColumns,
}) {
  const columnsPopover = usePopover();

  const handleFilterCustomerName = useCallback(
    (event) => {
      onFilters('customerName', event.target.value);
    },
    [onFilters]
  );

  const handleFilterCellNo = useCallback(
    (event) => {
      onFilters('cellNo', event.target.value);
    },
    [onFilters]
  );

  const handleFilterGstIn = useCallback(
    (event) => {
      onFilters('gstIn', event.target.value);
    },
    [onFilters]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >
        <TextField
          fullWidth
          value={filters.customerName}
          onChange={handleFilterCustomerName}
          placeholder="Filter by customer name..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          value={filters.cellNo}
          onChange={handleFilterCellNo}
          placeholder="Filter by mobile no..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="mdi:cellphone" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          value={filters.gstIn}
          onChange={handleFilterGstIn}
          placeholder="Filter by GSTIN..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="mdi:file-document" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={1}>
          <Tooltip title="Column Settings">
            <IconButton onClick={columnsPopover.onOpen}>
              <Iconify icon="mdi:table-column-plus-after" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Reset Columns">
            <span>
              <IconButton onClick={onResetColumns} disabled={!canResetColumns}>
                <Badge color="error" variant="dot" invisible={!canResetColumns}>
                  <Iconify icon="solar:restart-bold" />
                </Badge>
              </IconButton>
            </span>
          </Tooltip>

          {/* Removed export popover (moved to TableSelectedAction) */}
        </Stack>
      </Stack>

      <CustomPopover
        open={columnsPopover.open}
        onClose={columnsPopover.onClose}
        anchorEl={columnsPopover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <ColumnSelectorList
          TABLE_COLUMNS={TABLE_COLUMNS}
          visibleColumns={visibleColumns}
          disabledColumns={disabledColumns}
          handleToggleColumn={onToggleColumn}
          handleToggleAllColumns={onToggleAllColumns}
        />
      </CustomPopover>

      {/* Removed export popover */}
    </>
  );
}
