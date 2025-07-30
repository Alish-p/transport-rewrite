import dayjs from 'dayjs';
import { useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import { Link, Select, MenuItem, FormControl } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fNumber } from 'src/utils/format-number';

import { useMonthlyVehicleSubtrips } from 'src/query/use-dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableSkeleton, TableHeadCustom } from 'src/components/table';
import { Iconify } from 'src/components/iconify';

export function VehicleInsightsTable({ title, subheader, ...other }) {
  const today = dayjs();
  const currentMonthIndex = today.month();
  const monthOptions = Array.from({ length: currentMonthIndex + 1 }, (_, i) => {
    const m = today.month(i);
    return { label: m.format('MMM-YYYY'), value: m.format('YYYY-MM') };
  });

  const [selectedMonth, setSelectedMonth] = useState(monthOptions[currentMonthIndex].value);
  const [showAll, setShowAll] = useState(false);

  const { data: summary = [], isLoading } = useMonthlyVehicleSubtrips(selectedMonth);
  const displayedSummary = showAll ? summary : summary.slice(0, 6);

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

      <Scrollbar sx={{ minHeight: 402, ...(showAll && { maxHeight: 402 }) }}>
        <Table sx={{ minWidth: 480 }}>
          <TableHeadCustom
            headLabel={[
              { id: 'index', label: 'No.' },
              { id: 'vehicleNo', label: 'Vehicle' },
              { id: 'totalKm', label: 'Total Km' },
              { id: 'totalDiesel', label: 'Total Diesel' },
              { id: 'subtripCount', label: 'Subtrips' },
              { id: 'totalWeight', label: 'Total Weight' },
            ]}
          />
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : summary.length ? (
              <>
                {displayedSummary.map((row, idx) => (
                  <TableRow key={row.vehicleId}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={paths.dashboard.vehicle.details(row.vehicleId)}
                        variant="body2"
                        noWrap
                        sx={{ color: 'primary.main' }}
                      >
                        {row.vehicleNo}
                      </Link>
                    </TableCell>
                    <TableCell>{fNumber(row.totalKm)} Km </TableCell>
                    <TableCell>{fNumber(row.totalDiesel)} L</TableCell>
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

      {summary.length > 6 && (
        <>
          <Divider sx={{ borderStyle: 'dashed' }} />

          <Box sx={{ p: 2, textAlign: 'right' }}>
            <Button
              size="small"
              color="inherit"
              onClick={() => setShowAll((prev) => !prev)}
              endIcon={
                <Iconify
                  icon={showAll ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-forward-fill'}
                  width={18}
                  sx={{ ml: -0.5 }}
                />
              }
            >
              {showAll ? 'View less' : 'View all'}
            </Button>
          </Box>
        </>
      )}

    </Card>
  );
}
