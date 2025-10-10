/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// @mui
// components

import { PDFDownloadLink } from '@react-pdf/renderer';

import { Tooltip, MenuList } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateRangeShortLabel } from 'src/utils/format-time';
import { exportToExcel, prepareDataForExport } from 'src/utils/export-to-excel';

import ExpenseListPdf from 'src/pdfs/expense-list-pdf';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ColumnSelectorList } from 'src/components/table';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { KanbanPumpDialog } from 'src/sections/kanban/components/kanban-pump-dialog';
import { KanbanTripDialog } from 'src/sections/kanban/components/kanban-trip-dialog';
import { KanbanRouteDialog } from 'src/sections/kanban/components/kanban-route-dialog';
import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';
import { KanbanSubtripDialog } from 'src/sections/kanban/components/kanban-subtrip-dialog';
import { KanbanTransporterDialog } from 'src/sections/kanban/components/kanban-transporter-dialog';

import { useTenantContext } from 'src/auth/tenant';

import { TABLE_COLUMNS } from '../expense-table-config';
import { SUBTRIP_STATUS } from '../../subtrip/constants';

// ----------------------------------------------------------------------

export default function ExpenseTableToolbar({
  filters,
  onFilters,
  tableData,
  subtripExpenseTypes,
  vehicleExpenseTypes,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
  onToggleAllColumns,
  columnOrder = [],
  onResetColumns,
  canResetColumns,
}) {
  const popover = usePopover();
  const columnsPopover = usePopover();
  const dateDialog = useBoolean();
  const tenant = useTenantContext();

  const vehicleDialog = useBoolean();
  const pumpDialog = useBoolean();
  const transporterDialog = useBoolean();
  const tripDialog = useBoolean();
  const subtripDialog = useBoolean();
  const routeDialog = useBoolean();
  const typePopover = usePopover();

  const handleSelectVehicle = useCallback(
    (vehicle) => {
      onFilters('vehicle', vehicle);
    },
    [onFilters]
  );

  const handleSelectPump = useCallback(
    (pump) => {
      onFilters('pump', pump);
    },
    [onFilters]
  );

  const handleSelectTransporter = useCallback(
    (transporter) => {
      onFilters('transporter', transporter);
    },
    [onFilters]
  );

  const handleSelectTrip = useCallback(
    (trip) => {
      onFilters('trip', trip);
    },
    [onFilters]
  );

  const handleSelectSubtrip = useCallback(
    (subtrip) => {
      onFilters('subtrip', subtrip);
    },
    [onFilters]
  );

  const handleSelectRoute = useCallback(
    (route) => {
      onFilters('route', route);
    },
    [onFilters]
  );

  const handleFilterFromDate = useCallback(
    (newValue) => {
      onFilters('fromDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onFilters('endDate', newValue);
    },
    [onFilters]
  );

  const handleToggleExpenseType = useCallback(
    (value) => {
      const current = Array.isArray(filters.expenseType) ? [...filters.expenseType] : [];
      const newValues = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      onFilters('expenseType', newValues);
    },
    [filters.expenseType, onFilters]
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
        <DialogSelectButton
          onClick={vehicleDialog.onTrue}
          selected={filters.vehicle?.vehicleNo}
          placeholder="Vehicle"
          iconName="mdi:truck"
          sx={{ maxWidth: { md: 200 } }}
        />

        <DialogSelectButton
          onClick={subtripDialog.onTrue}
          selected={filters.subtrip?.subtripNo}
          placeholder="Job"
          iconName="mdi:map-marker-path"
          sx={{ maxWidth: { md: 200 } }}
        />

        <DialogSelectButton
          onClick={pumpDialog.onTrue}
          selected={filters.pump?.name}
          placeholder="Pump"
          iconName="mdi:gas-station"
          sx={{ maxWidth: { md: 200 } }}
        />

        <DialogSelectButton
          onClick={transporterDialog.onTrue}
          selected={filters.transporter?.transportName}
          placeholder="Transporter"
          iconName="mdi:truck-delivery"
          sx={{ maxWidth: { md: 200 } }}
        />

        <DialogSelectButton
          onClick={tripDialog.onTrue}
          selected={filters.trip?.tripNo}
          placeholder="Trip"
          iconName="mdi:truck-fast"
          sx={{ maxWidth: { md: 200 } }}
        />

        <DialogSelectButton
          onClick={routeDialog.onTrue}
          selected={
            filters.route ? `${filters.route.fromPlace} → ${filters.route.toPlace}` : undefined
          }
          placeholder="Route"
          iconName="mdi:map-marker-path"
          sx={{ maxWidth: { md: 200 } }}
        />

        <DialogSelectButton
          sx={{ maxWidth: { md: 200 } }}
          placeholder="Date Range"
          selected={
            filters.fromDate && filters.endDate
              ? fDateRangeShortLabel(filters.fromDate, filters.endDate)
              : undefined
          }
          onClick={dateDialog.onTrue}
          iconName="mdi:calendar"
        />
        <CustomDateRangePicker
          variant="calendar"
          open={dateDialog.value}
          onClose={dateDialog.onFalse}
          startDate={filters.fromDate}
          endDate={filters.endDate}
          onChangeStartDate={handleFilterFromDate}
          onChangeEndDate={handleFilterEndDate}
        />

        <DialogSelectButton
          onClick={typePopover.onOpen}
          selected={
            filters.expenseType.length > 0 ? `${filters.expenseType.length} types` : undefined
          }
          placeholder="Expense Type"
          iconName="mdi:filter-variant"
          sx={{ maxWidth: { md: 200 } }}
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
        open={typePopover.open}
        onClose={typePopover.onClose}
        anchorEl={typePopover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <Scrollbar sx={{ width: 200, maxHeight: 400 }}>
          <MenuList>
            {[...subtripExpenseTypes, ...vehicleExpenseTypes].map((option) => (
              <MenuItem key={option.label} onClick={() => handleToggleExpenseType(option.label)}>
                <Checkbox checked={filters.expenseType.includes(option.label)} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </MenuList>
        </Scrollbar>
      </CustomPopover>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={popover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem>
            <PDFDownloadLink
              document={
                <ExpenseListPdf
                  expenses={tableData}
                  visibleColumns={Object.keys(visibleColumns).filter((c) => visibleColumns[c])}
                  tenant={tenant}
                />
              }
              fileName="Expense-list.pdf"
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
                'Expense-list'
              );

              popover.onClose();
            }}
          >
            <Iconify icon="eva:download-fill" />
            Excel
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <KanbanVehicleDialog
        open={vehicleDialog.value}
        onClose={vehicleDialog.onFalse}
        selectedVehicle={filters.vehicle}
        onVehicleChange={handleSelectVehicle}
      />

      <KanbanSubtripDialog
        open={subtripDialog.value}
        onClose={subtripDialog.onFalse}
        selectedSubtrip={filters.subtrip}
        onSubtripChange={handleSelectSubtrip}
        statusList={[
          SUBTRIP_STATUS.IN_QUEUE,
          SUBTRIP_STATUS.LOADED,
          SUBTRIP_STATUS.RECEIVED,
          SUBTRIP_STATUS.ERROR,
          SUBTRIP_STATUS.BILLED,
        ]}
      />

      <KanbanPumpDialog
        open={pumpDialog.value}
        onClose={pumpDialog.onFalse}
        selectedPump={filters.pump}
        onPumpChange={handleSelectPump}
      />

      <KanbanTransporterDialog
        open={transporterDialog.value}
        onClose={transporterDialog.onFalse}
        selectedTransporter={filters.transporter}
        onTransporterChange={handleSelectTransporter}
      />

      <KanbanRouteDialog
        open={routeDialog.value}
        onClose={routeDialog.onFalse}
        selectedRoute={filters.route}
        onRouteChange={handleSelectRoute}
        mode="all"
      />

      <KanbanTripDialog
        open={tripDialog.value}
        onClose={tripDialog.onFalse}
        selectedTrip={filters.trip}
        onTripChange={handleSelectTrip}
        status={['open', 'closed']}
      />
    </>
  );
}
