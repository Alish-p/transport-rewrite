import { useMemo } from 'react';

import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { DetailCard } from 'src/components/detail-card';

// ----------------------------------------------------------------------

export function TransporterBasicWidget({ transporter }) {
  const { transportName, ownerName, transportType, address, state, pinNo, cellNo, emailId } =
    transporter || {};

  const fields = useMemo(
    () => [
      { label: 'Transport Name', value: transportName },
      { label: 'Owner Name', value: ownerName },
      { label: 'Transport Type', value: transportType },
      { label: 'Address', value: address },
      { label: 'State', value: state },
      { label: 'Pin Code', value: pinNo },
      {
        label: 'Mobile',
        value: cellNo ? (
          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
              {cellNo}
            </Typography>
            <IconButton
              size="small"
              color="success"
              onClick={() => window.open(`https://wa.me/${cellNo}`, '_blank')}
              sx={{ p: 0.25 }}
            >
              <Iconify icon="prime:whatsapp" width={16} />
            </IconButton>
          </Stack>
        ) : (
          '-'
        ),
        rawValue: cellNo,
      },
      { label: 'Email', value: emailId },
    ],
    [address, cellNo, emailId, ownerName, pinNo, state, transportName, transportType]
  );

  return (
    <DetailCard
      title="Basic Details"
      icon="solar:user-bold"
      showCopy
      fields={fields}
    />
  );
}

export default TransporterBasicWidget;
