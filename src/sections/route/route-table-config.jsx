import React from 'react';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { wrapText } from 'src/utils/change-case';

import { Label } from 'src/components/label';

export const TABLE_COLUMNS = [
  {
    id: 'routeName',
    label: 'Route Name',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row.routeName,
    render: ({ routeName, _id }) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={routeName} sx={{ mr: 2 }}>
          {routeName.slice(0, 2).toUpperCase()}
        </Avatar>
        <ListItemText
          disableTypography
          primary={
            <Tooltip title={routeName}>
              <Link
                component={RouterLink}
                to={paths.dashboard.route.details(_id)}
                variant="body2"
                noWrap
                sx={{ color: 'primary.main' }}
              >
                {wrapText(routeName, 40)}
              </Link>
            </Tooltip>
          }
        />
      </div>
    ),
  },
  {
    id: 'fromPlace',
    label: 'From Place',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.fromPlace,
  },
  {
    id: 'toPlace',
    label: 'To Place',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.toPlace,
  },
  {
    id: 'customer',
    label: 'Customer',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.customer?.customerName || '-',
  },
  {
    id: 'noOfDays',
    label: 'Number of Days',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.noOfDays,
    render: ({ noOfDays }) => (
      <Label variant="soft" color={noOfDays >= 5 ? 'success' : 'error'}>
        {noOfDays}
      </Label>
    ),
  },
  {
    id: 'distance',
    label: 'Distance',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) => row.distance,
  },
  {
    id: 'vehicleConfiguration',
    label: 'Vehicle Configurations',
    defaultVisible: true,
    disabled: false,
    align: 'center',
    getter: (row) =>
      row.vehicleConfiguration
        ?.map(
          (c) =>
            `${c.vehicleType} [${c.noOfTyres}] - Toll: ${c.tollAmt ?? '-'}, Advance: ${
              c.advanceAmt ?? '-'
            }, Fixed: ${c.fixedSalary ?? '-'}, %: ${
              c.percentageSalary ?? '-'
            }, Diesel: ${c.diesel ?? '-'}, AdBlue: ${c.adBlue ?? '-'}, FixMil: ${
              c.fixMilage ?? '-'
            }, PerfMil: ${c.performanceMilage ?? '-'}`
        )
        .join('\n') || '-',
    render: ({ vehicleConfiguration }) => (
      <Stack spacing={0.5} alignItems="center">
        {vehicleConfiguration?.length > 0 ? (
          vehicleConfiguration.map((config, idx) => (
            <Label key={idx} variant="soft" color="info">
              {`${config.vehicleType} [${config.noOfTyres}]`}
            </Label>
          ))
        ) : (
          <Label variant="soft">-</Label>
        )}
      </Stack>
    ),
  },
];
