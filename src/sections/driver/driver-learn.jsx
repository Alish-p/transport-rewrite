import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Accordion from '@mui/material/Accordion';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function DriverLearn({ open, onClose }) {
    const theme = useTheme();


    const renderOverview = (
        <Card
            sx={{
                p: 3,
                mb: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.08)} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
                border: `1px solid ${alpha(theme.palette.info.main, 0.12)}`,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <Avatar
                    sx={{
                        bgcolor: alpha(theme.palette.info.main, 0.16),
                        color: 'info.main',
                        width: 40,
                        height: 40,
                    }}
                >
                    <Iconify icon="solar:question-circle-bold" width={24} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        What is a Driver?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        A Driver represents an individual who operates vehicles in your fleet. Drivers are essential
                        for trip planning, execution, and salary management. Track their license details, experience,
                        contact information, and more.
                    </Typography>
                </Box>
            </Box>
        </Card>
    );

    const renderRequiredFields = (
        <Card sx={{ p: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Avatar
                    sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.16),
                        color: 'success.main',
                        width: 40,
                        height: 40,
                    }}
                >
                    <Iconify icon="solar:checklist-bold" width={24} />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Key Fields Reference
                </Typography>
            </Box>

            <Table
                size="small"
                sx={{
                    '& .MuiTableCell-root': {
                        borderBottom: `dashed 1px ${theme.palette.divider}`,
                        px: 1.5,
                        py: 1.5,
                    },
                    '& .MuiTableHead-root .MuiTableCell-root': {
                        fontWeight: 700,
                        color: 'text.primary',
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        borderBottom: `solid 2px ${theme.palette.divider}`,
                    },
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell>Field Name</TableCell>
                        <TableCell align="center">Required?</TableCell>
                        <TableCell>Description</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Iconify icon="solar:user-bold" width={18} color={theme.palette.text.secondary} />
                                Driver Name
                            </Box>
                        </TableCell>
                        <TableCell align="center">
                            <Chip label="Required" color="error" size="small" sx={{ fontWeight: 600 }} />
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            Full name of the driver
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Iconify icon="solar:phone-bold" width={18} color={theme.palette.text.secondary} />
                                Cell No
                            </Box>
                        </TableCell>
                        <TableCell align="center">
                            <Chip label="Required" color="error" size="small" sx={{ fontWeight: 600 }} />
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            10-digit mobile number
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Iconify icon="solar:card-bold" width={18} color={theme.palette.text.secondary} />
                                License No
                            </Box>
                        </TableCell>
                        <TableCell align="center">
                            <Chip label="Optional" size="small" variant="outlined" />
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            Driving license number
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Iconify icon="solar:calendar-bold" width={18} color={theme.palette.text.secondary} />
                                License Expiry
                            </Box>
                        </TableCell>
                        <TableCell align="center">
                            <Chip label="Optional" size="small" variant="outlined" />
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            Valid until date
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Iconify icon="solar:wallet-bold" width={18} color={theme.palette.text.secondary} />
                                Bank Details
                            </Box>
                        </TableCell>
                        <TableCell align="center">
                            <Chip label="Optional" size="small" variant="outlined" />
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            Account info for payments
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Card>
    );

    const renderFAQs = (
        <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Avatar
                    sx={{
                        bgcolor: alpha(theme.palette.warning.main, 0.16),
                        color: 'warning.main',
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
                        <Iconify icon="solar:trash-bin-trash-bold" width={20} color={theme.palette.error.main} />
                        <Typography variant="subtitle2">What happens when I delete a driver?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        Deleting a driver permanently removes their profile from the active list. However,
                        historical data linked to completed trips may be retained for audit purposes. Use this
                        action with caution.
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
                        <Iconify icon="solar:pause-circle-bold" width={20} color={theme.palette.warning.main} />
                        <Typography variant="subtitle2">What does &apos;Inactive&apos; status mean?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        Setting a driver to Inactive means they cannot be assigned to new trips and will not
                        appear in selection dropdowns. Their history and profile remain accessible for reference.
                        Use this for drivers on leave or temporarily unavailable.
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
                        <Iconify icon="solar:dollar-bold" width={20} color={theme.palette.success.main} />
                        <Typography variant="subtitle2">How is salary calculated?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        Salary calculations (Bata, Fixed Salary) depend on the driver&apos;s assigned trips and
                        attendance. Ensure Bank Details are filled to process payments smoothly.
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
                    {renderRequiredFields}
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
