/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';

import { useDebounce } from 'src/hooks/use-debounce';

import { useInfiniteDrivers, useCreateQuickDriver } from 'src/query/use-driver';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingSpinner } from 'src/components/loading-spinner';
import { SearchNotFound } from 'src/components/search-not-found';

const ITEM_HEIGHT = 64;

// Custom hook for debounced search + infinite scroll
function useDriverSearch(searchText, enabled) {
  const debounced = useDebounce(searchText, 500);
  const { ref: loadMoreRef, inView } = useInView({ threshold: 0 });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteDrivers(
    { search: debounced || undefined, rowsPerPage: 50 },
    { enabled }
  );

  const drivers = data ? data.pages.flatMap(page => page.drivers) : [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    drivers,
    isLoading,
    isFetchingNext: isFetchingNextPage,
    hasNextPage,
    loadMoreRef,
  };
}

export function KanbanDriverDialog({
  selectedDriver = null,
  open,
  onClose,
  onDriverChange,
  allowQuickCreate = false,
}) {
  // Search + pagination state
  const [search, setSearch] = useState('');
  const {
    drivers,
    isLoading,
    isFetchingNext,
    hasNextPage,
    loadMoreRef,
  } = useDriverSearch(search, open);

  // Quick-create form state
  const [isQuickMode, setQuickMode] = useState(false);
  const [driverName, setDriverName] = useState('');
  const [driverCellNo, setDriverCellNo] = useState('');
  const [error, setError] = useState('');
  const {
    mutateAsync: createDriver,
    isLoading: isCreating,
  } = useCreateQuickDriver();

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setSearch('');
      setQuickMode(false);
      setDriverName('');
      setDriverCellNo('');
      setError('');
    }
  }, [open]);

  const handleSelectDriver = (driver) => {
    onDriverChange(driver);
    onClose();
  };

  const handleQuickSubmit = async () => {
    setError('');
    if (!driverName.trim()) {
      return setError('Driver Name is required');
    }
    if (!/^\d{10}$/.test(driverCellNo)) {
      return setError('Driver Cell No must be exactly 10 digits');
    }

    try {
      const newDriver = await createDriver({ driverName, driverCellNo });
      onDriverChange(newDriver);
      onClose();
    } catch (e) {
      setError(e.message || 'Failed to create driver. Please try again.');
    }
  };

  // Determine no-results
  const noResults = !drivers.length && search.trim().length > 0 && !isLoading;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        {isQuickMode ? 'Create New Driver' : 'Select Driver'}
      </DialogTitle>

      {!isQuickMode && (
        <Box sx={{ px: 3, py: 2 }}>
          <TextField
            fullWidth
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      <DialogContent sx={{ p: 0 }}>
        {isQuickMode ? (
          <Box sx={{ px: 3, py: 2 }}>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Driver Name"
              value={driverName}
              onChange={e => setDriverName(e.target.value)}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Driver Cell No"
              value={driverCellNo}
              onChange={e => setDriverCellNo(e.target.value)}
              margin="dense"
              InputProps={{ startAdornment: <InputAdornment position="start">+91 - </InputAdornment> }}
            />
          </Box>
        ) : isLoading ? (
          <LoadingSpinner sx={{ height: ITEM_HEIGHT * 6 }} />
        ) : noResults ? (
          <Box sx={{ p: 3 }}>
            <SearchNotFound query={search} />
            {allowQuickCreate && (
              <Button
                fullWidth
                variant="contained"
                onClick={() => setQuickMode(true)}
                startIcon={<Iconify icon="eva:plus-fill" />}
                sx={{ mt: 2 }}
              >
                Create New Driver
              </Button>
            )}
          </Box>
        ) : (
          <Scrollbar sx={{ height: ITEM_HEIGHT * 6, px: 2.5 }}>
            <Box component="ul">
              {drivers.map(driver => (
                <Box
                  component="li"
                  key={driver._id}
                  sx={{ display: 'flex', alignItems: 'center', height: ITEM_HEIGHT, gap: 2 }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2">{driver.driverName}</Typography>
                    <Typography variant="caption">{driver.driverCellNo}</Typography>
                  </Box>
                  <Button
                    size="small"
                    color={selectedDriver?._id === driver._id ? 'primary' : 'inherit'}
                    onClick={() => handleSelectDriver(driver)}
                    startIcon={
                      <Iconify
                        icon={selectedDriver?._id === driver._id ? 'eva:checkmark-fill' : 'mingcute:add-line'}
                        width={16}
                        sx={{ mr: -0.5 }}
                      />
                    }
                  >
                    {selectedDriver?._id === driver._id ? 'Selected' : 'Select'}
                  </Button>
                </Box>
              ))}
              <Box
                ref={loadMoreRef}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: ITEM_HEIGHT }}
              >
                {isFetchingNext && <LoadingSpinner />}
              </Box>
            </Box>
          </Scrollbar>
        )}
      </DialogContent>

      <DialogActions>
        {isQuickMode && (
          <>
            <Button onClick={() => setQuickMode(false)}>Cancel</Button>
            <Button onClick={handleQuickSubmit} disabled={isCreating} variant="contained">
              {isCreating ? 'Creating…' : 'Create'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
