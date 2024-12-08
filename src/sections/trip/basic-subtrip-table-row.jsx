import { useNavigate } from 'react-router-dom';

import { Link, TableRow, TableCell } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';
import { paramCase } from 'src/utils/change-case';

import { Label } from 'src/components/label';

import { subtripConfig } from './basic-subtrip-table-config';

// ----------------------------------------------------------------------

export default function SubtripListRow({ row }) {
  const navigate = useNavigate();

  return (
    <TableRow>
      {subtripConfig.map((column) => (
        <TableCell key={column.id} align="start">
          {(() => {
            switch (column.id) {
              case '_id':
                return (
                  <Link
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                      navigate(paths.dashboard.subtrip.details(paramCase(row._id)));
                    }}
                  >
                    # {row._id}
                  </Link>
                );
              case 'customerId':
                return row?.customerId?.customerName ?? '-';
              case 'routeName':
                return row?.routeCd?.routeName ?? '-';
              case 'invoiceNo':
                return row.invoiceNo;
              case 'startDate':
                return fDate(row[column.id]);
              case 'subtripStatus':
                return (
                  <Label
                    variant="soft"
                    color={
                      (row[column.id] === 'In-queue' && 'primary') ||
                      (row[column.id] === 'Loaded' && 'secondary') ||
                      (row[column.id] === 'pending' && 'info') ||
                      (row[column.id] === 'pending' && 'success') ||
                      (row[column.id] === 'pending' && 'warning') ||
                      'default'
                    }
                  >
                    {row[column.id]}
                  </Label>
                );

              default:
                return row[column.id];
            }
          })()}
        </TableCell>
      ))}
    </TableRow>
  );
}
