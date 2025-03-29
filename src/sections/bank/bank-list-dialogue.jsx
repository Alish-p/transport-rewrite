import { FixedSizeList as List } from 'react-window';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { DialogTitle, DialogContent } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 90;

// ----------------------------------------------------------------------

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Row = ({ index, style, data }) => {
  const { banks, selected, onSelect } = data;
  const bank = banks[index];

  return (
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
      style={style}
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
};

export function BankListDialog({
  list,
  open,
  action,
  onClose,
  selected,
  onSelect,
  title = 'Bank List',
}) {
  const [searchBank, setSearchBank] = useState('');
  const debouncedSearch = useDebounce(searchBank, 300);

  const dataFiltered = applyFilter({ inputData: list, query: debouncedSearch });

  const notFound = !dataFiltered.length && !!debouncedSearch;

  const handleSearchBank = useCallback((event) => {
    setSearchBank(event.target.value);
  }, []);

  const handleSelectBank = useCallback(
    (bank) => {
      onSelect(bank);
      setSearchBank('');
      onClose();
    },
    [onClose, onSelect]
  );

  const renderList = (
    <Box sx={{ height: ITEM_HEIGHT * 5, px: 2.5 }}>
      <List
        height={ITEM_HEIGHT * 5}
        itemCount={dataFiltered.length}
        itemSize={ITEM_HEIGHT}
        width="100%"
        itemData={{ banks: dataFiltered, selected, onSelect: handleSelectBank }}
      >
        {Row}
      </List>
    </Box>
  );

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            {title} ({list?.length}){' '}
          </Typography>
          {action && action}
        </Stack>
      </DialogTitle>

      <Box sx={{ px: 3, py: 2.5 }}>
        <TextField
          value={searchBank}
          fullWidth
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
        {notFound ? (
          <SearchNotFound query={debouncedSearch} sx={{ px: 3, pt: 5, pb: 10 }} />
        ) : (
          renderList
        )}
      </DialogContent>
    </Dialog>
  );
}

function applyFilter({ inputData, query }) {
  if (query) {
    return inputData.filter(
      (bank) =>
        bank.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        bank.place.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        `${bank.ifsc}`.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}
