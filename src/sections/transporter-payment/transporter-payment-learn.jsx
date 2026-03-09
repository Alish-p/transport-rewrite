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

export default function TransporterPaymentLearn({ open, onClose }) {
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
                    <Iconify icon="solar:wallet-money-bold" width={24} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        What is a Transporter Payment?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        A Transporter Payment Receipt is a document generated to pay third-party / market vehicle
                        transporters for jobs they have completed on your behalf.
                        <br />
                        <br />
                        <strong>How are Payment IDs generated?</strong>
                        <br />
                        Payment numbers are auto-generated sequentially by the system to ensure correct ledger
                        tracking for each transporter.
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
                        Payment Statuses Explained
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        Keep track of your payments using these distinct statuses:
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Iconify icon="solar:clock-circle-bold" color={theme.palette.error.main} width={20} mt={0.3} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'error.main' }}>
                            Generated
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            The payment receipt has been finalized and recorded, but no actual payment has been made yet to the transporter.
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Iconify icon="solar:check-circle-bold" color={theme.palette.success.main} width={20} mt={0.3} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                            Paid
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            You have successfully logged the payment covering the full amount owed to the transporter.
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
                        The final net amount calculation works per job as follows:
                        <br />
                        <br />
                        1. First, an <b>Effective Freight Rate</b> is determined by doing: (<code>Rate - Commission Rate</code>)
                        <br />
                        2. The <b>Total Freight</b> is calculated: <code>Effective Freight Rate × Loading Weight</code>.
                        <br />
                        3. The <b>Pre-Tax Income</b> is derived by subtracting any job expenses / toll expenses and shortage amounts:
                        <br />
                        <code>Pre-Tax Income = Total Freight - Expenses - Shortages</code>
                        <br />
                        4. <b>Net Income</b> applies TDS deductions and sums extra charges:
                        <br />
                        <code>Net Income = Pre-Tax Income - TDS + Additional Charges</code>
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
                            How are TDS and GST calculated?
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        • <b>TDS</b>: Tax Deduction at Source is dynamically calculated based on the Transporter&apos;s <code>TDS Percentage</code> setting and applied to the Total Freight amount.
                        <br />
                        <br />
                        • <b>GST</b>: Since transporters operate under a Reverse Charge Mechanism (RCM), <b>GST is NOT added to the Total Net Amount.</b> Instead, GST breakdowns are shown purely for your accounting references.
                        If the Transporter has GST Enabled, the system will compare the Transporter State against the Tenant State to calculate CGST/SGST vs IGST.
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
                        You cannot edit a job once it&apos;s been linked to a Transporter Payment. If you need to make changes:
                        <br />
                        <br />
                        1. First, select the specific Payment Receipt from the list and <b>Delete</b> it.
                        <br />
                        2. This action resets all jobs found within that receipt back into the pool.
                        <br />
                        3. Go to the Trips section and legitimately edit the newly un-linked jobs.
                        <br />
                        4. Finally, <b>Re-Generate</b> a new payment receipt for them.
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
                        <Typography variant="subtitle2">Can I delete a Payment Receipt completely?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        Yes! Deleting a Transporter Payment Receipt entirely wipes it strictly from your ledgers.
                        This uniquely unlinks all the underlying jobs so that they may be corrected and re-billed with different totals.
                        It safely nullifies the connection.
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
