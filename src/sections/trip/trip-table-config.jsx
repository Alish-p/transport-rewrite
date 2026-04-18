import React from 'react';

import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fNumber } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

import { JobsPopoverCell } from './trip-jobs-popover-cell';


export const TABLE_COLUMNS = [
  {
    id: 'tripId',
    label: 'Trip No',
    defaultVisible: true,
    disabled: false,
    align: 'left',
    getter: (row) => row.tripNo,
    render: (row) => (
      <Link
        component={RouterLink}
        to={paths.dashboard.trip.details(row._id)}
        variant="body2"
        noWrap
        sx={{ color: 'primary.main' }}
      >
        {row.tripNo}
      </Link>
    ),
  },
  {
    id: 'vehicleNo',
    label: 'Vehicle Number',
    defaultVisible: true,
    disabled: true,
    align: 'left',
    getter: (row) => row.vehicleId?.vehicleNo,
    render: (row) => {
      const value = row.vehicleId?.vehicleNo;
      return (
        <ListItemText
          primary={value}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      );
    },
  },
  {
    id: 'driverName',
    label: 'Driver Name',
    defaultVisible: true,
    disabled: false,
    align: 'left',
    getter: (row) => {
      const drivers = new Set();
      if (row.subtrips && row.subtrips.length > 0) {
        row.subtrips.forEach((st) => {
          if (st.driverId?.driverName) drivers.add(st.driverId.driverName);
        });
      }
      return drivers.size > 0 ? Array.from(drivers).join(', ') : '-';
    },
  },
  {
    id: 'tripStatus',
    label: 'Trip Status',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.tripStatus,
    render: (row) => (
      <Label variant="soft" color={row.tripStatus === 'open' ? 'warning' : 'success'}>
        {row.tripStatus}
      </Label>
    ),
  },
  {
    id: 'jobs',
    label: 'Jobs',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.subtrips?.length || 0,
    render: (row) => <JobsPopoverCell row={row} />,
  },
  {
    id: 'fromDate',
    label: 'From Date',
    defaultVisible: true,
    disabled: false,
    align: 'left',
    getter: (row) => row.fromDate,
    render: (row) => (
      <ListItemText
        primary={fDate(new Date(row.fromDate))}
        secondary={fTime(new Date(row.fromDate))}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
      />
    ),
  },
  {
    id: 'toDate',
    label: 'To Date',
    defaultVisible: false,
    disabled: false,
    align: 'left',
    getter: (row) => row.toDate,
    render: (row) => (
      <ListItemText
        primary={row.toDate ? fDate(new Date(row.toDate)) : '--'}
        secondary={row.toDate ? fTime(new Date(row.toDate)) : '--'}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
      />
    ),
  },
  {
    id: 'remarks',
    label: 'Remarks',
    defaultVisible: false,
    disabled: false,
    align: 'left',
    getter: (row) => row.remarks,
  },
  {
    id: 'totalIncome',
    label: 'Total Income',
    defaultVisible: false,
    disabled: false,
    align: 'center',
    getter: (row) => row.cachedTotalIncome || 0,
    render: (row) => fNumber(row.cachedTotalIncome || 0),
  },
  {
    id: 'totalExpense',
    label: 'Total Expense',
    defaultVisible: false,
    disabled: false,
    align: 'center',
    getter: (row) => row.cachedTotalExpense || 0,
    render: (row) => fNumber(row.cachedTotalExpense || 0),
  },
  {
    id: 'profitAndLoss',
    label: 'Profit & Loss',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => (row.cachedTotalIncome || 0) - (row.cachedTotalExpense || 0),
    render: (row) => {
      const pnl = (row.cachedTotalIncome || 0) - (row.cachedTotalExpense || 0);
      return (
        <Label variant="soft" color={pnl >= 0 ? 'success' : 'error'}>
          {fNumber(pnl)}
        </Label>
      );
    },
  },
  {
    id: 'totalKm',
    label: 'Total KM',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.totalKm || 0,
    render: (row) => `${fNumber(row.totalKm || 0)} km`,
  },
  {
    id: 'totalDieselLtr',
    label: 'Total Diesel Ltr',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.cachedTotalDieselLtr || 0,
    render: (row) => `${fNumber(row.cachedTotalDieselLtr || 0)} Ltr`,
  },
];
