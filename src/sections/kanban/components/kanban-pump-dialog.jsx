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

import { usePumps } from 'src/query/use-pump';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

// ----------------------------------------------------------------------

export function KanbanPumpDialog({ selectedPump = null, open, onClose, onPumpChange }) {
  const { data: pumps } = usePumps();
  const [searchPump, setSearchPump] = useState('');

  const handleSearchPumps = useCallback((event) => {
    setSearchPump(event.target.value);
  }, []);

  const handleSelectPump = useCallback(
    (pump) => {
      onPumpChange(pump);
      onClose();
    },
    [onPumpChange, onClose]
  );

  const dataFiltered = applyFilter({ inputData: pumps || [], query: searchPump });

  const notFound = !dataFiltered.length && !!searchPump;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        Pumps <Typography component="span">({pumps?.length})</Typography>
      </DialogTitle>

      <Box sx={{ px: 3, py: 2.5 }}>
        <TextField
          fullWidth
          value={searchPump}
          onChange={handleSearchPumps}
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
          <SearchNotFound query={searchPump} sx={{ mt: 3, mb: 10 }} />
        ) : (
          <Scrollbar sx={{ height: ITEM_HEIGHT * 6, px: 2.5 }}>
            <Box component="ul">
              {dataFiltered.map((pump) => {
                const isSelected = selectedPump?._id === pump._id;

                return (
                  <Box
                    component="li"
                    key={pump._id}
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
                      primary={pump.pumpName}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption">
                            {pump.pumpPhoneNo} • {pump.address}
                          </Typography>
                        </Box>
                      }
                    />

                    <Button
                      size="small"
                      color={isSelected ? 'primary' : 'inherit'}
                      onClick={() => handleSelectPump(pump)}
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
    inputData = inputData.filter((pump) => {
      const searchQuery = query.toLowerCase();

      // Helper function to safely check if a field exists and contains the query
      const matchesField = (field) => field && field.toLowerCase().indexOf(searchQuery) !== -1;

      return (
        matchesField(pump.pumpName) || matchesField(pump.pumpPhoneNo) || matchesField(pump.address)
      );
    });
  }

  return inputData;
}
