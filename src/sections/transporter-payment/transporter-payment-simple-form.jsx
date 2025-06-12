import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useNavigate } from 'react-router';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import {
  Card,
  Stack,
  Table,
  Button,
  Divider,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fDateRangeShortLabel } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';
import { useFetchSubtripsForTransporterBilling } from 'src/query/use-subtrip';
import { useCreateTransporterPayment } from 'src/query/use-transporter-payment';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { TableSkeleton } from '../../components/table';
import { Form, Field, schemaHelper } from '../../components/hook-form';
import { KanbanTransporterDialog } from '../kanban/components/kanban-transporter-dialog';
import { CustomDateRangePicker } from '../../components/custom-date-range-picker/custom-date-range-picker';
import {
  calculateTransporterPayment,
  calculateTransporterPaymentSummary,
} from './utils/transporter-payment-calculations';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': { borderBottom: 'none', paddingTop: theme.spacing(1), paddingBottom: theme.spacing(1) },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
}));

const PaymentSchema = zod.object({
  transporterId: zod.string().min(1, 'Transporter is required'),
  billingPeriod: zod
    .object({
      start: schemaHelper.date({ required_error: 'Start date is required' }),
      end: schemaHelper.date({ required_error: 'End date is required' }),
    })
    .refine(
      (data) => {
        if (!data.start || !data.end) return true;
        return dayjs(data.end).isAfter(dayjs(data.start)) || dayjs(data.end).isSame(dayjs(data.start));
      },
      { message: 'End date must be after or equal to start date', path: ['end'] }
    ),
  subtrips: zod.array(zod.any()).min(1, 'Select at least one subtrip'),
  additionalCharges: zod
    .array(
      zod.object({
        label: zod.string().min(1, 'Label is required'),
        amount: zod
          .preprocess((val) => Number(val), zod.number())
          .refine((val) => val !== 0, 'Amount cannot be zero'),
      })
    )
    .default([]),
});

