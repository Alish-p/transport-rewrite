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

import { Label } from 'src/components/label';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    // textAlign: 'center',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

function calculateTotal(subtrips) {
  return subtrips?.reduce((acc, trip) => acc + trip.rate * trip.loadingWeight, 0);
}

export default function InvoiceDetails({ invoiceNo, subtrips, customer, status, createdDate }) {
  const totalAmount = useMemo(() => calculateTotal(subtrips), [subtrips]);

  return (
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
          src="/logo/logo_single.svg"
          sx={{ width: 48, height: 48 }}
        />

        <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
          <Label variant="soft" color="default">
            {status || 'Draft'}
          </Label>
          <Typography variant="h6">{invoiceNo || 'INV - XXX'}</Typography>
        </Stack>

        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
            Invoice From
          </Typography>
          Shree EnterPrise
          <br />
          Mudhol Opp-Reliance Trend
          <br />
          Phone: {7575049646}
          <br />
        </Stack>

        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
            Invoice To
          </Typography>
          {customer && (
            <>
              {customer.customerName}
              <br />
              {customer.address}
              <br />
              Phone: {customer.cellNo}
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
        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
            Due Date
          </Typography>
          {createdDate && fDate(createdDate)}
        </Stack>
      </Box>

      <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
        <Table sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow>
              <TableCell width={40}>#</TableCell>
              <TableCell sx={{ typography: 'subtitle2' }}>Consignee</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Vehicle No</TableCell>
              <TableCell>LR No</TableCell>
              <TableCell>Invoice No</TableCell>
              <TableCell>Disp Date</TableCell>

              <TableCell>QTY(MT)</TableCell>
              <TableCell>Rate/MT</TableCell>
              <TableCell>Freight</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subtrips &&
              subtrips.map((st, index) => (
                <TableRow key={st._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{st.consignee}</TableCell>
                  <TableCell>{st.unloadingPoint}</TableCell>
                  <TableCell>{st.tripId?.vehicleId?.vehicleNo}</TableCell>
                  <TableCell>{st._id}</TableCell>
                  <TableCell>{st.invoiceNo}</TableCell>
                  <TableCell>{fDate(st.startDate)}</TableCell>
                  <TableCell>{st.loadingWeight}</TableCell>
                  <TableCell>{fCurrency(st.rate)}</TableCell>
                  <TableCell>{fCurrency(st.rate * st.loadingWeight)}</TableCell>
                </TableRow>
              ))}
            <StyledTableRow>
              <TableCell colSpan={8} />
              <TableCell sx={{ typography: 'subtitle2' }}>Total</TableCell>
              <TableCell sx={{ typography: 'subtitle2' }}>{fCurrency(totalAmount)}</TableCell>
            </StyledTableRow>
            <StyledTableRow>
              <TableCell colSpan={8} />
              <TableCell sx={{ typography: 'subtitle2' }}>CGST(+6%)</TableCell>
              <TableCell sx={{ typography: 'subtitle2' }}>
                {fCurrency(totalAmount * 0.06)}
              </TableCell>
            </StyledTableRow>
            <StyledTableRow>
              <TableCell colSpan={8} />
              <TableCell sx={{ typography: 'subtitle2' }}>SGST(+6%)</TableCell>
              <TableCell sx={{ typography: 'subtitle2' }}>
                {fCurrency(totalAmount * 0.06)}
              </TableCell>
            </StyledTableRow>

            <StyledTableRow>
              <TableCell colSpan={8} />
              <TableCell sx={{ typography: 'subtitle2' }}>Net-Total</TableCell>
              <TableCell sx={{ typography: 'subtitle2', color: 'red' }}>
                {fCurrency(totalAmount * 1.12)}
              </TableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

      <Grid container>
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
  );
}
