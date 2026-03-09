import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function InvoiceLearn({ open, onClose }) {
    const theme = useTheme();

    const renderOverview = (
        <Card
            sx={{
                p: 3,
                mb: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.08)} 0%, ${alpha(
                    theme.palette.info.main,
                    0.02
                )} 100%)`,
                border: `1px solid ${alpha(theme.palette.info.main, 0.12)}`,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar
                    sx={{
                        bgcolor: alpha(theme.palette.info.main, 0.16),
                        color: 'info.main',
                        width: 40,
                        height: 40,
                    }}
                >
                    <Iconify icon="solar:document-text-bold" width={24} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        What is an Invoice?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        An Invoice is a formal billing document sent to your Customer. It aggregates the freight
                        charges, deductions, shortages, and taxes for the selected trips in a billing period.
                        <br />
                        <br />
                        <strong>How are Invoice Numbers generated?</strong>
                        <br />
                        The system auto-generates invoice numbers incrementally per customer based on their settings.
                        The format is always:{' '}
                        <code>[Prefix][Current Serial Number][Suffix]</code>.
                    </Typography>
                </Box>
            </Box>
        </Card>
    );

    const renderStatusGuide = (
        <Card
            sx={{
                p: 3,
                mb: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.08)} 0%, ${alpha(
                    theme.palette.warning.main,
                    0.02
                )} 100%)`,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.12)}`,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <Avatar
                    sx={{
                        bgcolor: alpha(theme.palette.warning.main, 0.16),
                        color: 'warning.main',
                        width: 40,
                        height: 40,
                    }}
                >
                    <Iconify icon="solar:info-circle-bold" width={24} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        Invoice Statuses Explained
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        Manage and track the payment lifecycle of your invoices using these distinct statuses:
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Iconify icon="solar:clock-circle-bold" color={theme.palette.info.main} width={20} mt={0.3} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'info.main' }}>
                            Pending
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            The invoice has been generated and sent, but no payments have been recorded yet. The invoice is awaiting customer payment.
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Iconify icon="solar:pie-chart-2-bold" color={theme.palette.warning.main} width={20} mt={0.3} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'warning.main' }}>
                            Partial Received
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            The customer has paid a portion of the invoice total, but a balance is still remaining to be settled.
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Iconify icon="solar:check-circle-bold" color={theme.palette.success.main} width={20} mt={0.3} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                            Received
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            The invoice has been paid in full directly covering the total amount due.
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Iconify icon="solar:danger-circle-bold" color={theme.palette.error.main} width={20} mt={0.3} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'error.main' }}>
                            Overdue
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            The current date has passed the payment Due Date defined by the customer&apos;s &quot;Pay Within&quot; setting terms.
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Iconify icon="solar:close-circle-bold" color={theme.palette.text.secondary} width={20} mt={0.3} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                            Cancelled
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            The invoice was voided. Note: This frees up the underlying jobs/subtrips back to &quot;Received&quot; status so they can be billed again.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Card>
    );

    const renderFAQs = (
        <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Avatar
                    sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.16),
                        color: 'primary.main',
                        width: 40,
                        height: 40,
                    }}
                >
                    <Iconify icon="solar:chat-round-dots-bold" width={24} />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Frequently Asked Questions
                </Typography>
            </Box>

            <Accordion
                variant="outlined"
                sx={{
                    mb: 1,
                    '&:before': { display: 'none' },
                    borderRadius: 1.5,
                    overflow: 'hidden',
                }}
            >
                <AccordionSummary
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Iconify icon="solar:calculator-bold" width={20} color={theme.palette.success.main} />
                        <Typography variant="subtitle2">How is the total calculated?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        The net amount calculation works as follows:
                        <br />
                        <br />
                        1. For each job (subtrip), the gross freight is calculated: <code>Rate × Loading Weight</code>.
                        <br />
                        2. The <b>Shortage Amount</b> for that trip is kept as a separate line item deduction record, but it is not directly subtracted from the gross freight by default to keep the accounting clear.
                        <br />
                        3. All trip amounts are summed into the <b>Taxable Amount</b> (Total Amount Before Tax).
                        <br />
                        4. <b>GST Tax</b> is calculated based on the Taxable Amount.
                        <br />
                        5. Any manual <b>Extra Charges</b> are added.
                        <br />
                        6. Final equation is: <br />
                        <code>Net Total = Taxable Amount + GST Taxes + Extra Charges</code>
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion
                variant="outlined"
                sx={{
                    mb: 1,
                    '&:before': { display: 'none' },
                    borderRadius: 1.5,
                    overflow: 'hidden',
                }}
            >
                <AccordionSummary
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Iconify icon="solar:document-medicine-bold" width={20} color={theme.palette.secondary.main} />
                        <Typography variant="subtitle2">
                            How does Tax (GST) mapping work?
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        Taxes are dynamically generated using your Tenant and Customer configuration mapping.
                        If the Customer has <b>GST Enabled</b>, the system compares the Customer state to the Tenant state.
                        <br />
                        <br />
                        • <b>Intra-state</b> (Same State): Applied evenly across <b>CGST</b> and <b>SGST</b>.
                        <br />
                        • <b>Inter-state</b> (Different State): Applied entirely as <b>IGST</b>.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion
                variant="outlined"
                sx={{
                    mb: 1,
                    '&:before': { display: 'none' },
                    borderRadius: 1.5,
                    overflow: 'hidden',
                }}
            >
                <AccordionSummary
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Iconify icon="solar:pen-bold" width={20} color={theme.palette.warning.main} />
                        <Typography variant="subtitle2">
                            What do I do if I made a mistake on a billed job?
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        You cannot directly edit a Job (subtrip) that has already been billed via an invoice.
                        If you realize there was an error with shortages, rates, or freight details:
                        <br />
                        <br />
                        1. First, select the Invoice and mark it as <b>Cancelled</b>.
                        <br />
                        2. This releases the jobs and resets their status to <b>Received</b>.
                        <br />
                        3. Go to the Trips section, edit the newly un-billed job to correct the details.
                        <br />
                        4. Finally, generate a brand new Invoice for those jobs.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion
                variant="outlined"
                sx={{
                    mb: 1,
                    '&:before': { display: 'none' },
                    borderRadius: 1.5,
                    overflow: 'hidden',
                }}
            >
                <AccordionSummary
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Iconify
                            icon="solar:trash-bin-trash-bold"
                            width={20}
                            color={theme.palette.error.main}
                        />
                        <Typography variant="subtitle2">Can I delete an Invoice completely?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        There is no hard &quot;Delete&quot; for an invoice. Instead, you <b>Cancel</b> it.
                        Cancelling an invoice completely neutralizes it from your payment ledgers and revenue analytics,
                        while safely maintaining financial compliance audit trails linking the old jobs.
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Card>
    );

    return (
        <Drawer
            open={open}
            onClose={onClose}
            anchor="bottom"
            PaperProps={{
                sx: {
                    maxHeight: '85vh',
                    borderRadius: '16px 16px 0 0',
                    boxShadow: theme.shadows[24],
                },
            }}
        >
            <Scrollbar sx={{ maxHeight: 'calc(85vh - 80px)' }}>
                <Box sx={{ p: 3 }}>
                    {renderOverview}
                    {renderStatusGuide}
                    {renderFAQs}

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            color="inherit"
                            size="large"
                            onClick={onClose}
                            startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                            sx={{
                                minWidth: 200,
                                fontWeight: 700,
                            }}
                        >
                            Got it!
                        </Button>
                    </Box>
                </Box>
            </Scrollbar>
        </Drawer>
    );
}
