import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { copyToClipboard } from 'src/utils/copy-to-clipboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function BankDetailsCard({
  bankDetails,
  title = 'Bank Details',
  icon = 'solar:wallet-bold',
  showCopy = true,
  editHref,
  action,
  extraFields,
  children,
  sx,
  ...other
}) {
  const { name, branch, ifsc, place, accNo } = bankDetails || {};

  const handleCopy = useCallback(() => {
    const extraData =
      extraFields?.reduce((acc, f) => {
        if (f?.label && f?.value !== undefined && f?.value !== null) {
          acc[f.label] = typeof f.value === 'object' && f.rawValue !== undefined ? f.rawValue : f.value;
        }
        return acc;
      }, {}) || {};

    const text = JSON.stringify({ bankDetails, ...extraData }, null, 2);
    copyToClipboard(text);
    toast.success('Copied to clipboard');
  }, [bankDetails, extraFields]);

  const defaultAction = (
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

  return (
    <Card sx={{ height: 1, ...sx }} {...other}>
      <CardHeader
        title={title}
        avatar={<Iconify icon={icon} color="primary.main" width={24} />}
        action={action !== undefined ? action : defaultAction}
        sx={{
          p: 2.5,
          pb: 1.5,
          '& .MuiCardHeader-avatar': { mr: 1 },
          '& .MuiCardHeader-title': { fontWeight: 'fontWeightBold' },
        }}
      />
      <Stack spacing={1} sx={{ px: 2.5, pb: 2.5, pt: 1 }}>
        <BankInfoRow icon="mdi:bank" label="Bank Name" value={name} />
        <BankInfoRow icon="mdi:source-branch" label="Branch" value={branch} />
        <BankInfoRow icon="mdi:barcode" label="IFSC" value={ifsc} />
        <BankInfoRow icon="mdi:map-marker" label="Place" value={place} />
        <BankInfoRow icon="mdi:numeric" label="Account No" value={accNo} />

        {extraFields?.map((field, idx) => (
          <BankInfoRow
            key={field.key || field.label || idx}
            icon={field.icon}
            label={field.label}
            value={field.value}
          />
        ))}

        {children}
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

export function BankInfoRow({ icon, label, value }) {
  if (value === undefined || value === null || value === '' || value === '-') return null;

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="space-between"
      spacing={1.5}
      sx={{ typography: 'body2', minHeight: 24 }}
    >
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ minWidth: 0, flexShrink: 0 }}>
        {icon && <Iconify icon={icon} width={16} sx={{ color: 'text.disabled', flexShrink: 0 }} />}
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
          {label}
        </Typography>
      </Stack>
      <Box sx={{ textAlign: 'right', minWidth: 0, flex: 1, ml: 1 }}>
        {typeof value === 'string' || typeof value === 'number' ? (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: '0.8125rem',
              color: 'text.primary',
              wordBreak: 'break-word',
            }}
          >
            {value}
          </Typography>
        ) : (
          value
        )}
      </Box>
    </Stack>
  );
}

export default BankDetailsCard;
