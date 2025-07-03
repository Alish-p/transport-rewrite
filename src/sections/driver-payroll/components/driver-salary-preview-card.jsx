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
  calculateDriverSalary,
  calculateDriverSalarySummary,
} from '../utils/driver-salary-calculations';

const StyledTableCell = (props) => <TableCell {...props} sx={{ fontWeight: 'bold' }} />;

export default function DriverSalaryPreviewCard({
  company,
  driver,
  associatedSubtrips,
  additionalPayments = [],
  additionalDeductions = [],
}) {
  const { totalTripWiseIncome, netIncome } =
    calculateDriverSalarySummary(
      { associatedSubtrips },
      driver,
      additionalPayments,
      additionalDeductions
    );

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
          <Typography variant="h6">Draft Driver Salary Preview</Typography>
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
          {driver?.driverName}
          <br />
          {driver?.driverPresentAddress}, Phone: {driver?.driverCellNo}
          {driver?.licenseNo && (
            <>
              <br />
              License: {driver?.licenseNo}
            </>
          )}
        </Stack>
      </Box>

      {/* table */}
      <TableContainer sx={{ overflowX: 'auto', mt: 4 }}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              {['#', 'Date', 'Subtrip ID', 'From', 'Destination', 'Trip Salary'].map((h) => (
                <StyledTableCell key={h}>{h}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {associatedSubtrips?.map((st, i) => {
              const driverSalary = calculateDriverSalary(st);
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
                  <TableCell>{st.loadingPoint}</TableCell>
                  <TableCell>{st.unloadingPoint}</TableCell>
                  <TableCell align="right">{fCurrency(driverSalary)}</TableCell>
                </TableRow>
              );
            })}

            {/* total trip-wise income */}
            <TableRow>
              <TableCell colSpan={5} align="right">
                <StyledTableCell>Trips Total</StyledTableCell>
              </TableCell>
              <TableCell align="right" sx={{ color: 'info.main' }}>
                {fCurrency(totalTripWiseIncome)}
              </TableCell>
            </TableRow>

            {/* additional payments */}
            {additionalPayments.map(({ label, amount }, idx) => (
              <TableRow key={`pay-${idx}`}>
                <TableCell colSpan={5} align="right">
                  {label}
                </TableCell>
                <TableCell align="right" sx={{ color: 'success.main' }}>
                  +{fCurrency(amount)}
                </TableCell>
              </TableRow>
            ))}

            {/* additional deductions */}
            {additionalDeductions.map(({ label, amount }, idx) => (
              <TableRow key={`ded-${idx}`}>
                <TableCell colSpan={5} align="right">
                  {label}
                </TableCell>
                <TableCell align="right" sx={{ color: 'error.main' }}>
                  -{fCurrency(amount)}
                </TableCell>
              </TableRow>
            ))}

            {/* net total */}
            <TableRow>
              <TableCell colSpan={5} align="right">
                <strong>Net Total</strong>
              </TableCell>
              <TableCell align="right" sx={{ color: 'success.main' }}>
                <strong>{fCurrency(netIncome)}</strong>
              </TableCell>
            </TableRow>
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
