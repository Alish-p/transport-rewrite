import React from 'react';

import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fDateTimeDuration } from 'src/utils/format-time';

import { Label } from 'src/components/label';

import {
  WORK_ORDER_STATUS_LABELS,
  WORK_ORDER_STATUS_COLORS,
  WORK_ORDER_PRIORITY_LABELS,
  WORK_ORDER_PRIORITY_COLORS,
} from './work-order-config';

export const TABLE_COLUMNS = [
  {
    id: 'workOrderNo',
    label: 'WO No.',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row.workOrderNo,
    render: (row) => {
      const value = row.workOrderNo || '-';
      return (
        <ListItemText
          disableTypography
          primary={
            <Link
              component={RouterLink}
              to={paths.dashboard.workOrder.details(row._id)}
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
    id: 'vehicle',
    label: 'Vehicle',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row.vehicle?.vehicleNo,
    render: (row) => {
      const value = row.vehicle?.vehicleNo || '';
      return (
        <ListItemText
          disableTypography
          primary={
            <Link
              component={RouterLink}
              to={paths.dashboard.workOrder.details(row._id)}
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
    id: 'status',
    label: 'Status',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.status,
    render: (row) => {
      const label = WORK_ORDER_STATUS_LABELS[row.status] || row.status || 'Unknown';
      const color = WORK_ORDER_STATUS_COLORS[row.status] || 'default';
      return (
        <Label variant="soft" color={color}>
          {label}
        </Label>
      );
    },
  },
  {
    id: 'priority',
    label: 'Priority',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.priority,
    render: (row) => {
      const label = WORK_ORDER_PRIORITY_LABELS[row.priority] || row.priority || 'Unknown';
      const color = WORK_ORDER_PRIORITY_COLORS[row.priority] || 'default';
      return (
        <Label variant="soft" color={color}>
          {label}
        </Label>
      );
    },
  },
  {
    id: 'category',
    label: 'Category',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.category,
    render: (row) => {
      const value = row.category;
      if (!value) return '-';
      return (
        <Label variant="soft" color="default">
          {value}
        </Label>
      );
    },
  },
  {
    id: 'timeTaken',
    label: 'Time Taken',
    defaultVisible: true,
    disabled: false,
    getter: (row) => {
      if (!row.actualStartDate || !row.completedDate) return '-';
      return fDateTimeDuration(row.actualStartDate, row.completedDate);
    },
    render: (row) => {
      if (!row.actualStartDate || !row.completedDate) return '-';
      return fDateTimeDuration(row.actualStartDate, row.completedDate);
    },
  },
  {
    id: 'issueAssignees',
    label: 'Issue Assignees',
    defaultVisible: true,
    disabled: false,
    getter: (row) => {
      const issues = row.issues || [];
      const names = issues
        .map((issue) => {
          if (!issue || typeof issue !== 'object' || !issue.assignedTo) return null;
          return issue.assignedTo.name || issue.assignedTo.customerName || null;
        })
        .filter(Boolean);
      const unique = Array.from(new Set(names));
      return unique.join(', ');
    },
  },
  {
    id: 'scheduledStartDate',
    label: 'Scheduled Start',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.scheduledStartDate,
    render: (row) => {
      const value = row.scheduledStartDate;
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
  {
    id: 'completedDate',
    label: 'Completed On',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.completedDate,
    render: (row) => {
      const value = row.completedDate;
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
  {
    id: 'totalCost',
    label: 'Total Cost',
    defaultVisible: true,
    disabled: false,
    align: 'right',
    getter: (row) => row.totalCost,
    render: (row) => fCurrency(row.totalCost || 0),
  },
];
