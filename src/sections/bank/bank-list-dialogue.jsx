import { useInView } from 'react-intersection-observer';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemText from '@mui/material/ListItemText';
import { DialogTitle, DialogContent } from '@mui/material';

import { useInfiniteBanks } from 'src/query/use-bank';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingSpinner } from 'src/components/loading-spinner';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 90;

// ----------------------------------------------------------------------

const Row = ({ bank, selected, onSelect }) => {
  const isSelected = selected(`${bank.ifsc}`);
  return (
    <Box
      component="li"
      sx={{
        gap: 2,
        my: 0.5,
        px: 1.5,
        py: 1,
        display: 'flex',
        height: ITEM_HEIGHT,
        alignItems: 'center',
        borderRadius: 1,
        ...(isSelected && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemText
        primaryTypographyProps={{ typography: 'subtitle2', sx: { mb: 0.25 } }}
        secondaryTypographyProps={{ typography: 'caption' }}
        primary={bank.name}
        secondary={
          <Stack spacing={0.25}>
            {bank.branch && (
              <Typography
                variant="caption"
                sx={{ color: 'primary.main' }}
              >{`${bank.branch} , ${bank.place}`}</Typography>
            )}
            {bank.ifsc && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {bank.ifsc}
              </Typography>
            )}
          </Stack>
        }
      />
      <Button
        size="small"
        color={isSelected ? 'primary' : 'inherit'}
        onClick={() => onSelect(bank)}
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
};

export function BankListDialog({ selected, open, action, onClose, onSelect, title = 'Bank List' }) {
  const scrollRef = useRef(null);
  const [searchBank, setSearchBank] = useState('');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching } =
    useInfiniteBanks({ search: searchBank || undefined, rowsPerPage: 50 }, { enabled: open });

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
            {title} <Typography component="span">({data?.pages?.[0]?.total || 0})</Typography>
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
                sx={{
                  height: ITEM_HEIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
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
