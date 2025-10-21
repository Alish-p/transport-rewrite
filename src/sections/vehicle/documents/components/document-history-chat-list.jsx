import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import axios from 'src/utils/axios';
import { fToNow, fDateRangeShortLabel } from 'src/utils/format-time';

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

  return (
    <Stack component="ul" spacing={2.5} sx={{ listStyle: 'none', px: 0, m: 0 }}>
      {items.map((h) => {
        const status = getExpiryStatus(h?.expiryDate);
        const author = h?.createdBy?.name || 'User';

        return (
          <Stack spacing={0.5} flexGrow={1} minWidth={0} mb={2} key={h._id} component="li">
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>

              </Stack>
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {h?.createdAt ? `${fToNow(h?.createdAt)} ago by ${author}` : ''}
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
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Doc#</Typography>
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
        );
      })}
    </Stack>
  );
}
