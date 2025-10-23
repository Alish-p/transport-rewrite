import Box from '@mui/material/Box';
import { Link } from '@mui/material';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTopRoutes } from 'src/query/use-dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableSkeleton, TableHeadCustom } from 'src/components/table';

export function TopRoutesTable({ ...other }) {
  const { data: routes = [], isLoading } = useTopRoutes();

  return (
    <Box {...other}>

      <Scrollbar sx={{ minHeight: 402, maxHeight: 402 }}>
        <Table sx={{ minWidth: 680 }}>
          <TableHeadCustom
            headLabel={[
              { id: 'index', label: 'No.' },
              { id: 'routeName', label: 'Route' },
              { id: 'fromPlace', label: 'From' },
              { id: 'toPlace', label: 'To' },
              { id: 'count', label: 'Jobs' },
            ]}
          />
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : routes.length ? (
              <>
                {routes.map((row, idx) => (
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
    </Box>
  );
}
