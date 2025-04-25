import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

// ----------------------------------------------------------------------

export function SubtripsDialog({ open, onClose, subtrips = [], selectedSubtrips = [], onChange }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleToggle = useCallback(
    (id) => {
      const newSelectedSubtrips = selectedSubtrips.includes(id)
        ? selectedSubtrips.filter((selectedId) => selectedId !== id)
        : [...selectedSubtrips, id];

      onChange({ subtripIds: newSelectedSubtrips });
    },
    [selectedSubtrips, onChange]
  );

  const handleSelectAll = useCallback(() => {
    if (selectedSubtrips.length === subtrips.length) {
      onChange({ subtripIds: [] });
    } else {
      onChange({ subtripIds: subtrips.map((st) => st._id) });
    }
  }, [selectedSubtrips, subtrips, onChange]);

  const dataFiltered = applyFilter({ inputData: subtrips || [], query: searchQuery });

  const notFound = !dataFiltered.length && !!searchQuery;

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        Select Subtrips <Typography component="span">({subtrips?.length})</Typography>
      </DialogTitle>

      <Box sx={{ px: 3, py: 2.5 }}>
        <TextField
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
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
          <SearchNotFound query={searchQuery} sx={{ mt: 3, mb: 10 }} />
        ) : (
          <Scrollbar sx={{ height: ITEM_HEIGHT * 6, px: 2.5 }}>
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedSubtrips.length === subtrips.length && subtrips.length > 0}
                    indeterminate={
                      selectedSubtrips.length > 0 && selectedSubtrips.length < subtrips.length
                    }
                    onChange={handleSelectAll}
                  />
                }
                label="Select All"
              />
            </Box>

            <Box component="ul">
              {dataFiltered.map((subtrip) => {
                const isSelected = selectedSubtrips.includes(subtrip._id);

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
                    <Checkbox checked={isSelected} onChange={() => handleToggle(subtrip._id)} />

                    <ListItemText
                      primaryTypographyProps={{ typography: 'subtitle2', sx: { mb: 0.25 } }}
                      secondaryTypographyProps={{ typography: 'caption' }}
                      primary={subtrip._id}
                      secondary={
                        <>
                          {subtrip.consignee} • {subtrip.unloadingPoint}
                        </>
                      }
                    />
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
        matchesField(subtrip.consignee) ||
        matchesField(subtrip.unloadingPoint)
      );
    });
  }

  return inputData;
}
