import { useMemo } from 'react';

import { DetailCard } from 'src/components/detail-card';

import { CUSTOMER_TYPE_LABELS } from '../customer.constant';

// ----------------------------------------------------------------------

export function CustomerBasicWidget({ customer }) {
  const { customerName, customerType, address, state, pinCode, cellNo } = customer || {};

  const fields = useMemo(
    () => [
      { label: 'Customer Name', value: customerName },
      { label: 'Customer Type', value: CUSTOMER_TYPE_LABELS[customerType] || '-' },
      { label: 'Address', value: address },
      { label: 'State', value: state },
      { label: 'Pin Code', value: pinCode },
      { label: 'Mobile', value: cellNo },
    ],
    [address, cellNo, customerName, customerType, pinCode, state]
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
