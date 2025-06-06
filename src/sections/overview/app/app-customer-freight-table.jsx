import { useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import { Select, TableRow, TableCell, FormControl } from '@mui/material';

import { useCustomerMonthlyFreight } from 'src/query/use-dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

import { fNumber, fCurrency } from '../../../utils/format-number';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'index', label: "No." },
    { id: 'customer', label: 'Customer' },
    { id: 'totalWeight', label: 'Total Weight' },
    { id: 'freightAmount', label: 'Freight Amount' },
];

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];


// ----------------------------------------------------------------------


export function CustomerFreightTable({ title, subheader, ...other }) {


    const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);

    // Convert "April" → "2025-04" (current year is 2025 in Asia/Kolkata timezone)
    const year = new Date().getFullYear();
    const monthIndex = MONTHS.indexOf(month); // 0-based
    const formattedMonth = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;

    // Expects YYYY-MM "2025-04"
    const { data: summary = [], isLoading } = useCustomerMonthlyFreight(formattedMonth);

    const handleChangeMonth = (event) => {
        setMonth(event.target.value);
    };



    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} action={
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select value={month} onChange={handleChangeMonth} >
                        {MONTHS.map((m) => (
                            <MenuItem key={m} value={m}>
                                {m}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            }
            />

            <Scrollbar sx={{ minHeight: 402, maxHeight: 410 }}>
                <Table sx={{ minWidth: 680 }}>
                    <TableHeadCustom headLabel={TABLE_HEAD} />

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : summary.length ? (
                            summary.map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{row.customerName}</TableCell>
                                    <TableCell>{fNumber(row.totalLoadingWeight)}</TableCell>
                                    <TableCell>{fCurrency(row.totalFreightAmount)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No data
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Scrollbar>
        </Card>
    );
}


