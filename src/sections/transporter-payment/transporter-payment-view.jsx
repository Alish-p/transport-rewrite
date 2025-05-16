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

import { paths } from 'src/routes/paths';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fDateRangeShortLabel } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

import { Label } from 'src/components/label';

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

function RenderHeader({ transporterPayment }) {
  const { paymentId, status } = transporterPayment || {};
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
        src="/logo/company-logo-main.png"
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
        <Typography variant="h6">{paymentId || 'TPR - XXX'}</Typography>
      </Stack>
    </Box>
  );
}

function RenderAddress({ title, details }) {
  return (
    <Stack sx={{ typography: 'body2' }} mb={2}>
      <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {details && details}
    </Stack>
  );
}

function RenderDateInfo({ issueDate, billingPeriod }) {
  return (
    <>
      <RenderAddress title="Issue Date" details={issueDate && fDate(issueDate)} />
      <RenderAddress
        title="Biling Period"
        details={billingPeriod && fDateRangeShortLabel(billingPeriod.start, billingPeriod.end)}
      />
    </>
  );
}

function RenderTable({ transporterPayment }) {
  const { subtripSnapshot, transporterId, taxBreakup, summary, additionalCharges } =
    transporterPayment;

  const navigate = useNavigate();
  const { cgst, sgst, igst, tds } = taxBreakup || {};
  const {
    totalAfterTax,
    netIncome,
    totalExpense,
    totalShortageAmount,
    totalTax,
    totalFreightAmount,
    totalTripWiseIncome,
  } = summary || {};
  return (
    <TableContainer>
      <Table sx={{ minWidth: 960, overflowX: 'auto' }}>
        <TableHead>
          <TableRow>
            <StyledTableCell width={40}>SR.NO</StyledTableCell>
            <StyledTableCell>Dispatch Date</StyledTableCell>
            <StyledTableCell>LR NO.</StyledTableCell>
            <StyledTableCell>VEH.NO</StyledTableCell>
            <StyledTableCell>From</StyledTableCell>
            <StyledTableCell>Destination</StyledTableCell>
            <StyledTableCell>InvoiceNo</StyledTableCell>
            <StyledTableCell>Load QTY(MT)</StyledTableCell>
            <StyledTableCell>Shortage Qty(MT)</StyledTableCell>
            <StyledTableCell>Shortage Amt</StyledTableCell>
            <StyledTableCell>FRT-RATE</StyledTableCell>
            <StyledTableCell>FRT-Amt</StyledTableCell>
            <StyledTableCell>Expense</StyledTableCell>
            <StyledTableCell>Total Payable</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subtripSnapshot?.map((st, index) => (
            <TableRow key={st.subtripId}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{fDate(st.startDate)}</TableCell>
              <TableCell
                sx={{ color: 'success.main', cursor: 'pointer' }}
                onClick={() => navigate(paths.dashboard.subtrip.details(st.subtripId))}
              >
                {st.subtripId}
              </TableCell>
              <TableCell>{st.vehicleNo}</TableCell>
              <TableCell>{st.loadingPoint}</TableCell>
              <TableCell>{st.unloadingPoint}</TableCell>
              <TableCell>{st.invoiceNo}</TableCell>
              <TableCell>{st.loadingWeight}</TableCell>
              <TableCell>{st.shortageWeight}</TableCell>
              <TableCell>{fCurrency(st.shortageAmount)}</TableCell>
              <TableCell>{fCurrency(st.effectiveFreightRate)}</TableCell>
              <TableCell>{fCurrency(st.freightAmount)}</TableCell>
              <TableCell>{fCurrency(st.totalExpense)}</TableCell>
              <TableCell>
                {fCurrency(st.freightAmount - st.totalExpense - st.shortageAmount)}
              </TableCell>
            </TableRow>
          ))}

          <StyledTableRow>
            <TableCell colSpan={8} />
            <StyledTableCell sx={{ color: 'info.main' }}>Total</StyledTableCell>
            <TableCell sx={{ color: 'info.main' }}>{fCurrency(totalShortageAmount)}</TableCell>
            <TableCell>-</TableCell>
            <TableCell sx={{ color: 'info.main' }}>{fCurrency(totalFreightAmount)}</TableCell>
            <TableCell sx={{ color: 'info.main' }}>{fCurrency(totalExpense)}</TableCell>
            <TableCell sx={{ color: 'info.main' }}>{fCurrency(totalTripWiseIncome)}</TableCell>
          </StyledTableRow>

          {cgst?.rate > 0 && (
            <StyledTableRow>
              <TableCell colSpan={12} />
              <StyledTableCell>CGST {cgst.rate}%</StyledTableCell>
              <TableCell sx={{ color: 'error.main' }}>{fCurrency(cgst.amount)}</TableCell>
            </StyledTableRow>
          )}

          {sgst?.rate > 0 && (
            <StyledTableRow>
              <TableCell colSpan={12} />
              <StyledTableCell>SGST {sgst.rate}%</StyledTableCell>
              <TableCell sx={{ color: 'error.main' }}>{fCurrency(sgst.amount)}</TableCell>
            </StyledTableRow>
          )}

          {igst?.rate > 0 && (
            <StyledTableRow>
              <TableCell colSpan={12} />
              <StyledTableCell>IGST {igst.rate}%</StyledTableCell>
              <TableCell sx={{ color: 'error.main' }}>{fCurrency(igst.amount)}</TableCell>
            </StyledTableRow>
          )}

          {tds?.rate > 0 && (
            <StyledTableRow>
              <TableCell colSpan={12} />
              <StyledTableCell>TDS({tds?.rate || 0}%)</StyledTableCell>
              <TableCell sx={{ color: 'error.main' }}>{fCurrency(tds?.amount || 0)}</TableCell>
            </StyledTableRow>
          )}

          {additionalCharges?.length > 0 &&
            additionalCharges.map(({ label, amount }) => (
              <StyledTableRow>
                <TableCell colSpan={12} />
                <StyledTableCell>{label}</StyledTableCell>
                <TableCell sx={{ color: 'error.main' }}>{fCurrency(amount || 0)}</TableCell>
              </StyledTableRow>
            ))}

          <StyledTableRow>
            <TableCell colSpan={12} />
            <StyledTableCell>Net-Total</StyledTableCell>
            <TableCell sx={{ color: 'success.main' }}>{fCurrency(netIncome)}</TableCell>
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
  const { transporterId: transporter, issueDate, billingPeriod } = transporterPayment || {};
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
        <RenderDateInfo issueDate={issueDate} billingPeriod={billingPeriod} />
      </Box>
      <RenderTable transporterPayment={transporterPayment} />
      <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
      <RenderFooter />
    </Card>
  );
}
