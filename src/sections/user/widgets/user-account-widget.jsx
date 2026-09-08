import dayjs from 'dayjs';
import { useMemo } from 'react';

import Tooltip from '@mui/material/Tooltip';

import { fToNow, fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { DetailCard } from 'src/components/detail-card';

// ----------------------------------------------------------------------

export function UserAccountWidget({ user }) {
  const { status = 'active', lastSeen, createdAt, updatedAt } = user || {};

  const lastSeenDetails = useMemo(() => {
    if (!lastSeen) {
      return {
        text: 'Never',
        color: 'error',
        fullDate: null,
      };
    }
    const diffInDays = dayjs().diff(dayjs(lastSeen), 'day');
    const color = diffInDays < 30 ? 'success' : 'warning';
    return {
      text: `${fToNow(lastSeen)} ago`,
      color,
      fullDate: fDateTime(lastSeen),
    };
  }, [lastSeen]);

  const fields = useMemo(
    () => [
      {
        icon: 'solar:check-circle-bold',
        label: 'Account Status',
        value: (
          <Label
            variant="soft"
            color={
              (status === 'active' && 'success') ||
              (status === 'pending' && 'warning') ||
              (status === 'banned' && 'error') ||
              'default'
            }
          >
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Active'}
          </Label>
        ),
        rawValue: status || 'active',
      },
      {
        icon: 'solar:clock-circle-bold',
        label: 'Last Seen',
        value: lastSeenDetails.fullDate ? (
          <Tooltip title={lastSeenDetails.fullDate} arrow placement="top">
            <Label variant="soft" color={lastSeenDetails.color}>
              {lastSeenDetails.text}
            </Label>
          </Tooltip>
        ) : (
          <Label variant="soft" color={lastSeenDetails.color}>
            {lastSeenDetails.text}
          </Label>
        ),
        rawValue: lastSeenDetails.fullDate || 'Never',
      },
      {
        icon: 'solar:calendar-date-bold',
        label: 'Joined Date',
        value: createdAt ? fDateTime(createdAt) : '-',
      },
      {
        icon: 'solar:calendar-minimalistic-bold',
        label: 'Last Updated',
        value: updatedAt ? fDateTime(updatedAt) : '-',
      },
    ],
    [createdAt, lastSeenDetails, status, updatedAt]
  );

  return (
    <DetailCard
      title="Account & Activity"
      icon="solar:history-bold"
      showCopy
      fields={fields}
    />
  );
}

export default UserAccountWidget;
