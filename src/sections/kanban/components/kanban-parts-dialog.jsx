import { useMemo, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { useDebounce } from 'src/hooks/use-debounce';

import { useInfiniteParts } from 'src/query/use-part';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingSpinner } from 'src/components/loading-spinner';
import { SearchNotFound } from 'src/components/search-not-found';

const ITEM_HEIGHT = 64;

export function KanbanPartsDialog({ selectedPart = null, open, onClose, onPartChange }) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteParts(
    { search: debouncedSearch || undefined, rowsPerPage: 50 },
    { enabled: open }
  );

  const parts = useMemo(() => data?.pages.flatMap((p) => p.parts || p.results || []) || [], [data]);
  const total = data?.pages?.[0]?.total || 0;

  const { ref: loadMoreRef, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  const handleSelectPart = (part) => {
    onPartChange(part);
    onClose();
  };

  const notFound = !parts.length && !!debouncedSearch && !isLoading;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        Parts{' '}
        <Typography component="span" sx={{ color: 'text.secondary' }}>
          ({total})
        </Typography>
      </DialogTitle>

      <Box sx={{ px: 3, py: 2.5 }}>
        <TextField
          fullWidth
          placeholder="Search by part name or number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
          <LoadingSpinner sx={{ height: ITEM_HEIGHT * 6 }} />
        ) : notFound ? (
          <SearchNotFound query={debouncedSearch} sx={{ mt: 3, mb: 10 }} />
        ) : (
          <Scrollbar sx={{ height: ITEM_HEIGHT * 6, px: 2.5, py: 1 }}>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              {parts.map((part) => {
                const isSelected = selectedPart?._id === part._id;
                const category =
                  part.category?.name || part.category || part.partCategory?.name || 'Uncategorized';
                const quantity = part.quantity ?? part.availableQuantity ?? part.stock ?? 0;
                const unit =
                  part.unit ||
                  part.uom ||
                  part.unitName ||
                  part.unitOfMeasure ||
                  part.measurementUnit ||
                  '';
                return (
                  <Box
                    component="li"
                    key={part._id}
                    onClick={() => handleSelectPart(part)}
                    sx={{
                      cursor: 'pointer',
                      mb: 1,
                      borderRadius: 1.5,
                      px: 2,
                      py: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      bgcolor: isSelected ? 'action.selected' : 'transparent',
                      transition: (theme) => theme.transitions.create(['background-color'], { duration: theme.transitions.duration.shorter }),
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1,
                          bgcolor: 'background.neutral',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'text.secondary',
                          flexShrink: 0,
                        }}
                      >
                        <Iconify icon="mdi:cube-outline" width={20} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                          {part.name || 'Unnamed Part'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {category}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      {unit ? `${quantity} ${unit}` : quantity}
                    </Typography>
                  </Box>
                );
              })}
              <Box
                ref={loadMoreRef}
                sx={{
                  height: ITEM_HEIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isFetchingNextPage && <LoadingSpinner />}
              </Box>
            </Box>
          </Scrollbar>
        )}
      </DialogContent>
    </Dialog>
  );
}
