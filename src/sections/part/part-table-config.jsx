import React from 'react';

import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { wrapText } from 'src/utils/change-case';

export const TABLE_COLUMNS = [
  {
    id: 'name',
    label: 'Part Name',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row.name,
    render: (row) => {
      const value = row.name || '';
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={value} sx={{ mr: 2 }}>
            {value.slice(0, 1).toUpperCase()}
          </Avatar>
          <ListItemText
            disableTypography
            primary={
              <Link
                component={RouterLink}
                to={paths.dashboard.part.details(row._id)}
                variant="body2"
                noWrap
                sx={{ color: 'primary.main' }}
              >
                {value}
              </Link>
            }
          />
        </div>
      );
    },
  },
  {
    id: 'partNumber',
    label: 'Part Number',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.partNumber,
  },
  {
    id: 'category',
    label: 'Category',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.category,
  },
  {
    id: 'manufacturer',
    label: 'Manufacturer',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.manufacturer,
  },
  {
    id: 'quantity',
    label: 'Quantity',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.totalQuantity,
  },
  {
    id: 'unitCost',
    label: 'Unit Cost',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row.unitCost,
    render: (row) => `₹ ${row.unitCost?.toFixed(2)}`,
  },
  {
    id: 'totalCost',
    label: 'Total Cost',
    defaultVisible: true,
    disabled: false,
    getter: (row) => {
      const cost = row.averageUnitCost || row.unitCost || 0;
      return (row.totalQuantity || 0) * cost;
    },
    render: (row) => {
      const cost = row.averageUnitCost || row.unitCost || 0;
      const total = (row.totalQuantity || 0) * cost;
      return `₹ ${total.toFixed(2)}`;
    },
  },
  {
    id: 'description',
    label: 'Description',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row.description,
    render: (row) => {
      const value = row.description || '';
      return (
        <Tooltip title={value}>
          <Typography variant="body2" noWrap>
            {wrapText(value, 40)}
          </Typography>
        </Tooltip>
      );
    },
  },
];

