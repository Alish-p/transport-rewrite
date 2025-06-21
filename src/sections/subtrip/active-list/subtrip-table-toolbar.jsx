/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';
// @mui
// components
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';
// components

import { Tooltip, MenuList, Checkbox, ListItemText } from '@mui/material';

import { exportToExcel } from 'src/utils/export-to-excel';
import { fDateRangeShortLabel } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';
import { PDFDownloadButton } from 'src/pdfs/common';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ColumnSelectorList } from 'src/components/table';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { KanbanDriverDialog } from 'src/sections/kanban/components/kanban-driver-dialog';
import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';
import { KanbanCustomerDialog } from 'src/sections/kanban/components/kanban-customer-dialog';
import { KanbanTransporterDialog } from 'src/sections/kanban/components/kanban-transporter-dialog';

import { transformSubtripsForExcel } from '../utils';
import { TABLE_COLUMNS } from '../config/table-columns';

// ----------------------------------------------------------------------

export default function SubtripTableToolbar({
  filters,
  onFilters,
  tableData,
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
}) {
  const popover = usePopover();
  const columnsPopover = usePopover();
  const materialPopover = usePopover();

  const startRange = useBoolean();
  const endRange = useBoolean();

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

  const handleToggleMaterial = useCallback(
    (value) => {
      const current = Array.isArray(filters.materials) ? [...filters.materials] : [];
      const newValues = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      onFilters('materials', newValues);
    },
    [filters.materials, onFilters]
  );

  const handleFilterSubtripId = useCallback(
    (event) => {
      onFilters('subtripId', event.target.value);
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
          value={filters.subtripId}
          onChange={handleFilterSubtripId}
          placeholder="Search Id ..."
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

        <DialogSelectButton
          onClick={vehicleDialog.onTrue}
          selected={selectedVehicle?.vehicleNo}
          placeholder="Vehicle"
          iconName="mdi:truck"
        />

        <DialogSelectButton
          onClick={driverDialog.onTrue}
          selected={selectedDriver?.driverName}
          placeholder="Driver"
          iconName="mdi:account"
        />

        <DialogSelectButton
          onClick={startRange.onTrue}
          selected={
            filters.fromDate && filters.toDate
              ? fDateRangeShortLabel(filters.fromDate, filters.toDate)
              : undefined
          }
          placeholder="Dispatch Date Range"
          iconName="mdi:calendar"
        />

        <DialogSelectButton
          onClick={endRange.onTrue}
          selected={
            filters.subtripEndFromDate && filters.subtripEndToDate
              ? fDateRangeShortLabel(filters.subtripEndFromDate, filters.subtripEndToDate)
              : undefined
          }
          placeholder="Receive Date Range"
          iconName="mdi:calendar"
        />

        <DialogSelectButton
          onClick={materialPopover.onOpen}
          selected={
            filters.materials.length > 0 ? `${filters.materials.length} materials` : undefined
          }
          placeholder="Materials"
          iconName="mdi:filter-variant"
        />

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

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={popover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem disableGutters onClick={popover.onClose}>
            <PDFDownloadButton
              fileName="Subtrip-list.pdf"
              getDocument={async () => {
                const { default: SubtripListPdf } = await import('src/pdfs/subtrip-list-pdf');
                const visibleCols = Object.keys(visibleColumns).filter((c) => visibleColumns[c]);
                return () => <SubtripListPdf subtrips={tableData} visibleColumns={visibleCols} />;
              }}
            />
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:import-bold" />
            Import
          </MenuItem>

          <MenuItem
            onClick={() => {
              const visibleCols = Object.keys(visibleColumns).filter((c) => visibleColumns[c]);
              exportToExcel(
                transformSubtripsForExcel(tableData, visibleCols),
                'subtrip-list'
              );
              popover.onClose();
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <CustomPopover
        open={materialPopover.open}
        onClose={materialPopover.onClose}
        anchorEl={materialPopover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <Scrollbar sx={{ width: 200, maxHeight: 400 }}>
          <MenuList>
            {CONFIG.materialOptions.map(({ value }) => (
              <MenuItem key={value} onClick={() => handleToggleMaterial(value)}>
                <Checkbox checked={filters.materials.includes(value)} />
                <ListItemText primary={value} />
              </MenuItem>
            ))}
          </MenuList>
        </Scrollbar>
      </CustomPopover>

      <CustomDateRangePicker
        variant="calendar"
        open={startRange.value}
        onClose={startRange.onFalse}
        startDate={filters.fromDate}
        endDate={filters.toDate}
        onChangeStartDate={(date) => onFilters('fromDate', date)}
        onChangeEndDate={(date) => onFilters('toDate', date)}
      />

      <CustomDateRangePicker
        variant="calendar"
        open={endRange.value}
        onClose={endRange.onFalse}
        startDate={filters.subtripEndFromDate}
        endDate={filters.subtripEndToDate}
        onChangeStartDate={(date) => onFilters('subtripEndFromDate', date)}
        onChangeEndDate={(date) => onFilters('subtripEndToDate', date)}
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
