import { useInView } from 'react-intersection-observer';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { useDebounce } from 'src/hooks/use-debounce';

import { wrapText } from 'src/utils/change-case';

import { useInfiniteRoutes } from 'src/query/use-route';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingSpinner } from 'src/components/loading-spinner';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

// ----------------------------------------------------------------------

export function KanbanRouteDialog({
  selectedRoute = null,
  open,
  onClose,
  onRouteChange,
  mode = 'all',
  customerId = null,
}) {
  const scrollRef = useRef(null);
  const [searchRoute, setSearchRoute] = useState('');
  const debouncedSearch = useDebounce(searchRoute);

  const params = {
    rowsPerPage: 50,
    routeName: debouncedSearch || undefined,
  };

  if (mode === 'generic') {
    params.isCustomerSpecific = false;
  } else if (mode === 'genericAndCustomer') {
    if (customerId) params.customer = customerId;
  } else if (mode === 'onlyCustomer') {
    params.isCustomerSpecific = true;
    if (customerId) params.customer = customerId;
  } else if (mode === 'all') {
    // no additional params
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching } =
    useInfiniteRoutes(params, { enabled: open });

  const routes = data ? data.pages.flatMap((p) => p.routes || p.results || []) : [];
  const total = data?.pages?.[0]?.total || 0;

  const handleSearchRoutes = useCallback((event) => {
    setSearchRoute(event.target.value);
  }, []);

  const handleSelectRoute = useCallback(
    (route) => {
      onRouteChange(route);
      onClose();
    },
    [onRouteChange, onClose]
  );

  const { ref: loadMoreRef, inView } = useInView({ root: scrollRef.current });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const notFound = !routes.length && !!debouncedSearch && !isLoading;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        Routes{' '}
        <Typography component="span" sx={{ color: 'text.secondary' }}>
          ({total})
        </Typography>
      </DialogTitle>

      <Box sx={{ px: 3, py: 2.5 }}>
        <TextField
          fullWidth
          value={searchRoute}
          onChange={handleSearchRoutes}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {isLoading ? (
          <LoadingSpinner sx={{ height: ITEM_HEIGHT * 6 }} />
        ) : notFound ? (
          <SearchNotFound query={debouncedSearch} sx={{ mt: 3, mb: 10 }} />
        ) : (
          <Scrollbar ref={scrollRef} sx={{ height: ITEM_HEIGHT * 6, px: 2.5 }}>
            <Box component="ul">
              {routes.map((route) => renderRouteItem(route, selectedRoute, handleSelectRoute))}
              <Box ref={loadMoreRef} sx={{ height: ITEM_HEIGHT }}>
                {isFetching && <LoadingSpinner />}
              </Box>
            </Box>
          </Scrollbar>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Helper function to render a route item
function renderRouteItem(route, selectedRoute, handleSelectRoute) {
  const isSelected = selectedRoute?._id === route._id;

  return (
    <Box
      component="li"
      key={route._id}
      sx={{
        gap: 2,
        display: 'flex',
        height: ITEM_HEIGHT,
        alignItems: 'center',
      }}
    >
      <ListItemText
        primaryTypographyProps={{ typography: 'subtitle2', sx: { mb: 0.25 } }}
        secondaryTypographyProps={{ typography: 'caption' }}
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={route.routeName}>
              <ListItemText
                primary={wrapText(route.routeName, 30)}
                primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              />
            </Tooltip>

            {!route.isCustomerSpecific && (
              <Label variant="soft" color="default" size="small">
                Generic
              </Label>
            )}
          </Box>
        }
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption">
              {route.fromPlace} to {route.toPlace}
            </Typography>
            {route.distance && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                • {route.distance} km
              </Typography>
            )}
          </Box>
        }
      />

      <Button
        size="small"
        color={isSelected ? 'primary' : 'inherit'}
        onClick={() => handleSelectRoute(route)}
        startIcon={
          <Iconify
            width={16}
            icon={isSelected ? 'eva:checkmark-fill' : 'mingcute:add-line'}
            sx={{ mr: -0.5 }}
          />
        }
      >
        {isSelected ? 'Selected' : 'Select'}
      </Button>
    </Box>
  );
}
