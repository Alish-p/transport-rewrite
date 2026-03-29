/* eslint-disable react/prop-types */
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { ColumnSelectorList } from 'src/components/table';
import { usePopover } from 'src/components/custom-popover';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { TABLE_COLUMNS } from '../loans-table-config';

// ----------------------------------------------------------------------

export default function LoansTableToolbar({
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
  const dateDialog = useBoolean();

  const handleFilterLoanNo = useCallback(
    (event) => {
      onFilters('loanNo', event.target.value);
    },
    [onFilters]
  );

  const handleFilterBorrower = useCallback(
    (event) => {
      onFilters('borrower', event.target.value);
    },
    [onFilters]
  );

  const handleChangeStartDate = useCallback(
    (date) => {
      onFilters('fromDate', date);
    },
    [onFilters]
  );

  const handleChangeEndDate = useCallback(
    (date) => {
      onFilters('endDate', date);
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
          value={filters.loanNo}
          onChange={handleFilterLoanNo}
          placeholder="Search Loan No..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          value={filters.borrower}
          onChange={handleFilterBorrower}
          placeholder="Search Borrower..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="mdi:account-search" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <DialogSelectButton
          onClick={dateDialog.onTrue}
          placeholder="Date range"
          selected={
            filters.fromDate && filters.endDate
              ? `${fDateRangeShortLabel(filters.fromDate, filters.endDate)}`
              : undefined
          }
          iconName="mdi:calendar"
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

      <CustomDateRangePicker
        variant="calendar"
        open={dateDialog.value}
        onClose={dateDialog.onFalse}
        startDate={filters.fromDate}
        endDate={filters.endDate}
        onChangeStartDate={handleChangeStartDate}
        onChangeEndDate={handleChangeEndDate}
      />
    </>
  );
}
