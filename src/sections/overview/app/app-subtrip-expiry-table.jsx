import { Link } from '@mui/material';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fToNow } from 'src/utils/format-time';

import { useSubtripsExpiry } from 'src/query/use-dashboard';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableSkeleton, TableHeadCustom } from 'src/components/table';

export function SubtripExpiryTable({ title, subheader, ...other }) {
  const { data: subtrips = [], isLoading } = useSubtripsExpiry();

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <Scrollbar sx={{ minHeight: 402, maxHeight: 402 }}>
        <Table sx={{ minWidth: 680 }}>
          <TableHeadCustom
            headLabel={[
              { id: 'index', label: 'No.' },
              { id: 'subtripId', label: 'Subtrip ID' },
              { id: 'vehicle', label: 'Vehicle' },
              { id: 'customer', label: 'Customer' },
              { id: 'ewayExpiryDate', label: 'Eway Expiry' },
              { id: 'unloadingPoint', label: 'Unloading Point' },
              { id: 'expired', label: 'Status' },
            ]}
          />
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : subtrips.length ? (
              <>
                {subtrips.map((row, idx) => (
                  <TableRow key={row.subtripId}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={paths.dashboard.subtrip.details(row.subtripId)}
                        variant="body2"
                        noWrap
                        sx={{ color: 'primary.main' }}
                      >
                        {row.subtripId}
                      </Link>
                    </TableCell>
                    <TableCell>{row.vehicle}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>{fToNow(new Date(row.ewayExpiryDate))}</TableCell>
                    <TableCell>{row.unloadingPoint}</TableCell>
                    <TableCell>
                      <Label variant="soft" color={row.expired ? 'error' : 'success'}>
                        {row.expired ? 'Expired' : 'Valid'}
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
    </Card>
  );
}
