import React from 'react';

import Link from '@mui/material/Link';
import { Tooltip } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fNumber, fCurrency } from 'src/utils/format-number';
import { fDate, fTime, fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

import { wrapText } from '../../utils/change-case';
import { INVOICE_STATUS_COLOR } from './invoice-config';

export const TABLE_COLUMNS = [
  {
    id: 'invoiceNo',
    label: 'Invoice',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row.invoiceNo,
    render: ({ _id, invoiceNo }) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ListItemText
          disableTypography
          primary={
            <Link
              component={RouterLink}
              to={paths.dashboard.invoice.details(_id)}
              variant="body2"
              noWrap
              sx={{ color: 'primary.main' }}
            >
              {invoiceNo}
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
    getter: (row) => (row.invoicedSubTrips ? row.invoicedSubTrips.join(', ') : ''),
    render: (row) => {
      const value = row.invoicedSubTrips ? row.invoicedSubTrips.join(', ') : '';
      return (
        <Tooltip title={value}>
          <ListItemText
            primary={wrapText(value, 20)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </Tooltip>
      );
    },
  },

  {
    id: 'invoiceStatus',
    label: 'Invoice Status',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.invoiceStatus,
    render: ({ invoiceStatus }) => (
      <Label variant="soft" color={INVOICE_STATUS_COLOR[invoiceStatus] || 'default'}>
        {invoiceStatus}
      </Label>
    ),
  },
  {
    id: 'issueDate',
    label: 'Issue Date',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => fDateTime(row.issueDate),
    render: ({ issueDate }) => (
      <ListItemText
        primary={fDate(new Date(issueDate))}
        secondary={fTime(new Date(issueDate))}
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
    getter: (row) => fDateTime(row.dueDate),
    render: ({ dueDate }) => (
      <ListItemText
        primary={fDate(new Date(dueDate))}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      />
    ),
  },
  {
    id: 'totalAmountBeforeTax',
    label: 'Taxable Amount',
    defaultVisible: false,
    disabled: false,
    align: 'right',
    getter: (row) => fNumber(row.totalAmountBeforeTax),
    showTotal: true,
    render: ({ totalAmountBeforeTax }) => (
      <ListItemText
        primary={fCurrency(totalAmountBeforeTax)}
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
    getter: (row) => fNumber(row.taxBreakup?.cgst?.amount || 0),
    render: (row) => {
      const value = row.taxBreakup?.cgst?.amount || 0;
      return (
        <ListItemText
          primary={fCurrency(value)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      );
    },
    showTotal: true,
  },
  {
    id: 'sgst',
    label: 'SGST (TAX)',
    defaultVisible: false,
    disabled: false,
    align: 'right',
    showTotal: true,
    getter: (row) => fNumber(row.taxBreakup?.sgst?.amount || 0),
    render: (row) => {
      const value = row.taxBreakup?.sgst?.amount || 0;
      return (
        <ListItemText
          primary={fCurrency(value)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      );
    },
  },
  {
    id: 'igst',
    label: 'IGST (TAX)',
    defaultVisible: false,
    disabled: false,
    align: 'right',
    showTotal: true,
    getter: (row) => fNumber(row.taxBreakup?.igst?.amount || 0),
    render: (row) => {
      const value = row.taxBreakup?.igst?.amount || 0;
      return (
        <ListItemText
          primary={fCurrency(value)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      );
    },
  },
  {
    id: 'netTotal',
    label: 'Amount',
    defaultVisible: true,
    disabled: false,
    align: 'right',
    getter: (row) => fNumber(row.netTotal),
    showTotal: true,
    render: ({ netTotal }) => (
      <ListItemText
        primary={fCurrency(netTotal)}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      />
    ),
  },
];
