import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDateRangeShortLabel } from 'src/utils/format-time';

import { useRouteSubtrips } from 'src/query/use-route';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableSkeleton, TableHeadCustom } from 'src/components/table';

import { Label } from '../../../components/label';
import { SUBTRIP_STATUS_COLORS } from '../../subtrip/constants';
import { SUBTRIP_EXPENSE_TYPES } from '../../expense/expense-config';

export function RouteSubtripsTable({ route, title = 'Subtrips', subheader, ...other }) {
  const { _id: routeId } = route || {};
  const { data: subtrips = [], isLoading } = useRouteSubtrips(routeId);
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? subtrips : subtrips.slice(0, 6);

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

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
              { id: 'advance', label: 'Advance' },
              { id: 'status', label: 'Status' },
            ]}
          />
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : subtrips.length ? (
              <>
                {displayed.map((row, idx) => {
                  const expenses = row.expenses || [];
                  const actualAdvance = expenses
                    .filter((e) =>
                      [
                        SUBTRIP_EXPENSE_TYPES.DRIVER_ADVANCE,
                        SUBTRIP_EXPENSE_TYPES.EXTRA_ADVANCE,
                      ].includes(e.expenseType)
                    )
                    .reduce((sum, e) => sum + (e.amount || 0), 0);

                  const vehicleType = row?.tripId?.vehicleId?.vehicleType || '';
                  const noOfTyres = row?.tripId?.vehicleId?.noOfTyres;
                  const config =
                    route?.vehicleConfiguration?.find(
                      (c) =>
                        c.vehicleType.toLowerCase() === vehicleType.toLowerCase() &&
                        c.noOfTyres === noOfTyres
                    ) || {};
                  const expectedAdvance = config.advanceAmt || 0;
                  const diff = actualAdvance - expectedAdvance;
                  const color = diff === 0 ? 'success' : diff > 0 ? 'error' : 'warning';

                  return (
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
                          {row?._id}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {row?.tripId?.vehicleId?.vehicleNo}({row?.tripId?.vehicleId?.vehicleType}-
                        {row?.tripId?.vehicleId?.noOfTyres})
                      </TableCell>
                      <TableCell>{row?.tripId?.driverId?.driverName}</TableCell>
                      <TableCell>{row.loadingPoint}</TableCell>
                      <TableCell>{row.unloadingPoint}</TableCell>
                      <TableCell>{fDateRangeShortLabel(row.startDate, row.endDate)}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Label variant="soft" color={color}>
                            {fCurrency(actualAdvance)}
                          </Label>
                          <Box
                            component="span"
                            sx={{ typography: 'caption', color: 'text.secondary' }}
                          >
                            / {fCurrency(expectedAdvance)}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Label
                          variant="soft"
                          color={SUBTRIP_STATUS_COLORS[row?.subtripStatus] || 'default'}
                        >
                          {row?.subtripStatus}
                        </Label>
                      </TableCell>
                    </TableRow>
                  );
                })}
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

export default RouteSubtripsTable;
