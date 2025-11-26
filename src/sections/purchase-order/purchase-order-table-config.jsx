import React from 'react';

import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';

const STATUS_CONFIG = {
  'pending-approval': { label: 'Pending Approval', color: 'warning' },
  approved: { label: 'Approved', color: 'info' },
  purchased: { label: 'Purchased', color: 'primary' },
  rejected: { label: 'Rejected', color: 'error' },
  received: { label: 'Received', color: 'success' },
};

export const TABLE_COLUMNS = [
  {
    id: 'vendor',
    label: 'Vendor',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row.vendor?.name,
    render: (row) => {
      const value = row.vendor?.name || '';
      return (
        <ListItemText
          disableTypography
          primary={
            <Link
              component={RouterLink}
              to={paths.dashboard.purchaseOrder.details(row._id)}
              variant="body2"
              noWrap
              sx={{ color: 'primary.main' }}
            >
              {value}
            </Link>
          }
        />
      );
    },
  },
  {
    id: 'partLocation',
    label: 'Location',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.partLocation?.name,
  },
  {
    id: 'status',
    label: 'Status',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.status,
    render: (row) => {
      const config = STATUS_CONFIG[row.status] || { label: row.status, color: 'default' };
      return (
        <Label variant="soft" color={config.color}>
          {config.label}
        </Label>
      );
    },
  },
  {
    id: 'total',
    label: 'Total',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.total,
    render: (row) => fCurrency(row.total || 0),
  },
  {
    id: 'createdAt',
    label: 'Date',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.createdAt,
    render: (row) => {
      const value = row.createdAt;
      if (!value) return '-';
      return (
        <Tooltip title={fDate(value)}>
          <Typography variant="body2" noWrap>
            {fDate(value)}
          </Typography>
        </Tooltip>
      );
    },
  },
];

