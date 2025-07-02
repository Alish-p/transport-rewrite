import React from 'react';

import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { wrapText } from 'src/utils/change-case';

export const TABLE_COLUMNS = [
  {
    id: 'transportName',
    label: 'Transport Name',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row.transportName,
    render: (value, row) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={value} sx={{ mr: 2 }}>
          {value.slice(0, 2).toUpperCase()}
        </Avatar>
        <ListItemText
          disableTypography
          primary={
            <Link
              component={RouterLink}
              to={paths.dashboard.transporter.details(row._id)}
              variant="body2"
              noWrap
              sx={{ color: 'primary.main' }}
            >
              {value}
            </Link>
          }
        />
      </div>
    ),
  },
  {
    id: 'address',
    label: 'Address',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.address,
    render: (value) => (
      <Tooltip title={value}>
        <ListItemText
          primary={wrapText(value, 20)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      </Tooltip>
    ),
  },
  {
    id: 'cellNo',
    label: 'Phone Number',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.cellNo,
  },
  {
    id: 'ownerName',
    label: 'Owner Name',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.ownerName,
  },
  {
    id: 'emailId',
    label: 'Email ID',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.emailId,
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
