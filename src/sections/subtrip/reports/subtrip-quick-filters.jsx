import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { fSub, fAdd } from 'src/utils/format-time';

import { Scrollbar } from 'src/components/scrollbar';

import { SUBTRIP_STATUS } from 'src/sections/subtrip/constants';

// ----------------------------------------------------------------------

/**
 * A component that provides quick access to commonly used filter combinations
 */
export default function SubtripQuickFilters({
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
        id: 'this-month-billed',
        label: 'This Month Billed',
        tooltip: 'Billed-paid subtrips from this month',
        filters: {
          fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          endDate: new Date(),
          status: [SUBTRIP_STATUS.BILLED_PAID],
        },
      },
      {
        id: 'last-month-billed',
        label: 'Last Month Billed',
        tooltip: 'Billed-paid subtrips from last month',
        filters: {
          fromDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
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
          // The actual filter for expiring e-way bills would need to be handled
          // in the backend API, as it's a complex date comparison
          // This is just a placeholder for the UI
          ewayExpiryDate: fAdd({ days: 1 }), // Setting ewayExpiryDate to tomorrow
        },
      },
      {
        id: 'recent-closed',
        label: 'Recently Closed',
        tooltip: 'Subtrips closed in the last 7 days',
        filters: {
          fromDate: new Date(fSub({ days: 7 })),
          endDate: new Date(),
          status: [SUBTRIP_STATUS.CLOSED],
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

    // // Trigger search
    // onSearch();
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
  THIS_MONTH_BILLED: 'this-month-billed',
  LAST_MONTH_BILLED: 'last-month-billed',
  PENDING_INVOICES: 'pending-invoices',
  OVERDUE_INVOICES: 'overdue-invoices',
  EXPIRING_EWAY: 'expiring-eway',
  RECENT_CLOSED: 'recent-closed',
};
