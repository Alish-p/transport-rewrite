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

import { fNumber, fCurrency } from 'src/utils/format-number';
import { fDate, fDateRangeShortLabel } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';
import { useCreateInvoice } from 'src/query/use-invoice';
import { useClosedTripsByCustomerAndDate } from 'src/query/use-subtrip';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { TableSkeleton } from '../../components/table';
import { loadingWeightUnit } from '../vehicle/vehicle-config';
import { Form, Field, schemaHelper } from '../../components/hook-form';
import { KanbanCustomerDialog } from '../kanban/components/kanban-customer-dialog';
import { CustomDateRangePicker } from '../../components/custom-date-range-picker/custom-date-range-picker';
import {
    calculateTaxBreakup,
    calculateInvoiceSummary,
    calculateInvoicePerSubtrip,
} from './utills/invoice-calculation';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '& td': { borderBottom: 'none', paddingTop: theme.spacing(1), paddingBottom: theme.spacing(1) },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
}));

const InvoiceSchema = zod.object({
    customerId: zod.string().min(1, 'Customer is required'),
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
    additionalItems: zod
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

export default function SimplerNewInvoiceForm({ customerList }) {
    const customerDialog = useBoolean();
    const dateDialog = useBoolean();

    const methods = useForm({
        resolver: zodResolver(InvoiceSchema),
        defaultValues: {
            customerId: '',
            billingPeriod: { start: dayjs().startOf('month'), end: dayjs() },
            subtrips: [],
            additionalItems: [],
        },
    });

    const {
        watch,
        setValue,
        reset,
        handleSubmit,
        control,
        formState: { isSubmitting, errors },
    } = methods;

    const {
        fields: subtripFields,
        remove: removeSubtrip,
        replace,
    } = useFieldArray({
        control,
        name: 'subtrips',
    });

    const {
        fields: additionalFields,
        append: appendItem,
        remove: removeItem,
    } = useFieldArray({ name: 'additionalItems', control });

    const { customerId, billingPeriod, subtrips, additionalItems } = watch();

    const selectedCustomer = useMemo(
        () => customerList.find((c) => String(c._id) === String(customerId)),
        [customerList, customerId]
    );

    const {
        data: fetchedSubtrips,
        isSuccess,
        isLoading,
        refetch,
    } = useClosedTripsByCustomerAndDate(
        customerId,
        billingPeriod?.start,
        billingPeriod?.end
    );

    const createInvoice = useCreateInvoice();
    const navigate = useNavigate();

    useEffect(() => {
        if (customerId && billingPeriod?.start && billingPeriod?.end) {
            refetch();
        }
    }, [customerId, billingPeriod?.start, billingPeriod?.end, refetch]);

    useEffect(() => {
        if (isSuccess && fetchedSubtrips) {
            replace(fetchedSubtrips);
        }
    }, [isSuccess, fetchedSubtrips, replace]);

    const handleRemove = (index) => {
        removeSubtrip(index);
    };

    const handleAddItem = () => {
        appendItem({ label: '', amount: '' });
    };

    const handleRemoveItem = (index) => {
        removeItem(index);
    };

    const handleReset = () => {
        reset({
            customerId: '',
            billingPeriod: { start: dayjs().startOf('month'), end: dayjs() },
            subtrips: [],
            additionalItems: [],
        });
    };

    const onSubmit = async (data) => {
        const {
            customerId: custId,
            billingPeriod: period,
            subtrips: subtripData,
            additionalItems: addItems,
        } = data;
        try {
            const invoice = await createInvoice({
                customerId: custId,
                billingPeriod: period,
                subtripIds: subtripData.map((st) => st._id),
                additionalCharges: addItems.map((it) => ({
                    label: it.label,
                    amount: Number(it.amount) || 0,
                })),
            });
            navigate(paths.dashboard.invoice.details(invoice._id));
        } catch (error) {
            console.error('Failed to create invoice', error);
        }
    };

    const { cgst, sgst, igst } = calculateTaxBreakup(selectedCustomer);
    const summary = calculateInvoiceSummary({
        subtripIds: subtrips,
        customer: selectedCustomer,
        additionalItems,
    });

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
                    <Box
                        component="img"
                        alt="logo"
                        src="/logo/company-logo-main.png"
                        sx={{ width: 60, height: 60 }}
                    />
                    <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                        <Label variant="soft" color="warning">
                            Draft
                        </Label>
                        <Typography variant="h6">INV - XXX</Typography>
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
                            <IconButton onClick={customerDialog.onTrue}>
                                <Iconify icon={selectedCustomer ? 'solar:pen-bold' : 'mingcute:add-line'} color='green' />
                            </IconButton>
                        </Stack>
                        {selectedCustomer ? (
                            <Stack spacing={1}>
                                <Typography variant="subtitle2">{selectedCustomer.customerName}</Typography>
                                <Typography variant="body2">{selectedCustomer.address}</Typography>
                                <Typography variant="body2">{selectedCustomer.cellNo}</Typography>
                            </Stack>
                        ) : (
                            <Typography typography="caption" sx={{ color: 'error.main' }}>
                                Select a customer
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

                <KanbanCustomerDialog
                    open={customerDialog.value}
                    onClose={customerDialog.onFalse}
                    selectedCustomer={selectedCustomer}
                    onCustomerChange={(customer) => setValue('customerId', customer?._id)}
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
                                <StyledTableCell>Shortage Weight</StyledTableCell>
                                <StyledTableCell>Total Amount</StyledTableCell>
                                <StyledTableCell />
                            </TableRow>
                        </TableHead>

                        {isLoading ? <TableSkeleton /> : <TableBody>
                            {subtripFields.map((st, idx) => {
                                const { totalAmount } = calculateInvoicePerSubtrip(st);
                                return (
                                    <TableRow key={st._id}>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell>{st.tripId?.vehicleId?.vehicleNo}</TableCell>
                                        <TableCell>{st.consignee}</TableCell>
                                        <TableCell>{st.unloadingPoint}</TableCell>
                                        <TableCell>{st._id}</TableCell>
                                        <TableCell>{fDate(st.startDate)}</TableCell>
                                        <TableCell>{fCurrency(st.rate)}</TableCell>
                                        <TableCell>
                                            {st.loadingWeight} {loadingWeightUnit[st.tripId?.vehicleId?.vehicleType]}
                                        </TableCell>
                                        <TableCell sx={{ color: st.shortageWeight > 0 ? '#FF5630' : 'inherit' }}>
                                            {fNumber(st.shortageWeight)} Kg
                                        </TableCell>
                                        <TableCell>{fCurrency(totalAmount)}</TableCell>
                                        <TableCell width={40}>
                                            <IconButton color="error" onClick={() => handleRemove(idx)}>
                                                <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}

                            <StyledTableRow>
                                <TableCell colSpan={7} />
                                <StyledTableCell colSpan={2} sx={{ color: 'text.secondary' }} align="center">
                                    Subtotal
                                </StyledTableCell>
                                <TableCell>{fCurrency(summary.totalAmountBeforeTax)}</TableCell>
                            </StyledTableRow>

                            {cgst > 0 && (
                                <StyledTableRow>
                                    <TableCell colSpan={7} />
                                    <StyledTableCell sx={{ color: 'text.secondary' }} colSpan={2} align="center">
                                        CGST ({cgst}%)
                                    </StyledTableCell>
                                    <TableCell> {fCurrency((summary.totalAmountBeforeTax * cgst) / 100)}</TableCell>
                                </StyledTableRow>
                            )}

                            {sgst > 0 && (
                                <StyledTableRow>
                                    <TableCell colSpan={7} />
                                    <StyledTableCell sx={{ color: 'text.secondary' }} colSpan={2} align="center">
                                        SGST ({sgst}%)
                                    </StyledTableCell>
                                    <TableCell>{fCurrency((summary.totalAmountBeforeTax * sgst) / 100)}</TableCell>
                                </StyledTableRow>
                            )}

                            {igst > 0 && (
                                <StyledTableRow>
                                    <TableCell colSpan={7} />
                                    <StyledTableCell sx={{ color: 'text.secondary' }} colSpan={2} align="center">
                                        IGST ({igst}%)
                                    </StyledTableCell>
                                    <TableCell>{fCurrency((summary.totalAmountBeforeTax * igst) / 100)}</TableCell>
                                </StyledTableRow>
                            )}

                            {additionalFields.map((item, idx) => (
                                <StyledTableRow key={idx}>
                                    <TableCell colSpan={7} />
                                    <TableCell colSpan={2} align="center">
                                        <Field.Text
                                            size="small"
                                            name={`additionalItems[${idx}].label`}
                                            label="Label"
                                            placeholder="Credit Note, Additional Payment..."
                                            required
                                            variant="filled"
                                            sx={{ width: 150 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Field.Text
                                            size="small"
                                            name={`additionalItems[${idx}].amount`}
                                            label="Amount"
                                            required
                                            placeholder="+100, -200"
                                            sx={{ width: 100 }}
                                            variant="filled"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <IconButton color="error" onClick={() => handleRemoveItem(idx)}>
                                            <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                                        </IconButton>
                                    </TableCell>
                                </StyledTableRow>
                            ))}

                            <StyledTableRow>
                                {/* <TableCell colSpan={7} /> */}
                                <TableCell colSpan={9}>
                                    <Button
                                        size="small"
                                        color="primary"
                                        startIcon={<Iconify icon="mingcute:add-line" />}
                                        onClick={handleAddItem}
                                        sx={{ width: { sm: 'auto', xs: 1 } }}
                                    >
                                        Add Extra Payment
                                    </Button>
                                </TableCell>
                            </StyledTableRow>

                            <StyledTableRow>
                                <TableCell colSpan={7} />
                                <StyledTableCell colSpan={2} sx={{ color: 'text.secondary' }} align="center">
                                    Net Total
                                </StyledTableCell>
                                <TableCell sx={{ color: 'error.main' }}>
                                    {fCurrency(summary.totalAfterTax)}
                                </TableCell>
                            </StyledTableRow>
                        </TableBody>}

                    </Table>
                </TableContainer>
            </Card>

            <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
                <Button variant="outlined" onClick={handleReset}>
                    Cancel
                </Button>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Create Invoice
                </LoadingButton>
            </Stack>
        </Form>
    );
}
