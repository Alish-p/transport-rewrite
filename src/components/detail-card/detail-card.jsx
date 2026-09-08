import { useMemo, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from 'src/routes/components';

import { copyToClipboard } from 'src/utils/copy-to-clipboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { InfoItem } from './info-item';

// ----------------------------------------------------------------------

export function DetailCard({
  title,
  icon,
  avatar,
  showCopy = false,
  editHref,
  action,
  fields = [],
  copyData,
  children,
  sx,
  headerSx,
  bodySx,
  ...other
}) {
  const handleCopy = useCallback(() => {
    let dataToCopy = copyData;

    if (!dataToCopy) {
      dataToCopy = fields.reduce((acc, f) => {
        if (!f || f.hide) return acc;
        if (f.label && f.value !== undefined && f.value !== null) {
          const val = f.rawValue !== undefined ? f.rawValue : f.value;
          if (typeof val !== 'object' || val === null) {
            acc[f.label] = val;
          }
        }
        return acc;
      }, {});
    } else if (typeof dataToCopy === 'function') {
      dataToCopy = dataToCopy();
    }

    const text = typeof dataToCopy === 'string' ? dataToCopy : JSON.stringify(dataToCopy, null, 2);
    copyToClipboard(text);
    toast.success('Copied to clipboard');
  }, [copyData, fields]);

  const defaultAction = useMemo(() => {
    if (!showCopy && !editHref) return null;

    return (
      <Stack direction="row" spacing={0.5}>
        {showCopy && (
          <Tooltip title="Copy">
            <IconButton onClick={handleCopy}>
              <Iconify icon="solar:copy-bold" />
            </IconButton>
          </Tooltip>
        )}
        {editHref && (
          <Tooltip title="Edit">
            <IconButton component={RouterLink} href={editHref}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    );
  }, [editHref, handleCopy, showCopy]);

  const cardAvatar = useMemo(() => {
    if (avatar !== undefined) return avatar;
    if (icon) {
      return <Iconify icon={icon} color="primary.main" width={24} />;
    }
    return null;
  }, [avatar, icon]);

  return (
    <Card sx={{ height: 1, ...sx }} {...other}>
      <CardHeader
        title={title}
        avatar={cardAvatar}
        action={action !== undefined ? action : defaultAction}
        sx={{
          p: 2.5,
          pb: 1.5,
          '& .MuiCardHeader-avatar': { mr: 1 },
          '& .MuiCardHeader-title': { fontWeight: 'fontWeightBold' },
          ...headerSx,
        }}
      />
      <Stack spacing={1} sx={{ px: 2.5, pb: 2.5, pt: 1, ...bodySx }}>
        {fields.map((field, idx) => {
          if (!field || field.hide) return null;
          return (
            <InfoItem
              key={field.key || field.label || idx}
              icon={field.icon}
              label={field.label}
              value={field.value}
              hideIfEmpty={field.hideIfEmpty}
              fallback={field.fallback}
              sx={field.sx}
            />
          );
        })}
        {children}
      </Stack>
    </Card>
  );
}

export default DetailCard;
