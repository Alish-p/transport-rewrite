import { useMemo } from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { DetailCard } from 'src/components/detail-card';

// ----------------------------------------------------------------------

export function TransporterAdditionalWidget({ transporter }) {
  const { gstEnabled, gstNo, panNo, agreementNo, podCharges } = transporter || {};

  const fields = useMemo(
    () => [
      {
        label: 'GST Enabled',
        value:
          gstEnabled !== undefined && gstEnabled !== null ? (
            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
              <Iconify
                icon={gstEnabled ? 'solar:check-circle-bold' : 'solar:close-circle-bold'}
                color={gstEnabled ? 'success.main' : 'error.main'}
                width={18}
              />
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                {gstEnabled ? 'Yes' : 'No'}
              </Typography>
            </Stack>
          ) : (
            '-'
          ),
        rawValue:
          gstEnabled !== undefined && gstEnabled !== null ? (gstEnabled ? 'Yes' : 'No') : undefined,
      },
      { label: 'GST No', value: gstNo },
      { label: 'PAN No', value: panNo },
      { label: 'Agreement No', value: agreementNo },
      { label: 'POD Charges', value: podCharges },
    ],
    [agreementNo, gstEnabled, gstNo, panNo, podCharges]
  );

  return (
    <DetailCard
      title="Additional Details"
      icon="solar:settings-bold"
      fields={fields}
    />
  );
}

export default TransporterAdditionalWidget;
