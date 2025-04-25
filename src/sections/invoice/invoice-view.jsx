import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';
import { useInvoice } from 'src/query/use-invoice';

import { Label } from 'src/components/label';

import { loadingWeightUnit } from '../vehicle/vehicle-config';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
}));

function RenderHeader({ invoice }) {
  const { invoiceNo, invoiceStatus } = invoice || {};
  return (
    <Box
      rowGap={3}
      display="grid"
      alignItems="center"
      gridTemplateColumns={{ xs: '1fr', sm: '1fr auto' }}
    >
      <Box
        component="img"
        alt="logo"
        src="/logo/company-logo-green.png"
        sx={{ width: 60, height: 60, mb: 3 }}
      />
      <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
        <Label
          variant="soft"
          color={
            invoiceStatus === 'paid'
              ? 'success'
              : invoiceStatus === 'pending'
                ? 'warning'
                : invoiceStatus === 'overdue'
                  ? 'error'
                  : 'default'
          }
        >
          {invoiceStatus || 'Draft'}
        </Label>
        <Typography variant="h6">{invoiceNo || 'INV - XXX'}</Typography>
      </Stack>
    </Box>
  );
}

function RenderAddress({ title, details }) {
  return (
    <Stack sx={{ typography: 'body2' }}>
      <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {details && details}
    </Stack>
  );
}

function RenderDateInfo({ issueDate, dueDate }) {
  return (
    <>
      <RenderAddress title="Created" details={issueDate && fDate(issueDate)} />
      <RenderAddress title="Due Date" details={dueDate && fDate(dueDate)} />
    </>
  );
}

function RenderTable({ invoice }) {
  const { taxBreakup, totalAfterTax, totalAmountBeforeTax, subtripSnapshot = [] } = invoice || {};
  const { cgst, sgst, igst } = taxBreakup || {};
  const navigate = useNavigate();

  return (
    <TableContainer sx={{ overflowX: 'auto', mt: 4 }}>
      <Table sx={{ minWidth: 960 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell width={40}>#</StyledTableCell>
            <StyledTableCell>Consignee</StyledTableCell>
            <StyledTableCell>Destination</StyledTableCell>
            <StyledTableCell>Vehicle No</StyledTableCell>
            <StyledTableCell>LR No</StyledTableCell>
            <StyledTableCell>Disp Date</StyledTableCell>
            <StyledTableCell>QTY</StyledTableCell>
            <StyledTableCell>Freight Rate</StyledTableCell>
            <StyledTableCell>Total Amount</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subtripSnapshot.map((st, index) => (
            <TableRow key={st.subtripId}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{st.consignee}</TableCell>
              <TableCell>{st.unloadingPoint}</TableCell>
              <TableCell>{st.vehicleNo}</TableCell>
              <TableCell
                sx={{ color: 'success.main', cursor: 'pointer' }}
                onClick={() => navigate(paths.dashboard.subtrip.details(st.subtripId))}
              >
                {st.subtripId}
              </TableCell>
              <TableCell>{fDate(st.startDate)}</TableCell>
              <TableCell>
                {st.loadingWeight || 0} {loadingWeightUnit[st.tripId?.vehicleId?.vehicleType]}
              </TableCell>
              <TableCell>{fCurrency(st.rate || 0)}</TableCell>
              <TableCell>{fCurrency(st.totalAmount || 0)}</TableCell>
            </TableRow>
          ))}

          <StyledTableRow>
            <TableCell colSpan={7} />
            <StyledTableCell>Total</StyledTableCell>
            <TableCell>{fCurrency(totalAmountBeforeTax)}</TableCell>
          </StyledTableRow>

          {cgst?.rate > 0 && (
            <StyledTableRow>
              <TableCell colSpan={7} />
              <StyledTableCell>CGST {cgst.rate}%</StyledTableCell>
              <TableCell>{fCurrency(cgst.amount)}</TableCell>
            </StyledTableRow>
          )}

          {sgst?.rate > 0 && (
            <StyledTableRow>
              <TableCell colSpan={7} />
              <StyledTableCell>SGST {sgst.rate}%</StyledTableCell>
              <TableCell>{fCurrency(sgst.amount)}</TableCell>
            </StyledTableRow>
          )}

          {igst?.rate > 0 && (
            <StyledTableRow>
              <TableCell colSpan={7} />
              <StyledTableCell>IGST {igst.rate}%</StyledTableCell>
              <TableCell>{fCurrency(igst.amount)}</TableCell>
            </StyledTableRow>
          )}

          <StyledTableRow>
            <TableCell colSpan={7} />
            <StyledTableCell>Net Total</StyledTableCell>
            <TableCell sx={{ color: 'error.main' }}>{fCurrency(totalAfterTax)}</TableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function RenderFooter() {
  return (
    <Grid container>
      <Grid xs={12} md={9} sx={{ py: 3 }}>
        <Typography variant="subtitle2">NOTES</Typography>
        <Typography variant="body2">{CONFIG.company.name}</Typography>
      </Grid>
      <Grid xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
        <Typography variant="subtitle2">For-{CONFIG.company.name}</Typography>
        <Typography variant="body2">Authorised Signatory</Typography>
      </Grid>
    </Grid>
  );
}

export default function InvoiceView() {
  const { id } = useParams();
  const { data: invoice, isLoading, error } = useInvoice(id);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error || !invoice) return <Typography>Error loading invoice.</Typography>;

  const { customerId: customer, issueDate, dueDate } = invoice;

  return (
    <Card sx={{ pt: 5, px: 5 }}>
      <RenderHeader invoice={invoice} />
      <Box
        rowGap={5}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
      >
        <RenderAddress
          title="Invoice From"
          details={
            <>
              {CONFIG.company.name}
              <br />
              {CONFIG.company.address.line1}
              <br />
              {CONFIG.company.address.line2}
              <br />
              {CONFIG.company.address.state}
              <br />
              Phone: {CONFIG.company.contacts[0]}
            </>
          }
        />
        <RenderAddress
          title="Invoice To"
          details={
            <>
              {customer?.customerName}
              <br />
              {customer?.address}
              <br />
              {customer?.state}
              <br />
              Phone: {customer?.cellNo}
            </>
          }
        />
        <RenderDateInfo issueDate={issueDate} dueDate={dueDate} />
      </Box>

      <RenderTable invoice={invoice} />
      <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
      <RenderFooter />
    </Card>
  );
}
