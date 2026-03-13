/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
// @mui
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify/';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';

import { TABLE_COLUMNS } from './transporter-table-config';
import { ColumnSelectorList } from '../../components/table';
import { usePopover } from '../../components/custom-popover';
import TransporterFiltersDrawer from './transporter-filters-drawer';
import { Box } from '@mui/material';

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
            sx={{ width: { xs: 1, md: 170 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ width: { xs: 1, md: 170 } }}>
            <DialogSelectButton
              onClick={vehicleDialog.onTrue}
              selected={selectedVehicle?.vehicleNo}
              placeholder="Vehicle"
              iconName="mdi:truck"
            />
          </Box>

          <TextField
            value={filters.gstNo}
            onChange={(e) => onFilters('gstNo', e.target.value)}
            placeholder="GST Number"
            sx={{ width: { xs: 1, md: 170 } }}
          />

          <TextField
            value={filters.panNo}
            onChange={(e) => onFilters('panNo', e.target.value)}
            placeholder="PAN Number"
            sx={{ width: { xs: 1, md: 170 } }}
          />

          <FormControl sx={{ width: { xs: 1, md: 170 } }}>
            <InputLabel id="toolbar-gst-status-label">GST Status</InputLabel>
            <Select
              value={filters.gstEnabled}
              onChange={(e) => onFilters('gstEnabled', e.target.value)}
              input={<OutlinedInput label="GST Status" />}
              labelId="toolbar-gst-status-label"
              MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
            >
              <MenuItem value="all">All</MenuItem>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="solar:filter-bold" />}
            onClick={filtersDrawer.onTrue}
            sx={{ flexShrink: 0, width: 140 }}
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
            sx={{ flexShrink: 0, width: 140 }}
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
