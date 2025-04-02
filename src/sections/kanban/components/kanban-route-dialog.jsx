import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { useRoutes } from 'src/query/use-route';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

// ----------------------------------------------------------------------

export function KanbanRouteDialog({
  selectedRoute = null,
  open,
  onClose,
  onRouteChange,
  customerId = null,
}) {
  const { data: routes } = useRoutes(customerId, true);
  const [searchRoute, setSearchRoute] = useState('');

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

  const dataFiltered = applyFilter({ inputData: routes || [], query: searchRoute });

  // Segregate routes
  const customerSpecificRoutes = dataFiltered.filter((route) => route.isCustomerSpecific);
  const genericRoutes = dataFiltered.filter((route) => !route.isCustomerSpecific);

  const notFound = !dataFiltered.length && !!searchRoute;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        Routes <Typography component="span">({routes?.length || 0})</Typography>
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
        {notFound ? (
          <SearchNotFound query={searchRoute} sx={{ mt: 3, mb: 10 }} />
        ) : (
          <Scrollbar sx={{ height: ITEM_HEIGHT * 6, px: 2.5 }}>
            <Box component="ul">
              {customerSpecificRoutes.length > 0 && (
                <>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: 'primary.main',
                      fontWeight: 'medium',
                      p: 1,
                    }}
                  >
                    Customer Specific Routes
                  </Typography>

                  {customerSpecificRoutes.map((route) =>
                    renderRouteItem(route, selectedRoute, handleSelectRoute)
                  )}

                  <Divider sx={{ borderStyle: 'dashed', my: 1.5 }} />
                </>
              )}

              {genericRoutes.length > 0 && (
                <>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: 'primary.main',
                      fontWeight: 'medium',
                      p: 1,
                    }}
                  >
                    Generic Routes
                  </Typography>

                  {genericRoutes.map((route) =>
                    renderRouteItem(route, selectedRoute, handleSelectRoute)
                  )}
                </>
              )}
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
        primary={route.routeName}
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

function applyFilter({ inputData, query }) {
  if (query) {
    inputData = inputData.filter((route) => {
      const searchQuery = query.toLowerCase();

      // Helper function to safely check if a field exists and contains the query
      const matchesField = (field) => field && field.toLowerCase().indexOf(searchQuery) !== -1;

      return (
        matchesField(route.routeName) ||
        matchesField(route.fromPlace) ||
        matchesField(route.toPlace)
      );
    });
  }

  return inputData;
}
