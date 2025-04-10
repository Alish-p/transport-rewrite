import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { useSubtrips } from 'src/query/use-subtrip';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';

import { SUBTRIP_STATUS_COLORS } from '../../subtrip/constants';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 90;

// ----------------------------------------------------------------------

export function KanbanSubtripDialog({ selectedSubtrip = null, open, onClose, onSubtripChange }) {
  const { data: subtrips } = useSubtrips();
  const [searchSubtrip, setSearchSubtrip] = useState('');

  const handleSearchSubtrips = useCallback((event) => {
    setSearchSubtrip(event.target.value);
  }, []);

  const handleSelectSubtrip = useCallback(
    (subtrip) => {
      onSubtripChange(subtrip);
      onClose();
    },
    [onSubtripChange, onClose]
  );

  const dataFiltered = applyFilter({ inputData: subtrips || [], query: searchSubtrip });

  const notFound = !dataFiltered.length && !!searchSubtrip;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        Subtrips <Typography component="span">({subtrips?.length || 0})</Typography>
      </DialogTitle>

      <Box sx={{ px: 3, py: 2.5 }}>
        <TextField
          fullWidth
          value={searchSubtrip}
          onChange={handleSearchSubtrips}
          placeholder="Search by ID, vehicle, or driver..."
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
          <SearchNotFound query={searchSubtrip} sx={{ mt: 3, mb: 10 }} />
        ) : (
          <Scrollbar sx={{ height: ITEM_HEIGHT * 6, px: 2.5 }}>
            <Box component="ul">
              {dataFiltered.map((subtrip) => {
                const isSelected = selectedSubtrip?._id === subtrip._id;

                return (
                  <Box
                    component="li"
                    key={subtrip._id}
                    sx={{
                      gap: 2,
                      display: 'flex',
                      height: ITEM_HEIGHT,
                      alignItems: 'center',
                    }}
                  >
                    <ListItemText
                      primaryTypographyProps={{ typography: 'subtitle2', sx: { mb: 0.5 } }}
                      secondaryTypographyProps={{ typography: 'caption' }}
                      primary={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="subtitle2">#{subtrip._id}</Typography>
                          <Label
                            variant="soft"
                            color={SUBTRIP_STATUS_COLORS[subtrip.subtripStatus] || 'default'}
                            size="small"
                          >
                            {subtrip.subtripStatus.replace('-', ' ')}
                          </Label>
                        </Stack>
                      }
                      secondary={
                        <Stack spacing={1}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {/* <Iconify icon="mdi:map-marker-path" sx={{ color: 'text.secondary' }} /> */}
                            <Typography variant="caption">
                              {`${subtrip.loadingPoint || 'N/A'} → ${subtrip.unloadingPoint || 'N/A'}`}
                            </Typography>
                          </Stack>

                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="caption">
                              {`${subtrip.tripId?.vehicleId?.vehicleNo || 'N/A'} | ${subtrip.tripId?.driverId?.driverName || 'N/A'} | ${subtrip.startDate ? new Date(subtrip.startDate).toLocaleDateString() : 'N/A'}`}
                            </Typography>
                          </Stack>
                        </Stack>
                      }
                    />

                    <Button
                      size="small"
                      color={isSelected ? 'primary' : 'inherit'}
                      onClick={() => handleSelectSubtrip(subtrip)}
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
    inputData = inputData.filter((subtrip) => {
      const searchQuery = query.toLowerCase();

      // Helper function to safely check if a field exists and contains the query
      const matchesField = (field) => field && field.toLowerCase().indexOf(searchQuery) !== -1;

      return (
        matchesField(subtrip._id) ||
        matchesField(subtrip.tripId?.vehicleId?.vehicleNo) ||
        matchesField(subtrip.tripId?.driverId?.driverName) ||
        matchesField(subtrip.loadingPoint) ||
        matchesField(subtrip.unloadingPoint)
      );
    });
  }

  return inputData;
}
