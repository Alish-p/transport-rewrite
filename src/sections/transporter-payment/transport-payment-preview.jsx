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
import { calculateTransporterPayment } from '../../utils/utils';

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

function calculateTotal(associatedSubtrips) {
  return (
    associatedSubtrips?.reduce((acc, st) => {
      const { totalTransporterPayment } = calculateTransporterPayment(st);
      return acc + totalTransporterPayment;
    }, 0) || 0
  );
}

function RenderHeader({ transporterPayment }) {
  const { _id, status } = transporterPayment || {};
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
            status === 'paid'
              ? 'success'
              : status === 'pending'
                ? 'warning'
                : status === 'overdue'
                  ? 'error'
                  : 'default'
          }
        >
          {status || 'Draft'}
        </Label>
        <Typography variant="h6">{_id || 'TPR - XXX'}</Typography>
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

function RenderTable({ transporterPayment }) {
  const totalAmount = calculateTotal(transporterPayment?.associatedSubtrips);
  return (
    <TableContainer sx={{ overflow: 'unset', mt: 4 }}>
      <Table sx={{ minWidth: 960 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell width={40}>#</StyledTableCell>
            <StyledTableCell>SubtripID</StyledTableCell>
            <StyledTableCell>Vehicle No</StyledTableCell>
            <StyledTableCell>Route Name</StyledTableCell>
            <StyledTableCell>Trip End Date</StyledTableCell>
            <StyledTableCell>Loading QTY(MT)</StyledTableCell>
            <StyledTableCell>Freight Rate</StyledTableCell>
            <StyledTableCell>Total Freight Amount</StyledTableCell>
            <StyledTableCell>Total Expense</StyledTableCell>
            <StyledTableCell>Total</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transporterPayment?.associatedSubtrips?.map((st, index) => {
            const {
              effectiveFreightRate,
              totalFreightAmount,
              totalExpense,
              totalTransporterPayment,
            } = calculateTransporterPayment(st);
            return (
              <TableRow key={st._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{st._id}</TableCell>
                <TableCell>{st.tripId?.vehicleId?.vehicleNo}</TableCell>
                <TableCell>{st.routeCd.routeName}</TableCell>
                <TableCell>{fDate(st.endDate)}</TableCell>
                <TableCell>{st.loadingWeight}</TableCell>
                <TableCell>{fCurrency(effectiveFreightRate)}</TableCell>
                <TableCell>{fCurrency(totalFreightAmount)}</TableCell>
                <TableCell>{fCurrency(totalExpense)}</TableCell>
                <TableCell>{fCurrency(totalTransporterPayment)}</TableCell>
              </TableRow>
            );
          })}

          <StyledTableRow>
            <TableCell colSpan={8} />
            <StyledTableCell>Total</StyledTableCell>
            <TableCell>{fCurrency(totalAmount)}</TableCell>
          </StyledTableRow>

          <StyledTableRow>
            <TableCell colSpan={8} />
            <StyledTableCell>CGST({CONFIG.transporterPaymentTax}%)</StyledTableCell>
            <TableCell>{fCurrency(totalAmount * (CONFIG.transporterPaymentTax / 100))}</TableCell>
          </StyledTableRow>

          <StyledTableRow>
            <TableCell colSpan={8} />
            <StyledTableCell>SGST({CONFIG.transporterPaymentTax}%)</StyledTableCell>
            <TableCell>{fCurrency(totalAmount * (CONFIG.transporterPaymentTax / 100))}</TableCell>
          </StyledTableRow>

          <StyledTableRow>
            <TableCell colSpan={8} />
            <StyledTableCell>Net-Total</StyledTableCell>
            <TableCell sx={{ color: 'error.main' }}>
              {fCurrency(totalAmount * (1 + (2 * CONFIG.transporterPaymentTax) / 100))}
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

export default function TransporterPaymentPreview({ transporterPayment }) {
  const { transporterId: transporter, createdDate } = transporterPayment || {};
  return (
    <Card sx={{ pt: 5, px: 5 }}>
      <RenderHeader transporterPayment={transporterPayment} />
      <Box
        rowGap={5}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
      >
        <RenderAddress
          title="Transporter Payment From"
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
          title="Payment To"
          details={
            transporter && (
              <>
                {transporter?.transportName}
                <br />
                {transporter?.address},{transporter?.pinNo}
                <br />
                {transporter?.cellNo && <>Phone: {transporter?.cellNo} </>}
                <br />
                {transporter?.panNo && <>Pan: {transporter?.panNo} </>}
                <br />
                {transporter?.gstNo && <>GST: {transporter?.gstNo} </>}
              </>
            )
          }
        />
        <RenderDateInfo createdDate={createdDate} />
      </Box>
      <RenderTable transporterPayment={transporterPayment} />
      <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
      <RenderFooter />
    </Card>
  );
}
