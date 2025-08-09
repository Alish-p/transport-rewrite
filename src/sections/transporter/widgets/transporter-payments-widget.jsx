import { useState } from 'react';

import Box from '@mui/material/Box';
import { Link } from '@mui/material';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useTransporterPayments } from 'src/query/use-transporter-payment';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableSkeleton, TableHeadCustom } from 'src/components/table';

export function TransporterPaymentsWidget({ transporterId, title = 'Payments', subheader, ...other }) {
  const { data: payments = [], isLoading } = useTransporterPayments(transporterId);
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? payments : payments.slice(0, 6);

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <Scrollbar sx={{ minHeight: 364, ...(showAll && { maxHeight: 364 }) }}>
        <Table sx={{ minWidth: 680 }}>
          <TableHeadCustom
            headLabel={[
              { id: 'index', label: 'No.' },
              { id: 'receiptNo', label: 'Receipt No.' },
              { id: 'issueDate', label: 'Issue Date' },
              { id: 'paymentMode', label: 'Mode' },
              { id: 'amount', label: 'Amount' },
            ]}
          />
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : payments.length ? (
              <>
                {displayed.map((row, idx) => (
                  <TableRow key={row._id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={paths.dashboard.transporterPayment.details(row._id)}
                        variant="body2"
                        noWrap
                        sx={{ color: 'primary.main' }}
                      >
                        {row.receiptNo}
                      </Link>
                    </TableCell>
                    <TableCell>{fDate(new Date(row.issueDate))}</TableCell>
                    <TableCell>{row.paymentMode}</TableCell>
                    <TableCell>{fCurrency(row.amount)}</TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <TableNoData notFound />
            )}
          </TableBody>
        </Table>
      </Scrollbar>

      {payments.length > 6 && (
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

export default TransporterPaymentsWidget;

