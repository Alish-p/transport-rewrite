import { useState, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;
const LIST_HEIGHT = ITEM_HEIGHT * 6;

// ----------------------------------------------------------------------

const TripItem = ({ data: { trips, selectedTrip, onSelect }, index, style }) => {
  const trip = trips[index];
  const isSelected = selectedTrip?._id === trip._id;

  return (
    <Box
      component="li"
      style={style}
      sx={{
        gap: 2,
        display: 'flex',
        height: ITEM_HEIGHT,
        alignItems: 'center',
      }}
    >
      <ListItemText
        primaryTypographyProps={{ typography: 'subtitle2', sx: { mb: 1, color: 'primary.dark' } }}
        secondaryTypographyProps={{ typography: 'caption', marginBottom: '5px' }}
        primary={`Trip ${trip._id}`}
        secondary={
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Label variant="primary" color="primary" startIcon={<Iconify icon="eva:car-outline" />}>
              {trip.vehicleId?.vehicleNo || '—'}
            </Label>
            <Label
              variant="primary"
              color="default"
              startIcon={<Iconify icon="eva:person-outline" width={16} />}
            >
              {trip.driverId?.driverName || '—'}
            </Label>
            <Label
              variant="primary"
              color="default"
              startIcon={<Iconify icon="eva:calendar-outline" width={16} />}
            >
              {fDate(trip.fromDate)}
            </Label>
          </Stack>
        }
      />

      <Button
        size="small"
        color={isSelected ? 'primary' : 'inherit'}
        onClick={() => onSelect(trip)}
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
};

const LoadingSkeleton = () => (
  <Box sx={{ height: LIST_HEIGHT, px: 2.5 }}>
    <Box component="ul">
      {[...Array(6)].map((_, index) => (
        <Box
          component="li"
          key={index}
          sx={{
            gap: 2,
            display: 'flex',
            height: ITEM_HEIGHT,
            alignItems: 'center',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={100} height={24} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="80%" height={20} />
          </Box>
          <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
        </Box>
      ))}
    </Box>
  </Box>
);

export function KanbanTripDialog({
  selectedTrip = null,
  open,
  onClose,
  onTripChange,
  trips = [],
  isLoading,
}) {
  const [searchTrip, setSearchTrip] = useState('');

  const handleSearchTrips = useCallback((event) => {
    setSearchTrip(event.target.value);
  }, []);

  const handleSelectTrip = useCallback(
    (trip) => {
      onTripChange(trip);
      onClose();
    },
    [onTripChange, onClose]
  );

  const dataFiltered = applyFilter({ inputData: trips || [], query: searchTrip });

  const notFound = !dataFiltered.length && !!searchTrip;

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        Trips <Typography component="span">({trips?.length})</Typography>
      </DialogTitle>

      <Box sx={{ px: 3, py: 2.5 }}>
        <TextField
          fullWidth
          value={searchTrip}
          onChange={handleSearchTrips}
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
          <LoadingSkeleton />
        ) : notFound ? (
          <SearchNotFound query={searchTrip} sx={{ mt: 3, mb: 10 }} />
        ) : (
          <Scrollbar sx={{ height: LIST_HEIGHT }}>
            <Box sx={{ px: 2.5 }}>
              <List
                height={LIST_HEIGHT}
                width="100%"
                itemCount={dataFiltered.length}
                itemSize={ITEM_HEIGHT}
                itemData={{
                  trips: dataFiltered,
                  selectedTrip,
                  onSelect: handleSelectTrip,
                }}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                }}
              >
                {TripItem}
              </List>
            </Box>
          </Scrollbar>
        )}
      </DialogContent>
    </Dialog>
  );
}

function applyFilter({ inputData, query }) {
  if (query) {
    inputData = inputData.filter((trip) => {
      const searchQuery = query.toLowerCase();

      // Helper function to safely check if a field exists and contains the query
      const matchesField = (field) => field && field.toLowerCase().indexOf(searchQuery) !== -1;

      return (
        matchesField(trip._id) ||
        matchesField(trip.vehicleId?.vehicleNo) ||
        matchesField(trip.driverId?.driverName)
      );
    });
  }

  return inputData;
}
