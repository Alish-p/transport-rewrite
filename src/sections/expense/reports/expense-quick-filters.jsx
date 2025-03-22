import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { fSub } from 'src/utils/format-time';

import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

/**
 * A component that provides quick access to commonly used filter combinations for expenses
 */
export default function ExpenseQuickFilters({
  onApplyFilter,
  onSearch,
  selectedFilter,
  onSetSelectedFilter,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // If selectedFilter prop is provided, use it, otherwise use internal state
  const [internalSelected, setInternalSelected] = useState(null);

  // Determine which selected state to use
  const selected = selectedFilter !== undefined ? selectedFilter : internalSelected;
  const setSelected = useCallback(
    (newValue) => {
      if (onSetSelectedFilter) {
        onSetSelectedFilter(newValue);
      } else {
        setInternalSelected(newValue);
      }
    },
    [onSetSelectedFilter]
  );

  const quickFilters = useMemo(
    () => [
      {
        id: 'this-month-expenses',
        label: 'This Month',
        tooltip: 'Expenses from this month',
        filters: {
          fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          endDate: new Date(),
        },
      },
      {
        id: 'last-month-expenses',
        label: 'Last Month',
        tooltip: 'Expenses from last month',
        filters: {
          fromDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
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
        id: 'high-amount',
        label: 'High Amount',
        tooltip: 'Expenses with high amounts (>10,000)',
        filters: {
          // This would need to be implemented in backend
          minAmount: 10000,
        },
      },
      {
        id: 'recent-expenses',
        label: 'Recent Expenses',
        tooltip: 'Expenses from the last 7 days',
        filters: {
          fromDate: new Date(fSub({ days: 7 })),
          endDate: new Date(),
        },
      },
    ],
    []
  );

  const handleFilterClick = (filter) => {
    setSelected(filter.id === selected ? null : filter.id);

    // Reset all filters first (handled in the parent component)
    onApplyFilter('reset', null);

    // If we're deselecting, just return without applying new filters
    if (filter.id === selected) {
      return;
    }

    // Apply each filter
    Object.entries(filter.filters).forEach(([key, value]) => {
      onApplyFilter(key, value);
    });
  };

  return (
    <Box sx={{ p: 2, pb: 1 }}>
      <Stack
        direction={isMobile ? 'column' : 'row'}
        sx={{
          mb: 1,
        }}
      >
        <Stack direction="row" alignItems="center">
          <Typography variant="body2" color="text.secondary" noWrap sx={{ mr: 1 }}>
            Quick Filters:
          </Typography>

          {!isMobile && <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />}
        </Stack>

        <Box sx={{ width: '100%' }}>
          <Scrollbar>
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
              {quickFilters.map((filter) => (
                <Tooltip key={filter.id} title={filter.tooltip} arrow>
                  <Chip
                    label={filter.label}
                    onClick={() => handleFilterClick(filter)}
                    color={selected === filter.id ? 'primary' : 'default'}
                    variant={selected === filter.id ? 'filled' : 'outlined'}
                    sx={{
                      height: 'auto',
                      '& .MuiChip-label': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        padding: '4px 8px',
                      },
                    }}
                  />
                </Tooltip>
              ))}
            </Stack>
          </Scrollbar>
        </Box>
      </Stack>

      {selected && (
        <Typography
          variant="caption"
          color="primary.main"
          sx={{
            display: 'block',
            mt: 0.5,
            mb: 1,
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {quickFilters.find((f) => f.id === selected)?.tooltip}
        </Typography>
      )}
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
