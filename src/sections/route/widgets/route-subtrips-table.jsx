import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDateRangeShortLabel } from 'src/utils/format-time';

import { usePaginatedSubtrips } from 'src/query/use-subtrip';

import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { Label } from '../../../components/label';
import { getVehicleTypeTyreColor } from '../constants';
import { SUBTRIP_STATUS_COLORS } from '../../subtrip/constants';
import { SUBTRIP_EXPENSE_TYPES } from '../../expense/expense-config';

export function RouteSubtripsTable({ route, title = 'Subtrips', subheader, ...other }) {
  const { _id: routeId } = route || {};
  const table = useTable({ defaultOrderBy: 'createDate', defaultRowsPerPage: 5 });

  const { data, isLoading } = usePaginatedSubtrips({
    page: table.page + 1,
    rowsPerPage: table.rowsPerPage,
    routeId,
  });

  const subtrips = data?.results || [];
  const totalCount = data?.total || 0;

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <Scrollbar sx={{ minHeight: 402, maxHeight: 402 }}>
        <Table sx={{ minWidth: 720 }}>
          <TableHeadCustom
            headLabel={[
              { id: 'index', label: 'No.' },
              { id: 'id', label: 'Subtrip' },
              { id: 'vehicleNo', label: 'Vehicle' },
              { id: 'vehicleType', label: 'Vehicle Type' },
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
                {subtrips.map((row, idx) => {
                  const expenses = row.expenses || [];
                  const actualAdvance = expenses
                    .filter((e) =>
                      [
                        SUBTRIP_EXPENSE_TYPES.DRIVER_ADVANCE,
                        SUBTRIP_EXPENSE_TYPES.EXTRA_ADVANCE,
                      ].includes(e.expenseType)
                    )
                    .reduce((sum, e) => sum + (e.amount || 0), 0);

                  const vehicleType = row?.vehicleId?.vehicleType || '';
                  const noOfTyres = row?.vehicleId?.noOfTyres;
                  const vehicleColor = getVehicleTypeTyreColor(vehicleType, noOfTyres);
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
                      <TableCell>{table.page * table.rowsPerPage + idx + 1}</TableCell>
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
                      <TableCell>{row?.vehicleId?.vehicleNo}</TableCell>
                      <TableCell>
                        <Label variant="soft" color={vehicleColor}>
                          {vehicleType} {noOfTyres}
                        </Label>
                      </TableCell>
                      <TableCell>{row?.driverId?.driverName}</TableCell>
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

      <TablePaginationCustom
        count={totalCount}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </Card>
  );
}

export default RouteSubtripsTable;
