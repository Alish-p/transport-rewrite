// 📦 Updated TransporterPaymentPreview.js (adds Totals, GST, Additional Charges)
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import {
  Box,
  Card,
  Grid,
  Stack,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';
import { useFetchSubtripsForTransporterBilling } from 'src/query/use-subtrip';

import {
  calculateTransporterPayment,
  calculateTransporterPaymentSummary,
} from './utils/transporter-payment-calculations';

const StyledTableCell = (props) => <TableCell {...props} sx={{ fontWeight: 'bold' }} />;

function RenderHeader() {
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
        <Typography variant="h6">Draft Transporter Payment Preview</Typography>
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
      {details}
    </Stack>
  );
}

function RenderTable({ subtrips, transporter, additionalCharges = [] }) {
  const summary = calculateTransporterPaymentSummary(subtrips, transporter, additionalCharges);
  const {
    taxBreakup,
    totalTax,
    netIncome,
    totalFreightAmount,
    totalExpense,
    totalShortageAmount,
    totalTripWiseIncome,
  } = summary;

  return (
    <TableContainer sx={{ overflowX: 'auto', mt: 4 }}>
      <Table sx={{ minWidth: 960 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell>#</StyledTableCell>
            <StyledTableCell>Dispatch Date</StyledTableCell>
            <StyledTableCell>LR No.</StyledTableCell>
            <StyledTableCell>VEH No</StyledTableCell>
            <StyledTableCell>From</StyledTableCell>
            <StyledTableCell>Destination</StyledTableCell>
            <StyledTableCell>InvoiceNo</StyledTableCell>
            <StyledTableCell>Load Qty</StyledTableCell>
            <StyledTableCell>Shortage Qty</StyledTableCell>
            <StyledTableCell>Shortage Amt</StyledTableCell>
            <StyledTableCell>FRT-RATE</StyledTableCell>
            <StyledTableCell>FRT-AMT</StyledTableCell>
            <StyledTableCell>Expense</StyledTableCell>
            <StyledTableCell>Total Payable</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subtrips.map((st, index) => {
            const {
              effectiveFreightRate,
              totalFreightAmount: freightAmount,
              totalExpense: expense,
              totalTransporterPayment,
              totalShortageAmount: shortageAmount,
            } = calculateTransporterPayment(st);

            return (
              <TableRow key={st._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{fDate(st.startDate)}</TableCell>
                <TableCell>
                  <RouterLink
                    to={paths.dashboard.subtrip.details(st._id)}
                    style={{ color: '#2e7d32', textDecoration: 'underline' }}
                  >
                    {st._id}
                  </RouterLink>
                </TableCell>
                <TableCell>{st.tripId?.vehicleId?.vehicleNo}</TableCell>
                <TableCell>{st.loadingPoint}</TableCell>
                <TableCell>{st.unloadingPoint}</TableCell>
                <TableCell>{st.invoiceNo}</TableCell>
                <TableCell align="right">{st.loadingWeight}</TableCell>
                <TableCell align="right">{st.shortageWeight}</TableCell>
                <TableCell align="right">{fCurrency(shortageAmount)}</TableCell>
                <TableCell align="right">{fCurrency(effectiveFreightRate)}</TableCell>
                <TableCell align="right">{fCurrency(freightAmount)}</TableCell>
                <TableCell align="right">{fCurrency(expense)}</TableCell>
                <TableCell align="right">{fCurrency(totalTransporterPayment)}</TableCell>
              </TableRow>
            );
          })}

          <TableRow>
            <TableCell colSpan={8} />
            <StyledTableCell sx={{ color: 'info.main' }}>Total</StyledTableCell>
            <TableCell align="right" sx={{ color: 'info.main' }}>
              {fCurrency(totalShortageAmount)}
            </TableCell>
            <TableCell align="right">-</TableCell>
            <TableCell align="right" sx={{ color: 'info.main' }}>
              {fCurrency(totalFreightAmount)}
            </TableCell>
            <TableCell align="right" sx={{ color: 'info.main' }}>
              {fCurrency(totalExpense)}
            </TableCell>
            <TableCell align="right" sx={{ color: 'info.main' }}>
              {fCurrency(totalTripWiseIncome)}
            </TableCell>
          </TableRow>

          {taxBreakup?.cgst?.rate > 0 && (
            <TableRow>
              <TableCell colSpan={13} align="right">
                CGST ({taxBreakup.cgst.rate}%)
              </TableCell>
              <TableCell sx={{ color: 'error.main' }} align="right">
                - {fCurrency(taxBreakup.cgst.amount)}
              </TableCell>
            </TableRow>
          )}

          {taxBreakup?.sgst?.rate > 0 && (
            <TableRow>
              <TableCell colSpan={13} align="right">
                SGST ({taxBreakup.sgst.rate}%)
              </TableCell>
              <TableCell sx={{ color: 'error.main' }} align="right">
                - {fCurrency(taxBreakup.sgst.amount)}
              </TableCell>
            </TableRow>
          )}

          {taxBreakup?.igst?.rate > 0 && (
            <TableRow>
              <TableCell colSpan={13} align="right">
                IGST ({taxBreakup.igst.rate}%)
              </TableCell>
              <TableCell sx={{ color: 'error.main' }} align="right">
                {fCurrency(taxBreakup.igst.amount)}
              </TableCell>
            </TableRow>
          )}

          {taxBreakup?.tds?.rate > 0 && (
            <TableRow>
              <TableCell colSpan={13} align="right">
                TDS ({taxBreakup.tds.rate}%)
              </TableCell>
              <TableCell sx={{ color: 'error.main' }} align="right">
                {fCurrency(taxBreakup.tds.amount)}
              </TableCell>
            </TableRow>
          )}

          {additionalCharges?.length > 0 &&
            additionalCharges.map(({ label, amount }, i) => (
              <TableRow key={`ac-${i}`}>
                <TableCell colSpan={13} align="right">
                  {label}
                </TableCell>
                <TableCell sx={{ color: 'error.main' }} align="right">
                  {fCurrency(amount)}
                </TableCell>
              </TableRow>
            ))}

          <TableRow>
            <TableCell colSpan={13} align="right">
              <strong>Net Total</strong>
            </TableCell>
            <TableCell align="right" sx={{ color: 'success.main' }}>
              {fCurrency(netIncome)}
            </TableCell>
          </TableRow>
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

export default function TransporterPaymentPreview({ transporterList }) {
  const draft = useWatch();

  const { data: availableSubtrips = [] } = useFetchSubtripsForTransporterBilling(
    draft.transporterId,
    draft.billingPeriod?.start,
    draft.billingPeriod?.end
  );

  const previewSubtrips = useMemo(() => {
    if (!draft.associatedSubtrips?.length || !availableSubtrips.length) return [];
    return availableSubtrips.filter((st) => draft.associatedSubtrips.includes(st._id));
  }, [draft.associatedSubtrips, availableSubtrips]);

  const selectedTransporter = useMemo(() => {
    if (!draft.transporterId || !transporterList.length) return null;
    return transporterList.find((t) => t._id === draft.transporterId);
  }, [draft.transporterId, transporterList]);

  if (!draft.transporterId || !draft.billingPeriod?.start || previewSubtrips.length === 0)
    return null;

  return (
    <Card sx={{ pt: 5, px: 5 }}>
      <RenderHeader />
      <Box
        rowGap={5}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
      >
        <RenderAddress
          title="Payment From"
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
            selectedTransporter && (
              <>
                {selectedTransporter.transportName}
                <br />
                {selectedTransporter.address}, {selectedTransporter.pinNo}
                <br />
                Phone: {selectedTransporter.cellNo}
                <br />
                {selectedTransporter.panNo && <>PAN: {selectedTransporter.panNo}</>}
                <br />
                {selectedTransporter.gstNo && <>GST: {selectedTransporter.gstNo}</>}
              </>
            )
          }
        />
      </Box>
      <RenderTable
        subtrips={previewSubtrips}
        transporter={selectedTransporter}
        additionalCharges={
          draft.additionalCharges || [
            {
              label: 'POD Charges',
              amount:
                previewSubtrips?.length > 0
                  ? previewSubtrips.length * selectedTransporter.podCharges
                  : 0,
            },
          ]
        }
      />
      <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
      <RenderFooter />
    </Card>
  );
}
