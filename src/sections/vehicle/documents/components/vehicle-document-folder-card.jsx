import { memo } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';

import { getStatusMeta } from 'src/sections/vehicle/utils/document-utils';

/**
 * Builds a user-friendly tooltip description of document health and counts.
 */
const getTooltipTitle = (docStatus) => {
  if (!docStatus) return 'Vehicle Documents';
  const { status, expiredCount, expiringCount, missingCount, validCount } = docStatus;

  if (status === 'Expired') {
    return `Expired: ${expiredCount} document${expiredCount > 1 ? 's' : ''} expired${
      expiringCount ? `, ${expiringCount} expiring` : ''
    }`;
  }
  if (status === 'Expiring') {
    return `Expiring: ${expiringCount} document${
      expiringCount > 1 ? 's' : ''
    } expiring within 15 days`;
  }
  if (status === 'Missing') {
    return `Missing: ${missingCount} required document${missingCount > 1 ? 's' : ''} missing`;
  }
  if (status === 'Valid') {
    return `All valid: ${validCount} active document${validCount > 1 ? 's' : ''}`;
  }
  return status;
};

export const VehicleFolderCard = memo(({ vehicle, onOpen }) => {
  const docStatus = vehicle?.documentStatus;
  const statusMeta = docStatus?.status ? getStatusMeta(docStatus.status) : null;
  const tooltipText = getTooltipTitle(docStatus);

  return (
    <Paper
      variant="outlined"
      onClick={() => onOpen(vehicle)}
      sx={(theme) => ({
        gap: 1,
        p: 2.5,
        maxWidth: 222,
        display: 'flex',
        borderRadius: 2,
        cursor: 'pointer',
        position: 'relative',
        bgcolor: 'transparent',
        flexDirection: 'column',
        alignItems: 'flex-start',
        boxShadow: 'none',
        transition: theme.transitions.create(['background-color', 'box-shadow'], {
          duration: theme.transitions.duration.shorter,
        }),
        '&:hover': {
          bgcolor: 'background.paper',
          boxShadow: theme.customShadows.z20,
        },
      })}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: 1 }}>
        <Box sx={{ width: 36, height: 36 }}>
          <Box
            component="img"
            src={`${CONFIG.site.basePath}/assets/icons/files/ic-folder.svg`}
            sx={{ width: 1, height: 1 }}
          />
        </Box>
        {statusMeta && (
          <Tooltip title={tooltipText} arrow placement="top">
            <Box sx={{ display: 'inline-flex', p: 0.5 }}>
              <Iconify
                icon={statusMeta.icon}
                sx={{
                  width: 20,
                  height: 20,
                  color: statusMeta.color === 'default' ? 'text.secondary' : `${statusMeta.color}.main`,
                }}
              />
            </Box>
          </Tooltip>
        )}
      </Stack>
      <Box sx={{ flexGrow: 1, width: 1 }}>
        <Typography variant="subtitle1" noWrap>
          {vehicle?.vehicleNo || 'Vehicle'}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {vehicle?.vehicleType || '-'}
        </Typography>
      </Box>
    </Paper>
  );
});

