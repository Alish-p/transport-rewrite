import { useMemo } from 'react';

import { DetailCard } from 'src/components/detail-card';

// ----------------------------------------------------------------------

export function DriverBasicWidget({ driver }) {
  const { driverName, driverLicenceNo, driverCellNo, driverPresentAddress, permanentAddress } =
    driver || {};

  const fields = useMemo(
    () => [
      { label: 'Driver Name', value: driverName },
      { label: 'Licence No', value: driverLicenceNo },
      { label: 'Mobile', value: driverCellNo },
      { label: 'Present Address', value: driverPresentAddress },
      { label: 'Permanent Address', value: permanentAddress },
    ],
    [driverCellNo, driverLicenceNo, driverName, driverPresentAddress, permanentAddress]
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

export default DriverBasicWidget;
