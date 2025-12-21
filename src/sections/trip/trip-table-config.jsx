import React from 'react';

import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

export const TABLE_COLUMNS = [
  {
    id: 'tripId',
    label: 'Trip No',
    defaultVisible: true,
    disabled: false,
    align: 'left',
    getter: (row) => row.tripNo,
    render: (row) => (
      <Link
        component={RouterLink}
        to={paths.dashboard.trip.details(row._id)}
        variant="body2"
        noWrap
        sx={{ color: 'primary.main' }}
      >
        {row.tripNo}
      </Link>
    ),
  },
  {
    id: 'vehicleNo',
    label: 'Vehicle Number',
    defaultVisible: true,
    disabled: true,
    align: 'left',
    getter: (row) => row.vehicleId?.vehicleNo,
    render: (row) => {
      const value = row.vehicleId?.vehicleNo;
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={value} sx={{ mr: 2 }}>
            {value?.slice(0, 2).toUpperCase()}
          </Avatar>
          <ListItemText
            primary={value}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </div>
      );
    },
  },
  {
    id: 'driverName',
    label: 'Driver Name',
    defaultVisible: true,
    disabled: false,
    align: 'left',
    getter: (row) => row.driverId?.driverName,
  },
  {
    id: 'tripStatus',
    label: 'Trip Status',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.tripStatus,
    render: (row) => (
      <Label variant="soft" color={row.tripStatus === 'open' ? 'warning' : 'success'}>
        {row.tripStatus}
      </Label>
    ),
  },
  {
    id: 'jobs',
    label: 'Jobs',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.subtrips?.length || 0,
    render: (row) => {
      const subtrips = row.subtrips || [];
      const count = subtrips.length;

      if (!count) {
        return (
          <Label variant="soft" color="default">
            0
          </Label>
        );
      }

      const tooltipContent = (
        <div>
          {subtrips.map((st, idx) => (
            <div key={st._id || st.subtripNo}>
              {idx + 1} | {st.subtripNo} | {st.loadingPoint} ➡️ {' '}
              {st.unloadingPoint}
            </div>
          ))}
        </div>
      );

      return (
        <Tooltip title={tooltipContent} arrow>
          <Label
            variant="soft"
            color="info"
            sx={{ cursor: 'pointer' }}
          >
            {count}
          </Label>
        </Tooltip >
      );
    },
  },
  {
    id: 'fromDate',
    label: 'From Date',
    defaultVisible: true,
    disabled: false,
    align: 'left',
    getter: (row) => row.fromDate,
    render: (row) => (
      <ListItemText
        primary={fDate(new Date(row.fromDate))}
        secondary={fTime(new Date(row.fromDate))}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
      />
    ),
  },
  {
    id: 'toDate',
    label: 'To Date',
    defaultVisible: true,
    disabled: false,
    align: 'left',
    getter: (row) => row.toDate,
    render: (row) => (
      <ListItemText
        primary={row.toDate ? fDate(new Date(row.toDate)) : '--'}
        secondary={row.toDate ? fTime(new Date(row.toDate)) : '--'}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
      />
    ),
  },
  {
    id: 'remarks',
    label: 'Remarks',
    defaultVisible: true,
    disabled: false,
    align: 'left',
    getter: (row) => row.remarks,
  },
];
