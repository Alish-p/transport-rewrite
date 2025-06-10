import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { styled } from '@mui/material/styles';
import { Card, Stack, Table, Divider, TableRow, TableHead, TableBody, TableCell, Typography, IconButton, TableContainer } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { fNumber, fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';
import { useClosedTripsByCustomerAndDate } from 'src/query/use-subtrip';

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
        data: subtrips = [],
        refetch,
    } = useClosedTripsByCustomerAndDate(selectedCustomer?._id, null, null);

    useEffect(() => {
        if (selectedCustomer?._id) {
            refetch();
        }
    }, [selectedCustomer, refetch]);

    const { cgst, sgst, igst } = calculateTaxBreakup(selectedCustomer);
    const summary = calculateInvoiceSummary({ subtripIds: subtrips });

    return (
        <Card sx={{ p: 3 }}>
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
                                </TableRow>
                            );
                        })}

                        <StyledTableRow>
                            <TableCell colSpan={7} />
                            <StyledTableCell>Subtotal</StyledTableCell>
                            <TableCell>{fCurrency(summary.totalAmountBeforeTax)}</TableCell>
                        </StyledTableRow>

                        {cgst > 0 && (
                            <StyledTableRow>
                                <TableCell colSpan={7} />
                                <StyledTableCell>CGST ({cgst}%)</StyledTableCell>
                                <TableCell>{fCurrency((summary.totalAmountBeforeTax * cgst) / 100)}</TableCell>
                            </StyledTableRow>
                        )}

                        {sgst > 0 && (
                            <StyledTableRow>
                                <TableCell colSpan={7} />
                                <StyledTableCell>SGST ({sgst}%)</StyledTableCell>
                                <TableCell>{fCurrency((summary.totalAmountBeforeTax * sgst) / 100)}</TableCell>
                            </StyledTableRow>
                        )}

                        {igst > 0 && (
                            <StyledTableRow>
                                <TableCell colSpan={7} />
                                <StyledTableCell>IGST ({igst}%)</StyledTableCell>
                                <TableCell>{fCurrency((summary.totalAmountBeforeTax * igst) / 100)}</TableCell>
                            </StyledTableRow>
                        )}

                        <StyledTableRow>
                            <TableCell colSpan={7} />
                            <StyledTableCell>Net Total</StyledTableCell>
                            <TableCell sx={{ color: 'error.main' }}>{fCurrency(summary.totalAfterTax)}</TableCell>
                        </StyledTableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}