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

import { useTransporters } from 'src/query/use-transporter';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

// ----------------------------------------------------------------------

export function KanbanTransporterDialog({
  selectedTransporter = null,
  open,
  onClose,
  onTransporterChange,
}) {
  const { data: transporters } = useTransporters();
  const [searchTransporter, setSearchTransporter] = useState('');

  const handleSearchTransporters = useCallback((event) => {
    setSearchTransporter(event.target.value);
  }, []);

  const handleSelectTransporter = useCallback(
    (transporter) => {
      onTransporterChange(transporter);
      onClose();
    },
    [onTransporterChange, onClose]
  );

  const dataFiltered = applyFilter({ inputData: transporters || [], query: searchTransporter });

  const notFound = !dataFiltered.length && !!searchTransporter;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        Transporters <Typography component="span">({transporters?.length})</Typography>
      </DialogTitle>

      <Box sx={{ px: 3, py: 2.5 }}>
        <TextField
          fullWidth
          value={searchTransporter}
          onChange={handleSearchTransporters}
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
          <SearchNotFound query={searchTransporter} sx={{ mt: 3, mb: 10 }} />
        ) : (
          <Scrollbar sx={{ height: ITEM_HEIGHT * 6, px: 2.5 }}>
            <Box component="ul">
              {dataFiltered.map((transporter) => {
                const isSelected = selectedTransporter?._id === transporter._id;

                return (
                  <Box
                    component="li"
                    key={transporter._id}
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
                      primary={transporter.transportName}
                      secondary={
                        <>
                          {transporter.ownerName} • {transporter.place} • {transporter.cellNo}
                        </>
                      }
                    />

                    <Button
                      size="small"
                      color={isSelected ? 'primary' : 'inherit'}
                      onClick={() => handleSelectTransporter(transporter)}
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
    inputData = inputData.filter((transporter) => {
      const searchQuery = query.toLowerCase();

      // Helper function to safely check if a field exists and contains the query
      const matchesField = (field) => field && field.toLowerCase().indexOf(searchQuery) !== -1;

      return (
        matchesField(transporter.transportName) ||
        matchesField(transporter.ownerName) ||
        matchesField(transporter.place) ||
        matchesField(transporter.cellNo) ||
        matchesField(transporter.gstNo)
      );
    });
  }

  return inputData;
}
