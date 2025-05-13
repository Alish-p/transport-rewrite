// src/sections/transporter-payment/bulk-transporter-payment-preview.jsx
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';
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

function RenderHeader({ transporterData, index }) {
  const { transporterId, transporterName } = transporterData;
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
        <Typography variant="h6">
          {index + 1}. {transporterName}
        </Typography>
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

function RenderTable({ transporterData }) {
  const { subtrips, loans, transporterId } = transporterData;
  const { netIncome } = calculateTransporterPaymentSummary({
    associatedSubtrips: subtrips,
    selectedLoans: loans,
    transporterId,
  });

  const finalAmount = netIncome * (1 - (transporterId?.tdsPercentage || 0) / 100);
  const hasNegativeAmount = finalAmount < 0;

  return (
    <TableContainer sx={{ overflow: 'scroll', mt: 4 }}>
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
            <StyledTableCell>Shortage Amount</StyledTableCell>
            <StyledTableCell>Total Expense</StyledTableCell>
            <StyledTableCell>Total</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subtrips?.map((st, index) => {
            const {
              effectiveFreightRate,
              totalFreightAmount,
              totalExpense,
              totalTransporterPayment,
              totalShortageAmount,
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
                <TableCell>{fCurrency(totalShortageAmount)}</TableCell>
                <TableCell>{fCurrency(totalExpense)}</TableCell>
                <TableCell>{fCurrency(totalTransporterPayment)}</TableCell>
              </TableRow>
            );
          })}

          {loans?.length > 0 &&
            loans.map(
              ({ remarks, createdAt, currentInstallmentAmount, installmentAmount }, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>Loan Repayment</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{remarks}</TableCell>
                  <TableCell>{fDate(createdAt)}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{fCurrency(installmentAmount)}</TableCell>
                  <TableCell>{fCurrency(installmentAmount)}</TableCell>
                </TableRow>
              )
            )}

          <StyledTableRow>
            <TableCell colSpan={9} />
            <StyledTableCell>Total</StyledTableCell>
            <TableCell>{fCurrency(netIncome)}</TableCell>
          </StyledTableRow>

          <StyledTableRow>
            <TableCell colSpan={9} />
            <StyledTableCell>TDS({transporterId?.tdsPercentage || 0}%)</StyledTableCell>
            <TableCell>
              {fCurrency(netIncome * ((transporterId?.tdsPercentage || 0) / 100))}
            </TableCell>
          </StyledTableRow>

          <StyledTableRow>
            <TableCell colSpan={9} />
            <StyledTableCell>
              <Typography variant="subtitle2" color={hasNegativeAmount ? 'error' : 'inherit'}>
                Net-Total
              </Typography>
            </StyledTableCell>
            <TableCell>
              <Typography color={hasNegativeAmount ? 'error' : 'inherit'}>
                {fCurrency(finalAmount)}
              </Typography>
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

// Main Bulk Preview Component
export default function BulkTransporterPaymentPreview({ transporterDataList, dateRange }) {
  const hasAnyNegativeAmount = transporterDataList?.some((data) => {
    const { netIncome } = calculateTransporterPaymentSummary({
      associatedSubtrips: data.subtrips,
      selectedLoans: data.loans,
      transporterId: data.transporterId,
    });
    return netIncome * (1 - (data.transporterId?.tdsPercentage || 0) / 100) < 0;
  });

  return (
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
          Some transporters have negative final amounts. Please review and adjust before generating
          payments.
        </Alert>
      )}

      <Stack spacing={4}>
        {transporterDataList?.map((transporterData, index) => (
          <Card
            key={transporterData.transporterId._id}
            sx={{
              p: 5,
              border: hasAnyNegativeAmount ? '2px solid' : 'none',
              borderColor: 'error.main',
              bgcolor: hasAnyNegativeAmount ? 'error.lighter' : 'background.paper',
            }}
          >
            <RenderHeader transporterData={transporterData} index={index} />

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
                  transporterData.transporterId && (
                    <>
                      {transporterData.transporterId?.transportName}
                      <br />
                      {transporterData.transporterId?.address},
                      {transporterData.transporterId?.pinNo}
                      <br />
                      {transporterData.transporterId?.cellNo && (
                        <>Phone: {transporterData.transporterId?.cellNo} </>
                      )}
                      <br />
                      {transporterData.transporterId?.panNo && (
                        <>Pan: {transporterData.transporterId?.panNo} </>
                      )}
                      <br />
                      {transporterData.transporterId?.gstNo && (
                        <>GST: {transporterData.transporterId?.gstNo} </>
                      )}
                    </>
                  )
                }
              />
            </Box>

            <RenderTable transporterData={transporterData} />

            <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
            <RenderFooter />
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
