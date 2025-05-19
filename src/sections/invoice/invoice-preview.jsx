import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';

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
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';
import { useClosedTripsByCustomerAndDate } from 'src/query/use-subtrip';

import { loadingWeightUnit } from '../vehicle/vehicle-config';
import { calculateTaxBreakup } from './utills/invoice-calculation';

const StyledTableRow = (props) => (
  <TableRow {...props} sx={{ '& td': { borderBottom: 'none', pt: 1, pb: 1 } }} />
);

const StyledTableCell = (props) => <TableCell {...props} sx={{ fontWeight: 'bold' }} />;

function calculateSubtripTotal(subtrip) {
  const freightAmount = (subtrip.loadingWeight || 0) * (subtrip.rate || 0);
  const shortage = subtrip.shortageAmount || 0;
  return freightAmount - shortage;
}

function RenderHeader({ draft }) {
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
        <Typography variant="h6">Draft Invoice Preview</Typography>
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

function RenderTable({ subtrips, selectedCustomer }) {
  const { cgst, sgst, igst } = calculateTaxBreakup(selectedCustomer);

  const subtotal = subtrips.reduce((acc, st) => acc + calculateSubtripTotal(st), 0);
  const cgstAmount = subtotal * (cgst / 100);
  const sgstAmount = subtotal * (sgst / 100);
  const igstAmount = subtotal * (igst / 100);
  const netTotal = subtotal + cgstAmount + sgstAmount + igstAmount;

  return (
    <TableContainer sx={{ overflowX: 'auto', mt: 4 }}>
      <Table sx={{ minWidth: 960 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell>#</StyledTableCell>
            <StyledTableCell>Vehicle No</StyledTableCell>
            <StyledTableCell>Consignee</StyledTableCell>
            <StyledTableCell>Destination</StyledTableCell>
            <StyledTableCell>Subtrip ID</StyledTableCell>
            <StyledTableCell>Dispatch Date</StyledTableCell>
            <StyledTableCell>Freight Rate</StyledTableCell>
            <StyledTableCell>Quantity</StyledTableCell>
            <StyledTableCell>Total Amount</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subtrips.map((st, idx) => (
            <TableRow key={st._id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{st.tripId?.vehicleId?.vehicleNo}</TableCell>

              <TableCell>{st.consignee}</TableCell>
              <TableCell>{st.unloadingPoint}</TableCell>
              <TableCell>
                <RouterLink
                  to={paths.dashboard.subtrip.details(st._id)}
                  style={{
                    color: '#2e7d32',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {st._id}
                </RouterLink>
              </TableCell>
              <TableCell>{fDate(st.startDate)}</TableCell>
              <TableCell>{fCurrency(st.rate)}</TableCell>
              <TableCell>
                {st.loadingWeight} {loadingWeightUnit[st.tripId?.vehicleId?.vehicleType]}
              </TableCell>
              <TableCell>{fCurrency(calculateSubtripTotal(st))}</TableCell>
            </TableRow>
          ))}

          <StyledTableRow>
            <TableCell colSpan={7} />
            <StyledTableCell>Subtotal</StyledTableCell>
            <TableCell colSpan={1}>{fCurrency(subtotal)}</TableCell>
          </StyledTableRow>

          {cgst > 0 && (
            <StyledTableRow>
              <TableCell colSpan={7} />
              <StyledTableCell>CGST ({cgst}%)</StyledTableCell>
              <TableCell>{fCurrency(cgstAmount)}</TableCell>
            </StyledTableRow>
          )}

          {sgst > 0 && (
            <StyledTableRow>
              <TableCell colSpan={7} />
              <StyledTableCell>SGST ({sgst}%)</StyledTableCell>
              <TableCell>{fCurrency(sgstAmount)}</TableCell>
            </StyledTableRow>
          )}

          {igst > 0 && (
            <StyledTableRow>
              <TableCell colSpan={7} />
              <StyledTableCell>IGST ({igst}%)</StyledTableCell>
              <TableCell>{fCurrency(igstAmount)}</TableCell>
            </StyledTableRow>
          )}
          <StyledTableRow>
            <TableCell colSpan={7} />
            <StyledTableCell>Net Total</StyledTableCell>
            <TableCell sx={{ color: 'error.main' }}>{fCurrency(netTotal)}</TableCell>
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

export default function InvoicePreview({ customerList }) {
  const draft = useWatch();
  const isDirty =
    draft.customerId ||
    draft.billingPeriod?.start ||
    draft.billingPeriod?.end ||
    draft.subtripIds?.length > 0;

  // Fetch subtrips data for preview
  const { data: availableSubtrips = [] } = useClosedTripsByCustomerAndDate(
    draft.customerId,
    draft.billingPeriod?.start,
    draft.billingPeriod?.end
  );

  // Filter subtrips based on selected IDs
  const previewSubtrips = useMemo(() => {
    if (!draft.subtripIds?.length || !availableSubtrips.length) return [];
    return availableSubtrips.filter((st) => draft.subtripIds.includes(st._id));
  }, [draft.subtripIds, availableSubtrips]);

  const selectedCustomer = useMemo(() => {
    if (!draft.customerId || !customerList.length) return null;
    return customerList.find((c) => c._id === draft.customerId);
  }, [draft.customerId, customerList]);

  if (!isDirty) {
    return null;
  }

  return (
    <Card sx={{ pt: 5, px: 5 }}>
      <RenderHeader draft={draft} />
      <Box
        rowGap={5}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
      >
        <RenderAddress
          title="Invoice From"
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
          title="Invoice To"
          details={
            <>
              {selectedCustomer?.customerName || '---'}
              <br />
              {selectedCustomer?.address || '---'}
              <br />
              {selectedCustomer?.state || '---'}
              <br />
              {selectedCustomer?.cellNo || '---'}
            </>
          }
        />
        <RenderAddress title="Due Date" details={draft.dueDate ? fDate(draft.dueDate) : '---'} />
      </Box>

      <RenderTable subtrips={previewSubtrips} selectedCustomer={selectedCustomer} />
      <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
      <RenderFooter />
    </Card>
  );
}
