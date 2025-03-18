import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

// ----------------------------------------------------------------------

export function KanbanTripDialog({ selectedTrip = null, open, onClose, onTripChange, trips = [] }) {
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
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
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
        {notFound ? (
          <SearchNotFound query={searchTrip} sx={{ mt: 3, mb: 10 }} />
        ) : (
          <Scrollbar sx={{ height: ITEM_HEIGHT * 6, px: 2.5 }}>
            <Box component="ul">
              {dataFiltered.map((trip) => {
                const isSelected = selectedTrip?._id === trip._id;

                return (
                  <Box
                    component="li"
                    key={trip._id}
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
                      primary={`Trip ${trip._id}`}
                      secondary={
                        <>
                          Vehicle: {trip.vehicleId?.vehicleNo} • Driver: {trip.driverId?.driverName}
                        </>
                      }
                    />

                    <Button
                      size="small"
                      color={isSelected ? 'primary' : 'inherit'}
                      onClick={() => handleSelectTrip(trip)}
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
              })}
            </Box>
          </Scrollbar>
        )}
      </DialogContent>
    </Dialog>
  );
}

function applyFilter({ inputData, query }) {
  if (query) {
    inputData = inputData.filter(
      (trip) =>
        trip._id.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        trip.vehicleId?.vehicleNo.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        trip.driverId?.driverName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}
