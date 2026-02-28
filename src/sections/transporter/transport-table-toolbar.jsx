/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
// @mui
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify/';

import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';

import { STATES } from '../customer/config';
import { TABLE_COLUMNS } from './transporter-table-config';
import { ColumnSelectorList } from '../../components/table';
import { usePopover } from '../../components/custom-popover';
import TransporterFiltersDrawer from './transporter-filters-drawer';

// ----------------------------------------------------------------------

export default function TransporterTableToolbar({
  filters,
  onFilters,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
  onToggleAllColumns,
  onResetColumns,
  canResetColumns,
  selectedVehicle,
  onSelectVehicle,
}) {
  const columnsPopover = usePopover();
  const filtersDrawer = useBoolean();
  const vehicleDialog = useBoolean();

  const handleSelectVehicle = useCallback(
    (vehicle) => {
      onFilters('vehicleId', vehicle._id);
      if (onSelectVehicle) {
        onSelectVehicle(vehicle);
      }
    },
    [onFilters, onSelectVehicle]
  );

  const handleFilterSearch = useCallback(
    (event) => {
      onFilters('search', event.target.value);
    },
    [onFilters]
  );

  const handleFilterState = useCallback(
    (event) => {
      onFilters('state', event.target.value);
    },
    [onFilters]
  );

  const handleFilterPaymentMode = useCallback(
    (event) => {
      onFilters('paymentMode', event.target.value);
    },
    [onFilters]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          sm: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} >
          <TextField
            value={filters.search}
            onChange={handleFilterSearch}
            placeholder="Name or Mobile No."
            sx={{ width: { xs: 1, md: 200 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            sx={{ width: { md: 200 } }}
            value={filters.vehicleCount === -1 ? '' : filters.vehicleCount}
            onChange={(event) => {
              const { value } = event.target;
              onFilters('vehicleCount', value === '' ? -1 : Number(value));
            }}
            placeholder="No. of Vehicles"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="mdi:truck" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            label="State"
            value={filters.state}
            onChange={handleFilterState}
            sx={{ width: { xs: 1, md: 200 } }}
          >
            <MenuItem value="">None</MenuItem>
            {STATES.map((state) => (
              <MenuItem key={state.value} value={state.value}>
                {state.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Payment Mode"
            placeholder="Cash, UPI, NEFT, Cheque"
            value={filters.paymentMode}
            onChange={handleFilterPaymentMode}
            sx={{ width: { xs: 1, md: 200 } }}
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="solar:filter-bold" />}
            onClick={filtersDrawer.onTrue}
            sx={{ flexShrink: 0 }}
          >
            More Filters
          </Button>

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

      <TransporterFiltersDrawer
        open={filtersDrawer.value}
        onClose={filtersDrawer.onFalse}
        filters={filters}
        onFilters={onFilters}
        vehicleDialog={vehicleDialog}
        selectedVehicle={selectedVehicle}
      />

      <KanbanVehicleDialog
        open={vehicleDialog.value}
        onClose={vehicleDialog.onFalse}
        selectedVehicle={selectedVehicle}
        onVehicleChange={handleSelectVehicle}
      />
    </>
  );
}
