import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { BankDetailsCard } from 'src/components/bank';

// ----------------------------------------------------------------------

export function TransporterFinanceWidget({ transporter }) {
  const { _id, bankDetails, paymentMode, tdsPercentage } = transporter || {};

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
      editHref={_id ? paths.dashboard.transporter.edit(_id) : undefined}
    />
  );
}

export default TransporterFinanceWidget;
