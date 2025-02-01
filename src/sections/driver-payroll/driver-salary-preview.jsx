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
import { calculateDriverSalary, calculatePayslipSummary } from 'src/utils/utils';

import { CONFIG } from 'src/config-global';

import { Label } from '../../components/label';

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

function RenderHeader({ driverSalary }) {
  const { _id, status } = driverSalary || {};
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
              : status === 'processing'
                ? 'warning'
                : status === 'pending'
                  ? 'error'
                  : 'default'
          }
        >
          {status || 'Draft'}
        </Label>
        <Typography variant="h6">{_id || 'DSR - XXX'}</Typography>
      </Stack>
    </Box>
  );
}

function RenderParty({ title, details }) {
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
    <Stack sx={{ typography: 'body2' }}>
      <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
        Created
      </Typography>
      {createdDate && fDate(createdDate)}
    </Stack>
  );
}

function RenderSalaryTable({ driverSalary }) {
  const { subtripComponents, otherSalaryComponent } = driverSalary;

  const { netSalary } = calculatePayslipSummary(driverSalary);

  return (
    <TableContainer sx={{ overflow: 'scroll', mt: 5 }}>
      <Table sx={{ minWidth: 960 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell width={40}>#</StyledTableCell>
            <StyledTableCell>Payment Type</StyledTableCell>
            <StyledTableCell>SubtripID</StyledTableCell>
            <StyledTableCell>Vehicle No</StyledTableCell>
            <StyledTableCell>Route Name / Remarks</StyledTableCell>
            <StyledTableCell>Trip End Date</StyledTableCell>
            <StyledTableCell>Payment</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {/* Subtrip related income */}
          {subtripComponents &&
            subtripComponents.map((st, index) => {
              const tripSalary = calculateDriverSalary(st);
              return (
                <TableRow key={st._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>Trip Payment</TableCell>
                  <TableCell>{st._id}</TableCell>
                  <TableCell>{st.tripId?.vehicleId?.vehicleNo}</TableCell>
                  <TableCell>{st.routeCd.routeName}</TableCell>
                  <TableCell>{fDate(st.endDate)}</TableCell>
                  <TableCell>{fCurrency(tripSalary)}</TableCell>
                </TableRow>
              );
            })}
          {/* Other income like fixed income or penalty */}
          {otherSalaryComponent &&
            otherSalaryComponent.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{subtripComponents.length + index + 1}</TableCell>
                <TableCell>{item.paymentType}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{item.remarks}</TableCell>
                <TableCell>{fDate(new Date())}</TableCell>
                <TableCell>{fCurrency(item.amount)}</TableCell>
              </TableRow>
            ))}

          <StyledTableRow>
            <TableCell colSpan={5} />
            <StyledTableCell>Total</StyledTableCell>
            <TableCell>{fCurrency(netSalary)}</TableCell>
          </StyledTableRow>

          <StyledTableRow>
            <TableCell colSpan={5} />
            <StyledTableCell>Net-Total</StyledTableCell>
            <TableCell sx={{ color: 'red' }}>{fCurrency(netSalary)}</TableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function RenderFooter() {
  return (
    <Grid container sx={{ mt: 5 }}>
      <Grid xs={12} md={9} sx={{ py: 3 }}>
        <Typography variant="subtitle2">NOTES</Typography>
        <Typography variant="body2">{CONFIG.company.name}</Typography>
      </Grid>
      <Grid xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
        <Typography variant="subtitle2">For-{CONFIG.company.name}</Typography>
        <Typography variant="body2"> Authorised Signatory</Typography>
      </Grid>
    </Grid>
  );
}

export default function DriverSalaryPreview({ driverSalary }) {
  const { driverId: driver, createdDate } = driverSalary || {};
  return (
    <>
      <Typography sx={{ p: 1, mb: 1 }} variant="h6" color="green">
        Payroll Reciept
      </Typography>

      <Card sx={{ pt: 5, px: 5 }}>
        <RenderHeader driverSalary={driverSalary} />
        <Box
          rowGap={5}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
        >
          <RenderParty
            title="Company"
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
          <RenderParty
            title="Driver Name"
            details={
              driver && (
                <>
                  {driver.driverName}
                  <br />
                  {driver.permanentAddress}
                  <br />
                  {driver.driverCellNo && (
                    <>
                      Phone: {driver.driverCellNo}
                      <br />
                    </>
                  )}
                  {driver?.bankDetails?.accNo && (
                    <>
                      Acc No: {driver.bankDetails.accNo}
                      <br />
                    </>
                  )}
                </>
              )
            }
          />

          <RenderDateInfo createdDate={createdDate} />
        </Box>
        <RenderSalaryTable driverSalary={driverSalary} />
        <Divider sx={{ my: 5, borderStyle: 'dashed' }} />
        <RenderFooter />
      </Card>
    </>
  );
}
