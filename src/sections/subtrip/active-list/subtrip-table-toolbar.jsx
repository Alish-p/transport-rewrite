/* eslint-disable react/prop-types */
import { useCallback } from 'react';

// @mui
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ColumnSelectorList } from 'src/components/table';
import { usePopover } from 'src/components/custom-popover';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { KanbanDriverDialog } from 'src/sections/kanban/components/kanban-driver-dialog';
import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';
import { KanbanCustomerDialog } from 'src/sections/kanban/components/kanban-customer-dialog';
import { KanbanTransporterDialog } from 'src/sections/kanban/components/kanban-transporter-dialog';

import { TABLE_COLUMNS } from '../config/table-columns';
import SubtripFiltersDrawer from './subtrip-filters-drawer';

// ----------------------------------------------------------------------

export default function SubtripTableToolbar({
  filters,
  onFilters,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
  onToggleAllColumns,
  selectedTransporter,
  onSelectTransporter,
  selectedCustomer,
  onSelectCustomer,
  selectedVehicle,
  onSelectVehicle,
  selectedDriver,
  onSelectDriver,
  onResetColumns,
  canResetColumns,
}) {
  const columnsPopover = usePopover();
  const filtersDrawer = useBoolean();

  const transporterDialog = useBoolean();
  const customerDialog = useBoolean();
  const vehicleDialog = useBoolean();
  const driverDialog = useBoolean();

  const handleSelectTransporter = useCallback(
    (transporter) => {
      onFilters('transportName', transporter._id);
      if (onSelectTransporter) {
        onSelectTransporter(transporter);
      }
    },
    [onFilters, onSelectTransporter]
  );

  const handleSelectCustomer = useCallback(
    (customer) => {
      onFilters('customerId', customer._id);
      if (onSelectCustomer) {
        onSelectCustomer(customer);
      }
    },
    [onFilters, onSelectCustomer]
  );

  const handleSelectVehicle = useCallback(
    (vehicle) => {
      onFilters('vehicleNo', vehicle._id);
      if (onSelectVehicle) {
        onSelectVehicle(vehicle);
      }
    },
    [onFilters, onSelectVehicle]
  );

  const handleSelectDriver = useCallback(
    (driver) => {
      onFilters('driverId', driver._id);
      if (onSelectDriver) {
        onSelectDriver(driver);
      }
    },
    [onFilters, onSelectDriver]
  );

  const handleFilterSubtripId = useCallback(
    (event) => {
      onFilters('subtripNo', event.target.value);
    },
    [onFilters]
  );

  const handleFilterReferenceSubtripNo = useCallback(
    (event) => {
      onFilters('referenceSubtripNo', event.target.value);
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
          value={filters.subtripNo}
          onChange={handleFilterSubtripId}
          placeholder="Job ID"
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
          value={filters.referenceSubtripNo}
          onChange={handleFilterReferenceSubtripNo}
          placeholder="Reference Job No"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <DialogSelectButton
          onClick={transporterDialog.onTrue}
          selected={selectedTransporter?.transportName}
          placeholder="Transporter"
          iconName="mdi:truck-delivery"
        />

        <DialogSelectButton
          onClick={customerDialog.onTrue}
          selected={selectedCustomer?.customerName}
          placeholder="Customer"
          iconName="mdi:office-building"
        />

        <Button
          color="inherit"
          startIcon={<Iconify icon="mdi:filter-variant" />}
          onClick={filtersDrawer.onTrue}
          sx={{ flexShrink: 0, height: 56 }}
        >
          More Filters
        </Button>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Column Settings">
            <Button
              onClick={columnsPopover.onOpen}
              startIcon={
                <Badge
                  color="error"
                  variant="dot"
                  invisible={!canResetColumns}
                  sx={{
                    '& .MuiBadge-badge': {
                      top: 2,
                      right: 2,
                    },
                  }}
                >
                  <Iconify icon="mdi:table-column-plus-after" />
                </Badge>
              }
            >
              Columns
            </Button>
          </Tooltip>
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

      <SubtripFiltersDrawer
        open={filtersDrawer.value}
        onClose={filtersDrawer.onFalse}
        filters={filters}
        onFilters={onFilters}
        transporterDialog={transporterDialog}
        customerDialog={customerDialog}
        vehicleDialog={vehicleDialog}
        driverDialog={driverDialog}
        selectedTransporter={selectedTransporter}
        selectedCustomer={selectedCustomer}
        selectedVehicle={selectedVehicle}
        selectedDriver={selectedDriver}
      />

      <KanbanTransporterDialog
        open={transporterDialog.value}
        onClose={transporterDialog.onFalse}
        selectedTransporter={selectedTransporter}
        onTransporterChange={handleSelectTransporter}
      />

      <KanbanCustomerDialog
        open={customerDialog.value}
        onClose={customerDialog.onFalse}
        selectedCustomer={selectedCustomer}
        onCustomerChange={handleSelectCustomer}
      />

      <KanbanVehicleDialog
        open={vehicleDialog.value}
        onClose={vehicleDialog.onFalse}
        selectedVehicle={selectedVehicle}
        onVehicleChange={handleSelectVehicle}
      />

      <KanbanDriverDialog
        open={driverDialog.value}
        onClose={driverDialog.onFalse}
        selectedDriver={selectedDriver}
        onDriverChange={handleSelectDriver}
      />
    </>
  );
}
