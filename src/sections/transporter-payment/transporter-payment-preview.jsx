import React, { useMemo, useEffect } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';

import { CONFIG } from 'src/config-global';
import { useFetchSubtripsForTransporterBilling } from 'src/query/use-subtrip';

import TransporterPaymentPreviewCard from './components/transporter-payment-preview-card';

export default function TransporterPaymentPreviewContainer({ transporterList }) {
  const { setValue } = useFormContext();
  // 1) grab form state
  const draft = useWatch();

  // 2) fetch filtered subtrips
  const { data: availableSubtrips = [], refetch } = useFetchSubtripsForTransporterBilling(
    draft.transporterId,
    draft.billingPeriod?.start,
    draft.billingPeriod?.end
  );

  // Fetch subtrips whenever transporter or date range changes
  useEffect(() => {
    if (draft.transporterId && draft.billingPeriod?.start && draft.billingPeriod?.end) {
      refetch();
    }
  }, [draft.transporterId, draft.billingPeriod?.start, draft.billingPeriod?.end, refetch]);

  // Auto-select all fetched subtrips if none selected yet
  useEffect(() => {
    if (availableSubtrips.length && draft.associatedSubtrips.length === 0) {
      setValue(
        'associatedSubtrips',
        availableSubtrips.map((st) => st._id),
        { shouldValidate: true }
      );
    }
  }, [availableSubtrips, draft.associatedSubtrips.length, setValue]);

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

  const handleRemoveSubtrip = (id) => {
    const updated = draft.associatedSubtrips.filter((sid) => sid !== id);
    setValue('associatedSubtrips', updated, { shouldValidate: true });
  };

  return (
    <TransporterPaymentPreviewCard
      company={CONFIG.company}
      transporter={selectedTransporter}
      subtrips={previewSubtrips}
      additionalCharges={additionalCharges}
      onRemoveSubtrip={handleRemoveSubtrip}
    />
  );
}
