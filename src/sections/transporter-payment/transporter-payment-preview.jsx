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

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';
import { useFetchSubtripsForTransporterBilling } from 'src/query/use-subtrip';

import { paths } from '../../routes/paths';
import { RouterLink } from '../../routes/components';
import { loadingWeightUnit } from '../vehicle/vehicle-config';
import { calculateTransporterPayment, calculateTransporterPaymentSummary } from '../../utils/utils';

const StyledTableRow = (props) => (
  <TableRow {...props} sx={{ '& td': { borderBottom: 'none', pt: 1, pb: 1 } }} />
);

const StyledTableCell = (props) => <TableCell {...props} sx={{ fontWeight: 'bold' }} />;

function RenderHeader() {
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
        <Typography variant="h6">Draft Transporter Payment Preview</Typography>
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

function RenderTable({ subtrips, selectedTransporter }) {
  const { netIncome } = calculateTransporterPaymentSummary({
    subtrips,
    transporterId: selectedTransporter,
  });

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
          {subtrips.map((st, idx) => {
            const {
              effectiveFreightRate,
              totalFreightAmount,
              totalExpense,
              totalTransporterPayment,
              totalShortageAmount,
            } = calculateTransporterPayment(st);
            return (
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
                <TableCell>{fCurrency(effectiveFreightRate)}</TableCell>
                <TableCell>
                  {st.loadingWeight} {loadingWeightUnit[st.tripId?.vehicleId?.vehicleType]}
                </TableCell>
                <TableCell>{fCurrency(totalTransporterPayment)}</TableCell>
              </TableRow>
            );
          })}

          <StyledTableRow>
            <TableCell colSpan={7} />
            <StyledTableCell>Subtotal</StyledTableCell>
            <TableCell>{fCurrency(netIncome)}</TableCell>
          </StyledTableRow>

          {selectedTransporter?.tdsPercentage > 0 && (
            <StyledTableRow>
              <TableCell colSpan={7} />
              <StyledTableCell>TDS ({selectedTransporter.tdsPercentage}%)</StyledTableCell>
              <TableCell>
                {fCurrency(netIncome * (selectedTransporter.tdsPercentage / 100))}
              </TableCell>
            </StyledTableRow>
          )}

          <StyledTableRow>
            <TableCell colSpan={7} />
            <StyledTableCell>Net Total</StyledTableCell>
            <TableCell sx={{ color: 'error.main' }}>
              {fCurrency(netIncome * (1 - (selectedTransporter?.tdsPercentage || 0) / 100))}
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

export default function TransporterPaymentPreview({ transporterList }) {
  // Watch entire form live!
  const draft = useWatch();
  const isDirty =
    draft.transporterId ||
    draft.billingPeriod?.start ||
    draft.billingPeriod?.end ||
    draft.subtripIds?.length > 0;

  // Fetch subtrips data for preview
  const { data: availableSubtrips = [] } = useFetchSubtripsForTransporterBilling(
    draft.transporterId,
    draft.billingPeriod?.start,
    draft.billingPeriod?.end
  );

  // Filter subtrips based on selected IDs
  const previewSubtrips = useMemo(() => {
    if (!draft.subtripIds?.length || !availableSubtrips.length) return [];
    return availableSubtrips.filter((st) => draft.subtripIds.includes(st._id));
  }, [draft.subtripIds, availableSubtrips]);

  const selectedTransporter = useMemo(() => {
    if (!draft.transporterId || !transporterList.length) return null;
    return transporterList.find((t) => t._id === draft.transporterId);
  }, [draft.transporterId, transporterList]);

  if (!isDirty) {
    return null;
  }

  return (
    <Card sx={{ pt: 5, px: 5 }}>
      <RenderHeader />
      <Box
        rowGap={5}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
      >
        <RenderAddress
          title="Payment From"
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
            selectedTransporter && (
              <>
                {selectedTransporter.transportName}
                <br />
                {selectedTransporter.address}
                <br />
                {selectedTransporter.place}
                <br />
                Phone: {selectedTransporter.cellNo}
                <br />
                {selectedTransporter.panNo && <>PAN: {selectedTransporter.panNo}</>}
                <br />
                {selectedTransporter.gstNo && <>GST: {selectedTransporter.gstNo}</>}
              </>
            )
          }
        />
      </Box>

      <RenderTable subtrips={previewSubtrips} selectedTransporter={selectedTransporter} />
      <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
      <RenderFooter />
    </Card>
  );
}
