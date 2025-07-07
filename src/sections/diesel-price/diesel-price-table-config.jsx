import React from 'react';

import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';

export const TABLE_COLUMNS = [
  {
    id: 'pumpName',
    label: 'Pump Name',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row.pump?.pumpName,
    render: (row) => {
      const value = row.pump?.pumpName || '-';
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={value} sx={{ mr: 2 }}>
            {value.slice(0, 1).toUpperCase()}
          </Avatar>
          <ListItemText
            disableTypography
            primary={
              <Link
                component={RouterLink}
                to={paths.dashboard.diesel.details(row._id)}
                variant="body2"
                noWrap
                sx={{ color: 'primary.main' }}
              >
                {value}
              </Link>
            }
          />
        </div>
      );
    },
  },
  {
    id: 'price',
    label: 'Price',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.price,
  },
  {
    id: 'startDate',
    label: 'Start Date',
    defaultVisible: true,
    disabled: false,
    getter: (row) => fDate(row.startDate),
    render: (row) => (
      <ListItemText
        primary={new Date(row.startDate).toLocaleDateString()}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      />
    ),
  },
  {
    id: 'endDate',
    label: 'End Date',
    defaultVisible: true,
    disabled: false,
    getter: (row) => fDate(row.endDate),
    render: (row) => (
      <ListItemText
        primary={new Date(row.endDate).toLocaleDateString()}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      />
    ),
  },
  {
    id: 'status',
    label: 'Status',
    defaultVisible: true,
    disabled: false,
    getter: (row) =>
      new Date() >= new Date(row.startDate) && new Date() <= new Date(row.endDate)
        ? 'Live'
        : 'Past',
    render: (row) => {
      const isLive =
        new Date() >= new Date(row.startDate) &&
        new Date() <= new Date(row.endDate);
      return (
        <ListItemText
          primary={
            <Label color={isLive ? 'success' : 'error'} sx={{
              textTransform: 'capitalize'
            }}>
              {isLive ? 'Live' : 'Past'}
            </Label>
          }
        />
      );
    },
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
