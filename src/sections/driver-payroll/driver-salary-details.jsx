import { useMemo } from 'react';

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
import { calculateDriverSalary } from 'src/utils/utils';

import { Label } from 'src/components/label';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    // textAlign: 'center',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

function calculateTotal(subtrips = [], otherSalary = []) {
  const tripSalary = subtrips.reduce((acc, trip) => acc + calculateDriverSalary(trip), 0);
  const extraSalary = otherSalary.reduce((acc, i) => acc + i.amount, 0);

  return tripSalary + extraSalary;
}

export default function InvoiceDetails({
  invoiceNo,
  selectedSubtripsData,
  driver,
  status,
  createdDate,
  otherSalaryComponent,
}) {
  const totalSalary = useMemo(
    () => calculateTotal(selectedSubtripsData, otherSalaryComponent),
    [selectedSubtripsData, otherSalaryComponent]
  );

  return (
    <>
      <Typography sx={{ p: 1, mb: 1 }} variant="h6" color="green">
        Payroll Reciept
      </Typography>
      <Card sx={{ pt: 5, px: 5 }}>
        <Box
          rowGap={5}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
        >
          <Box
            component="img"
            alt="logo"
            src="/logo/logo-single.svg"
            sx={{ width: 48, height: 48 }}
          />

          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Label variant="soft" color="secondary">
              {status || 'Payslip'}
            </Label>
            <Typography variant="h6">{invoiceNo || 'PAY - XXX'}</Typography>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
              Driver Details
            </Typography>
            {driver && (
              <>
                {driver.driverName}
                <br />
                {driver.permanentAddress}
                <br />
                Phone: {driver.driverCellNo}
                <br />
              </>
            )}
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
              Created
            </Typography>
            {createdDate && fDate(createdDate)}
          </Stack>
        </Box>

        <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
          <Table sx={{ minWidth: 960 }}>
            <TableHead>
              <TableRow>
                <TableCell width={40}>#</TableCell>
                <TableCell sx={{ typography: 'subtitle2' }}>Payment Type</TableCell>
                <TableCell>SubtripID</TableCell>
                <TableCell>Vehicle No</TableCell>
                <TableCell>Route Name</TableCell>
                <TableCell>Trip End Date</TableCell>
                <TableCell>Payment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedSubtripsData &&
                selectedSubtripsData.map((st, index) => {
                  const tripSalary = calculateDriverSalary(st);

                  return (
                    <TableRow key={st._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>Trip Payment</TableCell>
                      <TableCell>{st._id}</TableCell>
                      <TableCell>{st.tripId?.vehicleId?.vehicleNo}</TableCell>
                      <TableCell>{st.routeCd.routeName}</TableCell>
                      <TableCell>{fDate(st.endDate)}</TableCell>
                      {/* driver salary is counted this way */}
                      <TableCell>{fCurrency(tripSalary)}</TableCell>
                    </TableRow>
                  );
                })}
              {otherSalaryComponent &&
                otherSalaryComponent.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{selectedSubtripsData.length + index + 1}</TableCell>
                    <TableCell>{item.paymentType}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>{item.remarks}</TableCell>
                    <TableCell>{fDate(new Date())}</TableCell>
                    {/* driver salary is counted this way */}
                    <TableCell>{fCurrency(item.amount)}</TableCell>
                  </TableRow>
                ))}

              <StyledTableRow>
                <TableCell colSpan={5} />
                <TableCell sx={{ typography: 'subtitle2' }}>Total</TableCell>
                <TableCell sx={{ typography: 'subtitle2' }}>{fCurrency(totalSalary)}</TableCell>
              </StyledTableRow>

              <StyledTableRow>
                <TableCell colSpan={5} />
                <TableCell sx={{ typography: 'subtitle2' }}>Net-Total</TableCell>
                <TableCell sx={{ typography: 'subtitle2', color: 'red' }}>
                  {fCurrency(totalSalary)}
                </TableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 5, borderStyle: 'dashed' }} />

        <Grid container sx={{ mt: 5 }}>
          <Grid xs={12} md={9} sx={{ py: 3 }}>
            <Typography variant="subtitle2">NOTES</Typography>
            <Typography variant="body2">Shree EnterPrises</Typography>
          </Grid>
          <Grid xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
            <Typography variant="subtitle2">For-Shree EnterPrises</Typography>
            <Typography variant="body2"> Authorised Signatory</Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
