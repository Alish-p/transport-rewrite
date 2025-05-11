// src/sections/transporter-payment/bulk-transporter-payment-preview.jsx
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { calculateTransporterPayment, calculateTransporterPaymentSummary } from 'src/utils/utils';

import { CONFIG } from 'src/config-global';

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

// Individual Transporter Payment Card
function TransporterPaymentCard({ transporterData, index }) {
  const { transporterId, transporterName, subtrips, loans } = transporterData;

  // Calculate payment summary
  const paymentSummary = calculateTransporterPaymentSummary({
    associatedSubtrips: subtrips,
    selectedLoans: loans,
    transporterId,
  });

  const { netIncome } = paymentSummary;
  const finalAmount = netIncome * (1 - (transporterId?.tdsPercentage || 0) / 100);
  const hasNegativeAmount = finalAmount < 0;

  return (
    <Card
      sx={{
        p: 3,
        mb: 3,
        border: hasNegativeAmount ? '2px solid' : 'none',
        borderColor: 'error.main',
        bgcolor: hasNegativeAmount ? 'error.lighter' : 'background.paper',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          {index + 1}. {transporterName}
        </Typography>
        {hasNegativeAmount && (
          <Alert severity="error" sx={{ py: 0 }}>
            <AlertTitle>Negative Balance</AlertTitle>
            Final amount is negative
          </Alert>
        )}
      </Stack>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>SubtripID</StyledTableCell>
              <StyledTableCell>Vehicle No</StyledTableCell>
              <StyledTableCell>Route</StyledTableCell>
              <StyledTableCell>End Date</StyledTableCell>
              <StyledTableCell>Amount</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subtrips.map((st) => {
              const { totalTransporterPayment } = calculateTransporterPayment(st);
              return (
                <TableRow key={st._id}>
                  <TableCell>{st._id}</TableCell>
                  <TableCell>{st.tripId?.vehicleId?.vehicleNo}</TableCell>
                  <TableCell>{st.routeCd.routeName}</TableCell>
                  <TableCell>{fDate(st.endDate)}</TableCell>
                  <TableCell>{fCurrency(totalTransporterPayment)}</TableCell>
                </TableRow>
              );
            })}

            {loans.length > 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="subtitle2" color="error">
                    Loan Deductions
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="error">
                    -{fCurrency(loans.reduce((sum, loan) => sum + loan.installmentAmount, 0))}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            <StyledTableRow>
              <TableCell colSpan={4}>Subtotal</TableCell>
              <TableCell>{fCurrency(netIncome)}</TableCell>
            </StyledTableRow>

            <StyledTableRow>
              <TableCell colSpan={4}>TDS ({transporterId?.tdsPercentage || 0}%)</TableCell>
              <TableCell>
                {fCurrency(netIncome * ((transporterId?.tdsPercentage || 0) / 100))}
              </TableCell>
            </StyledTableRow>

            <StyledTableRow>
              <TableCell colSpan={4}>
                <Typography variant="subtitle2" color={hasNegativeAmount ? 'error' : 'inherit'}>
                  Final Amount
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color={hasNegativeAmount ? 'error' : 'inherit'}>
                  {fCurrency(finalAmount)}
                </Typography>
              </TableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

// Main Bulk Preview Component
export default function BulkTransporterPaymentPreview({ transporterDataList, dateRange }) {
  const hasAnyNegativeAmount = transporterDataList.some((data) => {
    const { netIncome } = calculateTransporterPaymentSummary({
      associatedSubtrips: data.subtrips,
      selectedLoans: data.loans,
      transporterId: data.transporterId,
    });
    return netIncome * (1 - (data.transporterId?.tdsPercentage || 0) / 100) < 0;
  });

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Bulk Transporter Payment Preview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Period: {fDate(dateRange.startDate)} - {fDate(dateRange.endDate)}
          </Typography>
        </Box>

        {hasAnyNegativeAmount && (
          <Alert severity="error">
            <AlertTitle>Warning</AlertTitle>
            Some transporters have negative final amounts. Please review and adjust before
            generating payments.
          </Alert>
        )}

        <Stack spacing={2}>
          {transporterDataList.map((transporterData, index) => (
            <TransporterPaymentCard
              key={transporterData.transporterId._id}
              transporterData={transporterData}
              index={index}
            />
          ))}
        </Stack>

        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Typography variant="subtitle2">For {CONFIG.company.name}</Typography>
          <Typography variant="body2">Authorised Signatory</Typography>
        </Box>
      </Stack>
    </Card>
  );
}
