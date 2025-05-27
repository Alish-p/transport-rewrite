import React, { useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import { CONFIG } from 'src/config-global';
import { useTripsCompletedByDriverAndDate } from 'src/query/use-subtrip';

import DriverSalaryPreviewCard from './components/driver-salary-preview-card';

export default function DriverSalaryPreview({ driverList }) {
  const draft = useWatch();
  const { data: availableSubtrips = [] } = useTripsCompletedByDriverAndDate(
    draft.driverId,
    draft.billingPeriod?.start,
    draft.billingPeriod?.end
  );

  const previewSubtrips = useMemo(() => {
    if (!draft.associatedSubtrips?.length) return [];
    return availableSubtrips.filter((st) => draft.associatedSubtrips.includes(st._id));
  }, [draft.associatedSubtrips, availableSubtrips]);

  const selectedDriver = useMemo(
    () => driverList.find((d) => d._id === draft.driverId) || null,
    [draft.driverId, driverList]
  );

  if (!draft.driverId || !draft.billingPeriod?.start || previewSubtrips.length === 0) {
    return null;
  }

  return (
    <DriverSalaryPreviewCard
      company={CONFIG.company}
      driver={selectedDriver}
      associatedSubtrips={previewSubtrips}
      additionalPayments={draft.additionalPayments || []}
      additionalDeductions={draft.additionalDeductions || []}
    />
  );
}
