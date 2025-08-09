import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { useDriverSubtrips } from 'src/query/use-driver';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableSkeleton, TableHeadCustom } from 'src/components/table';

import { SUBTRIP_STATUS_COLORS } from 'src/sections/subtrip/constants';

export function DriverSubtripsTable({ driver }) {
  const { _id: driverId } = driver || {};
  const { data: subtrips = [], isLoading } = useDriverSubtrips(driverId);
  const [showAll, setShowAll] = useState(false);
  const displayedSubtrips = showAll ? subtrips : subtrips.slice(0, 6);

  return (
    <Card>
      <CardHeader title="🧾 Subtrips" subheader="Subtrips done by this driver" sx={{ mb: 3 }} />

      <Scrollbar sx={{ minHeight: 402, ...(showAll && { maxHeight: 402 }) }}>
        <Table sx={{ minWidth: 720 }}>
          <TableHeadCustom
            headLabel={[
              { id: 'index', label: 'No.' },
              { id: 'id', label: 'Subtrip' },
              { id: 'vehicleNo', label: 'Vehicle' },
              { id: 'driverName', label: 'Driver' },
              { id: 'loadingPoint', label: 'Loading' },
              { id: 'unloadingPoint', label: 'Unloading' },
              { id: 'time', label: 'time' },
              { id: 'status', label: 'Status' },
            ]}
          />
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : subtrips.length ? (
              <>
                {displayedSubtrips.map((row, idx) => (
                  <TableRow key={row._id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={paths.dashboard.subtrip.details(row._id)}
                        variant="body2"
                        noWrap
                        sx={{ color: 'primary.main' }}
                      >
                        {row._id}
                      </Link>
                    </TableCell>
                    <TableCell>{row?.tripId?.vehicleId?.vehicleNo}</TableCell>

                    <TableCell>{row?.tripId?.driverId?.driverName}</TableCell>
                    <TableCell>{row.loadingPoint}</TableCell>
                    <TableCell>{row.unloadingPoint}</TableCell>
                    <TableCell>{fDateRangeShortLabel(row.startDate, row.endDate)}</TableCell>

                    <TableCell>
                      <Label
                        variant="soft"
                        color={SUBTRIP_STATUS_COLORS[row?.subtripStatus] || 'default'}
                      >
                        {row?.subtripStatus}
                      </Label>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <TableNoData notFound />
            )}
          </TableBody>
        </Table>
      </Scrollbar>

      {subtrips.length > 6 && (
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

export default DriverSubtripsTable;
