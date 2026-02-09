/* eslint-disable react/prop-types */
import { useCallback } from 'react';

// @mui
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ColumnSelectorList } from 'src/components/table';
import { usePopover } from 'src/components/custom-popover';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { KanbanCustomerDialog } from 'src/sections/kanban/components/kanban-customer-dialog';

import { TABLE_COLUMNS } from './route-table-config';

export default function RouteTableToolbar({
  filters,
  onFilters,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
  onToggleAllColumns,
  selectedCustomer,
  onSelectCustomer,
  onResetColumns,
  canResetColumns,
}) {
  const columnsPopover = usePopover();
  const customerDialog = useBoolean();

  const handleFilterRouteName = useCallback(
    (event) => {
      onFilters('routeName', event.target.value);
    },
    [onFilters]
  );

  const handleFilterFromPlace = useCallback(
    (event) => {
      onFilters('fromPlace', event.target.value);
    },
    [onFilters]
  );

  const handleFilterToPlace = useCallback(
    (event) => {
      onFilters('toPlace', event.target.value);
    },
    [onFilters]
  );

  const handleSelectCustomer = useCallback(
    (customer) => {
      if (onSelectCustomer) {
        onSelectCustomer(customer);
      }
      onFilters('customer', customer._id);
    },
    [onFilters, onSelectCustomer]
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
          value={filters.routeName}
          onChange={handleFilterRouteName}
          placeholder="Search Route Name..."
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
          value={filters.fromPlace}
          onChange={handleFilterFromPlace}
          placeholder="Search Starting point..."
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
          value={filters.toPlace}
          onChange={handleFilterToPlace}
          placeholder="Search Ending Point ..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <DialogSelectButton
          onClick={customerDialog.onTrue}
          placeholder="Search customer"
          selected={selectedCustomer?.customerName}
          iconName="mdi:office-building"
        />

        <Stack direction="row" spacing={1}>
          <Button
            color="inherit"
            variant="outlined"
            onClick={columnsPopover.onOpen}
            startIcon={
              <Badge color="error" variant="dot" invisible={!canResetColumns}>
                <Iconify icon="solar:settings-bold" />
              </Badge>
            }
            sx={{ flexShrink: 0 }}
          >
            Columns
          </Button>

          {/* Removed export popover (moved to TableSelectedAction) */}
        </Stack>
      </Stack>

      <ColumnSelectorList
        open={Boolean(columnsPopover.open)}
        onClose={columnsPopover.onClose}
        TABLE_COLUMNS={TABLE_COLUMNS}
        visibleColumns={visibleColumns}
        disabledColumns={disabledColumns}
        handleToggleColumn={onToggleColumn}
        handleToggleAllColumns={onToggleAllColumns}
        onResetColumns={onResetColumns}
        canResetColumns={canResetColumns}
      />

      {/* Removed export popover */}

      <KanbanCustomerDialog
        open={customerDialog.value}
        onClose={customerDialog.onFalse}
        selectedCustomer={selectedCustomer}
        onCustomerChange={handleSelectCustomer}
      />
    </>
  );
}
