// src/sections/transporter-payment/BulkTransporterPaymentPreview.jsx
import React, { useState } from 'react';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { fDate } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

import TransporterPaymentPreviewCard from './components/transporter-payment-preview-card';

function RenderHeader({ transporterName, index, isSelected, onToggle }) {
  return (
    <Box
      rowGap={3}
      display="grid"
      alignItems="center"
      gridTemplateColumns={{ xs: '1fr', sm: '1fr auto' }}
      mb={1}
    >
      <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
        <Typography variant="h6">
          {index + 1}. {transporterName}
        </Typography>
        <FormControlLabel
          control={<Switch size="medium" checked={isSelected} onChange={onToggle} />}
          label="Include"
        />
      </Stack>
    </Box>
  );
}

export default function BulkTransporterPaymentPreview({ transporterDataList, dateRange }) {
  // track which transporter IDs are “included”
  const [selected, setSelected] = useState(
    transporterDataList.map(({ transporter }) => transporter._id)
  );

  const toggleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]));
  };

  const handleGenerate = async () => {
    const payload = transporterDataList
      .filter(({ transporter }) => selected.includes(transporter._id))
      .map(({ transporter, subtrips }) => {
        const podAmount = (transporter.podCharges || 0) * subtrips.length;
        return {
          transporterId: transporter._id,
          billingPeriod: dateRange,
          associatedSubtrips: subtrips.map((st) => st._id),
          additionalCharges: [{ label: 'POD Charges', amount: podAmount }],
        };
      });

    try {
      const res = await fetch('/api/bulk-transporter-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payments: payload }),
      });
      if (!res.ok) throw new Error('Failed to generate bulk payments');
      const data = await res.json();
      console.log('Success', data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
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
            const isSelected = selected.includes(transporter._id);
            const podAmt = (transporter.podCharges || 0) * subtrips.length;
            const additionalCharges = [{ label: 'POD Charges', amount: podAmt }];

            return (
              <Box key={transporter._id} opacity={isSelected ? 1 : 0.5}>
                <RenderHeader
                  transporterName={transporter.transportName}
                  index={idx}
                  isSelected={isSelected}
                  onToggle={() => toggleSelect(transporter._id)}
                />
                {isSelected && (
                  <TransporterPaymentPreviewCard
                    company={CONFIG.company}
                    transporter={transporter}
                    subtrips={subtrips}
                    additionalCharges={additionalCharges}
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      </Stack>

      {/* action button */}
      <Box textAlign="right" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerate}
          disabled={selected.length === 0}
        >
          Generate Bulk Payments
        </Button>
      </Box>
    </>
  );
}
