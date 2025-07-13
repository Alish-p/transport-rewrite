import dayjs from 'dayjs';
import { useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import { Select, MenuItem, FormControl } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fNumber } from 'src/utils/format-number';

import { useMonthlyDriverSubtrips } from 'src/query/use-dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableSkeleton, TableHeadCustom } from 'src/components/table';

export function DriverInsightsTable({ title, subheader, ...other }) {
  const today = dayjs();
  const currentMonthIndex = today.month();
  const monthOptions = Array.from({ length: currentMonthIndex + 1 }, (_, i) => {
    const m = today.month(i);
    return { label: m.format('MMM-YYYY'), value: m.format('YYYY-MM') };
  });

  const [selectedMonth, setSelectedMonth] = useState(monthOptions[currentMonthIndex].value);

  const { data: summary = [], isLoading } = useMonthlyDriverSubtrips(selectedMonth);

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        sx={{ mb: 3 }}
        action={
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
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
        <Table sx={{ minWidth: 480 }}>
          <TableHeadCustom
            headLabel={[
              { id: 'index', label: 'No.' },
              { id: 'driverName', label: 'Driver' },
              { id: 'subtripCount', label: 'Subtrips' },
              { id: 'totalWeight', label: 'Total Weight' },
            ]}
          />
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : summary.length ? (
              <>
                {summary.map((row, idx) => (
                  <TableRow key={row.driverId}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <RouterLink
                        to={paths.dashboard.driver.details(row.driverId)}
                        style={{ color: 'green' }}
                      >
                        {row.driverName}
                      </RouterLink>
                    </TableCell>
                    <TableCell>{row.subtripCount}</TableCell>
                    <TableCell>{fNumber(row.totalLoadingWeight)}</TableCell>
                  </TableRow>
                ))}
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
