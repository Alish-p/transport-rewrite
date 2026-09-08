import { useMemo } from 'react';

import Chip from '@mui/material/Chip';

import { DetailCard } from 'src/components/detail-card';

// ----------------------------------------------------------------------

export function UserBasicWidget({ user }) {
  const { name, email, mobile, designation, address, role } = user || {};

  const fields = useMemo(
    () => [
      {
        icon: 'solar:user-bold',
        label: 'Full Name',
        value: name,
      },
      {
        icon: 'solar:letter-bold',
        label: 'Email',
        value: email,
      },
      {
        icon: 'solar:phone-bold',
        label: 'Mobile',
        value: mobile,
      },
      {
        icon: 'solar:badge-bold',
        label: 'Designation',
        value: designation,
      },
      {
        icon: 'solar:map-point-bold',
        label: 'Address',
        value: address,
      },
      {
        icon: 'solar:shield-user-bold',
        label: 'Platform Role',
        value: (
          <Chip
            size="small"
            variant="soft"
            color={role === 'super' ? 'secondary' : 'default'}
            label={role === 'super' ? 'Platform Superadmin' : 'Standard User'}
            sx={{ fontWeight: 600 }}
          />
        ),
        rawValue: role === 'super' ? 'Platform Superadmin' : 'Standard User',
      },
    ],
    [address, designation, email, mobile, name, role]
  );

  return (
    <DetailCard
      title="Basic Details"
      icon="solar:user-id-bold"
      showCopy
      fields={fields}
    />
  );
}

export default UserBasicWidget;
