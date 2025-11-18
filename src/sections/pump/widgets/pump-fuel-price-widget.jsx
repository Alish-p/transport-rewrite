import dayjs from 'dayjs';
import { useMemo } from 'react';

import Stack from '@mui/material/Stack';

import { useCurrentFuelPrice } from 'src/query/use-fuel-prices';

import AnalyticsWidgetSummary from '../../subtrip/widgets/summary-widget';

export function PumpDieselPriceWidget({ pumpId }) {
  const today = useMemo(() => dayjs().format(), []);

  const { data: dieselPriceOnDate } = useCurrentFuelPrice({
    pumpId,
    fuelType: 'Diesel',
    date: today,
  });

  const { data: petrolPriceOnDate } = useCurrentFuelPrice({
    pumpId,
    fuelType: 'Petrol',
    date: today,
  });

  const { data: cngPriceOnDate } = useCurrentFuelPrice({
    pumpId,
    fuelType: 'CNG',
    date: today,
  });

  return (
    <Stack spacing={2}>
      <AnalyticsWidgetSummary
        title="Live Diesel Price"
        total={dieselPriceOnDate?.price || 0}
        color="info"
        icon="solar:gas-station-bold"
      />

      <AnalyticsWidgetSummary
        title="Live Petrol Price"
        total={petrolPriceOnDate?.price || 0}
        color="success"
        icon="solar:gas-station-bold"
      />

      <AnalyticsWidgetSummary
        title="Live CNG Price"
        total={cngPriceOnDate?.price || 0}
        color="warning"
        icon="solar:gas-station-bold"
      />
    </Stack>
  );
}

export default PumpDieselPriceWidget;
