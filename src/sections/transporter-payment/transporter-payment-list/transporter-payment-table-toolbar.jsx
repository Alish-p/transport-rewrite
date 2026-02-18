/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';
import { useSubtrip } from 'src/query/use-subtrip';
import { useVehicle } from 'src/query/use-vehicle';
import { useTransporter } from 'src/query/use-transporter';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { ColumnSelectorList } from 'src/components/table';
import { usePopover } from 'src/components/custom-popover';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { SUBTRIP_STATUS } from 'src/sections/subtrip/constants';
import { KanbanSubtripDialog } from 'src/sections/kanban/components/kanban-subtrip-dialog';
import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';
import { KanbanTransporterDialog } from 'src/sections/kanban/components/kanban-transporter-dialog';

import { TABLE_COLUMNS } from '../transporter-payment-table-config';

// ----------------------------------------------------------------------

const icon = (name, sx) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} sx={sx} />
);

export default function TransporterPaymentTableToolbar({
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
  const transporterDialog = useBoolean();
  const subtripDialog = useBoolean();
  const vehicleDialog = useBoolean();
  const dateDialog = useBoolean();
  const { data: selectedTransporter } = useTransporter(filters.transporterId);
  const { data: selectedSubtrip } = useSubtrip(filters.subtripId);
  const { data: selectedVehicle } = useVehicle(filters.vehicleId);

  const handleSelectTransporter = useCallback(
    (transporter) => {
      onFilters('transporterId', transporter._id);
    },
    [onFilters]
  );

  const handleSelectSubtrip = useCallback(
    (subtrip) => {
      onFilters('subtripId', subtrip._id);
    },
    [onFilters]
  );

  const handleSelectVehicle = useCallback(
    (vehicle) => {
      onFilters('vehicleId', vehicle._id);
    },
    [onFilters]
  );

  const handleChangeStartDate = useCallback(
    (date) => {
      onFilters('issueFromDate', date);
    },
    [onFilters]
  );

  const handleChangeEndDate = useCallback(
    (date) => {
      onFilters('issueToDate', date);
    },
    [onFilters]
  );

  const handlePaymentId = useCallback(
    (event) => {
      onFilters('paymentId', event.target.value);
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
        <DialogSelectButton
          onClick={transporterDialog.onTrue}
          placeholder="Search transporter"
          selected={selectedTransporter?.transportName}
          startIcon={icon('ic_transporter', {
            color: selectedTransporter ? 'primary.main' : 'text.disabled',
          })}
        />

        <DialogSelectButton
          onClick={subtripDialog.onTrue}
          placeholder="Search job"
          selected={selectedSubtrip?.subtripNo}
          iconName="mdi:bookmark"
        />

        <DialogSelectButton
          onClick={vehicleDialog.onTrue}
          placeholder="Search vehicle"
          selected={selectedVehicle?.vehicleNo}
          startIcon={icon('ic_vehicle', {
            color: selectedVehicle ? 'primary.main' : 'text.disabled',
          })}
        />

        <TextField
          fullWidth
          value={filters.paymentId}
          onChange={handlePaymentId}
          placeholder="Payment ID"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <DialogSelectButton
          onClick={dateDialog.onTrue}
          placeholder="Issue date range"
          selected={
            filters.issueFromDate && filters.issueToDate
              ? `${fDateRangeShortLabel(filters.issueFromDate, filters.issueToDate)}`
              : undefined
          }
          iconName="mdi:calendar"
        />

        <FormControlLabel
          label="TDS"
          labelPlacement="top"
          control={
            <Switch
              checked={filters.hasTds}
              onChange={(e) => onFilters('hasTds', e.target.checked)}
            />
          }
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

      <KanbanTransporterDialog
        open={transporterDialog.value}
        onClose={transporterDialog.onFalse}
        selectedTransporter={selectedTransporter}
        onTransporterChange={handleSelectTransporter}
      />

      <KanbanSubtripDialog
        open={subtripDialog.value}
        onClose={subtripDialog.onFalse}
        selectedSubtrip={selectedSubtrip}
        onSubtripChange={handleSelectSubtrip}
        statusList={[SUBTRIP_STATUS.RECEIVED, SUBTRIP_STATUS.BILLED]}
      />

      <KanbanVehicleDialog
        open={vehicleDialog.value}
        onClose={vehicleDialog.onFalse}
        selectedVehicle={selectedVehicle}
        onVehicleChange={handleSelectVehicle}
        onlyMarket
      />

      <CustomDateRangePicker
        variant="calendar"
        open={dateDialog.value}
        onClose={dateDialog.onFalse}
        startDate={filters.issueFromDate}
        endDate={filters.issueToDate}
        onChangeStartDate={handleChangeStartDate}
        onChangeEndDate={handleChangeEndDate}
      />
    </>
  );
}
