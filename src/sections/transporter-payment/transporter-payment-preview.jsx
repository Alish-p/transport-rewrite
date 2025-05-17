import React, { useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import { CONFIG } from 'src/config-global';
import { useFetchSubtripsForTransporterBilling } from 'src/query/use-subtrip';

import TransporterPaymentPreviewCard from './components/transporter-payment-preview-card';

export default function TransporterPaymentPreviewContainer({ transporterList }) {
  // 1) grab form state
  const draft = useWatch();

  // 2) fetch filtered subtrips
  const { data: availableSubtrips = [] } = useFetchSubtripsForTransporterBilling(
    draft.transporterId,
    draft.billingPeriod?.start,
    draft.billingPeriod?.end
  );

  // 3) pick only associated subtrips
  const previewSubtrips = useMemo(() => {
    if (!draft.associatedSubtrips?.length) return [];
    return availableSubtrips.filter((st) => draft.associatedSubtrips.includes(st._id));
  }, [draft.associatedSubtrips, availableSubtrips]);

  // 4) find selected transporter
  const selectedTransporter = useMemo(
    () => transporterList.find((t) => t._id === draft.transporterId) || null,
    [draft.transporterId, transporterList]
  );

  // 5) build extra charges
  const additionalCharges = draft.additionalCharges ?? [
    {
      label: 'POD Charges',
      amount: previewSubtrips.length * (selectedTransporter?.podCharges || 0),
    },
  ];

  // nothing to render until we have all bits
  if (!draft.transporterId || !draft.billingPeriod?.start || previewSubtrips.length === 0) {
    return null;
  }

  return (
    <TransporterPaymentPreviewCard
      company={CONFIG.company}
      transporter={selectedTransporter}
      subtrips={previewSubtrips}
      additionalCharges={additionalCharges}
    />
  );
}
