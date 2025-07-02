import React from 'react';

import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Label } from 'src/components/label';

export const TABLE_COLUMNS = [
  {
    id: 'vehicleNo',
    label: 'Vehicle No',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row.vehicleNo,
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
              to={paths.dashboard.vehicle.details(row._id)}
              variant="body2"
              noWrap
              sx={{ color: 'primary.main' }}
            >
              {value}
            </Link>
          }
          secondary={
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {row.vehicleType}
            </Typography>
          }
        />
      </div>
    ),
  },
  {
    id: 'isOwn',
    label: 'Ownership',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.isOwn,
    render: (value) => (
      <Label variant="soft" color={value ? 'secondary' : 'warning'}>
        {value ? 'Own' : 'Market'}
      </Label>
    ),
  },
  {
    id: 'transporter',
    label: 'Transport Company',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.transporter?.transportName || '-',
  },
  {
    id: 'noOfTyres',
    label: 'No Of Tyres',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.noOfTyres,
  },
  {
    id: 'manufacturingYear',
    label: 'Manufacturing Year',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.manufacturingYear || '-',
  },
  {
    id: 'loadingCapacity',
    label: 'Loading Capacity',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.loadingCapacity,
    render: (value) => (
      <Label variant="soft" color={value >= 20 ? 'success' : 'error'}>
        {value || '-'}
      </Label>
    ),
  },
  {
    id: 'fuelTankCapacity',
    label: 'Fuel Tank Capacity',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.fuelTankCapacity || '-',
  },
  {
    id: 'vehicleCompany',
    label: 'Vehicle Company',
    defaultVisible: false,
    disabled: false,
    align: 'center',
    getter: (row) => row.vehicleCompany || '-',
  },
  {
    id: 'modelType',
    label: 'Vehicle Model',
    defaultVisible: false,
    disabled: false,
    align: 'center',
    getter: (row) => row.modelType || '-',
  },
  {
    id: 'chasisNo',
    label: 'Chasis No',
    defaultVisible: false,
    disabled: false,
    align: 'center',
    getter: (row) => row.chasisNo || '-',
  },
  {
    id: 'engineNo',
    label: 'Engine No',
    defaultVisible: false,
    disabled: false,
    align: 'center',
    getter: (row) => row.engineNo || '-',
  },
  {
    id: 'engineType',
    label: 'Engine Type',
    defaultVisible: false,
    disabled: false,
    align: 'center',
    getter: (row) => row.engineType || '-',
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
