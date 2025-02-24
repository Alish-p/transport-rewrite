import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

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

  const dataFiltered = applyFilter({ inputData: list, query: searchBank });

  const notFound = !dataFiltered.length && !!searchBank;

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
    <Scrollbar sx={{ p: 0.5, maxHeight: 480 }}>
      {dataFiltered.map((bank) => (
        <ButtonBase
          key={bank.id}
          onClick={() => handleSelectBank(bank)}
          sx={{
            py: 1,
            my: 0.5,
            px: 1.5,
            gap: 0.5,
            width: 1,
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
      ))}
    </Scrollbar>
  );

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 3, pr: 1.5 }}
      >
        <Typography variant="h6"> {title} </Typography>

        {action && action}
      </Stack>

      <Stack sx={{ p: 2, pt: 0 }}>
        <TextField
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
      </Stack>

      {notFound ? <SearchNotFound query={searchBank} sx={{ px: 3, pt: 5, pb: 10 }} /> : renderList}
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
