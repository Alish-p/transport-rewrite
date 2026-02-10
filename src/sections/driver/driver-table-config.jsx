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
    id: 'driverName',
    label: 'Driver',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row.driverName,
    render: ({ _id, driverName }) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={driverName} sx={{ mr: 2 }}>
          {driverName.charAt(0).toUpperCase()}
        </Avatar>
        <ListItemText
          disableTypography
          primary={
            <Link
              component={RouterLink}
              to={paths.dashboard.driver.details(_id)}
              variant="body2"
              noWrap
              sx={{ color: 'primary.main' }}
            >
              {driverName}
            </Link>
          }
        />
      </div>
    ),
  },
  {
    id: 'type',
    label: 'Type',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.type,
    render: ({ type }) =>
      type ? (
        <Label variant="soft" color="info">
          {type}
        </Label>
      ) : (
        '-'
      ),
  },
  {
    id: 'driverCellNo',
    label: 'Mobile',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.driverCellNo,
  },
  {
    id: 'permanentAddress',
    label: 'Address',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.permanentAddress,
  },
  {
    id: 'experience',
    label: 'Experience',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.experience,
  },
  {
    id: 'licenseTo',
    label: 'License Valid Till',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => (row.licenseTo ? fDate(row.licenseTo) : '-'),
  },
  {
    id: 'aadharNo',
    label: 'Aadhar No',
    defaultVisible: false,
    disabled: false,
    align: 'center',
    getter: (row) => row.aadharNo,
  },
  {
    id: 'status',
    label: 'Status',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.status,
    render: ({ status }) => (
      <Label variant="soft" color={status === 'expired' ? 'error' : 'success'}>
        {status}
      </Label>
    ),
  },
];
