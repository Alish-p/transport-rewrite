import { useMemo } from 'react';

import { fDate } from 'src/utils/format-time';

import { DetailCard } from 'src/components/detail-card';

// ----------------------------------------------------------------------

export function DriverAdditionalWidget({ driver }) {
  const { licenseFrom, licenseTo, experience, dob, aadharNo, guarantorName, guarantorCellNo } =
    driver || {};

  const fields = useMemo(
    () => [
      { label: 'License From', value: fDate(licenseFrom) },
      { label: 'License To', value: fDate(licenseTo) },
      { label: 'Experience', value: experience },
      { label: 'Date of Birth', value: fDate(dob) },
      { label: 'Aadhar No', value: aadharNo },
      { label: 'Guarantor Name', value: guarantorName },
      { label: 'Guarantor Cell No', value: guarantorCellNo },
    ],
    [aadharNo, dob, experience, guarantorCellNo, guarantorName, licenseFrom, licenseTo]
  );

  return (
    <DetailCard
      title="Additional Details"
      icon="solar:settings-bold"
      fields={fields}
    />
  );
}

export default DriverAdditionalWidget;
