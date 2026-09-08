import { useMemo } from 'react';

import Typography from '@mui/material/Typography';

import { DetailCard } from 'src/components/detail-card';

// ----------------------------------------------------------------------

export function UserBankWidget({ user }) {
  const { bankDetails } = user || {};
  const { name, accNo, ifsc, branch, place } = bankDetails || {};

  const hasBankData = Boolean(name || accNo || ifsc || branch || place);

  const fields = useMemo(
    () => [
      {
        icon: 'solar:user-circle-bold',
        label: 'Account Name',
        value: name,
        hideIfEmpty: false,
        fallback: '-',
      },
      {
        icon: 'solar:card-bold',
        label: 'Account No',
        value: accNo,
        hideIfEmpty: false,
        fallback: '-',
      },
      {
        icon: 'solar:code-file-bold',
        label: 'IFSC Code',
        value: ifsc,
        hideIfEmpty: false,
        fallback: '-',
      },
      {
        icon: 'solar:buildings-2-bold',
        label: 'Branch / Place',
        value: branch || place ? [branch, place].filter(Boolean).join(', ') : '-',
      },
    ],
    [accNo, branch, ifsc, name, place]
  );

  return (
    <DetailCard
      title="Bank Details"
      icon="solar:card-2-bold"
      showCopy={hasBankData}
      fields={fields}
    >
      {!hasBankData && (
        <Typography
          variant="caption"
          sx={{ color: 'text.disabled', fontStyle: 'italic', textAlign: 'center', mt: 1 }}
        >
          No bank details provided
        </Typography>
      )}
    </DetailCard>
  );
}

export default UserBankWidget;
