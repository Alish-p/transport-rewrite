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

import { fSub } from 'src/utils/format-time';

import { Scrollbar } from 'src/components/scrollbar';

export default function SubtripQuickFilters({ onFilters }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selected, setSelected] = useState(null);

  // Predefined filter configurations with dayjs objects
  const QUICK_FILTERS = [
    {
      id: 'this-month-expenses',
      label: 'This Month',
      tooltip: 'Expenses from this month',
      filters: {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(),
      },
    },
    {
      id: 'last-month-expenses',
      label: 'Last Month',
      tooltip: 'Expenses from last month',
      filters: {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      },
    },
    {
      id: 'vehicle-expenses',
      label: 'Vehicle Expenses',
      tooltip: 'All vehicle related expenses',
      filters: {
        expenseCategory: 'vehicle',
      },
    },
    {
      id: 'subtrip-expenses',
      label: 'Subtrip Expenses',
      tooltip: 'All subtrip related expenses',
      filters: {
        expenseCategory: 'subtrip',
      },
    },
    {
      id: 'recent-expenses',
      label: 'Recent Expenses',
      tooltip: 'Expenses from the last 7 days',
      filters: {
        startDate: new Date(fSub({ days: 7 })),
        endDate: new Date(),
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

// Export the quick filter IDs for use in other components
export const QUICK_FILTER_IDS = {
  THIS_MONTH_EXPENSES: 'this-month-expenses',
  LAST_MONTH_EXPENSES: 'last-month-expenses',
  VEHICLE_EXPENSES: 'vehicle-expenses',
  SUBTRIP_EXPENSES: 'subtrip-expenses',
  HIGH_AMOUNT: 'high-amount',
  RECENT_EXPENSES: 'recent-expenses',
};
