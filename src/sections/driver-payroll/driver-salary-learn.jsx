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

export default function DriverSalaryLearn({ open, onClose }) {
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
                        What is Driver Salary?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        Driver Salary acts as the final ledger for settling driver payments over a specific
                        billing period. Instead of paying per subtrip individually, this tool consolidates all
                        the jobs a driver completed within that period, factors in any advances or deductions,
                        and calculates the net total payable.
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
                        Salary Statuses Explained
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        A salary record transitions through a few life-cycles. Managing statuses helps you
                        track what is due versus what is settled.
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Iconify icon="solar:document-add-bold" color={theme.palette.info.main} width={20} mt={0.3} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'info.main' }}>
                            Generated (Draft)
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            The salary record is created and amounts are aggregated, but no actual payment has been made yet. This acts as an invoice or claim.
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
                            Mark as paid once the payment is successfully deposited to the driver&apos;s bank account or handed in cash.
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Iconify icon="solar:close-circle-bold" color={theme.palette.error.main} width={20} mt={0.3} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'error.main' }}>
                            Cancelled
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            If generated by mistake or with incorrect parameters, the salary can be cancelled. Cancelled salaries do not contribute to final ledger totals.
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
                        <Typography variant="subtitle2">How is it calculated?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        The net salary calculation works step-by-step:
                        <br />
                        1. All selected jobs/subtrips are scanned for &apos;Driver Salary&apos; expenses.
                        <br />
                        2. The sum of these trip salaries is grouped into <b>Trips Total</b>.
                        <br />
                        3. Any manual additions (like rewards or previous dues) are added as <b>Extra Income</b>.
                        <br />
                        4. Any manual deductions (like advance cuts or fines) are subtracted as <b>Deductions</b>.
                        <br />
                        5. Final equation is: <br />
                        <code>Net Total = Trips Total + Extra Income - Deductions</code>
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
                        <Iconify icon="solar:copy-bold" width={20} color={theme.palette.warning.main} />
                        <Typography variant="subtitle2">
                            Can I generate salary twice for the same job?
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        Yes, but you should avoid doing so to prevent double-paying a driver. By default, when
                        generating a new salary, the system shows you all jobs completed in that billing period.
                        It is up to you to verify if a job was already claimed. A best practice is to always use
                        non-overlapping billing periods for drivers.
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
                        <Typography variant="subtitle2">What happens if I delete it?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        Deleting a salary record wipes it complete from the database permanently. The underlying
                        subtrips <b>are NOT deleted</b>, but this specific payment record vanishes. This
                        action should only be taken if the entry was completely fictitious. Otherwise, prefer
                        changing the status to <b>Cancelled</b> to retain an audit trail.
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
