import { useMemo } from 'react';

import { InfoItem, DetailCard } from 'src/components/detail-card';

// ----------------------------------------------------------------------

export function BankDetailsCard({
  bankDetails,
  title = 'Bank Details',
  icon = 'solar:wallet-bold',
  showCopy = true,
  editHref,
  action,
  extraFields,
  children,
  sx,
  ...other
}) {
  const { name, branch, ifsc, place, accNo } = bankDetails || {};

  const fields = useMemo(() => {
    const baseFields = [
      { icon: 'mdi:bank', label: 'Bank Name', value: name, hideIfEmpty: true },
      { icon: 'mdi:source-branch', label: 'Branch', value: branch, hideIfEmpty: true },
      { icon: 'mdi:barcode', label: 'IFSC', value: ifsc, hideIfEmpty: true },
      { icon: 'mdi:map-marker', label: 'Place', value: place, hideIfEmpty: true },
      { icon: 'mdi:numeric', label: 'Account No', value: accNo, hideIfEmpty: true },
    ];

    if (extraFields && extraFields.length > 0) {
      return [...baseFields, ...extraFields.map((f) => ({ ...f, hideIfEmpty: f.hideIfEmpty ?? true }))];
    }

    return baseFields;
  }, [accNo, branch, extraFields, ifsc, name, place]);

  const copyData = useMemo(() => {
    const extraData =
      extraFields?.reduce((acc, f) => {
        if (f?.label && f?.value !== undefined && f?.value !== null) {
          acc[f.label] = typeof f.value === 'object' && f.rawValue !== undefined ? f.rawValue : f.value;
        }
        return acc;
      }, {}) || {};

    return { bankDetails, ...extraData };
  }, [bankDetails, extraFields]);

  return (
    <DetailCard
      title={title}
      icon={icon}
      showCopy={showCopy}
      editHref={editHref}
      action={action}
      fields={fields}
      copyData={copyData}
      sx={sx}
      {...other}
    >
      {children}
    </DetailCard>
  );
}

export const BankInfoRow = (props) => <InfoItem hideIfEmpty {...props} />;

export default BankDetailsCard;
