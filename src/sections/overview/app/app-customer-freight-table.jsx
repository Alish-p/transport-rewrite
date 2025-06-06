import dayjs from 'dayjs';
import { useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import { Select, TableRow, TableCell, FormControl } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fNumber, fCurrency } from 'src/utils/format-number';

import { useCustomerMonthlyFreight } from 'src/query/use-dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableSkeleton, TableHeadCustom } from 'src/components/table';

export function CustomerFreightTable({ title, subheader, ...other }) {
    // get current year/month
    const today = dayjs();
    const currentYear = today.year();
    const currentMonthIndex = today.month(); // 0-based

    // build list of { label: 'Jan-2025', value: '2025-01' } up to current month
    const monthOptions = Array.from({ length: currentMonthIndex + 1 }, (_, i) => {
        const m = today.month(i);
        return {
            label: m.format('MMM-YYYY'),
            value: m.format('YYYY-MM'),
        };
    });

    // selected value is the API format 'YYYY-MM'
    const [selectedMonth, setSelectedMonth] = useState(monthOptions[currentMonthIndex].value);

    const { data: summary = [], isLoading } = useCustomerMonthlyFreight(selectedMonth);

    return (
        <Card {...other}>
            <CardHeader
                title={title}
                subheader={subheader}
                sx={{ mb: 3 }}
                action={
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <Select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            {monthOptions.map(({ label, value }) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                }
            />

            <Scrollbar sx={{ minHeight: 402, maxHeight: 402 }}>
                <Table sx={{ minWidth: 680 }}>
                    <TableHeadCustom
                        headLabel={[
                            { id: 'index', label: 'No.' },
                            { id: 'customer', label: 'Customer' },
                            { id: 'totalWeight', label: 'Total Weight', align: 'right' },
                            { id: 'freightAmount', label: 'Freight Amount', align: 'right' },
                        ]}
                    />
                    <TableBody>
                        {isLoading ? (
                            <TableSkeleton />
                        ) : summary.length ? (
                            <>
                                {summary.map((row, idx) => (
                                    <TableRow key={row.customerId}>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell>
                                            <RouterLink
                                                to={paths.dashboard.customer.details(row.customerId)}
                                                style={{ color: 'green' }}
                                            >
                                                {row.customerName}
                                            </RouterLink>
                                        </TableCell>
                                        <TableCell align="right">{fNumber(row.totalLoadingWeight)}</TableCell>
                                        <TableCell align="right">{fCurrency(row.totalFreightAmount)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={2}>Totals</TableCell>
                                    <TableCell align="right">
                                        {fNumber(summary.reduce((sum, r) => sum + r.totalLoadingWeight, 0))}
                                    </TableCell>
                                    <TableCell align="right">
                                        {fCurrency(summary.reduce((sum, r) => sum + r.totalFreightAmount, 0))}
                                    </TableCell>
                                </TableRow>
                            </>
                        ) : (
                            <TableNoData notFound />
                        )}
                    </TableBody>
                </Table>
            </Scrollbar>
        </Card>
    );
}
