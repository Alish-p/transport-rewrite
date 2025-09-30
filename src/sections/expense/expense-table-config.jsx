import { Link, Stack, Typography, ListItemText } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fNumber } from 'src/utils/format-number';
import { fDate, fTime, fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import {
  useSubtripExpenseTypes,
  useVehicleExpenseTypes,
  DEFAULT_SUBTRIP_EXPENSE_TYPES,
  DEFAULT_VEHICLE_EXPENSE_TYPES,
} from './expense-config';
import { EXPENSE_CATEGORY_COLORS } from './config/constants';

function getExpenseTypeMeta(value) {
  const all = [...DEFAULT_SUBTRIP_EXPENSE_TYPES, ...DEFAULT_VEHICLE_EXPENSE_TYPES];
  return all.find((t) => t.value === value);
}

function ExpenseTypeCell({ expenseType = '-' }) {
  const types = [...useSubtripExpenseTypes(), ...useVehicleExpenseTypes()];
  const matched = types.find((t) => t.value === expenseType);
  const icon = matched?.icon;
  const label = matched?.label || expenseType;
  return (
    <Stack direction="row" alignItems="left" spacing={1}>
      {icon ? <Iconify icon={icon} sx={{ color: 'primary.main' }} /> : null}
      <Typography variant="body2" noWrap>
        {label}
      </Typography>
    </Stack>
  );
}

export const TABLE_COLUMNS = [
  {
    id: 'subtripId',
    label: 'LR No',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row?.subtripId?.subtripNo || '-',
    align: 'left',
    render: ({ subtripId = '-' }) => (
      <Link
        component={RouterLink}
        to={paths.dashboard.subtrip.details(subtripId?._id)}
        variant="body2"
        noWrap
        sx={{ color: 'primary.main' }}
      >
        {subtripId?.subtripNo || '-'}
      </Link>
    ),
  },
  {
    id: 'vehicleNo',
    label: 'Vehicle No',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row?.vehicleId?.vehicleNo || row?.vehicleNo || '-',
    align: 'left',
  },

  {
    id: 'expenseType',
    label: 'Expense Type',
    defaultVisible: true,
    disabled: true,
    getter: (row) => getExpenseTypeMeta(row?.expenseType)?.label || row?.expenseType || '-',
    render: ({ expenseType = '-' }) => <ExpenseTypeCell expenseType={expenseType} />,
  },
  {
    id: 'date',
    label: 'Date',
    defaultVisible: true,
    disabled: false,
    getter: (row) => fDateTime(row?.date) || '-',
    type: 'date',
    align: 'left',
    render: ({ date = '-' }) => (
      <ListItemText
        primary={fDate(new Date(date))}
        secondary={fTime(new Date(date))}
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
    id: 'remarks',
    label: 'Remarks',
    defaultVisible: false,
    disabled: false,
    align: 'left',
    getter: (row) => row?.remarks || '-',
  },
  {
    id: 'dieselRate',
    label: 'Diesel Rate (₹/Ltr)',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.dieselPrice || '-',
    align: 'right',
  },
  {
    id: 'dieselLtr',
    label: 'Diesel (Ltr)',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.dieselLtr || '-',
    align: 'center',
    showTotal: true,
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
    render: ({ expenseCategory = '-' }) => (
      <Label variant="soft" color={EXPENSE_CATEGORY_COLORS[expenseCategory] || 'default'}>
        {expenseCategory}
      </Label>
    ),
  },
  {
    id: 'pumpCd',
    label: 'Pump Code',
    defaultVisible: false,
    disabled: false,
    align: 'left',
    getter: (row) => row?.pumpCd?.name || '-',
  },
  {
    id: 'transporter',
    label: 'Transporter',
    defaultVisible: false,
    disabled: false,
    align: 'left',
    getter: (row) => row?.vehicleId?.transporter?.transportName || '-',
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
  {
    id: 'amount',
    label: 'Amount',
    defaultVisible: true,
    type: 'number',
    disabled: true,
    getter: (row) => fNumber(row?.amount),
    align: 'right',
    showTotal: true,
  },
];
