import dayjs from 'dayjs';
import { useState } from 'react';

import {
  Box,
  Chip,
  Stack,
  Divider,
  Tooltip,
  useTheme,
  Typography,
  useMediaQuery,
} from '@mui/material';

import { Scrollbar } from 'src/components/scrollbar';

import { SUBTRIP_STATUS } from 'src/sections/subtrip/constants';

export default function SubtripQuickFilters({ onFilters, selectedFilter }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selected, setSelected] = useState(null);

  // Predefined filter configurations with dayjs objects
  const QUICK_FILTERS = [
    {
      id: 'this-month-billed',
      label: 'This Month Billed',
      tooltip: 'Billed-paid subtrips from this month',
      filters: {
        startFromDate: dayjs().startOf('month'),
        startEndDate: dayjs(),
        status: [SUBTRIP_STATUS.BILLED_PAID],
      },
    },
    {
      id: 'pending-invoices',
      label: 'Pending Invoices',
      tooltip: 'Subtrips with pending invoice payment',
      filters: {
        status: [SUBTRIP_STATUS.BILLED_PENDING],
      },
    },
    {
      id: 'overdue-invoices',
      label: 'Overdue Invoices',
      tooltip: 'Subtrips with overdue invoice payment',
      filters: {
        status: [SUBTRIP_STATUS.BILLED_OVERDUE],
      },
    },
    {
      id: 'expiring-eway',
      label: 'E-way Expiring Soon',
      tooltip: 'Loaded subtrips with e-way bill expiring in 24 hours',
      filters: {
        status: [SUBTRIP_STATUS.LOADED],
        ewayExpiryFromDate: dayjs(),
        ewayExpiryEndDate: dayjs().add(1, 'day'),
      },
    },
    {
      id: 'recent-closed',
      label: 'Recently Closed',
      tooltip: 'Subtrips closed in the last 7 days',
      filters: {
        subtripEndFromDate: dayjs().subtract(7, 'day'),
        subtripEndEndDate: dayjs(),
        status: [SUBTRIP_STATUS.CLOSED],
      },
    },
  ];

  const handleFilterClick = (filter) => {
    const isDeselecting = filter.id === selected;
    setSelected(isDeselecting ? null : filter.id);

    // If deselecting, just reset filters
    if (isDeselecting) {
      onFilters('reset', null);
    } else {
      // Then apply the new filter
      onFilters('batch', filter.filters);
    }
  };

  const renderFilterChips = () => (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        py: 1,
        px: 0.5,
        gap: 1,
        minWidth: 'min-content',
      }}
    >
      {QUICK_FILTERS.map((filter) => (
        <Tooltip key={filter.id} title={filter.tooltip} arrow placement="top">
          <Chip
            label={filter.label}
            onClick={() => handleFilterClick(filter)}
            color={selected === filter.id ? 'primary' : 'default'}
            variant={selected === filter.id ? 'filled' : 'outlined'}
          />
        </Tooltip>
      ))}
    </Stack>
  );

  return (
    <Box sx={{ p: 2, pb: 1 }}>
      <Stack direction={isMobile ? 'column' : 'row'} sx={{ mb: 1 }}>
        <Stack direction="row" alignItems="center">
          <Typography variant="body2" color="text.secondary" noWrap sx={{ mr: 1 }}>
            Quick Filters:
          </Typography>
          {!isMobile && <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />}
        </Stack>

        <Box sx={{ width: '100%' }}>
          <Scrollbar>{renderFilterChips()}</Scrollbar>
        </Box>
      </Stack>
    </Box>
  );
}

// Export filter IDs for external use
export const QUICK_FILTER_IDS = {
  THIS_MONTH_BILLED: 'this-month-billed',
  PENDING_INVOICES: 'pending-invoices',
  OVERDUE_INVOICES: 'overdue-invoices',
  EXPIRING_EWAY: 'expiring-eway',
  RECENT_CLOSED: 'recent-closed',
};
