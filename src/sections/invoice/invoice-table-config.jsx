import React from 'react';

import Link from '@mui/material/Link';
import { Tooltip } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

import { wrapText } from '../../utils/change-case';

export const TABLE_COLUMNS = [
  {
    id: 'invoiceNo',
    label: 'Invoice',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row.invoiceNo,
    render: (value, row) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ListItemText
          disableTypography
          primary={
            <Link
              component={RouterLink}
              to={paths.dashboard.invoice.details(row._id)}
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
    id: 'customerId',
    label: 'Customer',
    defaultVisible: true,
    disabled: true,
    align: 'center',
    getter: (row) => row.customerId?.customerName,
  },

  {
    id: 'subtrips',
    label: 'Subtrips',
    defaultVisible: false,
    disabled: false,
    align: 'center',
    getter: (row) => row.invoicedSubTrips ? row.invoicedSubTrips.join(', ') : '',
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
    id: 'invoiceStatus',
    label: 'Invoice Status',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.invoiceStatus,
    render: (value) => (
      <Label
        variant="soft"
        color={value === 'paid' ? 'success' : value === 'overdue' ? 'error' : 'warning'}
      >
        {value}
      </Label>
    ),
  },
  {
    id: 'issueDate',
    label: 'Issue Date',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.issueDate,
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
    id: 'dueDate',
    label: 'Due Date',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.dueDate,
    render: (value) => (
      <ListItemText
        primary={fDate(new Date(value))}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      />
    ),
  },
  {
    id: 'netTotal',
    label: 'Amount',
    defaultVisible: true,
    disabled: false,
    align: 'right',
    getter: (row) => row.netTotal,
    render: (value) => (
      <ListItemText
        primary={fCurrency(value)}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      />
    ),
  },
  {
    id: 'cgst',
    label: 'CGST (TAX)',
    defaultVisible: false,
    disabled: false,
    align: 'right',
    getter: (row) => row.taxBreakup?.cgst?.amount || 0,
    render: (value) => (
      <ListItemText
        primary={fCurrency(value)}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      />
    ),
  },
  {
    id: 'sgst',
    label: 'SGST (TAX)',
    defaultVisible: false,
    disabled: false,
    align: 'right',
    getter: (row) => row.taxBreakup?.sgst?.amount || 0,
    render: (value) => (
      <ListItemText
        primary={fCurrency(value)}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      />
    ),
  },
  {
    id: 'igst',
    label: 'IGST (TAX)',
    defaultVisible: false,
    disabled: false,
    align: 'right',
    getter: (row) => row.taxBreakup?.igst?.amount || 0,
    render: (value) => (
      <ListItemText
        primary={fCurrency(value)}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      />
    ),
  },
];
