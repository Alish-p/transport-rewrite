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

import { useVehicles } from '../../../query/use-vehicle';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

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
                      primaryTypographyProps={{ typography: 'subtitle2', sx: { mb: 0.25 } }}
                      secondaryTypographyProps={{ typography: 'caption' }}
                      primary={vehicle.vehicleNo}
                      secondary={
                        <>
                          {vehicle.vehicleType} • {vehicle.modelType} • {vehicle.vehicleCompany}
                        </>
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
    inputData = inputData.filter(
      (vehicle) =>
        vehicle.vehicleNo.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        vehicle.vehicleType.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        vehicle.modelType.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        vehicle.vehicleCompany.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}
