import React from 'react';

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

import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import {
  calculateTransporterPayment,
  calculateTransporterPaymentSummary,
} from '../utils/transporter-payment-calculations';

const StyledTableCell = (props) => <TableCell {...props} sx={{ fontWeight: 'bold' }} />;

export default function TransporterPaymentPreviewUI({
  company,
  transporter,
  subtrips,
  additionalCharges = [],
}) {
  const {
    taxBreakup,
    netIncome,
    totalFreightAmount,
    totalExpense,
    totalShortageAmount,
    totalTripWiseIncome,
  } = calculateTransporterPaymentSummary(subtrips, transporter, additionalCharges);

  return (
    <Card sx={{ pt: 5, px: 5 }}>
      {/* header */}
      <Box
        display="grid"
        rowGap={3}
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

      {/* addresses */}
      <Box display="grid" rowGap={5} gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}>
        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
            Payment From
          </Typography>
          {company.name}
          <br />
          {company.address.line1}
          <br />
          {company.address.line2}
          <br />
          {company.address.state}
          <br />
          Phone: {company.contacts[0]}
        </Stack>
        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
            Payment To
          </Typography>
          {transporter.transportName}
          <br />
          {transporter.address}, {transporter.pinNo}
          <br />
          Phone: {transporter.cellNo}
          <br />
          {transporter.panNo && (
            <>
              PAN: {transporter.panNo}
              <br />
            </>
          )}
          {transporter.gstNo && <>GST: {transporter.gstNo}</>}
        </Stack>
      </Box>

      {/* table */}
      <TableContainer sx={{ overflowX: 'auto', mt: 4 }}>
        <Table sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow>
              {[
                '#',
                'Dispatch Date',
                'LR No.',
                'VEH No',
                'From',
                'Destination',
                'InvoiceNo',
                'Load Qty',
                'Shortage Qty',
                'Shortage Amt',
                'FRT-RATE',
                'FRT-AMT',
                'Expense',
                'Total Payable',
              ].map((h) => (
                <StyledTableCell key={h}>{h}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {subtrips.map((st, i) => {
              const {
                effectiveFreightRate,
                totalFreightAmount: freightAmount,
                totalExpense: expense,
                totalTransporterPayment,
                totalShortageAmount: shortageAmount,
              } = calculateTransporterPayment(st);

              return (
                <TableRow key={st._id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{fDate(st.startDate)}</TableCell>
                  <TableCell>
                    <RouterLink
                      to={`/dashboard/subtrip/${st._id}`}
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

            {/* totals row */}
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

            {taxBreakup?.tds?.rate > 0 && (
              <TableRow>
                <TableCell colSpan={13} align="right">
                  TDS ({taxBreakup.tds.rate}%)
                </TableCell>
                <TableCell sx={{ color: 'error.main' }} align="right">
                  -{fCurrency(taxBreakup.tds.amount)}
                </TableCell>
              </TableRow>
            )}

            {additionalCharges.map(({ label, amount }, i) => (
              <TableRow key={`ac-${i}`}>
                <TableCell colSpan={13} align="right">
                  {label}
                </TableCell>
                <TableCell align="right" sx={{ color: 'error.main' }}>
                  - {fCurrency(amount)}
                </TableCell>
              </TableRow>
            ))}

            {/* net total */}
            <TableRow>
              <TableCell colSpan={13} align="right">
                <strong>Net Total</strong>
              </TableCell>
              <TableCell align="right" sx={{ color: 'success.main' }}>
                {fCurrency(netIncome)}
              </TableCell>
            </TableRow>

            {/* tax & extra charges */}
            {[taxBreakup.cgst, taxBreakup.sgst, taxBreakup.igst].map(
              ({ rate, amount }, idx) =>
                rate > 0 && (
                  <TableRow key={idx}>
                    <TableCell colSpan={13} align="right">
                      {['CGST', 'SGST', 'IGST', 'TDS'][idx]} ({rate}%)
                    </TableCell>
                    <TableCell align="right">{fCurrency(amount)}</TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* footer */}
      <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
      <Grid container sx={{ py: 3 }}>
        <Grid item xs={12} md={9}>
          <Typography variant="subtitle2">NOTES</Typography>
          <Typography variant="body2">{company.name}</Typography>
        </Grid>
        <Grid item xs={12} md={3} sx={{ textAlign: 'right' }}>
          <Typography variant="subtitle2">For – {company.name}</Typography>
          <Typography variant="body2">Authorised Signatory</Typography>
        </Grid>
      </Grid>
    </Card>
  );
}
