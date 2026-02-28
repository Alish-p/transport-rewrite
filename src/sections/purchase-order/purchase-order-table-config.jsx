import React from 'react';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

const STATUS_CONFIG = {
  'pending-approval': { label: 'Pending Approval', color: 'warning' },
  approved: { label: 'Approved', color: 'info' },
  purchased: { label: 'Purchased', color: 'primary' },
  'partial-received': { label: 'Partially Received', color: 'warning' },
  rejected: { label: 'Rejected', color: 'error' },
  received: { label: 'Received', color: 'success' },
};

export const TABLE_COLUMNS = [
  {
    id: 'purchaseOrderNo',
    label: 'PO No.',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row.purchaseOrderNo,
    render: (row) => {
      const value = row.purchaseOrderNo || '-';
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
    id: 'vendor',
    label: 'Vendor',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row.vendorSnapshot?.name || row.vendor?.name,
    render: (row) => {
      const value = row.vendorSnapshot?.name || row.vendor?.name || '';
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
    getter: (row) => row.partLocationSnapshot?.name || row.partLocation?.name,
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
    label: 'Created Date',
    defaultVisible: true,
    disabled: false,
    getter: (row) => fDate(row.createdAt),
    render: (row) => {
      const value = row.createdAt;
      if (!value) return '-';
      return (<>
        <Typography variant="body2" noWrap>
          {fDate(value)}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
          {fTime(value)}
        </Typography>
      </>
      );
    },
  },
  {
    id: 'subtotal',
    label: 'Subtotal',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row.subtotal,
    render: (row) => fCurrency(row.subtotal || 0),
  },
  {
    id: 'discountAmount',
    label: 'Discount',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row.discountAmount,
    render: (row) => fCurrency(row.discountAmount || 0),
  },
  {
    id: 'taxAmount',
    label: 'Tax',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row.taxAmount,
    render: (row) => fCurrency(row.taxAmount || 0),
  },
  {
    id: 'shipping',
    label: 'Shipping',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row.shipping,
    render: (row) => fCurrency(row.shipping || 0),
  },
  {
    id: 'description',
    label: 'Description',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row.description,
  },
  {
    id: 'paymentReference',
    label: 'Payment Ref',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row.paymentReference,
  },
  {
    id: 'rejectionReason',
    label: 'Rejection Reason',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row.rejectionReason,
  },
  {
    id: 'createdBy',
    label: 'Created By',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row.createdBy?.name || '-',
  },
  {
    id: 'approvedBy',
    label: 'Approved By',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row.approvedBy?.name || '-',
  },
  {
    id: 'purchasedBy',
    label: 'Purchased By',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row.purchasedBy?.name || '-',
  },
  {
    id: 'approvedAt',
    label: 'Approved Date',
    defaultVisible: false,
    disabled: false,
    getter: (row) => fDate(row.approvedAt),
    render: (row) => {
      const value = row.approvedAt;
      if (!value) return '-';
      return (
        <>
          <Typography variant="body2" noWrap>
            {fDate(value)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
            {fTime(value)}
          </Typography>
        </>
      );
    },
  },
  {
    id: 'purchasedAt',
    label: 'Purchased Date',
    defaultVisible: false,
    disabled: false,
    getter: (row) => fDate(row.purchasedAt),
    render: (row) => {
      const value = row.purchasedAt;
      if (!value) return '-';
      return (
        <>
          <Typography variant="body2" noWrap>
            {fDate(value)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
            {fTime(value)}
          </Typography>
        </>
      );
    },
  },
  {
    id: 'receivedAt',
    label: 'Received Date',
    defaultVisible: false,
    disabled: false,
    getter: (row) => fDate(row.receivedAt),
    render: (row) => {
      const value = row.receivedAt;
      if (!value) return '-';
      return (
        <>
          <Typography variant="body2" noWrap>
            {fDate(value)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
            {fTime(value)}
          </Typography>
        </>
      );
    },
  },
];