export default function TransporterPaymentSimpleForm({ transporterList }) {
  const transporterDialog = useBoolean();
  const subtripDialog = useBoolean();
  const dateDialog = useBoolean();

  const methods = useForm({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      transporterId: '',
      billingPeriod: { start: dayjs().startOf('month'), end: dayjs() },
      subtrips: [],
      additionalCharges: [],
    },
  });

  const {
    watch,
    setValue,
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const {
    fields: subtripFields,
    remove: removeSubtrip,
    replace,
  } = useFieldArray({ control, name: 'subtrips' });

  const {
    fields: additionalFields,
    append: appendCharge,
    remove: removeCharge,
  } = useFieldArray({ name: 'additionalCharges', control });

  const { transporterId, billingPeriod, subtrips, additionalCharges } = watch();

  const selectedTransporter = useMemo(
    () => transporterList.find((t) => String(t._id) === String(transporterId)),
    [transporterList, transporterId]
  );

  const { data: fetchedSubtrips, isSuccess, isLoading, refetch } =
    useFetchSubtripsForTransporterBilling(
      transporterId,
      billingPeriod?.start,
      billingPeriod?.end
    );

  const createPayment = useCreateTransporterPayment();
  const navigate = useNavigate();

  useEffect(() => {
    if (transporterId && billingPeriod?.start && billingPeriod?.end) {
      refetch();
    }
  }, [transporterId, billingPeriod?.start, billingPeriod?.end, refetch]);

  useEffect(() => {
    if (isSuccess && fetchedSubtrips) {
      replace(fetchedSubtrips);
    }
  }, [isSuccess, fetchedSubtrips, replace]);

  const handleRemove = (index) => {
    removeSubtrip(index);
  };

  const handleAddCharge = () => {
    appendCharge({ label: '', amount: '' });
  };

  const handleRemoveCharge = (index) => {
    removeCharge(index);
  };

  const handleReset = () => {
    reset({
      transporterId: '',
      billingPeriod: { start: dayjs().startOf('month'), end: dayjs() },
      subtrips: [],
      additionalCharges: [],
    });
  };

  const onSubmit = async (data) => {
    const {
      transporterId: tid,
      billingPeriod: period,
      subtrips: subtripData,
      additionalCharges: addCharges,
    } = data;
    try {
      const payment = await createPayment({
        transporterId: tid,
        billingPeriod: period,
        associatedSubtrips: subtripData.map((st) => st._id),
        additionalCharges: [
          {
            label: 'POD Charges',
            amount: subtripData.length * (selectedTransporter?.podCharges || 0) * -1, // pod charges will be negative
          },
          ...addCharges.map((it) => ({ label: it.label, amount: Number(it.amount) || 0 })),
        ],
      });
      navigate(paths.dashboard.transporterPayment.details(payment._id));
    } catch (error) {
      console.error('Failed to create transporter payment', error);
    }
  };

  const podCharge = subtrips.length * (selectedTransporter?.podCharges || 0);

  const summary = calculateTransporterPaymentSummary(
    subtrips,
    selectedTransporter,
    [
      { label: 'POD Charges', amount: -podCharge },
      ...additionalCharges.map((it) => ({ label: it.label, amount: Number(it.amount) || 0 })),
    ]
  );

  const { taxBreakup, totalFreightAmount, totalExpense, totalShortageAmount, totalTripWiseIncome, netIncome } =
    summary;

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Box
          rowGap={3}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{ xs: '1fr', sm: '1fr auto' }}
          sx={{ mb: 3 }}
        >
          <Box component="img" alt="logo" src="/logo/company-logo-main.png" sx={{ width: 60, height: 60 }} />
          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Label variant="soft" color="warning">
              Draft
            </Label>
            <Typography variant="h6">TPR - XXX</Typography>
          </Stack>
        </Box>
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
            <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
                To:
              </Typography>
              <IconButton onClick={transporterDialog.onTrue}>
                <Iconify icon={selectedTransporter ? 'solar:pen-bold' : 'mingcute:add-line'} color="green" />
              </IconButton>
            </Stack>
            {selectedTransporter ? (
              <Stack spacing={1}>
                <Typography variant="subtitle2">{selectedTransporter.transportName}</Typography>
                <Typography variant="body2">{selectedTransporter.address}</Typography>
                <Typography variant="body2">{selectedTransporter.cellNo}</Typography>
              </Stack>
            ) : (
              <Typography typography="caption" sx={{ color: 'error.main' }}>
                Select a transporter
              </Typography>
            )}
          </Stack>
        </Stack>

        <Stack
          mt={5}
          spacing={{ xs: 3, md: 5 }}
          direction={{ xs: 'column', md: 'row' }}
          divider={<Divider flexItem orientation="vertical" sx={{ borderStyle: 'dashed' }} />}
        >
          <Stack sx={{ width: 1 }}>
            <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
                Billing Period:
              </Typography>
              <IconButton onClick={dateDialog.onTrue}>
                <Iconify icon="mingcute:calendar-line" color='green' />
              </IconButton>
            </Stack>
            {billingPeriod?.start && billingPeriod?.end ? (
              <Typography variant="body2">
                {fDateRangeShortLabel(billingPeriod.start, billingPeriod.end)}
              </Typography>
            ) : (
              <Typography typography="caption" sx={{ color: 'error.main' }}>
                Select date range
              </Typography>
            )}
          </Stack>

          <Stack sx={{ width: 1 }}>
            <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
                Issue Date:
              </Typography>
            </Stack>
            <Typography variant="body2">{fDate(new Date())}</Typography>
          </Stack>
        </Stack>

        <KanbanTransporterDialog
          open={transporterDialog.value}
          onClose={transporterDialog.onFalse}
          selectedTransporter={selectedTransporter}
          onTransporterChange={(transporter) => setValue('transporterId', transporter?._id)}
        />

        <CustomDateRangePicker
          variant='calendar'
          open={dateDialog.value}
          onClose={dateDialog.onFalse}
          startDate={billingPeriod?.start}
          endDate={billingPeriod?.end}
          onChangeStartDate={(date) => setValue('billingPeriod.start', date)}
          onChangeEndDate={(date) => setValue('billingPeriod.end', date)}
        />

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
                  <StyledTableCell key={h} align={idx < 7 ? 'center' : 'right'}>{h}</StyledTableCell>
                ))}
                <StyledTableCell />
              </TableRow>
            </TableHead>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <TableBody>
                {subtripFields.map((st, idx) => {
                  const {
                    effectiveFreightRate,
                    totalFreightAmount: freightAmount,
                    totalExpense: expense,
                    totalTransporterPayment,
                    totalShortageAmount: shortageAmount,
                  } = calculateTransporterPayment(st);

                  return (
                    <TableRow key={st._id}>
                      <TableCell>{idx + 1}</TableCell>
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
                        <IconButton color="error" onClick={() => handleRemove(idx)}>
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

                {[taxBreakup.cgst, taxBreakup.sgst, taxBreakup.igst].map(({ rate, amount }, idx) =>
                  rate > 0 ? (
                    <StyledTableRow key={idx}>
                      <TableCell colSpan={13} align="right">
                        {['CGST', 'SGST', 'IGST'][idx]} ({rate}%)
                      </TableCell>
                      <TableCell align="right">{fCurrency(amount)}</TableCell>
                      <TableCell />
                    </StyledTableRow>
                  ) : null
                )}

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

                {additionalFields.map((item, idx) => (
                  <StyledTableRow key={idx}>
                    <TableCell colSpan={13} align="right">
                      <Field.Text
                        size="small"
                        name={`additionalCharges[${idx}].label`}
                        label="Label"
                        placeholder="Diesel Advance, Extra Payment..."
                        required
                        variant="filled"
                        sx={{ width: 150 }}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <Field.Text
                        size="small"
                        name={`additionalCharges[${idx}].amount`}
                        label="Amount"
                        required
                        placeholder="100, -50"
                        sx={{ width: 100 }}
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleRemoveCharge(idx)}>
                        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))}

                <StyledTableRow>
                  <TableCell colSpan={15}>
                    <Button
                      size="small"
                      color="primary"
                      startIcon={<Iconify icon="mingcute:add-line" />}
                      onClick={handleAddCharge}
                      sx={{ width: { sm: 'auto', xs: 1 } }}
                    >
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
            )}
          </Table>
        </TableContainer>
      </Card>

      <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
        <Button variant="outlined" onClick={handleReset}>
          Cancel
        </Button>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Create Payment
        </LoadingButton>
      </Stack>
    </Form>
  );
}
