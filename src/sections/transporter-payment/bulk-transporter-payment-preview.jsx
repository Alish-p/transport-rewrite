// src/sections/transporter-payment/BulkTransporterPaymentPreview.jsx
import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Grid, Card, Stack, CardContent } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';
import { useCreateBulkTransporterPayment } from 'src/query/use-transporter-payment';

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
  const createBulkTransporterPayment = useCreateBulkTransporterPayment();

  // track which transporter IDs are “included”
  const [selected, setSelected] = useState(
    transporterDataList.map(({ transporter }) => transporter._id)
  );

  const toggleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]));
  };

  // prepare summary data
  const selectedData = transporterDataList.filter(({ transporter }) =>
    selected.includes(transporter._id)
  );
  const totalTransporters = selectedData.length;
  const totalSubtrips = selectedData.reduce((sum, { subtrips }) => sum + subtrips.length, 0);
  const totalPODCharges = selectedData.reduce(
    (sum, { transporter, subtrips }) => sum + (transporter.podCharges || 0) * subtrips.length,
    0
  );

  const handleGenerate = async () => {
    const payload = selectedData.map(({ transporter, subtrips }) => {
      const podAmount = (transporter.podCharges || 0) * subtrips.length;
      return {
        transporterId: transporter._id,
        billingPeriod: dateRange,
        associatedSubtrips: subtrips.map((st) => st._id),
        additionalCharges: [{ label: 'POD Charges', amount: podAmount }],
      };
    });

    try {
      createBulkTransporterPayment(payload);
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
            Period: {fDate(dateRange.start)} – {fDate(dateRange.end)}
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

      {/* Summary */}
      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle2">Transporters</Typography>
                <Typography variant="h5">{totalTransporters}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2">Subtrips</Typography>
                <Typography variant="h5">{totalSubtrips}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2">Total POD Charges</Typography>
                <Typography variant="h5">
                  {CONFIG.currencySymbol}
                  {totalPODCharges.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

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
