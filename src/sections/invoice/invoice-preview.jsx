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

import { Label } from 'src/components/label';

import { CONFIG } from '../../config-global';

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

function calculateTotal(invoicedSubTrips) {
  return (
    invoicedSubTrips?.reduce((acc, trip) => {
      const rate = Number(trip.rate) || 0;
      const loadingWeight = Number(trip.loadingWeight) || 0;
      return acc + rate * loadingWeight;
    }, 0) || 0
  );
}

function RenderHeader({ invoice }) {
  const { _id, invoiceStatus } = invoice || {};
  return (
    <Box
      rowGap={3}
      display="grid"
      alignItems="center"
      gridTemplateColumns={{ xs: '1fr', sm: '1fr auto' }}
    >
      <Box component="img" alt="logo" src="/logo/companylogo1.png" sx={{ width: 48, height: 48 }} />
      <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
        <Label variant="soft" color={invoiceStatus === 'paid' ? 'success' : 'default'}>
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

function RenderDateInfo({ createdDate }) {
  return (
    <>
      <RenderAddress title="Created" details={createdDate && fDate(createdDate)} />
      <RenderAddress title="Due Date" details={createdDate && fDate(createdDate)} />
    </>
  );
}

function RenderTable({ invoice }) {
  const totalAmount = calculateTotal(invoice?.invoicedSubTrips);
  return (
    <TableContainer sx={{ overflow: 'unset', mt: 4 }}>
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
            <StyledTableCell>QTY(MT)</StyledTableCell>
            <StyledTableCell>Rate/MT</StyledTableCell>
            <StyledTableCell>Freight</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoice?.invoicedSubTrips?.map((st, index) => (
            <TableRow key={st._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{st.consignee}</TableCell>
              <TableCell>{st.unloadingPoint}</TableCell>
              <TableCell>{st.tripId?.vehicleId?.vehicleNo}</TableCell>
              <TableCell>{st._id}</TableCell>
              <TableCell>{st.invoiceNo}</TableCell>
              <TableCell>{fDate(st.startDate)}</TableCell>
              <TableCell>{st.loadingWeight || 0}</TableCell>
              <TableCell>{fCurrency(st.rate || 0)}</TableCell>
              <TableCell>{fCurrency((st.rate || 0) * (st.loadingWeight || 0))}</TableCell>
            </TableRow>
          ))}

          <StyledTableRow>
            <TableCell colSpan={8} />
            <StyledTableCell>Total</StyledTableCell>
            <TableCell>{fCurrency(totalAmount)}</TableCell>
          </StyledTableRow>

          <StyledTableRow>
            <TableCell colSpan={8} />
            <StyledTableCell>CGST({CONFIG.customerInvoiceTax}%)</StyledTableCell>
            <TableCell>{fCurrency(totalAmount * (CONFIG.customerInvoiceTax / 100))}</TableCell>
          </StyledTableRow>

          <StyledTableRow>
            <TableCell colSpan={8} />
            <StyledTableCell>SGST({CONFIG.customerInvoiceTax}%)</StyledTableCell>
            <TableCell>{fCurrency(totalAmount * (CONFIG.customerInvoiceTax / 100))}</TableCell>
          </StyledTableRow>

          <StyledTableRow>
            <TableCell colSpan={8} />
            <StyledTableCell>Net-Total</StyledTableCell>
            <TableCell sx={{ color: 'error.main' }}>
              {fCurrency(totalAmount * (1 + (2 * CONFIG.customerInvoiceTax) / 100))}
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

export default function InvoiceDetails({ invoice }) {
  console.log({ draftInvoice: invoice });
  const { customerId: customer, createdDate } = invoice || {};
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
            customer && (
              <>
                {customer?.customerName}
                <br />
                {customer?.address}
                <br />
                Phone: {customer?.cellNo}
              </>
            )
          }
        />
        <RenderDateInfo createdDate={createdDate} />
      </Box>
      <RenderTable invoice={invoice} />
      <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
      <RenderFooter />
    </Card>
  );
}
