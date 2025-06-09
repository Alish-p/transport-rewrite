import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fCurrency } from 'src/utils/format-number';

import { useFinancialMonthlyData } from 'src/query/use-dashboard';

import { Chart, useChart, ChartSelect } from 'src/components/chart';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function FinancialMonthlyChart({ title, ...other }) {
    const theme = useTheme();
    const { data } = useFinancialMonthlyData();

    const categoryOptions = useMemo(
        () => [
            { key: 'invoiceAmount', label: 'Invoice amount', color: theme.palette.primary.main },
            {
                key: 'transporterPayment',
                label: 'Transporter payment',
                color: theme.palette.warning.main,
            },
            { key: 'driverSalary', label: 'Driver salary', color: theme.palette.info.main },
            { key: 'loanDisbursed', label: 'Loan disbursed', color: theme.palette.error.main },
        ],
        [theme]
    );

    const [selected, setSelected] = useState(categoryOptions[0].label);

    const handleChange = useCallback((newValue) => {
        setSelected(newValue);
    }, []);

    const currentOption = categoryOptions.find((c) => c.label === selected);

    const chartSeries =
        data && currentOption ? [{ name: currentOption.label, data: data[currentOption.key] }] : [];

    const chartOptions = useChart({
        xaxis: { categories: MONTHS },
        colors: currentOption ? [currentOption.color] : [theme.palette.primary.main],
        yaxis: { labels: { formatter: (value) => Math.round(value) } },
        tooltip: { y: { formatter: (value) => fCurrency(value) } },
    });

    return (
        <Card {...other}>
            <CardHeader
                title={title}
                subheader={data ? `Year ${data.year}` : ''}
                action={
                    <ChartSelect
                        options={categoryOptions.map((c) => c.label)}
                        value={selected}
                        onChange={handleChange}
                    />
                }
            />
            <Chart
                type="line"
                series={chartSeries}
                options={chartOptions}
                height={320}
                sx={{ py: 2.5, pl: 1, pr: 2.5 }}
            />
        </Card>
    );
}
