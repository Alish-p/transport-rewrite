import { Stack, Typography, ListItemText } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

import { Iconify } from '../../../components/iconify';
import { fCurrency } from '../../../utils/format-number';
import { subtripExpenseTypes, EXPENSE_CATEGORY_COLORS } from './constants';

export const TABLE_COLUMNS = [
  {
    id: 'subtripId',
    label: 'LR No',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row?.subtripId?._id || '-',
    align: 'center',
    render: (value) => (
      <RouterLink
        to={`${paths.dashboard.subtrip.details(value)}`}
        style={{ color: 'green', textDecoration: 'underline' }}
      >
        <ListItemText
          primary={value}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      </RouterLink>
    ),
  },
  {
    id: 'tripId',
    label: 'Trip No',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row?.tripId?._id || '-',
    render: (value) => (
      <RouterLink
        to={`${paths.dashboard.trip.details(value)}`}
        style={{ color: 'green', textDecoration: 'underline' }}
      >
        <ListItemText
          primary={value}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      </RouterLink>
    ),
  },
  {
    id: 'vehicleNo',
    label: 'Vehicle No',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row.vehicleId?.vehicleNo || '-',
    align: 'center',
  },
  {
    id: 'driver',
    label: 'Driver',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.tripId?.driverId?.driverName || '-',
    align: 'center',
  },

  {
    id: 'expenseType',
    label: 'Expense Type',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row?.expenseType || '-',
    render: (value) => (
      <Stack direction="row" alignItems="center" spacing={1}>
        <Iconify
          icon={subtripExpenseTypes.find((type) => type.value === value)?.icon}
          sx={{ color: 'secondary.main' }}
        />
        <Typography variant="body2" noWrap>
          {value}
        </Typography>
      </Stack>
    ),
  },
  {
    id: 'amount',
    label: 'Amount',
    defaultVisible: true,
    disabled: false,
    getter: (row) => (row?.amount ? fCurrency(row?.amount) : '-'),
  },
  {
    id: 'remarks',
    label: 'Remarks',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row?.remarks || '-',
  },
  {
    id: 'dieselLtr',
    label: 'Diesel (Ltr)',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.dieselLtr || '-',
  },
  {
    id: 'paidThrough',
    label: 'Paid Through',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row?.paidThrough || '-',
  },
  {
    id: 'date',
    label: 'Date',
    defaultVisible: true,
    disabled: false,
    getter: (row) => fDate(row?.date) || '-',
    type: 'date',
    align: 'center',
    render: (value) => (
      <ListItemText
        primary={fDate(new Date(value))}
        secondary={fTime(new Date(value))}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        secondaryTypographyProps={{
          mt: 0.5,
          component: 'span',
          typography: 'caption',
        }}
      />
    ),
  },
  {
    id: 'expenseCategory',
    label: 'Expense Category',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.expenseCategory || '-',
    render: (value) => (
      <Label variant="soft" color={EXPENSE_CATEGORY_COLORS[value] || 'default'}>
        {value}
      </Label>
    ),
  },
  {
    id: 'pumpCd',
    label: 'Pump Code',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.pumpCd?.pumpName || '-',
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
