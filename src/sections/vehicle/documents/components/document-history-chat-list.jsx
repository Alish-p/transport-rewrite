import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

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

              <Stack spacing={1.5} alignItems="flex-start">
                <FileThumbnail
                  file={h?.fileUrl}
                  tooltip
                  onDownload={() => openDownload(h)}
                  sx={{ width: 56, height: 56 }}
                  slotProps={{ icon: { width: 56, height: 56 } }}
                />

                <Box
                  sx={{
                    bgcolor: 'background.neutral',
                    borderRadius: 2,
                    p: 1.5,
                    width: '100%',
                  }}
                >
                  <Stack spacing={1.25}>
                    {/* Document Type and Number */}
                    {(h?.docType || h?.docNumber) && (
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        {h?.docNumber && (
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {h.docNumber}
                          </Typography>
                        )}
                      </Stack>
                    )}

                    {/* Issuer */}
                    {h?.issuer && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Iconify icon="solar:user-check-bold-duotone" width={16} sx={{ color: 'text.secondary' }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Issued by:
                        </Typography>
                        <Typography variant="caption" fontWeight={500}>
                          {h.issuer}
                        </Typography>
                      </Stack>
                    )}

                    {/* Validity Period */}
                    {(h?.issueDate || h?.expiryDate) && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Iconify icon="solar:calendar-bold-duotone" width={16} sx={{ color: 'text.secondary' }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Valid:
                        </Typography>
                        <Typography variant="caption" fontWeight={500}>
                          {fDateRangeShortLabel(h?.issueDate, h?.expiryDate)}
                        </Typography>
                      </Stack>
                    )}

                    {/* Status Chip */}
                    {status && (
                      <Box sx={{ pt: 0.5 }}>
                        <Label variant="soft" color={getStatusColor(status)}>
                          {status}
                        </Label>

                      </Box>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}