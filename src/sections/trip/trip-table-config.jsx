import React from 'react';

import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Label } from 'src/components/label';
import { fDate, fTime } from 'src/utils/format-time';

export const TABLE_COLUMNS = [
  {
    id: 'tripId',
    label: 'Trip ID',
    defaultVisible: true,
    disabled: false,
    align: 'left',
    getter: (row) => row._id,
    render: (value) => (
      <Link component={RouterLink} to={paths.dashboard.trip.details(value)} variant="body2" noWrap sx={{ color: 'primary.main' }}>
        {value}
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
    render: (value) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={value} sx={{ mr: 2 }}>
          {value?.slice(0, 2).toUpperCase()}
        </Avatar>
        <ListItemText primary={value} primaryTypographyProps={{ typography: 'body2', noWrap: true }} />
      </div>
    ),
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
    render: (value) => (
      <Label variant="soft" color={value === 'open' ? 'warning' : 'success'}>
        {value}
      </Label>
    ),
  },
  {
    id: 'fromDate',
    label: 'From Date',
    defaultVisible: true,
    disabled: false,
    align: 'left',
    getter: (row) => row.fromDate,
    render: (value) => (
      <ListItemText
        primary={fDate(new Date(value))}
        secondary={fTime(new Date(value))}
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
    render: (value) => (
      <ListItemText
        primary={value ? fDate(new Date(value)) : '--'}
        secondary={value ? fTime(new Date(value)) : '--'}
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

export const getDefaultVisibleColumns = () =>
  TABLE_COLUMNS.reduce((acc, column) => {
    acc[column.id] = column.defaultVisible;
    return acc;
  }, {});

export const getDisabledColumns = () =>
  TABLE_COLUMNS.reduce((acc, column) => {
    acc[column.id] = column.disabled;
    return acc;
  }, {});
