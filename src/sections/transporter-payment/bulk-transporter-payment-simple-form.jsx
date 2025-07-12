import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import {
  Card,
  Table,
  Stack,
  Switch,
  Button,
  Divider,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TextField,
  Typography,
  IconButton,
  TableContainer,
  FormControlLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';
import { useSubtripsByTransporter } from 'src/query/use-subtrip';
import { useCreateBulkTransporterPayment } from 'src/query/use-transporter-payment';

import { Iconify } from 'src/components/iconify';
import { TableSkeleton } from 'src/components/table';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import {
  calculateTransporterPayment,
  calculateTransporterPaymentSummary,
} from './utils/transporter-payment-calculations';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': { borderBottom: 'none', paddingTop: theme.spacing(1), paddingBottom: theme.spacing(1) },
}));

const StyledTableCell = styled(TableCell)(() => ({
  fontWeight: 'bold',
}));

export default function BulkTransporterPaymentSimpleForm() {
  const dateRangeDialog = useBoolean();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const { data = [], isLoading } = useSubtripsByTransporter(dateRange.start, dateRange.end);
  const createBulk = useCreateBulkTransporterPayment();

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (data?.length) {
      setPayments(
        data.map(({ transporter, subtrips }) => ({
          transporter,
          subtrips,
          additionalCharges: [],
          selected: true,
        }))
      );
    } else {
      setPayments([]);
    }
  }, [data]);

  const handleRemoveSubtrip = (ti, si) => {
    setPayments((prev) => {
      const copy = [...prev];
      copy[ti].subtrips.splice(si, 1);
      return copy;
    });
  };

  const handleAddCharge = (ti) => {
    setPayments((prev) => {
      const copy = [...prev];
      copy[ti].additionalCharges.push({ label: '', amount: '' });
      return copy;
    });
  };

  const handleRemoveCharge = (ti, ci) => {
    setPayments((prev) => {
      const copy = [...prev];
      copy[ti].additionalCharges.splice(ci, 1);
      return copy;
    });
  };

  const handleChangeCharge = (ti, ci, field, value) => {
    setPayments((prev) => {
      const copy = [...prev];
      copy[ti].additionalCharges[ci][field] = value;
      return copy;
    });
  };

  const toggleSelect = (ti) => {
    setPayments((prev) => {
      const copy = [...prev];
      copy[ti].selected = !copy[ti].selected;
      return copy;
    });
  };

  const handleCreate = async () => {
    const payload = payments
      .filter((p) => p.selected && p.subtrips.length)
      .map(({ transporter, subtrips, additionalCharges }) => ({
        transporterId: transporter._id,
        billingPeriod: dateRange,
        associatedSubtrips: subtrips.map((st) => st._id),
        additionalCharges: [
          { label: 'POD Charges', amount: subtrips.length * (transporter.podCharges || 0) },
          ...additionalCharges.map((c) => ({ label: c.label, amount: Number(c.amount) || 0 })),
        ],
      }));

    if (payload.length === 0) return;

    try {
      await createBulk(payload);
      navigate(paths.dashboard.transporterPayment.root);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Card sx={{ p: 3, mb: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Select Date Range</Typography>
          <DialogSelectButton
            placeholder="Select Date Range"
            selected={
              dateRange.start && dateRange.end
                ? `${fDate(dateRange.start)} – ${fDate(dateRange.end)}`
                : 'Select Date Range'
            }
            onClick={dateRangeDialog.onTrue}
            iconName="mdi:calendar"
            disabled={isLoading}
          />
          <CustomDateRangePicker
            variant="calendar"
            open={dateRangeDialog.value}
            onClose={dateRangeDialog.onFalse}
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChangeStartDate={(d) => setDateRange({ ...dateRange, start: d })}
            onChangeEndDate={(d) => setDateRange({ ...dateRange, end: d })}
          />
        </Stack>
      </Card>

      {isLoading && <TableSkeleton />}

      {!isLoading &&
        payments.map((pay, ti) => {
          const { transporter, subtrips, additionalCharges, selected } = pay;
          const podCharge = subtrips.length * (transporter.podCharges || 0);
          const summary = calculateTransporterPaymentSummary(subtrips, transporter, [
            { label: 'POD Charges', amount: podCharge },
            ...additionalCharges.map((c) => ({ label: c.label, amount: Number(c.amount) || 0 })),
          ]);
          const {
            taxBreakup,
            totalFreightAmount,
            totalExpense,
            totalShortageAmount,
            totalTripWiseIncome,
            netIncome,
          } = summary;

          return (
            <Card key={transporter._id} sx={{ p: 3, mb: 3, opacity: selected ? 1 : 0.5 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <Typography variant="h6">{transporter.transportName}</Typography>
                <FormControlLabel
                  control={<Switch checked={selected} onChange={() => toggleSelect(ti)} />}
                  label="Include"
                />
              </Stack>

              <Stack
                spacing={{ xs: 3, md: 5 }}
                direction={{ xs: 'column', md: 'row' }}
                divider={<Divider flexItem orientation="vertical" sx={{ borderStyle: 'dashed' }} />}
              >
                <Stack sx={{ width: 1 }}>
                  <Typography variant="h6" sx={{ color: 'text.disabled', mb: 1 }}>
                    From:
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">{CONFIG.company.name}</Typography>
                    <Typography variant="body2">{CONFIG.company.address.line1}</Typography>
                    <Typography variant="body2">{CONFIG.company.address.line2}</Typography>
                    <Typography variant="body2">{CONFIG.company.address.state}</Typography>
                    <Typography variant="body2">Phone: {CONFIG.company.contacts[0]}</Typography>
                  </Stack>
                </Stack>

                <Stack sx={{ width: 1 }}>
                  <Typography variant="h6" sx={{ color: 'text.disabled', mb: 1 }}>
                    To:
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">{transporter.transportName}</Typography>
                    <Typography variant="body2">{transporter.address}</Typography>
                    <Typography variant="body2">{transporter.cellNo}</Typography>
                  </Stack>
                </Stack>
              </Stack>

              <TableContainer sx={{ overflowX: 'auto', mt: 3 }}>
                <Table sx={{ minWidth: 960 }}>
                  <TableHead>
                    <TableRow>
                      {[
                        '#',
                        'Dispatch Date',
                        'LR No.',
                        'VEH No',
                        'From',
                        'Destination',
                        'InvoiceNo',
                        'Load Qty',
                        'Shortage Qty',
                        'Shortage Amt',
                        'FRT-RATE',
                        'FRT-AMT',
                        'Expense',
                        'Total Payable',
                      ].map((h, idx) => (
                        <StyledTableCell key={h} align={idx < 7 ? 'center' : 'right'}>
                          {h}
                        </StyledTableCell>
                      ))}
                      <StyledTableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subtrips.map((st, si) => {
                      const {
                        effectiveFreightRate,
                        totalFreightAmount: freightAmount,
                        totalExpense: expense,
                        totalTransporterPayment,
                        totalShortageAmount: shortageAmount,
                      } = calculateTransporterPayment(st);
                      return (
                        <TableRow key={st._id}>
                          <TableCell>{si + 1}</TableCell>
                          <TableCell>{fDate(st.startDate)}</TableCell>
                          <TableCell>{st._id}</TableCell>
                          <TableCell>{st.tripId?.vehicleId?.vehicleNo}</TableCell>
                          <TableCell>{st.loadingPoint}</TableCell>
                          <TableCell>{st.unloadingPoint}</TableCell>
                          <TableCell>{st.invoiceNo}</TableCell>
                          <TableCell align="right">{st.loadingWeight}</TableCell>
                          <TableCell align="right">{st.shortageWeight}</TableCell>
                          <TableCell align="right">{fCurrency(shortageAmount)}</TableCell>
                          <TableCell align="right">{fCurrency(effectiveFreightRate)}</TableCell>
                          <TableCell align="right">{fCurrency(freightAmount)}</TableCell>
                          <TableCell align="right">{fCurrency(expense)}</TableCell>
                          <TableCell align="right">{fCurrency(totalTransporterPayment)}</TableCell>
                          <TableCell width={40}>
                            <IconButton color="error" onClick={() => handleRemoveSubtrip(ti, si)}>
                              <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    <StyledTableRow>
                      <TableCell colSpan={8} />
                      <StyledTableCell sx={{ color: 'info.main' }}>Total</StyledTableCell>
                      <TableCell align="right" sx={{ color: 'info.main' }}>
                        {fCurrency(totalShortageAmount)}
                      </TableCell>
                      <TableCell align="right">-</TableCell>
                      <TableCell align="right" sx={{ color: 'info.main' }}>
                        {fCurrency(totalFreightAmount)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'info.main' }}>
                        {fCurrency(totalExpense)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'info.main' }}>
                        {fCurrency(totalTripWiseIncome)}
                      </TableCell>
                      <TableCell />
                    </StyledTableRow>

                    {taxBreakup?.tds?.rate > 0 && (
                      <StyledTableRow>
                        <TableCell colSpan={13} align="right">
                          TDS ({taxBreakup.tds.rate}%)
                        </TableCell>
                        <TableCell sx={{ color: 'error.main' }} align="right">
                          -{fCurrency(taxBreakup.tds.amount)}
                        </TableCell>
                        <TableCell />
                      </StyledTableRow>
                    )}

                    {['cgst', 'sgst', 'igst'].map((k) => {
                      const item = taxBreakup[k];
                      return item.rate > 0 ? (
                        <StyledTableRow key={k}>
                          <TableCell colSpan={13} align="right">
                            {k.toUpperCase()} ({item.rate}%)
                          </TableCell>
                          <TableCell align="right">{fCurrency(item.amount)}</TableCell>
                          <TableCell />
                        </StyledTableRow>
                      ) : null;
                    })}

                    {podCharge > 0 && (
                      <StyledTableRow>
                        <TableCell colSpan={13} align="right">
                          POD Charges
                        </TableCell>
                        <TableCell sx={{ color: 'error.main' }} align="right">
                          -{fCurrency(podCharge)}
                        </TableCell>
                        <TableCell />
                      </StyledTableRow>
                    )}

                    {additionalCharges.map((ch, ci) => (
                      <StyledTableRow key={ci}>
                        <TableCell colSpan={13} align="right">
                          <TextField
                            style={{ width: 150 }}
                            value={ch.label}
                            onChange={(e) => handleChangeCharge(ti, ci, 'label', e.target.value)}
                            placeholder="Label"
                            size="small"
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            style={{ width: 100 }}
                            value={ch.amount}
                            onChange={(e) => handleChangeCharge(ti, ci, 'amount', e.target.value)}
                            placeholder="Amount"
                            size="small"
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton color="error" onClick={() => handleRemoveCharge(ti, ci)}>
                            <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                          </IconButton>
                        </TableCell>
                      </StyledTableRow>
                    ))}

                    <StyledTableRow>
                      <TableCell colSpan={15}>
                        <Button size="small" onClick={() => handleAddCharge(ti)}>
                          Add Extra Charge
                        </Button>
                      </TableCell>
                    </StyledTableRow>

                    <StyledTableRow>
                      <TableCell colSpan={13} align="right">
                        <strong>Net Total</strong>
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'success.main' }}>
                        {fCurrency(netIncome)}
                      </TableCell>
                      <TableCell />
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          );
        })}

      {payments.length > 0 && (
        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
          <LoadingButton variant="contained" onClick={handleCreate} loading={false}>
            Generate Bulk Payments
          </LoadingButton>
        </Stack>
      )}
    </>
  );
}
