import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { fSub, fAdd } from 'src/utils/format-time';

import { SUBTRIP_STATUS } from 'src/sections/subtrip/constants';

// ----------------------------------------------------------------------

/**
 * A component that provides quick access to commonly used filter combinations
 */
export default function SubtripQuickFilters({ onApplyFilter, onSearch }) {
  const [selected, setSelected] = useState(null);

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
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          mb: 1,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          Quick Filters:
        </Typography>

        <Divider orientation="vertical" flexItem />

        {quickFilters.map((filter) => (
          <Tooltip key={filter.id} title={filter.tooltip} arrow>
            <Chip
              label={filter.label}
              onClick={() => handleFilterClick(filter)}
              color={selected === filter.id ? 'primary' : 'default'}
              variant={selected === filter.id ? 'filled' : 'outlined'}
            />
          </Tooltip>
        ))}
      </Stack>

      {selected && (
        <Typography variant="caption" color="primary.main" sx={{ display: 'block', mt: 0.5 }}>
          {quickFilters.find((f) => f.id === selected)?.tooltip}
        </Typography>
      )}
    </Box>
  );
}
