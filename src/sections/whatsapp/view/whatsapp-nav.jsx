import { Avatar, Box, Chip, IconButton, InputBase, Skeleton, Stack } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { WhatsAppNavItem } from './whatsapp-nav-item';

// ----------------------------------------------------------------------

export function WhatsAppNav({
  conversations,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  entityFilter,
  onEntityFilterChange,
  collapsed,
  onToggleCollapse,
  isLoading,
}) {
  const FILTERS = ['All', 'Driver', 'Transporter', 'Customer'];

  return (
    <>
      <Stack sx={{ p: 2, pb: 1, borderBottom: (theme) => `solid 1px ${theme.palette.divider}` }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          {!collapsed && (
            <InputBase
              fullWidth
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              startAdornment={
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', mr: 1 }} />
              }
              sx={{
                p: 1,
                bgcolor: 'background.neutral',
                borderRadius: 1,
                typography: 'body2',
              }}
            />
          )}
        </Stack>

        {!collapsed && (
          <Scrollbar sx={{ pb: 1 }}>
            <Stack direction="row" spacing={1}>
              {FILTERS.map((f) => (
                <Chip
                  key={f}
                  label={f}
                  size="small"
                  onClick={() => onEntityFilterChange(f === 'All' ? '' : f)}
                  color={
                    (f === 'All' && !entityFilter) || entityFilter === f
                      ? 'primary'
                      : 'default'
                  }
                  variant={
                    (f === 'All' && !entityFilter) || entityFilter === f
                      ? 'filled'
                      : 'outlined'
                  }
                />
              ))}
            </Stack>
          </Scrollbar>
        )}
      </Stack>

      <Scrollbar sx={{ flex: 1 }}>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Stack key={i} direction="row" spacing={2} sx={{ p: 2, alignItems: 'center' }}>
              <Skeleton variant="circular" width={48} height={48} />
              {!collapsed && (
                <Stack spacing={1} flex={1}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="90%" />
                </Stack>
              )}
            </Stack>
          ))
        ) : (
          conversations?.map((conv) => (
            <WhatsAppNavItem
              key={conv._id}
              conversation={conv}
              selected={selectedId === conv._id}
              onSelect={() => onSelect(conv._id)}
              collapsed={collapsed}
            />
          ))
        )}
      </Scrollbar>

      <Box sx={{ p: 1, borderTop: (theme) => `solid 1px ${theme.palette.divider}`, display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end' }}>
        <IconButton onClick={onToggleCollapse}>
          <Iconify icon={collapsed ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'} />
        </IconButton>
      </Box>
    </>
  );
}
