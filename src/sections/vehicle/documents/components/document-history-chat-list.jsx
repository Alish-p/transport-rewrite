import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';

import axios from 'src/utils/axios';
import { fToNow, fDateRangeShortLabel } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { FileThumbnail } from 'src/components/file-thumbnail';

import { getExpiryStatus } from '../../utils/document-utils';

export function DocumentHistoryChatList({ vehicleId, items = [] }) {
  const openDownload = async (doc) => {
    try {
      const { data } = await axios.get(`/api/documents/${vehicleId}/${doc._id}/download`);
      const url = data?.url || doc?.fileUrl;
      if (url) window.open(url, '_blank');
    } catch (e) {
      // silent
    }
  };

  const initialFrom = (name) => {
    const n = (name || '').trim();
    if (!n) return 'D';
    const parts = n.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || 'D';
    return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
  };

  const getStatusColor = (status) => {
    if (!status) return 'default';
    const s = status.toLowerCase();
    if (s.includes('expired')) return 'error';
    if (s.includes('expiring') || s.includes('soon')) return 'warning';
    if (s.includes('valid') || s.includes('active')) return 'success';
    return 'default';
  };

  return (
    <Stack component="ul" spacing={2.5} sx={{ listStyle: 'none', px: 0, m: 0 }}>
      {items.map((h) => {
        const status = getExpiryStatus(h?.expiryDate);
        const author = h?.createdBy?.name || 'User';

        return (
          <Stack component="li" key={h._id} direction="row" spacing={2} alignItems="flex-start">
            <Avatar alt={author} src={h?.createdBy?.avatarUrl} sx={{ width: 32, height: 32 }}>
              {initialFrom(author)}
            </Avatar>

            <Stack spacing={1.5} flexGrow={1} minWidth={0}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle2" noWrap>
                  {author}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  {h?.createdAt ? `${fToNow(h?.createdAt)} ago` : ''}
                </Typography>
              </Stack>


              <Box
                sx={{
                  bgcolor: 'background.neutral',
                  borderRadius: 2,
                  p: 1.5,
                  width: '100%',
                }}
              >
                <TableContainer component={Box} sx={{ bgcolor: 'transparent' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: 80 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>File</Typography>
                        </TableCell>
                        <TableCell sx={{ width: 140 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Doc Number</Typography>
                        </TableCell>
                        <TableCell sx={{ width: 180 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Validity</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Issuer</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <FileThumbnail
                            file={h?.fileUrl}
                            tooltip
                            onDownload={() => openDownload(h)}
                            sx={{ width: 36, height: 36 }}
                            slotProps={{ icon: { width: 36, height: 36 } }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {h?.docNumber || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {(h?.issueDate || h?.expiryDate)
                              ? fDateRangeShortLabel(h?.issueDate, h?.expiryDate)
                              : '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {h?.issuer || '-'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}
