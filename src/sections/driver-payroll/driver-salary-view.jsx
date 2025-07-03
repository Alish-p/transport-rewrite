// DriverSalaryView.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { styled } from '@mui/material/styles';
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

import { fCurrency } from 'src/utils/format-number';
import { fDate, fDateRangeShortLabel } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

import { Label } from 'src/components/label';

const StyledTableCell = styled(TableCell)(() => ({
  fontWeight: 'bold',
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

function RenderHeader({ driverSalary }) {
  const { paymentId, status } = driverSalary || {};
  return (
    <Box
      rowGap={3}
      display="grid"
      alignItems="center"
      gridTemplateColumns={{ xs: '1fr', sm: '1fr auto' }}
      sx={{ mb: 2 }}
    >
      <Box
        component="img"
        alt="logo"
        src="/logo/company-logo-main.png"
        sx={{ width: 60, height: 60 }}
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
          {status?.toUpperCase() || 'DRAFT'}
        </Label>
        <Typography variant="h6">{paymentId || 'DSR - XXX'}</Typography>
      </Stack>
    </Box>
  );
}

function RenderAddress({ title, children }) {
  return (
    <Stack sx={{ typography: 'body2' }} mb={2}>
      <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
}

function RenderDateInfo({ issueDate, billingPeriod }) {
  return (
    <>
      <RenderAddress title="Issue Date">{issueDate && fDate(issueDate)}</RenderAddress>
      <RenderAddress title="Billing Period">
        {billingPeriod && fDateRangeShortLabel(billingPeriod.start, billingPeriod.end)}
      </RenderAddress>
    </>
  );
}

function RenderTable({ driverSalary }) {
  const {
    subtripSnapshot = [],
    summary = {},
    additionalPayments = [],
    additionalDeductions = [],
  } = driverSalary;
  const navigate = useNavigate();

  return (
    <TableContainer>
      <Table sx={{ minWidth: 600 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell>SR.NO</StyledTableCell>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Subtrip ID</StyledTableCell>
            <StyledTableCell>From</StyledTableCell>
            <StyledTableCell>Destination</StyledTableCell>
            <StyledTableCell align="right">Trip Salary</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subtripSnapshot.map((st, idx) => (
            <TableRow key={st.subtripId}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{fDate(st.startDate)}</TableCell>
              <TableCell
                sx={{ color: 'success.main', cursor: 'pointer' }}
                onClick={() => navigate(paths.dashboard.subtrip.details(st.subtripId))}
              >
                {st.subtripId}
              </TableCell>
              <TableCell>{st.loadingPoint}</TableCell>
              <TableCell>{st.unloadingPoint}</TableCell>
              <TableCell align="right">{st.totalDriverSalary}</TableCell>
            </TableRow>
          ))}

          <StyledTableRow>
            <TableCell colSpan={5} align="right">
              Trips Total
            </TableCell>
            <StyledTableCell align="right">
              {fCurrency(summary.totalTripWiseIncome)}
            </StyledTableCell>
          </StyledTableRow>

          {additionalPayments.map((p, i) => (
            <StyledTableRow key={`pay-${i}`}>
              <TableCell colSpan={5} align="right">
                {p.label}
              </TableCell>
              <TableCell align="right" sx={{ color: 'success.main' }}>
                +{fCurrency(p.amount)}
              </TableCell>
            </StyledTableRow>
          ))}

          {additionalDeductions.map((d, i) => (
            <StyledTableRow key={`ded-${i}`}>
              <TableCell colSpan={5} align="right">
                {d.label}
              </TableCell>
              <TableCell align="right" sx={{ color: 'error.main' }}>
                -{fCurrency(d.amount)}
              </TableCell>
            </StyledTableRow>
          ))}

          <StyledTableRow>
            <TableCell colSpan={5} align="right">
              <strong>Net Total</strong>
            </TableCell>
            <StyledTableCell align="right" sx={{ color: 'success.main' }}>
              <strong>{fCurrency(summary.netIncome)}</strong>
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function RenderFooter() {
  return (
    <Grid container sx={{ py: 3 }}>
      <Grid item xs={12} md={9}>
        <Typography variant="subtitle2">NOTES</Typography>
        <Typography variant="body2">{CONFIG.company.name}</Typography>
      </Grid>
      <Grid item xs={12} md={3} sx={{ textAlign: 'right' }}>
        <Typography variant="subtitle2">For – {CONFIG.company.name}</Typography>
        <Typography variant="body2">Authorised Signatory</Typography>
      </Grid>
    </Grid>
  );
}

export default function DriverSalaryView({ driverSalary }) {
  const { driverId: driver, billingPeriod, issueDate } = driverSalary || {};

  return (
    <Card sx={{ pt: 5, px: 5 }}>
      <RenderHeader driverSalary={driverSalary} />

      <Box display="grid" rowGap={4} gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr' }}>
        <RenderAddress title="Salary From">
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
        </RenderAddress>

        <RenderAddress title="Salary To">
          {driver && (
            <>
              {driver.driverName}
              <br />
              {driver.driverPresentAddress}
              <br />
              Phone: {driver.driverCellNo}
              {driver.driverLicenceNo && (
                <>
                  <br />
                  Licence: {driver.driverLicenceNo}
                </>
              )}
            </>
          )}
        </RenderAddress>

        <RenderDateInfo issueDate={issueDate} billingPeriod={billingPeriod} />
      </Box>

      <RenderTable driverSalary={driverSalary} />

      <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

      <RenderFooter />
    </Card>
  );
}
