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

import { useVehicles } from 'src/query/use-vehicle';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 74;

// ----------------------------------------------------------------------

export function KanbanVehicleDialog({ selectedVehicle = null, open, onClose, onVehicleChange }) {
  const { data: vehicles } = useVehicles();
  const [searchVehicle, setSearchVehicle] = useState('');

  const handleSearchVehicles = useCallback((event) => {
    setSearchVehicle(event.target.value);
  }, []);

  const handleSelectVehicle = useCallback(
    (vehicle) => {
      onVehicleChange(vehicle);
      onClose();
    },
    [onVehicleChange, onClose]
  );

  const dataFiltered = applyFilter({ inputData: vehicles || [], query: searchVehicle });

  const notFound = !dataFiltered.length && !!searchVehicle;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        Vehicles <Typography component="span">({vehicles?.length})</Typography>
      </DialogTitle>

      <Box sx={{ px: 3, py: 2.5 }}>
        <TextField
          fullWidth
          value={searchVehicle}
          onChange={handleSearchVehicles}
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
          <SearchNotFound query={searchVehicle} sx={{ mt: 3, mb: 10 }} />
        ) : (
          <Scrollbar sx={{ height: ITEM_HEIGHT * 6, px: 2.5 }}>
            <Box component="ul">
              {dataFiltered.map((vehicle) => {
                const isSelected = selectedVehicle?._id === vehicle._id;

                return (
                  <Box
                    component="li"
                    key={vehicle._id}
                    sx={{
                      gap: 2,
                      display: 'flex',
                      height: ITEM_HEIGHT,
                      alignItems: 'center',
                    }}
                  >
                    <ListItemText
                      secondaryTypographyProps={{ typography: 'caption' }}
                      primary={
                        <Stack direction="row" alignItems="center" gap={1} mb={1}>
                          <Typography variant="subtitle2" sx={{ mb: 0.25 }}>
                            {vehicle.vehicleNo}
                          </Typography>
                          <Label
                            color={vehicle.isOwn ? 'success' : 'warning'}
                            size="small"
                            variant="soft"
                          >
                            {vehicle.isOwn ? 'Own' : 'Market'}
                          </Label>
                        </Stack>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption">
                            {vehicle.vehicleType} • {vehicle.modelType} • {vehicle.vehicleCompany}
                          </Typography>
                        </Box>
                      }
                    />

                    <Button
                      size="small"
                      color={isSelected ? 'primary' : 'inherit'}
                      onClick={() => handleSelectVehicle(vehicle)}
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
    inputData = inputData.filter((vehicle) => {
      const searchQuery = query.toLowerCase();

      // Helper function to safely check if a field exists and contains the query
      const matchesField = (field) => field && field.toLowerCase().indexOf(searchQuery) !== -1;

      return (
        matchesField(vehicle.vehicleNo) ||
        matchesField(vehicle.vehicleType) ||
        matchesField(vehicle.modelType) ||
        matchesField(vehicle.vehicleCompany)
      );
    });
  }

  return inputData;
}
