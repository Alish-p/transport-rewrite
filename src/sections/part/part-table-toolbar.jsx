/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { useOptions } from 'src/query/use-options';

import { Iconify } from 'src/components/iconify';
import { ColumnSelectorList } from 'src/components/table';
import { usePopover } from 'src/components/custom-popover';

import { TABLE_COLUMNS } from './part-table-config';
import { PART_CATEGORY_GROUP, PART_MANUFACTURER_GROUP } from '../settings/settings-constants';

export default function PartTableToolbar({
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

  const { data: categoryOptions = [] } = useOptions(PART_CATEGORY_GROUP);
  const { data: manufacturerOptions = [] } = useOptions(PART_MANUFACTURER_GROUP);

  const handleFilterSearch = useCallback(
    (event) => {
      onFilters('search', event.target.value);
    },
    [onFilters]
  );

  const handleFilterCategory = useCallback(
    (event) => {
      onFilters('category', event.target.value);
    },
    [onFilters]
  );

  const handleFilterManufacturer = useCallback(
    (event) => {
      onFilters('manufacturer', event.target.value);
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
          value={filters.search}
          onChange={handleFilterSearch}
          placeholder="Search by name, number..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ width: { xs: 1, md: 200 } }}>
          <InputLabel id="part-category-select-label">Category</InputLabel>
          <Select
            labelId="part-category-select-label"
            value={filters.category === 'all' ? '' : filters.category}
            onChange={handleFilterCategory}
            input={<OutlinedInput label="Category" />}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
          >
            <MenuItem value="">All</MenuItem>
            <Divider sx={{ borderStyle: 'dashed' }} />
            {categoryOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: { xs: 1, md: 200 } }}>
          <InputLabel id="part-manufacturer-select-label">Manufacturer</InputLabel>
          <Select
            labelId="part-manufacturer-select-label"
            value={filters.manufacturer === 'all' ? '' : filters.manufacturer}
            onChange={handleFilterManufacturer}
            input={<OutlinedInput label="Manufacturer" />}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
          >
            <MenuItem value="">All</MenuItem>
            <Divider sx={{ borderStyle: 'dashed' }} />
            {manufacturerOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
    </>
  );
}

