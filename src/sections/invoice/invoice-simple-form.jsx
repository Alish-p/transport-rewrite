import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { Card, Stack, Table, Button, Divider, TableRow, TableHead, TableBody, TableCell, TextField, Typography, IconButton, TableContainer } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { fNumber, fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';
import { useCreateInvoice } from 'src/query/use-invoice';
import { useClosedTripsByCustomerAndDate } from 'src/query/use-subtrip';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { loadingWeightUnit } from '../vehicle/vehicle-config';
import { KanbanCustomerDialog } from '../kanban/components/kanban-customer-dialog';
import { calculateTaxBreakup, calculateInvoiceSummary, calculateInvoicePerSubtrip } from './utills/invoice-calculation';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '& td': { borderBottom: 'none', paddingTop: theme.spacing(1), paddingBottom: theme.spacing(1) },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
}));

export default function SimplerNewInvoiceForm() {
    const customerDialog = useBoolean();

    const { watch, setValue } = useForm({ defaultValues: { customer: null } });

    const selectedCustomer = watch('customer');

    const {
        data: fetchedSubtrips = [],
        refetch,
    } = useClosedTripsByCustomerAndDate(selectedCustomer?._id, null, null);

    const [subtrips, setSubtrips] = useState([]);
    const [additionalItems, setAdditionalItems] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createInvoice = useCreateInvoice();
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedCustomer?._id) {
            refetch();
        }
    }, [selectedCustomer, refetch]);

    useEffect(() => {
        setSubtrips(fetchedSubtrips);
    }, [fetchedSubtrips]);

    const handleRemove = (id) => {
        setSubtrips((prev) => prev.filter((st) => st._id !== id));
    };

    const handleAddItem = () => {
        setAdditionalItems((prev) => [...prev, { label: '', amount: '' }]);
    };

    const handleRemoveItem = (index) => {
        setAdditionalItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleItemChange = (index, field, value) => {
        setAdditionalItems((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const handleReset = () => {
        setValue('customer', null);
        setSubtrips([]);
        setAdditionalItems([]);
    };

    const handleCreate = async () => {
        if (!selectedCustomer || subtrips.length === 0) return;
        setIsSubmitting(true);
        try {
            const invoice = await createInvoice({
                customerId: selectedCustomer._id,
                subtripIds: subtrips.map((st) => st._id),
                additionalCharges: additionalItems.map((it) => ({
                    label: it.label,
                    amount: Number(it.amount) || 0,
                })),
            });
            navigate(paths.dashboard.invoice.details(invoice._id));
        } catch (error) {
            console.error('Failed to create invoice', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const { cgst, sgst, igst } = calculateTaxBreakup(selectedCustomer);
    const summary = calculateInvoiceSummary({
        subtripIds: subtrips,
        customer: selectedCustomer,
        additionalItems,
    });

    return (
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
                            <Iconify icon={selectedCustomer ? 'solar:pen-bold' : 'mingcute:add-line'} />
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

            <KanbanCustomerDialog
                open={customerDialog.value}
                onClose={customerDialog.onFalse}
                selectedCustomer={selectedCustomer}
                onCustomerChange={(customer) => setValue('customer', customer)}
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
                            <StyledTableCell>Total Amount</StyledTableCell>
                            <StyledTableCell>Shortage Weight</StyledTableCell>
                            <StyledTableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subtrips.map((st, idx) => {
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
                                    <TableCell>{fCurrency(totalAmount)}</TableCell>
                                    <TableCell sx={{ color: st.shortageWeight > 0 ? '#FF5630' : 'inherit' }}>
                                        {fNumber(st.shortageWeight)}
                                    </TableCell>
                                    <TableCell width={40}>
                                        <IconButton color="error" onClick={() => handleRemove(st._id)}>
                                            <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        <StyledTableRow>
                            <TableCell colSpan={8} />
                            <StyledTableCell>Subtotal</StyledTableCell>
                            <TableCell>{fCurrency(summary.totalAmountBeforeTax)}</TableCell>
                        </StyledTableRow>

                        {cgst > 0 && (
                            <StyledTableRow>
                                <TableCell colSpan={8} />
                                <StyledTableCell>CGST ({cgst}%)</StyledTableCell>
                                <TableCell>{fCurrency((summary.totalAmountBeforeTax * cgst) / 100)}</TableCell>
                            </StyledTableRow>
                        )}

                        {sgst > 0 && (
                            <StyledTableRow>
                                <TableCell colSpan={8} />
                                <StyledTableCell>SGST ({sgst}%)</StyledTableCell>
                                <TableCell>{fCurrency((summary.totalAmountBeforeTax * sgst) / 100)}</TableCell>
                            </StyledTableRow>
                        )}

                        {igst > 0 && (
                            <StyledTableRow>
                                <TableCell colSpan={8} />
                                <StyledTableCell>IGST ({igst}%)</StyledTableCell>
                                <TableCell>{fCurrency((summary.totalAmountBeforeTax * igst) / 100)}</TableCell>
                            </StyledTableRow>
                        )}


                        {additionalItems.map((item, idx) => (
                            <StyledTableRow key={idx}>
                                <TableCell colSpan={8} />
                                <TableCell>
                                    <TextField
                                        size="small"
                                        label="Label"
                                        value={item.label}
                                        onChange={(e) => handleItemChange(idx, 'label', e.target.value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        label="Amount"
                                        type="number"
                                        value={item.amount}
                                        onChange={(e) => handleItemChange(idx, 'amount', e.target.value)}
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
                            <TableCell colSpan={8} />
                            <TableCell >
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
                            <TableCell colSpan={8} />
                            <StyledTableCell>Net Total</StyledTableCell>
                            <TableCell sx={{ color: 'error.main' }}>{fCurrency(summary.totalAfterTax)}</TableCell>
                        </StyledTableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Divider sx={{ my: 3, borderStyle: 'dashed' }} />



            <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button variant="outlined" onClick={handleReset}>Reset</Button>
                <LoadingButton variant="contained" onClick={handleCreate} loading={isSubmitting}>
                    Create Invoice
                </LoadingButton>
            </Stack>
        </Card>
    );
}