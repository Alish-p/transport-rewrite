import { useMemo } from 'react';

import { DetailCard } from 'src/components/detail-card';

// ----------------------------------------------------------------------

export function CustomerBasicWidget({ customer }) {
  const { customerName, address, state, pinCode, cellNo } = customer || {};

  const fields = useMemo(
    () => [
      { label: 'Customer Name', value: customerName },
      { label: 'Address', value: address },
      { label: 'State', value: state },
      { label: 'Pin Code', value: pinCode },
      { label: 'Mobile', value: cellNo },
    ],
    [address, cellNo, customerName, pinCode, state]
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

export default CustomerBasicWidget;
