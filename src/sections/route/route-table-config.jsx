import React from 'react';

import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Label } from 'src/components/label';

import { wrapText } from '../../utils/change-case';

export const TABLE_COLUMNS = [
  {
    id: 'routeName',
    label: 'Route Name',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row.routeName,
    render: (value, row) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={value} sx={{ mr: 2 }}>
          {value.slice(0, 2).toUpperCase()}
        </Avatar>
        <ListItemText
          disableTypography
          primary={
            <Tooltip title={value}>
              <Link
                component={RouterLink}
                to={paths.dashboard.route.details(row._id)}
                variant="body2"
                noWrap
                sx={{ color: 'primary.main' }}
              >
                {wrapText(value, 20)}
              </Link>
            </Tooltip>
          }
        />
      </div>
    ),
  },
  {
    id: 'fromPlace',
    label: 'From Place',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.fromPlace,
  },
  {
    id: 'toPlace',
    label: 'To Place',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.toPlace,
  },
  {
    id: 'customer',
    label: 'Customer',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.customer?.customerName || '-',
  },
  {
    id: 'noOfDays',
    label: 'Number of Days',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.noOfDays,
    render: (value) => (
      <Label variant="soft" color={value >= 5 ? 'success' : 'error'}>
        {value}
      </Label>
    ),
  },
  {
    id: 'distance',
    label: 'Distance',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.distance,
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
