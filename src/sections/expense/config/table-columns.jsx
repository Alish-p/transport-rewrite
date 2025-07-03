import { Stack, Typography, ListItemText } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { subtripExpenseTypes, EXPENSE_CATEGORY_COLORS } from './constants';

export const TABLE_COLUMNS = [
  {
    id: 'subtripId',
    label: 'LR No',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row?.subtripId || '-',
    align: 'left',
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
    id: 'vehicleNo',
    label: 'Vehicle No',
    defaultVisible: false,
    disabled: true,
    getter: (row) => row?.vehicleId?.vehicleNo || '-',
    align: 'left',
  },

  {
    id: 'customerName',
    label: 'Customer',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.subtripId?.customerId?.customerName || '-',
    align: 'left',
  },

  {
    id: 'routeName',
    label: 'Route',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.subtripId?.routeCd?.routeName || '-',
    align: 'left',
  },

  {
    id: 'expenseType',
    label: 'Expense Type',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row?.expenseType || '-',
    render: (value) => (
      <Stack direction="row" alignItems="left" spacing={1}>
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
    id: 'date',
    label: 'Date',
    defaultVisible: true,
    disabled: false,
    getter: (row) => fDate(row?.date) || '-',
    type: 'date',
    align: 'left',
    render: (value, row) => (
      <ListItemText
        primary={fDate(new Date(row?.date))}
        secondary={fTime(new Date(row?.date))}
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
    id: 'amount',
    label: 'Amount',
    defaultVisible: true,
    type: 'number',
    disabled: true,
    getter: (row) => (row?.amount ? fCurrency(row?.amount) : '-'),
    align: 'right',
  },
  {
    id: 'remarks',
    label: 'Remarks',
    defaultVisible: false,
    disabled: false,
    align: 'left',
    getter: (row) => row?.remarks || '-',
  },
  {
    id: 'dieselLtr',
    label: 'Diesel (Ltr)',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.dieselLtr || '-',
    align: 'center',
  },
  {
    id: 'paidThrough',
    label: 'Paid Through',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.paidThrough || '-',
    align: 'left',
  },

  {
    id: 'expenseCategory',
    label: 'Expense Category',
    defaultVisible: false,
    disabled: false,
    align: 'left',
    getter: (row) => row?.expenseCategory || '-',
    render: (value) => (
      <Label variant="soft" color={EXPENSE_CATEGORY_COLORS[value] || 'default'}>
        {value}
      </Label>
    ),
  },
  {
    id: 'pumpCd',
    label: 'Pump',
    defaultVisible: false,
    disabled: false,
    align: 'left',
    getter: (row) => row?.pumpCd?.pumpName || '-',
  },

  {
    id: 'transporterName',
    label: 'Transporter',
    defaultVisible: false,
    disabled: false,
    align: 'left',
    getter: (row) =>
      row?.vehicleId?.transporter?.transportName || '-',
  },
  {
    id: 'slipNo',
    label: 'Slip No',
    defaultVisible: false,
    disabled: false,
    align: 'left',
    getter: (row) => row?.slipNo || '-',
  },
  {
    id: 'authorisedBy',
    label: 'Authorised By',
    defaultVisible: false,
    disabled: false,
    align: 'left',
    getter: (row) => row?.authorisedBy || '-',
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
