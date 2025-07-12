import React from 'react';

import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

export const TABLE_COLUMNS = [
  {
    id: 'name',
    label: 'Bank Name',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row.name,
    render: (row) => {
      const value = row.name;
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={value} sx={{ mr: 2 }}>
            {value.slice(0, 2).toUpperCase()}
          </Avatar>
          <ListItemText
            disableTypography
            primary={
              <Link
                component={RouterLink}
                to={paths.dashboard.bank.details(row._id)}
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
    id: 'branch',
    label: 'Bank Branch',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.branch,
  },
  {
    id: 'place',
    label: 'Bank Place',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.place,
  },
  {
    id: 'ifsc',
    label: 'Bank IFSC',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.ifsc,
  },
];
