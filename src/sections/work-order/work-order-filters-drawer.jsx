import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { WORK_ORDER_ISSUE_OPTIONS } from './work-order-config';

export default function WorkOrderFiltersDrawer({
  open,
  onClose,
  filters,
  onFilters,
  // Dialogs provided by parent
  createdByDialog,
  closedByDialog,
  issueAssigneeDialog,
  // Selected state provided by parent
  selectedCreatedBy,
  selectedClosedBy,
  selectedIssueAssignee,
}) {
  const startDateRange = useBoolean();
  const endDateRange = useBoolean();
  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, px: 2.5 }}
    >
      <Typography variant="h6">Filters</Typography>

      <IconButton onClick={onClose}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  return (
    <>
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 320 },
        }}
      >
        {renderHead}

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 2.5 }}>
            <TextField
              fullWidth
              value={filters.workOrderNo || ''}
              onChange={(event) => onFilters('workOrderNo', event.target.value)}
              placeholder="WO No."
              label="WO No."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Autocomplete
              freeSolo
              options={WORK_ORDER_ISSUE_OPTIONS}
              value={filters.issue || ''}
              onChange={(event, newValue) => {
                onFilters('issue', newValue || '');
              }}
              onInputChange={(event, newInputValue) => {
                onFilters('issue', newInputValue || '');
              }}
              renderInput={(params) => <TextField {...params} label="Issue" />}
            />

            <DialogSelectButton
              onClick={startDateRange.onTrue}
              selected={
                filters.startDateStart && filters.startDateEnd
                  ? fDateRangeShortLabel(filters.startDateStart, filters.startDateEnd)
                  : undefined
              }
              placeholder="Work Order Start Date Range"
              iconName="mdi:calendar"
            />

            <DialogSelectButton
              onClick={endDateRange.onTrue}
              selected={
                filters.endDateStart && filters.endDateEnd
                  ? fDateRangeShortLabel(filters.endDateStart, filters.endDateEnd)
                  : undefined
              }
              placeholder="Work Order End Date Range"
              iconName="mdi:calendar"
            />

            <DialogSelectButton
              onClick={createdByDialog.onTrue}
              selected={selectedCreatedBy?.name}
              placeholder="Created By"
              iconName="mdi:account"
            />

            <DialogSelectButton
              onClick={closedByDialog.onTrue}
              selected={selectedClosedBy?.name}
              placeholder="Closed By"
              iconName="mdi:account-check"
            />

            <DialogSelectButton
              onClick={issueAssigneeDialog.onTrue}
              selected={selectedIssueAssignee?.name}
              placeholder="Issue Assignee"
              iconName="mdi:account-hard-hat"
            />
          </Stack>
        </Scrollbar>
      </Drawer>

      <CustomDateRangePicker
        variant="calendar"
        open={startDateRange.value}
        onClose={startDateRange.onFalse}
        startDate={filters.startDateStart}
        endDate={filters.startDateEnd}
        onChangeStartDate={(date) => onFilters('startDateStart', date)}
        onChangeEndDate={(date) => onFilters('startDateEnd', date)}
      />

      <CustomDateRangePicker
        variant="calendar"
        open={endDateRange.value}
        onClose={endDateRange.onFalse}
        startDate={filters.endDateStart}
        endDate={filters.endDateEnd}
        onChangeStartDate={(date) => onFilters('endDateStart', date)}
        onChangeEndDate={(date) => onFilters('endDateEnd', date)}
      />
    </>
  );
}
