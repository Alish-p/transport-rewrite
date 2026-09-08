import { useMemo } from 'react';

import { BankDetailsCard } from 'src/components/bank';

// ----------------------------------------------------------------------

export function TransporterFinanceWidget({ transporter }) {
  const { bankDetails, paymentMode, tdsPercentage } = transporter || {};

  const extraFields = useMemo(
    () => [
      {
        icon: 'solar:wallet-money-bold',
        label: 'Payment Mode',
        value: paymentMode,
      },
      {
        icon: 'mdi:percent',
        label: 'TDS %',
        value:
          tdsPercentage !== undefined && tdsPercentage !== null && tdsPercentage !== ''
            ? `${tdsPercentage}%`
            : null,
        rawValue: tdsPercentage,
      },
    ],
    [paymentMode, tdsPercentage]
  );

  return (
    <BankDetailsCard
      title="Finance Details"
      bankDetails={bankDetails}
      extraFields={extraFields}
    />
  );
}

export default TransporterFinanceWidget;
