// src/sections/transporter-payment/BulkTransporterPaymentPreview.jsx
import React from 'react';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

import TransporterPaymentPreviewCard from './components/transporter-payment-preview-card';

function RenderHeader({ transporterName, index }) {
  return (
    <Box
      rowGap={3}
      display="grid"
      alignItems="center"
      gridTemplateColumns={{ xs: '1fr', sm: '1fr auto' }}
      mb={1}
    >
      <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }} sx>
        <Typography variant="h6">
          {index + 1}. {transporterName}
        </Typography>
      </Stack>
    </Box>
  );
}

export default function BulkTransporterPaymentPreview({ transporterDataList, dateRange }) {
  return (
    <Stack spacing={3}>
      {/* Page title + period */}
      <Box>
        <Typography variant="h4" gutterBottom>
          Bulk Transporter Payment Preview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Period: {fDate(dateRange.startDate)} – {fDate(dateRange.endDate)}
        </Typography>
      </Box>

      {/* One preview per transporter */}
      <Stack spacing={4}>
        {transporterDataList.map(({ transporter, subtrips }, idx) => {
          // 1) POD charges
          const podAmount = (transporter.podCharges || 0) * subtrips.length;
          const podCharge = { label: 'POD Charges', amount: podAmount };

          const additionalCharges = [podCharge];

          return (
            <Box key={transporter._id}>
              <RenderHeader transporterName={transporter.transportName} index={idx} />
              <TransporterPaymentPreviewCard
                company={CONFIG.company}
                transporter={transporter}
                subtrips={subtrips}
                additionalCharges={additionalCharges}
              />
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}
