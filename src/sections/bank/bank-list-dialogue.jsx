import { useInView } from 'react-intersection-observer';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { DialogTitle, DialogContent } from '@mui/material';

import { useInfiniteBanks } from 'src/query/use-bank';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingSpinner } from 'src/components/loading-spinner';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 90;

// ----------------------------------------------------------------------

const Row = ({ bank, selected, onSelect }) => (
  <ButtonBase
    onClick={() => onSelect(bank)}
    sx={{
      py: 1,
      my: 0.5,
      px: 1.5,
      gap: 0.5,
      width: '100%',
      borderRadius: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      ...(selected(`${bank.ifsc}`) && {
        bgcolor: 'action.selected',
      }),
    }}
  >
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography variant="subtitle2">{bank.name}</Typography>
    </Stack>

    {bank.branch && (
      <Box
        sx={{ color: 'primary.main', typography: 'caption' }}
      >{`${bank.branch} , ${bank.place}`}</Box>
    )}

    {bank.ifsc && (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {bank.ifsc}
      </Typography>
    )}
  </ButtonBase>
);

export function BankListDialog({
  selected,
  open,
  action,
  onClose,
  onSelect,
  title = 'Bank List',
}) {
  const scrollRef = useRef(null);
  const [searchBank, setSearchBank] = useState('');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteBanks(
    { search: searchBank || undefined, rowsPerPage: 50 },
    { enabled: open }
  );

  const banks = data ? data.pages.flatMap((p) => p.banks) : [];

  const handleSearchBank = useCallback((event) => {
    setSearchBank(event.target.value);
  }, []);

  const handleSelectBank = useCallback(
    (bank) => {
      onSelect(bank);
      onClose();
    },
    [onSelect, onClose]
  );

  const { ref: loadMoreRef, inView } = useInView({ root: scrollRef.current });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const notFound = !banks.length && !!searchBank && !isLoading;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            {title}{' '}
            <Typography component="span">({data?.pages?.[0]?.total || 0})</Typography>
          </Typography>
          {action && action}
        </Stack>
      </DialogTitle>

      <Box sx={{ px: 3, py: 2.5 }}>
        <TextField
          fullWidth
          value={searchBank}
          onChange={handleSearchBank}
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
          <LoadingSpinner sx={{ height: ITEM_HEIGHT * 5 }} />
        ) : notFound ? (
          <SearchNotFound query={searchBank} sx={{ mt: 3, mb: 10 }} />
        ) : (
          <Scrollbar ref={scrollRef} sx={{ height: ITEM_HEIGHT * 5, px: 2.5 }}>
            <Box component="ul">
              {banks.map((bank) => (
                <Row
                  key={bank.ifsc || bank._id}
                  bank={bank}
                  selected={selected}
                  onSelect={handleSelectBank}
                />
              ))}
              <Box
                ref={loadMoreRef}
                sx={{ height: ITEM_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {isFetching && <LoadingSpinner />}
              </Box>
            </Box>
          </Scrollbar>
        )}
      </DialogContent>
    </Dialog>
  );
}
