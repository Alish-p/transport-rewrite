import { useNavigate } from 'react-router-dom';

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

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { calculateInvoiceSummary, calculateInvoicePerSubtrip } from 'src/utils/utils';

import { CONFIG } from 'src/config-global';

import { Label } from 'src/components/label';

import { paths } from '../../routes/paths';
import { useInvoice } from './context/InvoiceContext';

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
  const { _id, invoiceStatus } = invoice || {};
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
        <Typography variant="h6">{_id || 'INV - XXX'}</Typography>
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

function RenderDateInfo({ createdDate, dueDate }) {
  return (
    <>
      <RenderAddress title="Created" details={createdDate && fDate(createdDate)} />
      <RenderAddress title="Due Date" details={dueDate && fDate(dueDate)} />
    </>
  );
}

function RenderTable({ invoice }) {
  const {
    totalAfterTax,
    totalAmountBeforeTax,
    totalFreightAmount,
    totalFreightWt,
    totalShortageAmount,
    totalShortageWt,
  } = calculateInvoiceSummary(invoice);

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
            <StyledTableCell>Invoice No</StyledTableCell>
            <StyledTableCell>Disp Date</StyledTableCell>
            <StyledTableCell>Rate/MT</StyledTableCell>
            <StyledTableCell>QTY(MT)</StyledTableCell>
            <StyledTableCell>Freight</StyledTableCell>

            <StyledTableCell>Shortage QTY(MT)</StyledTableCell>
            <StyledTableCell>Shortage Amount</StyledTableCell>
            <StyledTableCell>Total Amount</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoice?.invoicedSubTrips?.map((st, index) => {
            const {
              freightAmount,
              shortageAmount,
              totalAmount: totalAmountPerSubtrip,
            } = calculateInvoicePerSubtrip(st);

            return (
              <TableRow key={st._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{st.consignee}</TableCell>
                <TableCell>{st.unloadingPoint}</TableCell>
                <TableCell>{st.tripId?.vehicleId?.vehicleNo}</TableCell>
                <TableCell
                  sx={{ color: 'success.main', cursor: 'pointer' }}
                  onClick={() => navigate(paths.dashboard.subtrip.details(st._id))}
                >
                  {st._id}
                </TableCell>
                <TableCell>{fDate(st.startDate)}</TableCell>
                <TableCell>{fCurrency(st.rate || 0)}</TableCell>
                <TableCell>{st.loadingWeight || 0}</TableCell>
                <TableCell>{fCurrency(freightAmount)}</TableCell>

                <TableCell>{st.shortageWeight || 0}</TableCell>
                <TableCell>{fCurrency(shortageAmount || 0)}</TableCell>
                <TableCell>{fCurrency(totalAmountPerSubtrip || 0)}</TableCell>
              </TableRow>
            );
          })}

          <StyledTableRow>
            <TableCell colSpan={7} />
            <StyledTableCell>Total</StyledTableCell>
            <TableCell>{totalFreightWt}</TableCell>
            <TableCell>{fCurrency(totalFreightAmount)}</TableCell>
            <TableCell>{totalShortageWt}</TableCell>
            <TableCell>{fCurrency(totalShortageAmount)}</TableCell>
            <TableCell>{fCurrency(totalAmountBeforeTax)}</TableCell>
          </StyledTableRow>

          <StyledTableRow>
            <TableCell colSpan={11} />
            <StyledTableCell>CGST({CONFIG.customerInvoiceTax}%)</StyledTableCell>
            <TableCell>
              {fCurrency(totalAmountBeforeTax * (CONFIG.customerInvoiceTax / 100))}
            </TableCell>
          </StyledTableRow>

          <StyledTableRow>
            <TableCell colSpan={11} />
            <StyledTableCell>SGST({CONFIG.customerInvoiceTax}%)</StyledTableCell>
            <TableCell>
              {fCurrency(totalAmountBeforeTax * (CONFIG.customerInvoiceTax / 100))}
            </TableCell>
          </StyledTableRow>

          <StyledTableRow>
            <TableCell colSpan={11} />
            <StyledTableCell>Net-Total</StyledTableCell>
            <TableCell sx={{ color: 'error.main' }}>
              {fCurrency(totalAmountBeforeTax * (1 + (2 * CONFIG.customerInvoiceTax) / 100))}
            </TableCell>
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

export default function InvoicePreview() {
  const { draftInvoice } = useInvoice();
  const { customerId: customer, createdDate, dueDate } = draftInvoice || {};

  return (
    <Card sx={{ pt: 5, px: 5 }}>
      <RenderHeader invoice={draftInvoice} />
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
            customer && (
              <>
                {customer?.customerName}
                <br />
                {customer?.address}
                <br />
                {customer?.cellNo && <>Phone: {customer?.cellNo} </>}
              </>
            )
          }
        />
        <RenderDateInfo createdDate={createdDate} dueDate={dueDate} />
      </Box>
      <RenderTable invoice={draftInvoice} />
      <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
      <RenderFooter />
    </Card>
  );
}
