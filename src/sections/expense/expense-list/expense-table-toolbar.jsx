/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
// @mui
// components

import { PDFDownloadLink } from '@react-pdf/renderer';

import { Tooltip, MenuList, Checkbox, ListItemText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { exportToExcel } from 'src/utils/export-to-excel';
import { fDateRangeShortLabel } from 'src/utils/format-time';

import ExpenseListPdf from 'src/pdfs/expense-list-pdf';

import { Iconify } from 'src/components/iconify';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { TABLE_COLUMNS } from '../config/table-columns';

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
}) {
  const popover = usePopover();
  const columnsPopover = usePopover();
  const dateDialog = useBoolean();
  const dateRangeSelected = !!filters.fromDate && !!filters.endDate;

  const handleFilterPumpName = useCallback(
    (event) => {
      onFilters('pump', event.target.value);
    },
    [onFilters]
  );

  const handleFilterVehicle = useCallback(
    (event) => {
      onFilters('vehicleNo', event.target.value);
    },
    [onFilters]
  );

  const handleFilterTransporter = useCallback(
    (event) => {
      onFilters('transporter', event.target.value);
    },
    [onFilters]
  );

  const handleFilterTripId = useCallback(
    (event) => {
      onFilters('tripId', event.target.value);
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
          onChange={handleFilterVehicle}
          placeholder="Search vehicle..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: { md: 250 },
          }}
        />

        <TextField
          fullWidth
          value={filters.pump}
          onChange={handleFilterPumpName}
          placeholder="Search Pump ..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: { md: 250 },
          }}
        />

        <TextField
          fullWidth
          value={filters.transporter}
          onChange={handleFilterTransporter}
          placeholder="Search Transporter"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: { md: 250 },
          }}
        />

        <TextField
          fullWidth
          value={filters.tripId}
          onChange={handleFilterTripId}
          placeholder="Search Trip ID"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: { md: 250 },
          }}
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

        <TextField
          select
          label="Expense Type"
          value={filters.expenseType}
          onChange={(event) => onFilters('expenseType', event.target.value)}
          sx={{
            width: { md: 200 },
          }}
        >
          <MenuItem value="">None</MenuItem>

          {[...subtripExpenseTypes, ...vehicleExpenseTypes].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

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
          {TABLE_COLUMNS.map((column) => (
            <MenuItem
              key={column.id}
              onClick={() => !disabledColumns[column.id] && onToggleColumn(column.id)}
              disabled={disabledColumns[column.id]}
              sx={disabledColumns[column.id] ? { opacity: 0.7 } : {}}
            >
              <Checkbox checked={visibleColumns[column.id]} disabled={disabledColumns[column.id]} />
              <ListItemText
                primary={column.label}
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
          <MenuItem>
            <PDFDownloadLink
              document={
                <ExpenseListPdf
                  expenses={tableData}
                  visibleColumns={Object.keys(visibleColumns).filter((c) => visibleColumns[c])}
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
    </>
  );
}
