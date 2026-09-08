import { useMemo } from 'react';

import { BankDetailsCard } from 'src/components/bank';

// ----------------------------------------------------------------------

export function CustomerFinanceWidget({ customer }) {
  const { bankDetails, gstEnabled, GSTNo, PANNo } = customer || {};

  const extraFields = useMemo(
    () => [
      {
        icon: 'solar:shield-check-bold',
        label: 'GST Enabled',
        value: gstEnabled ? 'Yes' : 'No',
        rawValue: gstEnabled,
      },
      {
        icon: 'mdi:file-document-outline',
        label: 'GST No',
        value: GSTNo,
      },
      {
        icon: 'mdi:card-account-details-outline',
        label: 'PAN No',
        value: PANNo,
      },
    ],
    [GSTNo, PANNo, gstEnabled]
  );

  return (
    <BankDetailsCard
      title="Finance Details"
      bankDetails={bankDetails}
      extraFields={extraFields}
    />
  );
}

export default CustomerFinanceWidget;
