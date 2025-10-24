import dayjs from 'dayjs';
import { useMemo } from 'react';

import { useDieselPriceOnDate } from 'src/query/use-diesel-prices';

import AnalyticsWidgetSummary from '../../subtrip/widgets/summary-widget';

export function PumpDieselPriceWidget({ pumpId }) {
  const today = useMemo(() => dayjs().format(), []);
  const { data: dieselPriceOnDate } = useDieselPriceOnDate({ pump: pumpId, date: today });

  return (
    <AnalyticsWidgetSummary
      title="Live Diesel Price"
      total={dieselPriceOnDate?.price || 0}
      color="info"
      icon="solar:gas-station-bold"
      sx={{ flexGrow: { xs: 0, sm: 1 }, flexBasis: { xs: 'auto', sm: 0 } }}
    />
  );
}

export default PumpDieselPriceWidget;
