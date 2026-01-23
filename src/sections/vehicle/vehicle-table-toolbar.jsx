/* eslint-disable react/prop-types */
import { useCallback } from 'react';

// @mui
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import Badge from '@mui/material/Badge';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ColumnSelectorList } from 'src/components/table';
import { usePopover } from 'src/components/custom-popover';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { KanbanTransporterDialog } from 'src/sections/kanban/components/kanban-transporter-dialog';

import { vehicleTypes } from './vehicle-config';
import { TABLE_COLUMNS } from './vehicle-table-config';

// ----------------------------------------------------------------------

export default function VehicleTableToolbar({
  filters,
  onFilters,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
  onToggleAllColumns,
  selectedTransporter,
  onSelectTransporter,
  onResetColumns,
  canResetColumns,
}) {
  const columnsPopover = usePopover();
  const transporterDialog = useBoolean();

  const handleSelectTransporter = useCallback(
    (transporter) => {
      if (onSelectTransporter) {
        onSelectTransporter(transporter);
      }
      onFilters('transporter', transporter._id);
    },
    [onFilters, onSelectTransporter]
  );

  const handleFilterVehicleNo = useCallback(
    (event) => {
      onFilters('vehicleNo', event.target.value);
    },
    [onFilters]
  );

  const handleFilterVehicleType = useCallback(
    (event) => {
      onFilters('vehicleType', event.target.value);
    },
    [onFilters]
  );

  const handleFilterNoOfTyres = useCallback(
    (event) => {
      onFilters('noOfTyres', event.target.value);
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
          value={filters.vehicleNo}
          onChange={handleFilterVehicleNo}
          placeholder="Search Vehicle No..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 300 } }}>
          <InputLabel id="vehicle-type-select-label">Vehicle Type</InputLabel>
          <Select
            value={filters.vehicleType || ''}
            onChange={handleFilterVehicleType}
            input={<OutlinedInput label="Vehicle Type" />}
            labelId="vehicle-type-select-label"
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
          >
            <MenuItem value="">All</MenuItem>
            <Divider sx={{ borderStyle: 'dashed' }} />
            {vehicleTypes.map((option) => (
              <MenuItem key={option.key} value={option.key}>
                {option.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          type="number"
          value={filters.noOfTyres}
          onChange={handleFilterNoOfTyres}
          placeholder="Search No Of Tyres..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: { xs: 1, md: 300 } }}
        />

        <DialogSelectButton
          onClick={transporterDialog.onTrue}
          placeholder="Search transporter"
          selected={selectedTransporter?.transportName}
          iconName="mdi:truck"
        />

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
    </>
  );
}
