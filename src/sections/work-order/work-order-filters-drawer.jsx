import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { DialogSelectButton } from 'src/components/dialog-select-button';

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
  );
}
