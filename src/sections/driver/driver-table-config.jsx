import React from 'react';

import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';

export const TABLE_COLUMNS = [
    {
        id: 'driverName',
        label: 'Driver',
        defaultVisible: true,
        disabled: true,
        getter: (row) => row.driverName,
        render: (value, row) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar alt={value} sx={{ mr: 2 }}>
                    {value.charAt(0).toUpperCase()}
                </Avatar>
                <ListItemText
                    disableTypography
                    primary={
                        <Link
                            component={RouterLink}
                            to={paths.dashboard.driver.details(row._id)}
                            variant="body2"
                            noWrap
                            sx={{ color: 'primary.main' }}
                        >
                            {value}
                        </Link>
                    }
                />
            </div>
        ),
    },
    {
        id: 'driverCellNo',
        label: 'Mobile',
        defaultVisible: true,
        disabled: false,
        align: 'center',
        getter: (row) => row.driverCellNo,
    },
    {
        id: 'permanentAddress',
        label: 'Address',
        defaultVisible: true,
        disabled: false,
        align: 'center',
        getter: (row) => row.permanentAddress,
    },
    {
        id: 'experience',
        label: 'Experience',
        defaultVisible: true,
        disabled: false,
        align: 'center',
        getter: (row) => row.experience,
    },
    {
        id: 'licenseTo',
        label: 'License Valid Till',
        defaultVisible: true,
        disabled: false,
        align: 'center',
        getter: (row) => (row.licenseTo ? fDate(row.licenseTo) : '-'),
    },
    {
        id: 'aadharNo',
        label: 'Aadhar No',
        defaultVisible: false,
        disabled: false,
        align: 'center',
        getter: (row) => row.aadharNo,
    },
    {
        id: 'status',
        label: 'Status',
        defaultVisible: true,
        disabled: false,
        align: 'center',
        getter: (row) => row.status,
        render: (value) => (
            <Label variant="soft" color={value === 'expired' ? 'error' : 'success'}>
                {value}
            </Label>
        ),
    },
];

