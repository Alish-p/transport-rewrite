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

import { PDFDownloadLink } from '@react-pdf/renderer';

import { Tooltip, MenuList, Checkbox, ListItemText } from '@mui/material';

import { exportToExcel } from 'src/utils/export-to-excel';
import { fDateRangeShortLabel } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';
import SubtripListPdf from 'src/pdfs/subtrip-list-pdf';

import { Iconify } from 'src/components/iconify';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { KanbanDriverDialog } from 'src/sections/kanban/components/kanban-driver-dialog';
import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';
import { KanbanCustomerDialog } from 'src/sections/kanban/components/kanban-customer-dialog';
import { KanbanTransporterDialog } from 'src/sections/kanban/components/kanban-transporter-dialog';

// ----------------------------------------------------------------------

export default function SubtripTableToolbar({
  filters,
  onFilters,
  tableData,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
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
    },
    [onFilters]
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
          selected={filters.transportName ? 'Selected' : undefined}
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
          placeholder="Start Date"
          iconName="mdi:calendar"
        />

        <DialogSelectButton
          onClick={endRange.onTrue}
          selected={
            filters.subtripEndFromDate && filters.subtripEndToDate
              ? fDateRangeShortLabel(filters.subtripEndFromDate, filters.subtripEndToDate)
              : undefined
          }
          placeholder="End Date"
          iconName="mdi:calendar"
        />

        <DialogSelectButton
          onClick={materialPopover.onOpen}
          selected={
            filters.materials.length > 0
              ? `${filters.materials.length} materials`
              : undefined
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
          <MenuItem onClick={popover.onClose}>
            <PDFDownloadLink
              document={<SubtripListPdf subtrips={tableData} />}
              fileName="Subtrip-list.pdf"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {({ loading }) => (
                <>
                  <Iconify
                    icon={loading ? 'line-md:loading-loop' : 'eva:download-fill'}
                    sx={{ mr: 2 }}
                  />
                  PDF
                </>
              )}
            </PDFDownloadLink>
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
              popover.onClose();
              exportToExcel(tableData, 'Expense-list');
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
        <MenuList sx={{ width: 200 }}>
          {CONFIG.materialOptions.map(({ value }) => (
            <MenuItem key={value} onClick={() => handleToggleMaterial(value)}>
              <Checkbox checked={filters.materials.includes(value)} />
              <ListItemText primary={value} />
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>

      <CustomDateRangePicker
        variant='calendar'
        open={startRange.value}
        onClose={startRange.onFalse}
        startDate={filters.fromDate}
        endDate={filters.toDate}
        onChangeStartDate={(date) => onFilters('fromDate', date)}
        onChangeEndDate={(date) => onFilters('toDate', date)}
      />

      <CustomDateRangePicker
        variant='calendar'
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
        selectedTransporter={null}
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
