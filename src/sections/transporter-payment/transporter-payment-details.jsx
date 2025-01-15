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
import { calculateTransporterPayment } from 'src/utils/utils';

import { Label } from 'src/components/label';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    borderBottom: 'none',
    padding: theme.spacing(1),
  },
}));

// Utility functions
const calculateTotal = (subtrips = []) =>
  subtrips.reduce((acc, st) => acc + calculateTransporterPayment(st), 0);

const calculateTotalExpense = (subtrip) =>
  subtrip?.expenses.reduce((acc, expense) => acc + expense.amount, 0) || 0;

const TDSAmount = (total, tdsPercentage) => (total * tdsPercentage) / 100;

const FinalAmount = (total, tdsAmount) => total - tdsAmount;

// Constants
const TABLE_HEADERS = [
  '#',
  'SubtripID',
  'Vehicle No',
  'Route Name',
  'Trip End Date',
  'Loading QTY(MT)',
  'Freight Rate',
  'Total Freight Amount',
  'Total Expense',
  'Total',
];

// Components
const Header = ({ status, paymentNo }) => (
  <Stack spacing={1} alignItems="flex-end">
    <Label variant="soft" color="secondary">
      {status || 'Transporter Payment'}
    </Label>
    <Typography variant="h6">{paymentNo || 'TPR - XXX'}</Typography>
  </Stack>
);

const TransporterDetails = ({ transporter, createdDate }) => (
  <>
    <Stack sx={{ typography: 'body2' }}>
      <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
        Transporter Details
      </Typography>
      {transporter && (
        <>
          {transporter.transportName}
          <br />
          {transporter.address}
          <br />
          Phone: {transporter.mobileNo}
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
  </>
);

const SubtripRow = ({ subtrip, index }) => {
  const totalExpense = calculateTotalExpense(subtrip);
  const totalFreightAmount = subtrip.loadingWeight * subtrip.rate;
  const total = calculateTransporterPayment(subtrip);

  return (
    <TableRow key={subtrip._id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{subtrip._id}</TableCell>
      <TableCell>{subtrip.tripId?.vehicleId?.vehicleNo}</TableCell>
      <TableCell>{subtrip.routeCd.routeName}</TableCell>
      <TableCell>{fDate(subtrip.endDate)}</TableCell>
      <TableCell>{subtrip.loadingWeight}</TableCell>
      <TableCell>{fCurrency(subtrip.rate)}</TableCell>
      <TableCell>{fCurrency(totalFreightAmount)}</TableCell>
      <TableCell>{fCurrency(totalExpense)}</TableCell>
      <TableCell>{fCurrency(total)}</TableCell>
    </TableRow>
  );
};

const TotalRow = ({ label, value, color }) => (
  <StyledTableRow>
    <TableCell colSpan={8} />
    <TableCell sx={{ typography: 'subtitle2', color: 'GrayText' }}>{label}</TableCell>
    <TableCell sx={{ typography: 'subtitle2', color }}>{fCurrency(value)}</TableCell>
  </StyledTableRow>
);

const Notes = () => (
  <Grid container sx={{ mt: 5 }}>
    <Grid xs={12} md={9} sx={{ py: 3 }}>
      <Typography variant="subtitle2">NOTES</Typography>
      <Typography variant="body2">Shree Enterprises</Typography>
    </Grid>
    <Grid xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
      <Typography variant="subtitle2">For Shree Enterprises</Typography>
      <Typography variant="body2">Authorised Signatory</Typography>
    </Grid>
  </Grid>
);

export default function TransporterPaymentDetails({
  paymentNo,
  selectedSubtripsData,
  transporter,
  status,
  createdDate,
}) {
  const totalPayment = useMemo(() => calculateTotal(selectedSubtripsData), [selectedSubtripsData]);
  const tdsAmount = useMemo(
    () => TDSAmount(totalPayment, transporter?.tdsPercentage || 0),
    [totalPayment, transporter]
  );
  const finalAmount = useMemo(
    () => FinalAmount(totalPayment, tdsAmount),
    [totalPayment, tdsAmount]
  );

  return (
    <>
      <Typography sx={{ p: 1, mb: 1 }} variant="h6" color="green">
        Transporter Payment Receipt
      </Typography>
      <Card sx={{ pt: 5, px: 5 }}>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)' }}>
          <Box
            component="img"
            alt="logo"
            src="/logo/logo-single.svg"
            sx={{ width: 48, height: 48 }}
          />
          <Header status={status} paymentNo={paymentNo} />
          <TransporterDetails transporter={transporter} createdDate={createdDate} />
        </Box>

        <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
          <Table sx={{ minWidth: 960 }}>
            <TableHead>
              <TableRow>
                {TABLE_HEADERS.map((header, index) => (
                  <TableCell key={index}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedSubtripsData &&
                selectedSubtripsData.map((st, index) => (
                  <SubtripRow key={st._id} subtrip={st} index={index} />
                ))}
              <TotalRow label="Total" value={totalPayment} color="inherit" />
              <TotalRow
                label={`TDS (${transporter?.tdsPercentage}%)`}
                value={tdsAmount}
                color="red"
              />
              <TotalRow label="Final Total" value={finalAmount} color="green" />
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 5, borderStyle: 'dashed' }} />
        <Notes />
      </Card>
    </>
  );
}
