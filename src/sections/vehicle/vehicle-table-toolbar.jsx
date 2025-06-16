/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
// @mui
import InputAdornment from '@mui/material/InputAdornment';
import { Tooltip, MenuList, ListItemText } from '@mui/material';
// components

import { PDFDownloadLink } from '@react-pdf/renderer';

import { exportToExcel } from 'src/utils/export-to-excel';

import VehicleListPdf from 'src/pdfs/vehicle-list-pdf';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { vehicleTypes } from './vehicle-config';

// ----------------------------------------------------------------------

export default function VehicleTableToolbar({
  filters,
  onFilters,
  tableData,
  visibleColumns,
  disabledColumns = {},
  onToggleColumn,
}) {
  const popover = usePopover();
  const columnsPopover = usePopover();

  const handleFilterVehicleNo = useCallback(
    (event) => {
      onFilters('vehicleNo', event.target.value);
    },
    [onFilters]
  );

  const handleFilterVehicleTypes = useCallback(
    (event) => {
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
      onFilters('vehicleTypes', newValue);
    },
    [onFilters]
  );

  const handleFilterTransporter = useCallback(
    (event) => {
      onFilters('transporter', event.target.value);
    },
    [onFilters]
  );

  const handleFilterIsOwn = useCallback(
    (event) => {
      onFilters('isOwn', event.target.value);
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

        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 250 } }}>
          <InputLabel id="vehicle-type-select-label">Vehicle Types</InputLabel>
          <Select
            multiple
            value={filters.vehicleTypes || []}
            onChange={handleFilterVehicleTypes}
            input={<OutlinedInput label="Vehicle Types" />}
            renderValue={(selected) =>
              selected
                .map((value) => {
                  const type = vehicleTypes.find((t) => t.key === value);
                  return type ? type.value : value;
                })
                .join(', ')
            }
            labelId="vehicle-type-select-label"
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
          >
            {vehicleTypes.map((option) => (
              <MenuItem key={option.key} value={option.key}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.vehicleTypes ? filters.vehicleTypes.includes(option.key) : false}
                />
                {option.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 250 } }}>
          <InputLabel id="is-own-select-label">Vehicle Ownership</InputLabel>
          <Select
            value={filters.isOwn || 'all'}
            onChange={handleFilterIsOwn}
            input={<OutlinedInput label="Vehicle Ownership" />}
            labelId="is-own-select-label"
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
          >
            <MenuItem value="all">All Vehicles</MenuItem>
            <MenuItem value="market">Market Vehicles</MenuItem>
            <MenuItem value="old">Own Vehicles</MenuItem>
          </Select>
        </FormControl>

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
        slotProps={{ arrow: { placement: 'right-top' } }}
        anchorEl={popover.anchorEl}
      >
        <MenuList>
          <MenuItem onClick={popover.onClose}>
            <PDFDownloadLink
              document={<VehicleListPdf vehicles={tableData} />}
              fileName="Vehicle-list.pdf"
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
              exportToExcel(tableData, 'Vehicles-list');
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
