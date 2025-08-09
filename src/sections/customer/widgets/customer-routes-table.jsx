import { useState } from 'react';

import Box from '@mui/material/Box';
import { Link } from '@mui/material';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useCustomerRoutes } from 'src/query/use-customer';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableSkeleton, TableHeadCustom } from 'src/components/table';

export function CustomerRoutesTable({ customer, title, subheader, ...other }) {
  const { _id: customerId } = customer || {};
  const { data: routes = [], isLoading } = useCustomerRoutes(customerId);
  const [showAll, setShowAll] = useState(false);
  const displayedRoutes = showAll ? routes : routes.slice(0, 6);

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <Scrollbar sx={{ minHeight: 402, ...(showAll && { maxHeight: 402 }) }}>
        <Table sx={{ minWidth: 680 }}>
          <TableHeadCustom
            headLabel={[
              { id: 'index', label: 'No.' },
              { id: 'routeName', label: 'Route' },
              { id: 'fromPlace', label: 'From' },
              { id: 'toPlace', label: 'To' },
              { id: 'count', label: 'Subtrips' },
            ]}
          />
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : routes.length ? (
              <>
                {displayedRoutes.map((row, idx) => (
                  <TableRow key={row.routeId}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={paths.dashboard.route.details(row.routeId)}
                        variant="body2"
                        noWrap
                        sx={{ color: 'primary.main' }}
                      >
                        {row.routeName}
                      </Link>
                    </TableCell>
                    <TableCell>{row.fromPlace}</TableCell>
                    <TableCell>{row.toPlace}</TableCell>
                    <TableCell>
                      <Tooltip
                        title={`Own: ${row.ownSubtripCount} Market: ${row.marketSubtripCount}`}
                      >
                        <span>{row.subtripCount}</span>
                      </Tooltip>
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

      {routes.length > 6 && (
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

export default CustomerRoutesTable;

