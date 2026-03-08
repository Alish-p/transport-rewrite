import React from 'react';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate, fTime, fDateRangeShortLabel } from 'src/utils/format-time';


export const TABLE_COLUMNS = [
    {
        id: 'paymentId',
        label: '#',
        defaultVisible: true,
        disabled: true,
        getter: (row) => row.paymentId,
        render: ({ _id, paymentId }) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <ListItemText
                    disableTypography
                    primary={
                        <Link
                            component={RouterLink}
                            href={paths.dashboard.driverSalary.details(_id)}
                            variant="body2"
                            noWrap
                            sx={{ color: 'primary.main' }}
                        >
                            {paymentId}
                        </Link>
                    }
                />
            </div>
        ),
    },
    {
        id: 'driver',
        label: 'Driver',
        defaultVisible: true,
        disabled: false,
        getter: (row) => row.driverId?.driverName,
        render: ({ driverId }) => (
            <ListItemText
                disableTypography
                primary={
                    <Link
                        component={RouterLink}
                        href={paths.dashboard.driver.details(driverId?._id)}
                        variant="body2"
                        noWrap
                        sx={{ color: 'primary.main', cursor: 'pointer' }}
                    >
                        {driverId?.driverName}
                    </Link>
                }
                secondary={
                    <Typography
                        noWrap
                        variant="body2"
                        sx={{ color: 'text.disabled', display: 'block' }}
                    >
                        {driverId?.driverCellNo}
                    </Typography>
                }
            />
        ),
    },
    {
        id: 'issueDate',
        label: 'Issue Date',
        defaultVisible: true,
        disabled: false,
        getter: (row) => row.issueDate,
        render: ({ issueDate }) => (
            <ListItemText
                primary={fDate(new Date(issueDate))}
                secondary={fTime(new Date(issueDate))}
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
        disabled: false,
        getter: (row) => row.summary?.netIncome,
        render: ({ summary }) => (
            <ListItemText
                primary={summary?.netIncome}
                primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
        ),
    },
    {
        id: 'billingPeriod',
        label: 'Billing Period',
        defaultVisible: true,
        disabled: false,
        getter: (row) => row.billingPeriod,
        render: ({ billingPeriod }) => (
            <ListItemText
                primary={fDateRangeShortLabel(billingPeriod?.start, billingPeriod?.end)}
                primaryTypographyProps={{
                    mt: 0.5,
                    component: 'span',
                    typography: 'caption',
                    color: 'text.disabled',
                }}
            />
        ),
    },
];
