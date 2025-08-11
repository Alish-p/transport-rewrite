import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { useCustomerInvoices } from 'src/query/use-customer';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableSkeleton, TableHeadCustom } from 'src/components/table';

export function CustomerInvoicesTable({ customer, title, subheader, ...other }) {
  const { _id: customerId } = customer || {};
  const { data: invoices = [], isLoading } = useCustomerInvoices(customerId);

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <Scrollbar>
        <Table sx={{ minWidth: 720 }}>
          <TableHeadCustom
            headLabel={[
              { id: 'index', label: 'No.' },
              { id: 'invoiceNo', label: 'Invoice' },
              { id: 'invoiceStatus', label: 'Status', align: 'center' },
              { id: 'issueDate', label: 'Issue Date' },
              { id: 'dueDate', label: 'Due Date' },
              { id: 'netTotal', label: 'Amount', align: 'right' },
            ]}
          />

          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : invoices.length ? (
              invoices.map((row, idx) => {
                const invoiceNo = row.invoiceNo || row.invoiceNumber;
                const invoiceStatus = row.invoiceStatus || row.status;
                const issueDate = row.issueDate || row.invoiceDate;
                const amount = row.netTotal ?? row.totalAmount;

                return (
                  <TableRow key={row._id}>
                    <TableCell>{idx + 1}</TableCell>

                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={paths.dashboard.invoice.details(row._id)}
                        variant="body2"
                        noWrap
                        sx={{ color: 'primary.main' }}
                      >
                        {invoiceNo}
                      </Link>
                    </TableCell>

                    <TableCell align="center">
                      <Label
                        variant="soft"
                        color={
                          invoiceStatus === 'paid'
                            ? 'success'
                            : invoiceStatus === 'over-due'
                              ? 'error'
                              : 'warning'
                        }
                      >
                        {invoiceStatus}
                      </Label>
                    </TableCell>

                    <TableCell>
                      <ListItemText
                        primary={issueDate ? fDate(new Date(issueDate)) : '-'}
                        secondary={issueDate ? fTime(new Date(issueDate)) : null}
                        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                        secondaryTypographyProps={{
                          mt: 0.5,
                          component: 'span',
                          typography: 'caption',
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <ListItemText
                        primary={row.dueDate ? fDate(new Date(row.dueDate)) : '-'}
                        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <ListItemText
                        primary={fCurrency(amount || 0)}
                        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableNoData notFound />
            )}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
}

export default CustomerInvoicesTable;
