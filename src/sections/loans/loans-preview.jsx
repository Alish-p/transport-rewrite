import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

function RenderHeader({ loan }) {
  const { status } = loan || {};
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
        <Label variant="soft" color={status === 'pending' ? 'warning' : 'success'}>
          {status}
        </Label>
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

function RenderInstallments({ loan }) {
  const totalInstallments = loan.tenure;
  const paidInstallments = loan.installmentsPaid || [];

  return (
    <TableContainer sx={{ overflowX: 'auto', mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Installment No.</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Paid Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: totalInstallments }).map((_, index) => {
            const paidInstallment = paidInstallments[index];
            const isPaid = !!paidInstallment;

            return (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{fCurrency(loan.installmentAmount)}</TableCell>
                <TableCell>
                  {fDate(
                    new Date(loan.createdAt).setMonth(
                      new Date(loan.createdAt).getMonth() + index + 1
                    )
                  )}
                </TableCell>
                <TableCell>
                  {isPaid ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'success.main' }} />
                      <Typography variant="body2" sx={{ color: 'success.main' }}>
                        Paid
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Pending
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{isPaid ? fDate(paidInstallment.paidDate) : '-'}</TableCell>
              </TableRow>
            );
          })}

          <StyledTableRow>
            <TableCell colSpan={3} />
            <TableCell sx={{ fontWeight: 'bold' }}>Total Amount</TableCell>
            <TableCell>{fCurrency(loan.totalAmount)}</TableCell>
          </StyledTableRow>

          <StyledTableRow>
            <TableCell colSpan={3} />
            <TableCell sx={{ fontWeight: 'bold' }}>Paid Amount</TableCell>
            <TableCell>
              {fCurrency(loan.totalAmount - (loan.remainingBalance || loan.totalAmount))}
            </TableCell>
          </StyledTableRow>

          <StyledTableRow>
            <TableCell colSpan={3} />
            <TableCell sx={{ fontWeight: 'bold' }}>Remaining Balance</TableCell>
            <TableCell sx={{ color: 'error.main' }}>
              {fCurrency(loan.remainingBalance || loan.totalAmount)}
            </TableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function LoansPreview({ loan }) {
  const { borrowerId: borrower, createdAt } = loan || {};

  return (
    <Card sx={{ pt: 5, px: 5 }}>
      <RenderHeader loan={loan} />

      <Box
        rowGap={5}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
        sx={{ mb: 5 }}
      >
        <RenderAddress
          title="Borrower Information"
          details={
            <>
              {borrower?.driverName || borrower?.transportName}
              <br />
              {borrower?.driverPresentAddress || borrower?.address}
              <br />
              Phone: {borrower?.driverCellNo || borrower?.cellNo}
              <br />
              {borrower?.driverLicenceNo && `License - ${borrower?.driverLicenceNo}`}
              {borrower?.gstNo && `GST - ${borrower?.driverLicenceNo}`}
            </>
          }
        />
        <RenderAddress
          title="Bank Details"
          details={
            <>
              {borrower?.bankDetails?.name}
              <br />
              Branch: {borrower?.bankDetails?.branch}
              <br />
              IFSC: {borrower?.bankDetails?.ifsc}
              <br />
              A/C: {borrower?.bankDetails?.accNo}
            </>
          }
        />
        <RenderAddress
          title="Loan Details"
          details={
            <>
              Principal: {fCurrency(loan?.principalAmount)}
              <br />
              Interest Rate: {loan?.interestRate}%
              <br />
              Tenure: {loan?.tenure} months
              <br />
              Created: {fDate(createdAt)}
            </>
          }
        />
      </Box>

      <RenderInstallments loan={loan} />

      <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

      <Grid container>
        <Grid xs={12} md={9} sx={{ py: 3 }}>
          <Typography variant="subtitle2">REMARKS</Typography>
          <Typography variant="body2">{loan?.remarks}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
}
