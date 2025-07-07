import React from 'react';

import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { wrapText } from 'src/utils/change-case';

export const TABLE_COLUMNS = [
  {
    id: 'pumpName',
    label: 'Pump Name',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row.pumpName,
    render: (row) => {
      const value = row.pumpName;
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
                to={paths.dashboard.pump.details(row._id)}
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
    id: 'placeName',
    label: 'Place Name',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row.placeName,
  },
  {
    id: 'ownerName',
    label: 'Owner Name',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.ownerName,
  },
  {
    id: 'ownerCellNo',
    label: 'Owner Cell No',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row.ownerCellNo,
  },
  {
    id: 'pumpPhoneNo',
    label: 'Pump Phone No',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row.pumpPhoneNo,
  },
  {
    id: 'taluk',
    label: 'Taluk',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row.taluk,
  },
  {
    id: 'district',
    label: 'District',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.district,
  },
  {
    id: 'address',
    label: 'Address',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.address,
    render: (row) => {
      const value = row.address;
      return (
        <Tooltip title={value}>
          <Typography variant="body2" noWrap>
            {wrapText(value, 20)}
          </Typography>
        </Tooltip>
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
