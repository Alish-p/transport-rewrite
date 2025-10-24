import React from 'react';

import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

import { getStatusMeta, getExpiryStatus } from '../../utils/document-utils';

export const TABLE_COLUMNS = [
  {
    id: 'vehicle',
    label: 'Vehicle',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row?.vehicle?.vehicleNo || row?.vehicleNo || '-',
    render: (row) => {
      const id = row?.vehicle?._id || row?.vehicleId || row?._id;
      const vehicleNo = row?.vehicle?.vehicleNo || row?.vehicleNo || '-';
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            disableTypography
            primary={
              <Link
                component={RouterLink}
                to={id ? paths.dashboard.vehicle.details(id) : '#'}
                variant="body2"
                noWrap
                sx={{
                  color: id ? 'primary.main' : 'text.primary',
                  pointerEvents: id ? 'auto' : 'none',
                }}
              >
                {vehicleNo}
              </Link>
            }
          />
        </div>
      );
    },
  },
  {
    id: 'docType',
    label: 'Type',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row?.docType || '-',
    render: (row) => (
      <Label variant="soft" color="info" sx={{ textTransform: 'capitalize' }}>
        {row?.docType || '-'}
      </Label>
    ),
  },
  {
    id: 'docNumber',
    label: 'Number',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row?.docNumber || '-',
  },
  {
    id: 'issuer',
    label: 'Issuer',
    defaultVisible: false,
    disabled: false,
    align: 'center',
    getter: (row) => row?.issuer || '-',
  },
  {
    id: 'issueDate',
    label: 'Issue Date',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row?.issueDate || '-',
    render: (row) => (
      <ListItemText
        primary={row?.issueDate ? fDate(new Date(row.issueDate)) : '-'}
        secondary={row?.issueDate ? fTime(new Date(row.issueDate)) : ''}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
      />
    ),
  },
  {
    id: 'expiryDate',
    label: 'Expiry Date',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row?.expiryDate || '-',
    render: (row) => (
      <ListItemText
        primary={row?.expiryDate ? fDate(new Date(row.expiryDate)) : '-'}
        secondary={row?.expiryDate ? fTime(new Date(row.expiryDate)) : ''}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
      />
    ),
  },
  {
    id: 'status',
    label: 'Status',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => getExpiryStatus(row?.expiryDate) || (row?.missing ? 'Missing' : '-') || '-',
    render: (row) => {
      const status = getExpiryStatus(row?.expiryDate) || (row?.missing ? 'Missing' : null);
      const meta = status ? getStatusMeta(status) : null;
      if (!meta) return '-';
      return (
        <Label variant="soft" color={meta.color} startIcon={undefined}>
          {status}
        </Label>
      );
    },
  },
  {
    id: 'createdBy',
    label: 'Created By',
    defaultVisible: false,
    disabled: false,
    align: 'center',
    getter: (row) => row?.createdBy?.name || row?.createdByName || '-',
  },
];
