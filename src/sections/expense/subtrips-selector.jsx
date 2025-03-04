import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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

function SubtripSelector({ subtrips, currentSubtrip, onChangeSubtrip }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleSelectSubtrip = useCallback(
    (subtrip) => {
      onChangeSubtrip(subtrip);
      handleClose();
    },
    [onChangeSubtrip]
  );

  const dataFiltered = applyFilter({ inputData: subtrips || [], query: searchQuery });
  const notFound = !dataFiltered.length && !!searchQuery;

  const renderSubtripInfo = (subtrip) => {
    if (!subtrip?._id) return 'Please select a subtrip';

    const parts = [];
    if (subtrip.tripId?.vehicleId?.vehicleNo) {
      parts.push(`Subtrip ID: ${subtrip._id}`);
    }
    // if (subtrip.loadingPoint && subtrip.unloadingPoint) {
    //   parts.push(`${subtrip.loadingPoint} → ${subtrip.unloadingPoint}`);
    // }
    // if (subtrip.tripId?.driverId?.driverName) {
    //   parts.push(`Driver: ${subtrip.tripId.driverId.driverName}`);
    // }
    // if (subtrip.tripId?.vehicleId?.vehicleNo) {
    //   parts.push(`Vehicle: ${subtrip.tripId.vehicleId.vehicleNo}`);
    // }

    return parts.join(' | ');
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: 'text.primary' }}>
          Subtrip
        </Typography>
      </Box>

      <Card sx={{ p: 3, mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="primary" sx={{ flex: 1 }}>
            {renderSubtripInfo(currentSubtrip)}
          </Typography>

          <Button
            variant="outlined"
            startIcon={
              <Iconify icon={currentSubtrip?._id ? 'eva:edit-fill' : 'mingcute:add-line'} />
            }
            onClick={handleOpen}
          >
            {currentSubtrip?._id ? 'Change' : 'Select Subtrip'}
          </Button>
        </Box>
      </Card>

      <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle sx={{ pb: 0 }}>
          Select Subtrip <Typography component="span">({subtrips?.length})</Typography>
        </DialogTitle>

        <Box sx={{ px: 3, py: 2.5 }}>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search subtrips..."
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
              <Box component="ul" sx={{ py: 1 }}>
                {dataFiltered.map((subtrip) => {
                  const isSelected = currentSubtrip?._id === subtrip._id;

                  return (
                    <Box
                      component="li"
                      key={subtrip._id}
                      sx={{
                        p: 1,
                        gap: 2,
                        display: 'flex',
                        alignItems: 'flex-start',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                      onClick={() => handleSelectSubtrip(subtrip)}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                            <Box component="span" sx={{ color: 'info.main', fontWeight: 'bold' }}>
                              {subtrip._id}
                            </Box>
                          </Typography>
                        }
                        secondary={
                          <Box
                            component="span"
                            sx={{ color: 'text.secondary', typography: 'caption' }}
                          >
                            {(subtrip.loadingPoint || subtrip.unloadingPoint) && (
                              <Box component="span" sx={{ display: 'block' }}>
                                {subtrip.loadingPoint} → {subtrip.unloadingPoint}
                              </Box>
                            )}
                            {subtrip.tripId?.driverId?.driverName && (
                              <Box component="span">
                                Vehicle:{' '}
                                <Box component="span" sx={{ color: 'info.light' }}>
                                  {subtrip.tripId.vehicleId.vehicleNo}
                                </Box>
                              </Box>
                            )}
                            {subtrip.tripId?.driverId?.driverName && (
                              <Box component="span" sx={{ display: 'block' }}>
                                Driver:{' '}
                                <Box component="span" sx={{ color: 'info.light' }}>
                                  {subtrip.tripId.driverId.driverName}
                                </Box>
                              </Box>
                            )}
                          </Box>
                        }
                      />

                      <Button
                        size="small"
                        color={isSelected ? 'primary' : 'inherit'}
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
    </>
  );
}

function applyFilter({ inputData, query }) {
  if (query) {
    return inputData.filter((subtrip) => {
      const searchText = [
        subtrip._id,
        subtrip.tripId?.vehicleId?.vehicleNo,
        subtrip.routeCd?.routeName,
        subtrip.loadingPoint,
        subtrip.unloadingPoint,
        subtrip.tripId?.driverId?.driverName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchText.indexOf(query.toLowerCase()) !== -1;
    });
  }
  return inputData;
}

export default SubtripSelector;
