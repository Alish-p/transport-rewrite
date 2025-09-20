/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
// components
import { PDFDownloadLink } from '@react-pdf/renderer';

import { Tooltip, MenuList } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useBoolean } from 'src/hooks/use-boolean';

import { exportToExcel, prepareDataForExport } from 'src/utils/export-to-excel';

import TripListPdf from 'src/pdfs/trip-list-pdf';

import { Iconify } from 'src/components/iconify';
import { ColumnSelectorList } from 'src/components/table';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { useTenantContext } from 'src/auth/tenant';

import { TABLE_COLUMNS } from './trip-table-config';
import { fDateRangeShortLabel } from '../../utils/format-time';
import { KanbanDriverDialog } from '../kanban/components/kanban-driver-dialog';
import { KanbanVehicleDialog } from '../kanban/components/kanban-vehicle-dialog';
import { KanbanSubtripDialog } from '../kanban/components/kanban-subtrip-dialog';

// ----------------------------------------------------------------------

export default function TripTableToolbar({
  filters,
  onFilters,
  tableData,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
  onToggleAllColumns,
  columnOrder = [],
  selectedVehicle,
  onSelectVehicle,
  selectedDriver,
  onSelectDriver,
  selectedSubtrip,
  onSelectSubtrip,
  onResetColumns,
  canResetColumns,
}) {
  const popover = usePopover();
  const columnsPopover = usePopover();
  const tenant = useTenantContext();
  const vehicleDialog = useBoolean();
  const driverDialog = useBoolean();
  const subtripDialog = useBoolean();
  const dateDialog = useBoolean();

  const handleFilterTripNo = useCallback(
    (event) => {
      onFilters('tripNo', event.target.value);
    },
    [onFilters]
  );

  const handleSelectDriver = useCallback(
    (driver) => {
      if (onSelectDriver) onSelectDriver(driver);
      onFilters('driverId', driver ? driver._id : '');
    },
    [onFilters, onSelectDriver]
  );

  const handleSelectVehicle = useCallback(
    (vehicle) => {
      if (onSelectVehicle) onSelectVehicle(vehicle);
      onFilters('vehicleId', vehicle ? vehicle._id : '');
    },
    [onFilters, onSelectVehicle]
  );

  const handleSelectSubtrip = useCallback(
    (subtrip) => {
      if (onSelectSubtrip) onSelectSubtrip(subtrip);
      onFilters('subtripId', subtrip ? subtrip._id : '');
    },
    [onFilters, onSelectSubtrip]
  );

  const handleFilterFromDate = useCallback(
    (newValue) => {
      onFilters('fromDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onFilters('toDate', newValue);
    },
    [onFilters]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <TextField
          fullWidth
          value={filters.tripNo}
          onChange={handleFilterTripNo}
          placeholder="Search Trip-NO..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <DialogSelectButton
          onClick={driverDialog.onTrue}
          placeholder="Driver"
          selected={selectedDriver?.driverName}
          iconName="mdi:account"
          sx={{ maxWidth: { md: 200 } }}
        />

        <DialogSelectButton
          onClick={vehicleDialog.onTrue}
          placeholder="Vehicle"
          selected={selectedVehicle?.vehicleNo}
          iconName="mdi:truck"
          sx={{ maxWidth: { md: 200 } }}
        />

        <DialogSelectButton
          onClick={subtripDialog.onTrue}
          placeholder="Subtrip"
          selected={selectedSubtrip?._id}
          iconName="mdi:bookmark"
          sx={{ maxWidth: { md: 200 } }}
        />

        <DialogSelectButton
          onClick={dateDialog.onTrue}
          placeholder="Date Range"
          selected={
            filters.fromDate && filters.toDate
              ? fDateRangeShortLabel(filters.fromDate, filters.toDate)
              : undefined
          }
          iconName="mdi:calendar"
          sx={{ maxWidth: { md: 200 } }}
        />

        <FormControlLabel
          label="Own"
          labelPlacement="top"
          control={<Switch checked={!!filters.isOwn} onChange={(e) => onFilters('isOwn', e.target.checked)} />}
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

          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
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

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={popover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem onClick={popover.onClose}>
            <PDFDownloadLink
              document={
                <TripListPdf
                  trips={tableData}
                  visibleColumns={Object.keys(visibleColumns).filter((c) => visibleColumns[c])}
                  tenant={tenant}
                />
              }
              fileName="Trip-list.pdf"
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
              const visibleCols = Object.keys(visibleColumns).filter((c) => visibleColumns[c]);
              exportToExcel(
                prepareDataForExport(tableData, TABLE_COLUMNS, visibleCols, columnOrder),
                'Trips-list'
              );
              popover.onClose();
            }}
          >
            <Iconify icon="eva:download-fill" />
            Excel
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <KanbanDriverDialog
        open={driverDialog.value}
        onClose={driverDialog.onFalse}
        selectedDriver={selectedDriver}
        onDriverChange={handleSelectDriver}
      />

      <KanbanVehicleDialog
        open={vehicleDialog.value}
        onClose={vehicleDialog.onFalse}
        selectedVehicle={selectedVehicle}
        onVehicleChange={handleSelectVehicle}
      />

      <KanbanSubtripDialog
        open={subtripDialog.value}
        onClose={subtripDialog.onFalse}
        selectedSubtrip={selectedSubtrip}
        onSubtripChange={handleSelectSubtrip}
        statusList={['in-queue', 'loaded', 'received', 'error', 'billed']}
      />

      <CustomDateRangePicker
        variant="calendar"
        open={dateDialog.value}
        onClose={dateDialog.onFalse}
        startDate={filters.fromDate}
        endDate={filters.toDate}
        onChangeStartDate={handleFilterFromDate}
        onChangeEndDate={handleFilterEndDate}
      />
    </>
  );
}
